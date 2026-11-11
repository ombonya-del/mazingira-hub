// Supabase Edge Function: opportunity-scanner  (MazingiraKenya)  v2 (2026-11-09)
// Auto-discovers climate / environmental-justice OPPORTUNITIES (grants, calls,
// fellowships, accreditations) for Kenya / East Africa / pan-African climate justice
// and files them into `resources` (category='Opportunities', published=false) for admin
// Accept/Reject. Each candidate page is fetched and Claude extracts opp_type / deadline /
// amount / eligibility and decides whether it is on-topic AND still open.
//
// v2 changes:
//  - Dead sources removed: OpportunitiesForAfricans (404), ReliefWeb v1 API (410, retired;
//    v2 needs an appname approved by ReliefWeb, so it is opt-in via RELIEFWEB_APPNAME).
//  - Google News now has Bing News twins, so a Google 503 no longer empties the scan.
//  - Claude failures are reported (llm.errors / llm.sample_error) instead of being
//    silently counted as "skipped" (every candidate was "skipped" Oct 17 and Nov 9).
//
// Deploy:  supabase functions deploy opportunity-scanner --project-ref uueemckdoozsuowcqkhl
// Secrets: CRON_SECRET, ANTHROPIC_API_KEY, optional RELIEFWEB_APPNAME, optional SCANNER_MODEL

import { createClient } from "jsr:@supabase/supabase-js@2";
import { askJson, LlmStats } from "../_shared/llm.ts";
import { bingNews, fetchAll, googleNews, TIME_BUDGET_MS, type Feed, type FeedItem } from "../_shared/rss.ts";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";
const RELIEFWEB_APPNAME = Deno.env.get("RELIEFWEB_APPNAME") ?? "";
const MAX_CANDIDATES = 40;   // bound per-run fetch + LLM cost

const Q1 = 'Africa (climate OR environment OR conservation OR "just transition") ("call for proposals" OR grant OR fellowship)';
const Q2 = 'Kenya OR "East Africa" (climate OR environment OR biodiversity) (grant OR "call for applications" OR funding)';
const FEEDS: Feed[] = [
  { url: "https://opportunitydesk.org/feed/", label: "OpportunityDesk" },
  { url: "https://opportunitydesk.org/category/fellowships/feed/", label: "OpportunityDesk" },
  { url: "https://opportunitydesk.org/category/grants/feed/", label: "OpportunityDesk" },
  { url: "https://www2.fundsforngos.org/feed/", label: "FundsforNGOs" },                // was 403 with a bot UA
  { url: "https://www2.fundsforngos.org/category/environment-climate-change/feed/", label: "FundsforNGOs" },
  { url: "https://www.afterschoolafrica.com/feed/", label: "AfterSchoolAfrica" },
  { url: "https://opportunitiescorners.com/feed/", label: "OpportunitiesCorners" },
  googleNews(Q1), googleNews(Q2),
  bingNews(Q1), bingNews(Q2),
];
const REL = ["climate", "environment", "conservation", "biodiversity", "carbon", "renewable", "solar",
  "green", "drought", "adaptation", "resilience", "pollution", "deforestation", "forest", "land",
  "water", "wash", "energy", "just transition", "nature", "ecosystem", "wildlife", "waste", "sustainab",
  "restoration", "emissions", "reparations", "fellowship", "scholarship", "grant", "fund"];
const relevant = (t: string) => { const s = (t || "").toLowerCase(); return REL.some((k) => s.includes(k)); };

// ReliefWeb v2 (opt-in). Request an appname at https://apidoc.reliefweb.int/parameters#appname,
// then: supabase secrets set RELIEFWEB_APPNAME=<approved name>
async function reliefweb(): Promise<{ items: FeedItem[]; status: string }> {
  if (!RELIEFWEB_APPNAME) return { items: [], status: "off (no RELIEFWEB_APPNAME)" };
  const body = {
    query: { value: "climate OR environment OR conservation OR resilience", operator: "OR" },
    filter: { field: "country.name", value: ["Kenya", "World"] },
    fields: { include: ["title", "url", "source.name", "date.created"] }, limit: 30, sort: ["date.created:desc"],
  };
  try {
    const r = await fetch(`https://api.reliefweb.int/v2/training?appname=${encodeURIComponent(RELIEFWEB_APPNAME)}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) return { items: [], status: String(r.status) };
    const j = await r.json();
    const items = (j.data || []).map((d: any) => ({
      title: d.fields?.title, link: d.fields?.url, desc: "", pubDate: d.fields?.date?.created ?? null,
      source: d.fields?.source?.[0]?.name ?? "ReliefWeb",
    })).filter((x: FeedItem) => x.title && x.link);
    return { items, status: String(r.status) };
  } catch (e) { return { items: [], status: "err:" + String(e).slice(0, 50) }; }
}

async function pageText(url: string): Promise<string> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 MazingiraKenyaScanner/2.0" }, signal: AbortSignal.timeout(12000) });
    if (!r.ok) return "";
    const html = await r.text();
    return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim().slice(0, 4000);
  } catch { return ""; }
}

const system = (today: string) =>
  `Today is ${today}. You curate climate / environmental-justice OPPORTUNITIES (grants, calls, fellowships, scholarships, accreditations, funds) for a Kenya / East Africa / pan-African hub. ` +
  `Given an opportunity's title, URL and page text, reply ONLY with compact JSON: ` +
  `{"keep":bool,"opp_type":"Grant|Fellowship|Scholarship|Accreditation|Fund|Call|Consultancy","deadline":"human e.g. 31 Aug 2026 or Rolling or null","deadline_iso":"YYYY-MM-DD or null","amount":"e.g. Up to USD 20,000 or null","eligibility":"one line: who can apply / geographic focus or null"}. ` +
  `Set keep=true ONLY if ALL hold: (a) genuinely about climate/environment/conservation/climate-justice; (b) open to Kenyan / East African / African applicants (global calls open to Africans count); (c) STILL OPEN: deadline_iso is today (${today}) or later, OR clearly rolling/ongoing. ` +
  `Set keep=false for news articles, press releases, roundups/listicles, winners announcements, reports about a programme, or general promotion. If the deadline has passed or you are unsure it is a real open call, set keep=false.`;

Deno.serve(async (req) => {
  if (CRON_SECRET && req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { "content-type": "application/json" } });
  }
  const today = new Date().toISOString().slice(0, 10);
  const llm = new LlmStats();
  const started = Date.now();
  try {
    const { all, debug } = await fetchAll(FEEDS);
    const rw = await reliefweb(); debug["ReliefWeb v2"] = `${rw.status}/${rw.items.length}`; all.push(...rw.items);

    const rough = all.filter((x) => relevant(x.title));
    const { data: existing } = await sb.from("resources").select("url").in("url", rough.map((x) => x.link));
    const have = new Set((existing || []).map((e: any) => e.url));
    const fresh = rough.filter((x) => !have.has(x.link));
    const cands = fresh.slice(0, MAX_CANDIDATES);

    let inserted = 0, rejected = 0, failed = 0, aborted = false, timed_out = false;
    for (const c of cands) {
      if (Date.now() - started > TIME_BUDGET_MS) { timed_out = true; break; }
      const body = await pageText(c.link);
      const res = await askJson(system(today), `TITLE: ${c.title}\nURL: ${c.link}\n\nPAGE:\n${body}`.slice(0, 5000), 350);
      llm.record(res);
      if (res.err) { failed++; if (res.fatal) { aborted = true; break; } continue; }
      const x = res.data;
      if (!x.keep) { rejected++; continue; }
      const deadline = (x.deadline && String(x.deadline).trim()) || "Rolling";
      const meta = [x.opp_type, c.source, deadline !== "Rolling" ? `closes ${deadline}` : "Rolling"].filter(Boolean).join(" · ");
      const { error } = await sb.from("resources").insert({
        category: "Opportunities", title: String(c.title).slice(0, 300),
        meta, url: c.link, kind: "LINK", by: c.source, published: false,
        opp_type: x.opp_type ?? null, deadline,
        deadline_iso: /^\d{4}-\d{2}-\d{2}$/.test(String(x.deadline_iso)) ? x.deadline_iso : null,
        amount: x.amount ?? null, eligibility: x.eligibility ?? null,
      });
      if (!error) { inserted++; have.add(c.link); }
    }
    return new Response(JSON.stringify({
      candidates: cands.length, already_seen: rough.length - fresh.length, inserted, rejected, failed, aborted, timed_out,
      before_relevance: all.length, today, llm, debug,
    }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e), llm }), { status: 500, headers: { "content-type": "application/json" } });
  }
});
