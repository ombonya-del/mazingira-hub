// Supabase Edge Function: event-scanner  (MazingiraKenya)
// Discovers upcoming climate / environmental-justice EVENTS (conferences, summits,
// forums, COP-related) relevant to Kenya / East Africa / pan-African climate justice
// and files them into `calendar_events` as DRAFTS (published=false) for admin Accept/Reject.
// Uses Claude (haiku) to extract structured event fields from each candidate headline.
//
// Deploy:  supabase functions deploy event-scanner --project-ref uueemckdoozsuowcqkhl
// Secrets: CRON_SECRET, ANTHROPIC_API_KEY

import { createClient } from "jsr:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";

const FEEDS = [
  { url: "https://news.google.com/rss/search?q=Africa+(climate+OR+environment+OR+biodiversity+OR+%22climate+justice%22)+(conference+OR+summit+OR+forum+OR+COP+OR+symposium+OR+convening)+2026&hl=en&gl=KE&ceid=KE:en", org: "Google News" },
  { url: "https://news.google.com/rss/search?q=Kenya+(climate+OR+environment+OR+conservation)+(conference+OR+summit+OR+forum+OR+workshop+OR+expo)+2026&hl=en-KE&gl=KE&ceid=KE:en", org: "Google News" },
];

const REL = ["climate", "environment", "conservation", "biodiversity", "carbon", "energy",
  "just transition", "nature", "ecosystem", "drought", "adaptation", "resilience", "cop",
  "reparations", "green", "sustainab", "land", "water", "forest"];
const EVENTWORD = ["conference", "summit", "forum", "cop", "symposium", "convening", "workshop", "expo", "dialogue", "week", "congress"];
const candidate = (t: string) => { const s = (t || "").toLowerCase(); return REL.some((k) => s.includes(k)) && EVENTWORD.some((k) => s.includes(k)); };

function pick(block: string, tag: string): string | null {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&").replace(/<[^>]+>/g, "").trim() : null;
}

async function fetchRss(feed: { url: string; org: string }) {
  try {
    const r = await fetch(feed.url, { headers: { "User-Agent": "mazingira-event-scanner" }, signal: AbortSignal.timeout(15000) });
    if (!r.ok) return { items: [] as any[], status: r.status };
    const xml = await r.text();
    const blocks = xml.split(/<item[\s>]/i).slice(1);
    const items = blocks.map((b) => {
      const title = pick(b, "title");
      const link = (pick(b, "link") || "").split("<")[0].trim();
      const desc = pick(b, "description") || "";
      return title && link ? { title, link, desc } : null;
    }).filter(Boolean);
    return { items, status: r.status };
  } catch (e) { return { items: [] as any[], status: "err:" + String(e).slice(0, 50) }; }
}

async function extractEvent(title: string, desc: string): Promise<any | null> {
  if (!ANTHROPIC_KEY) return null;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001", max_tokens: 200,
        system: "You extract structured data about a single upcoming climate/environment EVENT from a news snippet. " +
          "Reply ONLY with compact JSON: {\"is_event\":bool,\"start_date\":\"YYYY-MM-DD\"|null,\"location\":str|null,\"mode\":\"In person\"|\"Virtual\"|\"Hybrid\"|null,\"org\":str|null,\"description\":str|null}. " +
          "is_event is true ONLY if this is a specific, real, upcoming conference/summit/forum/COP with a plausible future date. If it's just news coverage, set is_event false.",
        messages: [{ role: "user", content: `${title}\n\n${desc}`.slice(0, 1200) }],
      }),
      signal: AbortSignal.timeout(20000),
    });
    const j = await r.json();
    const txt = (j?.content?.[0]?.text ?? "").trim().replace(/^```json\s*|\s*```$/g, "");
    return JSON.parse(txt);
  } catch (_) { return null; }
}

Deno.serve(async (req) => {
  if (CRON_SECRET && req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { "content-type": "application/json" } });
  }
  try {
    const debug: Record<string, unknown> = {};
    let all: any[] = [];
    for (const f of FEEDS) { const res = await fetchRss(f); debug[f.org] = `${res.status}/${res.items.length}`; all = all.concat(res.items); }
    const cands = all.filter((x) => x.title && x.link && candidate(x.title)).slice(0, 15);

    // dedupe against existing links
    const { data: existing } = await sb.from("calendar_events").select("link").in("link", cands.map((x) => x.link));
    const have = new Set((existing || []).map((e: any) => e.link));

    let inserted = 0;
    for (const c of cands) {
      if (have.has(c.link)) continue;
      const ev = await extractEvent(c.title, c.desc);
      if (!ev || !ev.is_event) continue;
      const { error } = await sb.from("calendar_events").insert({
        title: String(c.title).slice(0, 300),
        start_date: ev.start_date && /^\d{4}-\d{2}-\d{2}$/.test(ev.start_date) ? ev.start_date : null,
        time: null, location: ev.location ?? null, mode: ev.mode ?? null,
        description: ev.description ?? null, org: ev.org ?? null, link: c.link,
        source: "watch", published: false,
      });
      if (!error) { inserted++; have.add(c.link); }
    }
    return new Response(JSON.stringify({ candidates: cands.length, inserted, debug }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { "content-type": "application/json" } });
  }
});
