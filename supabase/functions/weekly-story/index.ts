// Supabase Edge Function: weekly-story  (MazingiraKenya · raia "Story of the week")  2026-11-13
// Every Monday it picks the week's most important climate / environmental-justice story from the
// hub's own intelligence (media radar, disinfo desk, sector streams, COP31 digests) and drafts it in
// raia's issue format — what's happening, how it's being talked about, the fuller picture, what you
// can do — then translates it into Kiswahili and Sheng. Nothing is public until an admin publishes it.
//
// Two calls, so each stays well inside Supabase's time limit (the GitHub workflow makes both):
//   POST {"mode":"write"}      choose the story + write the English version  (draft row)
//   POST {"mode":"translate"}  add Kiswahili + Sheng to this week's draft     (two calls in parallel)
//
// Deploy:  supabase functions deploy weekly-story --project-ref uueemckdoozsuowcqkhl
// SQL:     run supabase/weekly-story.sql once
// Secrets: CRON_SECRET, ANTHROPIC_API_KEY, optional STORY_MODEL (default claude-sonnet-5-5)

import { createClient } from "jsr:@supabase/supabase-js@2";
import { askTool, LlmStats } from "../_shared/llm.ts";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";
const MODEL = Deno.env.get("STORY_MODEL") ?? "claude-sonnet-5-5";

// raia's standing issues (so the draft can link to one, and so we don't just repeat them)
const ISSUES = [
  ["lamu-refinery", "A $17bn oil refinery is coming to Lamu"], ["lamu-coal", "The Lamu coal plant that Kenya defeated"],
  ["western-gold", "Gold, guns and eviction in Western Kenya"], ["turkana-wind", "Lake Turkana wind: green power, contested land"], ["turkana-oil", "Turkana oil is flowing. Who gets paid, and who cleans up?"],
  ["siaya-nuclear", "A nuclear plant proposed for the lakeshore"], ["coast-plastics", "Drowning in plastic: Dandora, Gioto & the coast"],
];

const eat = () => new Date(Date.now() + 3 * 3600_000);
function mondayOf(d: Date) { const x = new Date(d); const wd = (x.getUTCDay() + 6) % 7; x.setUTCDate(x.getUTCDate() - wd); return x.toISOString().slice(0, 10); }
const reply = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json" } });
const pick = (r: any, keys: string[]) => { for (const k of keys) if (r?.[k]) return String(r[k]); return ""; };

// ---------- WRITE (English) ----------
const EN_SCHEMA = {
  type: "object",
  properties: {
    pick_reason: { type: "string" },
    status: { type: "string", enum: ["new", "ongoing", "threat", "proposed", "win", "decided"] },
    place: { type: "string" }, title: { type: "string" }, summary: { type: "string" },
    happening: { type: "array", items: { type: "string" } }, narrative: { type: "array", items: { type: "string" } },
    gap: { type: "array", items: { type: "string" } }, action: { type: "string" },
    related_issue: { type: "string" }, src: { type: "array", items: { type: "integer" } },
  },
  required: ["pick_reason", "status", "place", "title", "summary", "happening", "narrative", "gap", "action", "src"],
};
const WRITE_SYSTEM = `You are the editor of raia, MazingiraKenya's public platform that explains Kenya's climate and environmental-justice issues to ordinary Kenyans in plain language.
Each week you choose ONE "Story of the week" from the hub's intelligence for the past 7 days and write it in raia's format.

CHOOSING: pick the story that matters most to Kenyan communities this week — weigh how much coverage it got, how directly it affects land, water, air, health, livelihoods or public money in Kenya, whether a decision or participation window is coming, and whether misleading framing is circulating. Prefer a fresh development over background. Avoid repeating last weeks' picks unless there is major news.

WRITING (English only in this step):
- title: max 12 words, plain and concrete. place: county / region (e.g. "Lamu · Coast"). summary: 2 sentences.
- happening: 2 short paragraphs — the facts: who, what, where, when, how much.
- narrative: 1–2 paragraphs — how it is being presented by officials, companies or media (the dominant framing).
- gap: 1–2 paragraphs — the fuller picture: what that framing leaves out, the fair questions to ask, community concerns.
- action: 1–2 sentences — something an ordinary Kenyan can do (ask a specific question, take part in a hearing, sign, share).
- related_issue: the id of a standing raia issue it continues, if any, else "".
- src: the item numbers you relied on.
RULES: use ONLY facts in the items provided; never invent figures, names, dates or quotes. Fair, not sensational: question claims, don't attack people. Short sentences, no jargon (explain any technical term in a few words).
Call the submit_story tool once.`;

async function write(llm: LlmStats) {
  const week = mondayOf(eat());
  const since = new Date(Date.now() - 7 * 864e5).toISOString();
  const { data: existing } = await sb.from("weekly_stories").select("id,published,issue_id").eq("week_of", week).order("updated_at", { ascending: false });
  if ((existing ?? []).some((r: any) => r.published)) return { skipped: "this week already has a published story", week };

  // gather the week's intelligence
  const [radar, disinfo, extract, legal, policy, cop, prev] = await Promise.all([
    sb.from("sentiment_items").select("title,source,stance,url,published_at").gte("published_at", since).order("published_at", { ascending: false }).limit(140),
    sb.from("disinfo_items").select("body,verdict,tweet_url,name,created_at").gte("created_at", since).limit(20),
    sb.from("extractive_signals").select("*").gte("created_at", since).limit(15),
    sb.from("litigation_updates").select("*").gte("created_at", since).limit(15),
    sb.from("policy_updates").select("*").gte("created_at", since).limit(15),
    sb.from("cop_digests").select("digest_date,hub").gte("digest_date", since.slice(0, 10)).order("digest_date", { ascending: false }).limit(6),
    sb.from("weekly_stories").select("week_of,story,issue_id").eq("published", true).order("week_of", { ascending: false }).limit(4),
  ]);
  type It = { text: string; url: string; source: string };
  const items: It[] = [];
  for (const r of radar.data ?? []) items.push({ text: `[media · ${r.stance}] ${r.title}`, url: r.url, source: r.source });
  for (const r of disinfo.data ?? []) items.push({ text: `[disinfo flag · ${r.verdict}] ${String(r.body).slice(0, 220)}`, url: r.tweet_url ?? "", source: r.name ?? "disinfo desk" });
  for (const [tag, res] of [["extractive", extract], ["litigation", legal], ["policy", policy]] as const)
    for (const r of (res as any).data ?? []) items.push({ text: `[${tag}] ${pick(r, ["title", "headline", "name", "summary"])} ${pick(r, ["summary", "detail", "description"]).slice(0, 200)}`.trim(),
      url: pick(r, ["url", "link", "source_url"]), source: pick(r, ["source", "outlet", "court"]) || tag });
  for (const r of cop.data ?? []) if (r.hub?.headline) items.push({ text: `[COP31 ${r.digest_date}] ${r.hub.headline}. ${String(r.hub.summary ?? "").slice(0, 240)}`, url: "", source: "COP31 Daily" });
  if (items.length < 5) return { skipped: "too little intelligence this week", items: items.length, week };

  const prevList = (prev.data ?? []).map((p: any) => `${p.week_of}: ${p.issue_id ? "featured issue " + p.issue_id : (p.story?.title?.en ?? "")}`).join("\n") || "none yet";
  const user = `WEEK OF ${week}.\nSTANDING RAIA ISSUES: ${ISSUES.map(([id, t]) => `${id} = ${t}`).join("; ")}\nLAST WEEKS' STORIES:\n${prevList}\n\nTHIS WEEK'S INTELLIGENCE:\n` +
    items.slice(0, 180).map((it, i) => `[${i + 1}] ${it.source}: ${it.text}`).join("\n");

  const res = await askTool(WRITE_SYSTEM, user, "submit_story", EN_SCHEMA, 3500, 110_000, MODEL);
  llm.record(res);
  if (res.err) return { inserted: 0, failed: 1, week, items: items.length };
  const d = res.data;
  const sources = [...new Set<number>((d.src ?? []).map(Number))].filter((n) => n >= 1 && n <= items.length)
    .map((n) => ({ n, title: items[n - 1].text.replace(/^\[[^\]]+\]\s*/, "").slice(0, 160), url: items[n - 1].url, source: items[n - 1].source }));
  const en = (v: any) => ({ en: v ?? "" });
  const story = {
    status: d.status, related: d.related_issue || null,
    place: en(d.place), title: en(d.title), summary: en(d.summary),
    happening: { en: d.happening ?? [] }, narrative: { en: d.narrative ?? [] }, gap: { en: d.gap ?? [] }, action: en(d.action),
  };
  const draft = (existing ?? []).find((r: any) => !r.published && !r.issue_id);
  const row = { week_of: week, story, sources, note: d.pick_reason ?? null, updated_at: new Date().toISOString() };
  const { error } = draft ? await sb.from("weekly_stories").update(row).eq("id", draft.id) : await sb.from("weekly_stories").insert(row);
  if (error) return { error: "db: " + error.message };
  return { inserted: draft ? 0 : 1, updated: draft ? 1 : 0, week, title: d.title, items: items.length, sources: sources.length };
}

// ---------- TRANSLATE (Kiswahili + Sheng) ----------
const TR_SCHEMA = {
  type: "object",
  properties: {
    place: { type: "string" }, title: { type: "string" }, summary: { type: "string" },
    happening: { type: "array", items: { type: "string" } }, narrative: { type: "array", items: { type: "string" } },
    gap: { type: "array", items: { type: "string" } }, action: { type: "string" },
  },
  required: ["place", "title", "summary", "happening", "narrative", "gap", "action"],
};
const TR_SYSTEM: Record<string, string> = {
  sw: "Translate this raia story into clear, natural standard Kiswahili for ordinary Kenyans. Keep every fact, number and name exactly; keep the same paragraphs. Plain everyday words, short sentences. Call the submit_translation tool once.",
  sh: "Rewrite this raia story in Nairobi Sheng — the natural mix of Sheng, Kiswahili and English young Nairobians speak (e.g. \"Hii project inasemekana…\", \"ni fiti kuuliza…\"). Respectful and clear, not slang-heavy, never mocking. Keep every fact, number and name exactly; keep the same paragraphs. Call the submit_translation tool once.",
};

async function translate(llm: LlmStats) {
  const week = mondayOf(eat());
  const { data: row } = await sb.from("weekly_stories").select("id,story,published").eq("week_of", week).is("issue_id", null)
    .order("updated_at", { ascending: false }).limit(1).maybeSingle();
  if (!row) return { skipped: "no draft this week", week };
  if (row.published) return { skipped: "already published", week };
  const s = row.story ?? {};
  const enOnly = { place: s.place?.en, title: s.title?.en, summary: s.summary?.en, happening: s.happening?.en, narrative: s.narrative?.en, gap: s.gap?.en, action: s.action?.en };
  const user = JSON.stringify(enOnly, null, 1);
  const [sw, sh] = await Promise.all([
    askTool(TR_SYSTEM.sw, user, "submit_translation", TR_SCHEMA, 3500, 110_000, MODEL),
    askTool(TR_SYSTEM.sh, user, "submit_translation", TR_SCHEMA, 3500, 110_000, MODEL),
  ]);
  llm.record(sw); llm.record(sh);
  const put = (lang: string, d: any) => { if (!d) return; for (const k of ["place", "title", "summary", "action"]) s[k] = { ...(s[k] ?? {}), [lang]: d[k] ?? "" };
    for (const k of ["happening", "narrative", "gap"]) s[k] = { ...(s[k] ?? {}), [lang]: d[k] ?? [] }; };
  put("sw", sw.data); put("sh", sh.data);
  const { error } = await sb.from("weekly_stories").update({ story: s, updated_at: new Date().toISOString() }).eq("id", row.id);
  if (error) return { error: "db: " + error.message };
  return { translated: [sw.data ? "sw" : null, sh.data ? "sh" : null].filter(Boolean), week, sw_error: sw.err, sh_error: sh.err };
}

Deno.serve(async (req) => {
  if (CRON_SECRET && req.headers.get("x-cron-secret") !== CRON_SECRET) return reply({ error: "forbidden" }, 403);
  const body = await req.json().catch(() => ({}));
  const llm = new LlmStats(MODEL);
  try {
    const out = body?.mode === "translate" ? await translate(llm) : await write(llm);
    return reply({ mode: body?.mode === "translate" ? "translate" : "write", ...out, llm });
  } catch (e) {
    return reply({ error: String(e), llm }, 500);
  }
});
