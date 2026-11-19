// Supabase Edge Function: news-digest  (MazingiraKenya)  v1 (2026-11-17)
// "Habari za leo" — once a day, takes the last ~30h of radar headlines (sentiment_items),
// picks the 3–5 stories that matter most to ordinary Kenyans, and summarises them in plain
// English, Swahili and Sheng for raia's Kwenye Habari tab. Same pattern as cop-digest.
//
// Grounding: the radar only stores headline + feed snippet (no article text), so the model is
// told to use ONLY that text and every story keeps its source links. Drafts land with
// published=false for admin review (set NEWS_DIGEST_AUTOPUBLISH=true to skip review).
// A digest the admin already published is never overwritten (pass {"force":true} to redo a draft).
//
// Deploy:  supabase functions deploy news-digest --project-ref uueemckdoozsuowcqkhl
// Secrets: CRON_SECRET, ANTHROPIC_API_KEY, optional NEWS_DIGEST_MODEL (default claude-sonnet-5-5),
//          optional NEWS_DIGEST_AUTOPUBLISH (true|false, default false)
// Body (optional JSON): {"date":"2026-11-17","hours":30,"force":false}

import { createClient } from "jsr:@supabase/supabase-js@2";
import { askTool, LlmStats } from "../_shared/llm.ts";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";
const MODEL = Deno.env.get("NEWS_DIGEST_MODEL") ?? "claude-sonnet-5-5";
const AUTOPUBLISH = (Deno.env.get("NEWS_DIGEST_AUTOPUBLISH") ?? "false").toLowerCase() === "true";

const T3 = { type: "object", properties: { en: { type: "string" }, sw: { type: "string" }, sh: { type: "string" } }, required: ["en", "sw", "sh"] };
const SCHEMA = {
  type: "object",
  properties: {
    headline: T3,                       // the day in one line
    summary: T3,                        // 2 short sentences
    stories: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: T3,                    // short plain title
          what: T3,                     // 1-2 sentences: what happened (only from the headlines/snippets)
          why: T3,                      // 1 sentence: why it matters for ordinary Kenyans
          refs: { type: "array", items: { type: "integer" } },   // numbers of the headlines it is based on
        },
        required: ["title", "what", "why", "refs"],
      },
    },
    why_care: T3,                       // one closing line
  },
  required: ["headline", "summary", "stories", "why_care"],
};

const SYSTEM =
  "You write 'Habari za leo', a short daily news round-up for raia — MazingiraKenya's public page explaining Kenya's climate & " +
  "environmental-justice news in everyday language. You get numbered headlines (with a feed snippet when available) from the last day.\n" +
  "1. Pick the 3-5 stories that matter most to ordinary Kenyans (land, water, air, food, livelihoods, energy projects, communities, " +
  "accountability). Group headlines about the same story together. Skip duplicates, opinion clickbait and foreign stories with no Kenya/East Africa angle unless major.\n" +
  "2. For each story: a short title, 'what' (1-2 sentences of what happened) and 'why' (1 sentence, why it matters here). " +
  "Use ONLY what the headlines and snippets say — never invent numbers, quotes, outcomes or causes. If something is unclear, say less.\n" +
  "3. Neutral, factual tone; no sensationalism.\n" +
  "Languages for every text field: \"en\" plain English; \"sw\" clear everyday Kenyan Kiswahili; \"sh\" Nairobi Sheng as young Nairobians " +
  "speak it — natural mix of Sheng/Swahili/English (e.g. \"Hizo kampuni zinasema...\", \"doo\", \"project\", \"ni fiti\"), respectful, readable, never mocking. " +
  "Keep names, places, numbers exactly. Keep well-known technical terms (carbon credits, EIA) in English.\n" +
  "Call submit_digest exactly once.";

function eatDate(d = new Date()) { return new Date(d.getTime() + 3 * 3600_000).toISOString().slice(0, 10); }
function decode(s: string) {
  return String(s ?? "").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&amp;/g, "&");
}

Deno.serve(async (req) => {
  if (CRON_SECRET && req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { "content-type": "application/json" } });
  }
  const llm = new LlmStats(MODEL);
  let opts: any = {};
  try { opts = await req.json(); } catch { /* no body */ }
  const digest_date = String(opts.date ?? eatDate());
  const hours = Number(opts.hours ?? 30);
  try {
    const { data: prev } = await sb.from("news_digests").select("id,published").eq("digest_date", digest_date).maybeSingle();
    if (prev?.published) return json({ skipped: "already published", digest_date });
    if (prev && !opts.force) return json({ skipped: "draft exists (pass force:true to redo)", digest_date });

    const since = new Date(Date.now() - hours * 3600_000).toISOString();
    const { data: rows, error } = await sb.from("sentiment_items").select("title,url,source,snippet,published_at")
      .gte("published_at", since).order("published_at", { ascending: false }).limit(45);
    if (error) return json({ error: error.message }, 500);
    if (!rows || rows.length < 3) return json({ skipped: "not enough new headlines", count: rows?.length ?? 0, digest_date });

    const user = rows.map((r, i) => `${i + 1}. [${r.source}] ${decode(r.title)}` + (r.snippet ? `\n   ${decode(r.snippet).slice(0, 350)}` : "")).join("\n");
    const res = await askTool(SYSTEM, user, "submit_digest", SCHEMA, 7000, 125_000, MODEL);
    llm.record(res);
    if (res.err) return json({ error: res.err, llm }, 502);

    const d = res.data;
    const used = new Set<number>();
    for (const s of d.stories || []) {
      s.refs = (s.refs || []).map(Number).filter((n: number) => n >= 1 && n <= rows.length);
      s.links = s.refs.map((n: number) => { used.add(n); return { title: decode(rows[n - 1].title), url: rows[n - 1].url, source: rows[n - 1].source }; });
    }
    const sources = [...used].sort((a, b) => a - b).map((n) => ({ title: decode(rows[n - 1].title), url: rows[n - 1].url, source: rows[n - 1].source }));
    const row = { digest_date, content: d, sources, model: MODEL, published: AUTOPUBLISH, updated_at: new Date().toISOString() };
    const { error: e2 } = await sb.from("news_digests").upsert(row, { onConflict: "digest_date" });
    if (e2) return json({ error: e2.message, llm }, 500);
    return json({ digest_date, stories: (d.stories || []).length, headlines_in: rows.length, published: AUTOPUBLISH, llm });
  } catch (e) {
    return json({ error: String(e), llm }, 500);
  }
});

function json(o: unknown, status = 200) { return new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json" } }); }
