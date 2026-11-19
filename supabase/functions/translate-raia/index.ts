// Supabase Edge Function: translate-raia  (MazingiraKenya)  v1 (2026-11-17)
// Makes raia's live streams readable in Swahili and Sheng:
//   A) Tetesi + Ukweli Halisi  -> disinfo_items.i18n  {body,verdict,rebuttal} x {sw,sh}
//   B) Kwenye Habari           -> sentiment_items.gist {sw,sh}  (plain-language gist of each headline)
//
// It only fills what is MISSING or STALE, so it is cheap to run often and the first runs
// double as the backfill. Every source of disinfo rows (the scanner, the weekly device task,
// manual uploads in admin) is covered the same way, because this runs over the table, not
// inside one scanner.
//   - A row whose English changed since it was translated is redone (hash in i18n.src),
//     unless an admin hand-edited the translation (i18n.edited = true) — that is never overwritten.
//   - Drafts (published=false) are translated too, so the admin sees SW/SH in the review queue
//     before publishing.
//
// Deploy:  supabase functions deploy translate-raia --project-ref uueemckdoozsuowcqkhl
// Secrets: CRON_SECRET, ANTHROPIC_API_KEY, optional TRANSLATE_MODEL (default claude-sonnet-5-5)
// Body (optional JSON): {"only":"disinfo"|"news", "max_disinfo":24, "max_news":80, "news_days":14}

import { createClient } from "jsr:@supabase/supabase-js@2";
import { askTool, LlmStats } from "../_shared/llm.ts";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";
const MODEL = Deno.env.get("TRANSLATE_MODEL") ?? "claude-sonnet-5-5";
const BUDGET_MS = 125_000;           // stay well under Supabase's ~150s wall clock
const DISINFO_BATCH = 4, NEWS_BATCH = 20;

const VOICE =
  "Audience: ordinary Kenyans following climate & environmental-justice issues on raia (MazingiraKenya's public page). " +
  "\"sw\" = clear, everyday standard Kiswahili (Kenyan usage, not stiff or academic). " +
  "\"sh\" = Nairobi Sheng as young Nairobians actually speak it: natural mix of Sheng, Swahili and English " +
  "(e.g. \"Hizo kampuni zinasema...\", \"doo\", \"project\", \"ni fiti\", \"wasee\") — respectful, readable, not slang-heavy, never mocking. " +
  "Keep names of people, places, organisations, numbers and dates exactly. Keep technical terms people know in English " +
  "(e.g. carbon credits, EIA) and explain them briefly in brackets the first time if needed. Never add facts that are not in the source text.";

function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}
const T2 = { type: "object", properties: { sw: { type: "string" }, sh: { type: "string" } }, required: ["sw", "sh"] };

// ---------- A) disinfo_items ----------
const DISINFO_SYSTEM = "You translate fact-check cards for raia. " + VOICE + " " +
  "Each card has: claim (the post or headline being fact-checked), verdict (a short label like False / Misleading / Lacks context), " +
  "and rebuttal (the evidence-based correction). Translate all three into sw and sh, keeping the meaning exact — the rebuttal must " +
  "not get stronger or weaker. If the claim is ALREADY in Swahili or Sheng, return it unchanged for that language. " +
  "Verdict: 1-3 words (e.g. sw \"Si kweli\", \"Inapotosha\", \"Haina muktadha\"; sh \"Ni uongo\", \"Inadanganya\", \"Haina context\"). " +
  "Call submit_cards with one entry per card, same ids, same order.";
const DISINFO_SCHEMA = {
  type: "object",
  properties: {
    cards: {
      type: "array",
      items: { type: "object", properties: { id: { type: "string" }, body: T2, verdict: T2, rebuttal: T2 }, required: ["id", "body", "verdict", "rebuttal"] },
    },
  },
  required: ["cards"],
};

function srcOf(r: any) { return hash(`${r.body ?? ""}|${r.eng ?? ""}|${r.verdict ?? ""}|${r.rebuttal ?? ""}`); }
function needsDisinfo(r: any) {
  const i = r.i18n;
  if (!i || !i.body || !i.rebuttal) return true;
  if (i.edited) return false;
  return i.src !== srcOf(r);
}

async function doDisinfo(max: number, started: number, llm: LlmStats) {
  const { data, error } = await sb.from("disinfo_items")
    .select("id,body,eng,verdict,rebuttal,i18n,published,created_at")
    .order("published", { ascending: false }).order("created_at", { ascending: false }).limit(400);
  if (error) return { error: error.message };
  const todo = (data || []).filter(needsDisinfo).slice(0, max);
  let done = 0, failed = 0, timed_out = false, aborted = false;
  for (let i = 0; i < todo.length; i += DISINFO_BATCH) {
    if (Date.now() - started > BUDGET_MS) { timed_out = true; break; }
    const batch = todo.slice(i, i + DISINFO_BATCH);
    const user = batch.map((r) =>
      `<card id="${r.id}">\n<claim>${r.body ?? ""}</claim>\n` +
      (r.eng ? `<claim_english>${r.eng}</claim_english>\n` : "") +
      `<verdict>${r.verdict ?? ""}</verdict>\n<rebuttal>${r.rebuttal ?? ""}</rebuttal>\n</card>`).join("\n\n");
    const res = await askTool(DISINFO_SYSTEM, user, "submit_cards", DISINFO_SCHEMA, 4000, 90_000, MODEL);
    llm.record(res);
    if (res.err) { failed += batch.length; if (res.fatal) { aborted = true; break; } continue; }
    const byId = new Map<string, any>((res.data?.cards || []).map((c: any) => [String(c.id), c]));
    for (const r of batch) {
      const c = byId.get(String(r.id));
      if (!c?.body?.sw || !c?.rebuttal?.sw) { failed++; continue; }
      const i18n = {
        body: { sw: c.body.sw, sh: c.body.sh || c.body.sw },
        verdict: { sw: c.verdict?.sw || "", sh: c.verdict?.sh || c.verdict?.sw || "" },
        rebuttal: { sw: c.rebuttal.sw, sh: c.rebuttal.sh || c.rebuttal.sw },
        src: srcOf(r), edited: false, model: MODEL, at: new Date().toISOString(),
      };
      const { error: e2 } = await sb.from("disinfo_items").update({ i18n }).eq("id", r.id);
      if (e2) failed++; else done++;
    }
  }
  const remaining = (data || []).filter(needsDisinfo).length - done;
  return { pending_before: todo.length, translated: done, failed, remaining: Math.max(0, remaining), timed_out, aborted };
}

// ---------- B) sentiment_items gists ----------
const NEWS_SYSTEM = "You turn English news headlines into one-line plain-language gists for raia's 'Kwenye Habari' stream. " + VOICE + " " +
  "For each numbered headline write ONE short sentence (max ~22 words) in sw and in sh saying what the story is about, in words a " +
  "non-specialist understands. Use ONLY what the headline (and snippet, if given) says — do not guess outcomes, numbers or causes. " +
  "Drop clickbait and site names. Call submit_gists with exactly one entry per headline, same n, same order.";
const NEWS_SCHEMA = {
  type: "object",
  properties: { gists: { type: "array", items: { type: "object", properties: { n: { type: "integer" }, sw: { type: "string" }, sh: { type: "string" } }, required: ["n", "sw", "sh"] } } },
  required: ["gists"],
};
function decode(s: string) {
  return String(s ?? "").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&amp;/g, "&");
}

async function doNews(max: number, days: number, started: number, llm: LlmStats) {
  const since = new Date(Date.now() - days * 86400_000).toISOString();
  const { data, error } = await sb.from("sentiment_items").select("id,title,snippet,source")
    .is("gist", null).gte("published_at", since).order("published_at", { ascending: false }).limit(max);
  if (error) return { error: error.message };
  const todo = data || [];
  let done = 0, failed = 0, timed_out = false, aborted = false;
  for (let i = 0; i < todo.length; i += NEWS_BATCH) {
    if (Date.now() - started > BUDGET_MS) { timed_out = true; break; }
    const batch = todo.slice(i, i + NEWS_BATCH);
    const user = batch.map((r, n) => `${n + 1}. ${decode(r.title)}` + (r.snippet ? `\n   snippet: ${decode(r.snippet).slice(0, 300)}` : "")).join("\n");
    const res = await askTool(NEWS_SYSTEM, user, "submit_gists", NEWS_SCHEMA, 4000, 90_000, MODEL);
    llm.record(res);
    if (res.err) { failed += batch.length; if (res.fatal) { aborted = true; break; } continue; }
    const byN = new Map<number, any>((res.data?.gists || []).map((g: any) => [Number(g.n), g]));
    for (let n = 0; n < batch.length; n++) {
      const g = byN.get(n + 1);
      if (!g?.sw) { failed++; continue; }
      const { error: e2 } = await sb.from("sentiment_items").update({ gist: { sw: g.sw, sh: g.sh || g.sw } }).eq("id", batch[n].id);
      if (e2) failed++; else done++;
    }
  }
  return { pending_before: todo.length, translated: done, failed, timed_out, aborted };
}

Deno.serve(async (req) => {
  if (CRON_SECRET && req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { "content-type": "application/json" } });
  }
  const started = Date.now();
  const llm = new LlmStats(MODEL);
  let opts: any = {};
  try { opts = await req.json(); } catch { /* no body */ }
  try {
    const out: Record<string, unknown> = { model: MODEL };
    if (opts.only !== "news") out.disinfo = await doDisinfo(Number(opts.max_disinfo ?? 24), started, llm);
    if (opts.only !== "disinfo") out.news = await doNews(Number(opts.max_news ?? 80), Number(opts.news_days ?? 14), started, llm);
    out.llm = llm;
    return new Response(JSON.stringify(out), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e), llm }), { status: 500, headers: { "content-type": "application/json" } });
  }
});
