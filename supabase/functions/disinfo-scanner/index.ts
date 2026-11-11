// Supabase Edge Function: disinfo-scanner  (MazingiraKenya)  v2 (2026-11-09)
// Scans Kenyan / East African climate-and-environment media for DISINFORMATION and
// misleading narratives (denialism, greenwashing, false claims, manipulated framing).
// Claude flags each candidate, assigns a verdict and writes an evidence-based rebuttal;
// flagged items go into `disinfo_items` as DRAFTS (published=false) for admin review.
//
// v2 changes (it screened 20 and inserted 0 on both Oct 17 and Nov 9):
//  - Screening is broader: besides outright false claims, it flags uncritical
//    amplification of misleading industry/government framing (e.g. "clean coal",
//    nuclear or refinery projects presented as risk-free, carbon-credit claims taken at
//    face value) with a confidence level. Admin still decides, so drafts can be generous.
//  - Targeted feeds for the stories being tracked (Lamu/Dangote refinery, Siaya nuclear,
//    carbon credits, coal), on Google AND Bing; AllAfrica Kenya added.
//  - Candidates ordered targeted-feeds-first, up to 30 (was 20, general feeds first).
//  - Claude failures are reported (llm.errors / llm.sample_error) instead of hidden.
//
// Deploy:  supabase functions deploy disinfo-scanner --project-ref uueemckdoozsuowcqkhl
// Secrets: CRON_SECRET, ANTHROPIC_API_KEY, optional SCANNER_MODEL, optional DISINFO_MIN_CONFIDENCE (low|medium|high, default medium)

import { createClient } from "jsr:@supabase/supabase-js@2";
import { askJson, LlmStats } from "../_shared/llm.ts";
import { bingNews, fetchAll, googleNews, TIME_BUDGET_MS, type Feed } from "../_shared/rss.ts";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";
const MIN_CONF = (Deno.env.get("DISINFO_MIN_CONFIDENCE") ?? "medium").toLowerCase();
const RANK: Record<string, number> = { low: 1, medium: 2, high: 3 };
const MAX_CANDIDATES = 30;

const TARGETED = [
  'Kenya (climate OR coal OR "carbon credits" OR oil OR environment) (claim OR misleading OR false OR hoax OR denial OR greenwash)',
  'Lamu OR Dangote refinery Kenya environment',
  'Siaya OR NuPEA nuclear plant Kenya',
  'Kenya "carbon credits" OR "carbon market" communities',
  'Africa (climate OR "fossil fuel" OR gas) (disinformation OR misleading OR greenwashing)',
];
const FEEDS: Feed[] = [
  ...TARGETED.map((q) => googleNews(q)),
  ...TARGETED.map((q) => bingNews(q)),
  { url: "https://allafrica.com/tools/headlines/rdf/kenya/headlines.rdf", label: "AllAfrica Kenya" },
  { url: "https://www.standardmedia.co.ke/rss/headlines.php", label: "The Standard" },
  { url: "https://news.mongabay.com/feed/", label: "Mongabay" },
  { url: "https://www.climatechangenews.com/feed/", label: "Climate Home News" },
];

const KW = /(climate|carbon|coal|oil|gas|fossil|refinery|geotherm|nuclear|uranium|drought|flood|conservanc|land|Lamu|Turkana|Siaya|environment|Dangote|greenwash|emission|deforest|mining|pipeline|EACOP)/i;

const SYSTEM =
  "You screen Kenyan/African climate & environment media for the hub's Narrative-disinfo queue. A human editor reviews every draft, so flag items worth a second look. " +
  "Flag (is_disinfo=true) when the item itself CARRIES OR AMPLIFIES a false, unsupported or misleading environmental claim, including: climate denial; greenwashing; " +
  "uncritical repetition of industry or government claims that a coal, oil, gas, refinery, nuclear, mining or carbon-credit project is clean, safe, risk-free or uncontested " +
  "when serious known risks or community objections go unmentioned; misleading statistics or framing that downplays environmental or community harm. " +
  "Do NOT flag accurate reporting, fact-checks, critical coverage, or advocacy that is evidence-based. " +
  'Reply ONLY with compact JSON: {"is_disinfo":bool,"confidence":"low"|"medium"|"high","verdict":"False"|"Misleading"|"Unsupported"|"Lacks context","claim":str,"rebuttal":str}. ' +
  "claim: the misleading claim in one line. rebuttal: 1-2 sentences of evidence-based correction or missing context.";

Deno.serve(async (req) => {
  if (CRON_SECRET && req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { "content-type": "application/json" } });
  }
  const llm = new LlmStats();
  const started = Date.now();
  try {
    const { all, debug } = await fetchAll(FEEDS);   // targeted feeds come first in FEEDS, so they win the cap
    const rough = all.filter((x) => KW.test(x.title + " " + x.desc));

    const { data: existing } = await sb.from("disinfo_items").select("tweet_url").in("tweet_url", rough.map((x) => x.link));
    const have = new Set((existing || []).map((e: any) => e.tweet_url));
    const fresh = rough.filter((x) => !have.has(x.link));
    const cands = fresh.slice(0, MAX_CANDIDATES);

    let inserted = 0, cleared = 0, below_confidence = 0, failed = 0, aborted = false, timed_out = false;
    for (const c of cands) {
      if (Date.now() - started > TIME_BUDGET_MS) { timed_out = true; break; }
      const res = await askJson(SYSTEM, `SOURCE: ${c.source}\nHEADLINE: ${c.title}\n\n${c.desc}`.slice(0, 1800), 360);
      llm.record(res);
      if (res.err) { failed++; if (res.fatal) { aborted = true; break; } continue; }
      const a = res.data;
      if (!a.is_disinfo || !a.rebuttal || !a.verdict) { cleared++; continue; }
      if ((RANK[String(a.confidence).toLowerCase()] ?? 1) < (RANK[MIN_CONF] ?? 2)) { below_confidence++; continue; }
      const verdict = String(a.verdict);
      const { error } = await sb.from("disinfo_items").insert({
        name: c.source, handle: null, posted_at: c.pubDate ?? null,
        body: String(a.claim ? `${c.title} — ${a.claim}` : c.title).slice(0, 600), eng: null,
        verdict, verdict_class: verdict.toLowerCase().replace(/\s+/g, "-"),
        tweet_url: c.link, rebuttal: String(a.rebuttal).slice(0, 800), published: false,
      });
      if (!error) { inserted++; have.add(c.link); }
    }
    return new Response(JSON.stringify({
      candidates: cands.length, already_seen: rough.length - fresh.length, inserted, cleared, below_confidence, failed, aborted, timed_out,
      min_confidence: MIN_CONF, llm, debug,
    }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e), llm }), { status: 500, headers: { "content-type": "application/json" } });
  }
});
