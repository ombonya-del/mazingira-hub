// Supabase Edge Function: baraza-seed  (MazingiraKenya)
// Keeps the Baraza Socials Wall fed and lets Baraza activity seed the rest of the hub.
//   1. VERIFY  — publishes partner X posts dropped in (hidden) by the daily X-list sweep,
//                but only when the post's handle matches a partner's x_handle.
//   2. YOUTUBE — pulls the latest videos from partners' YouTube channels (public feeds).
//   3. SEED    — reads new forum posts + wall items and, where one is clearly a funding
//                opportunity, an event, a resource or a media story, files an UNPUBLISHED
//                draft into resources / calendar_events for admin Accept/Reject.
// Nothing is ever published to the hub's public sections by this function.
//
// Deploy:  supabase functions deploy baraza-seed --project-ref uueemckdoozsuowcqkhl
// Secrets: CRON_SECRET, ANTHROPIC_API_KEY (SUPABASE_URL / SERVICE_ROLE injected automatically)

import { createClient } from "jsr:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { "content-type": "application/json" } });
const norm = (h: string | null) => String(h || "").trim().replace(/^@/, "").replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//i, "").replace(/\/.*$/, "").toLowerCase();

/* ---------- 1. verify swept X posts ---------- */
async function verifySocials(partners: any[]) {
  const byHandle = new Map<string, string>();
  partners.forEach((p) => { const h = norm(p.x_handle); if (h) byHandle.set(h, p.name); });
  const { data: pend } = await sb.from("baraza_posts").select("id,source_handle,url")
    .eq("kind", "social").eq("hidden", true).is("seeded_at", null).limit(300);
  let published = 0, rejected = 0;
  for (const p of pend || []) {
    const h = norm(p.source_handle);
    const okUrl = new RegExp(`^https://(www\\.)?(x|twitter)\\.com/${h.replace(/[^a-z0-9_]/g, "")}/status/\\d+`, "i").test(p.url || "");
    if (h && byHandle.has(h) && okUrl) {
      await sb.from("baraza_posts").update({ hidden: false, platform: "x", source_name: byHandle.get(h) }).eq("id", p.id);
      published++;
    } else {
      await sb.from("baraza_posts").update({ seeded_at: new Date().toISOString(), seeded_to: "unverified-handle" }).eq("id", p.id);
      rejected++;
    }
  }
  return { published, rejected };
}

/* run fn over items, n at a time, stopping new work once the time budget is spent */
let T0 = Date.now(); const BUDGET_MS = 110_000;
const timeLeft = () => BUDGET_MS - (Date.now() - T0);
async function pool<T>(items: T[], n: number, fn: (x: T) => Promise<void>) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length && timeLeft() > 15_000) await fn(items[i++]);
  }));
}

/* ---------- 2. partner YouTube channels ---------- */
async function channelId(v: string): Promise<string | null> {
  const m = String(v).match(/UC[\w-]{22}/);
  if (m) return m[0];
  let url = String(v).trim();
  if (/^@/.test(url)) url = "https://www.youtube.com/" + url;
  if (!/^https?:\/\//.test(url)) return null;
  try {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 mazingira-baraza" }, signal: AbortSignal.timeout(12000) });
    const html = await r.text();
    const c = html.match(/"(?:channelId|externalId)":"(UC[\w-]{22})"/) || html.match(/channel\/(UC[\w-]{22})/);
    return c ? c[1] : null;
  } catch { return null; }
}
async function youtube(partners: any[]) {
  let added = 0; const debug: Record<string, string> = {};
  const cutoff = Date.now() - 45 * 864e5;
  await pool(partners.filter((x) => x.youtube), 8, async (p) => {
    const id = await channelId(p.youtube);
    if (!id) { debug[p.name] = "no channel id"; return; }
    try {
      const r = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${id}`, { signal: AbortSignal.timeout(12000) });
      if (!r.ok) { debug[p.name] = "feed " + r.status; return; }
      const xml = await r.text();
      const items = xml.split("<entry>").slice(1).map((e) => ({
        vid: (e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1],
        title: ((e.match(/<title>([^<]*)<\/title>/) || [])[1] || "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
        published: (e.match(/<published>([^<]+)<\/published>/) || [])[1],
      })).filter((x) => x.vid && x.published && Date.parse(x.published) > cutoff).slice(0, 3);
      if (!items.length) { debug[p.name] = "nothing recent"; return; }
      const ids = items.map((x) => "yt:" + x.vid);
      const { data: have } = await sb.from("baraza_posts").select("ext_id").in("ext_id", ids);
      const known = new Set((have || []).map((h: any) => h.ext_id));
      for (const it of items) {
        if (known.has("yt:" + it.vid)) continue;
        const { error } = await sb.from("baraza_posts").insert({
          kind: "social", platform: "youtube", url: `https://www.youtube.com/watch?v=${it.vid}`, title: it.title,
          body: it.title, source_name: p.name, source_handle: id, author_name: "Socials sweep", hidden: false,
          ext_id: "yt:" + it.vid, created_at: it.published, last_activity_at: it.published,
        });
        if (!error) added++;
      }
      debug[p.name] = `${items.length} recent`;
    } catch (e) { debug[p.name] = "err " + String(e).slice(0, 40); }
  });
  return { added, debug };
}

/* ---------- 3. seed drafts from Baraza activity ---------- */
async function classify(p: any) {
  const text = [p.title && `Title: ${p.title}`, p.body && `Text: ${p.body}`, p.url && `Link: ${p.url}`,
    p.source_name && `Posted by: ${p.source_name}`, p.county && `County: ${p.county}`].filter(Boolean).join("\n").slice(0, 3000);
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001", max_tokens: 450,
      system: "You sort posts from a Kenyan climate/environmental-justice coalition's members' forum and partners' social feeds. " +
        "Decide if the post should become a draft in another section of the coalition's hub:\n" +
        "- opportunity: an OPEN funding call, grant, fellowship, award or job relevant to climate/environment work (needs a link)\n" +
        "- event: a specific upcoming event (conference, forum, baraza, training, webinar) with a date\n" +
        "- resource: a report, study, policy, toolkit, guide or dataset (needs a link)\n" +
        "- media: a news article or media coverage about climate/environment issues in Kenya/East Africa (needs a link)\n" +
        "- petition: a petition, memorandum or open letter people are asked to SIGN (needs a link)\n" +
        "- action: a specific call to action other than signing — e.g. submit comments on an EIA/bill, attend public participation, write to an MP/MCA, join a march — with a link or a date\n" +
        "- none: discussion, opinion, greetings, questions, or anything unclear.\n" +
        "Be conservative: when unsure, answer none. Reply with ONLY compact JSON: " +
        '{"type":"opportunity|event|resource|media|petition|action|none","title":"clean title","meta":"short descriptor e.g. Grant · Funder · closes 12 Dec 2026","date":"YYYY-MM-DD (event date, or petition/action deadline) or null","location":"place or null","target":"for petition/action: who it is addressed to, e.g. Ministry of Energy, Siaya County Assembly; else null","ask":"for petition/action: the ask in one or two plain sentences; else null","link":"for petition/action: the full https URL to sign or act, only if it appears complete in the text; else null"}',
      messages: [{ role: "user", content: text }],
    }),
    signal: AbortSignal.timeout(25000),
  });
  const j = await r.json();
  const raw = j?.content?.[0]?.text ?? "";
  try { return JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1)); } catch { return { type: "none" }; }
}
async function seed() {
  if (!ANTHROPIC_KEY) return { skipped: "no ANTHROPIC_API_KEY" };
  const since = new Date(Date.now() - 21 * 864e5).toISOString();
  const { data: posts } = await sb.from("baraza_posts").select("*")
    .eq("hidden", false).is("seeded_at", null).gte("created_at", since).order("created_at", { ascending: true }).limit(20);
  const out: Record<string, number> = { opportunity: 0, event: 0, resource: 0, media: 0, petition: 0, action: 0, none: 0, dup: 0 };
  await pool(posts || [], 5, async (p: any) => {
    let c: any = { type: "none" };
    try { c = await classify(p); } catch { c = { type: "none" }; }
    let t = ["opportunity", "event", "resource", "media", "petition", "action"].includes(c.type) ? c.type : "none";
    const url = /^https:\/\//.test(p.url || "") ? p.url : null;
    const goodDate = /^\d{4}-\d{2}-\d{2}$/.test(c.date || "") && Date.parse(c.date) >= Date.now() - 864e5 ? c.date : null;
    if (t !== "event" && t !== "action" && t !== "none" && !url) t = "none";
    if (t === "action" && !url && !goodDate) t = "none";
    const by = p.source_name || p.author_org || p.author_name || "Baraza";
    const title = String(c.title || p.title || p.body || "").slice(0, 300);
    if (t === "petition" || t === "action") {
      const link = /^https:\/\/[^\s…]+$/.test(c.link || "") && !/…/.test(c.link) ? c.link : url;
      const { data: d } = link ? await sb.from("petitions").select("id").eq("action_url", link).limit(1) : { data: [] as any[] };
      if (d && d.length) { out.dup++; t = "dup"; }
      else {
        const { error } = await sb.from("petitions").insert({
          kind: t, title, target: String(c.target || "Duty-bearers").slice(0, 200),
          summary: String(c.ask || p.body || title).slice(0, 600), body: (p.body || "").slice(0, 2000) || null,
          action_url: link, deadline: goodDate, source: "baraza", source_name: by, goal: 0, published: false,
        });
        if (error) t = "none";
      }
    } else if (t === "event") {
      const date = /^\d{4}-\d{2}-\d{2}$/.test(c.date || "") && Date.parse(c.date) >= Date.now() - 864e5 ? c.date : null;
      if (!date) t = "none";
      else {
        const { data: d } = url ? await sb.from("calendar_events").select("id").eq("link", url).limit(1) : { data: [] as any[] };
        if (d && d.length) { out.dup++; t = "dup"; }
        else await sb.from("calendar_events").insert({ title, start_date: date, location: c.location || null, org: by,
          link: url, description: (p.body || "").slice(0, 1000) + "\n\n(Seeded from the Baraza)", source: "baraza", published: false });
      }
    } else if (t !== "none") {
      const { data: d } = await sb.from("resources").select("id").eq("url", url).limit(1);
      if (d && d.length) { out.dup++; t = "dup"; }
      else await sb.from("resources").insert({
        category: t === "opportunity" ? "Opportunities" : t === "media" ? "Media briefs" : "Resources",
        title, meta: [c.meta, "via the Baraza"].filter(Boolean).join(" · "), url, kind: "LINK", by, published: false,
      });
    }
    if (t in out && t !== "dup") out[t]++;
    await sb.from("baraza_posts").update({ seeded_at: new Date().toISOString(), seeded_to: t }).eq("id", p.id);
  });
  return out;
}

Deno.serve(async (req) => {
  if (CRON_SECRET && req.headers.get("x-cron-secret") !== CRON_SECRET) return json({ error: "forbidden" }, 403);
  T0 = Date.now();
  try {
    const { data: partners } = await sb.from("partners").select("name,x_handle,youtube").eq("active", true);
    const verified = await verifySocials(partners || []);
    const yt = await youtube(partners || []);
    const seeded = await seed();
    return json({ verified, youtube: yt, seeded });
  } catch (e) { return json({ error: String(e) }, 500); }
});
