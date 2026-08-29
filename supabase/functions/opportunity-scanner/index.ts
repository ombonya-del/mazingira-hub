// Supabase Edge Function: opportunity-scanner  (MazingiraKenya)
// Auto-discovers climate / environmental-justice OPPORTUNITIES (grants, calls,
// fellowships, accreditations) for Kenya / East Africa / pan-African climate justice
// and files them into `resources` (category='Opportunities', published=false) for admin
// Accept/Reject.
//
// Currency + relevance are enforced BEFORE insert: each candidate's source page is
// fetched and Claude extracts opp_type / deadline / amount / eligibility and decides
// whether it is on-topic AND still open (deadline today-or-later, or rolling). Only
// then is it inserted, WITH those four fields populated so the admin preview and
// partner-matching have what they need.
//
// Deploy:  supabase functions deploy opportunity-scanner --project-ref uueemckdoozsuowcqkhl
// Secrets: CRON_SECRET, ANTHROPIC_API_KEY

import { createClient } from "jsr:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
const APP = "mazingira-hub";
const MAX_CANDIDATES = 20;   // bound per-run fetch + LLM cost

const RSS_FEEDS = [
  { url: "https://www.opportunitiesforafricans.com/feed/", org: "OpportunitiesForAfricans" },
  { url: "https://opportunitydesk.org/feed/", org: "OpportunityDesk" },
  { url: "https://www2.fundsforngos.org/feed/", org: "FundsforNGOs" },
  { url: "https://news.google.com/rss/search?q=Africa+(climate+OR+environment+OR+conservation+OR+%22just+transition%22)+(%22call+for+proposals%22+OR+grant+OR+fellowship+OR+scholarship)&hl=en&gl=KE&ceid=KE:en", org: "Google News" },
];
const QUERY = "climate OR environment OR conservation OR biodiversity OR renewable OR drought OR " +
  "adaptation OR resilience OR deforestation OR carbon OR 'just transition' OR land rights OR water OR " +
  "grant OR fellowship OR scholarship";
const REL = ["climate", "environment", "conservation", "biodiversity", "carbon", "renewable", "solar",
  "green", "drought", "adaptation", "resilience", "pollution", "deforestation", "forest", "land",
  "water", "wash", "energy", "just transition", "nature", "ecosystem", "wildlife", "waste", "sustainab",
  "restoration", "emissions", "reparations", "fellowship", "scholarship", "grant", "fund"];
const relevant = (t: string) => { const s = (t || "").toLowerCase(); return REL.some((k) => s.includes(k)); };

function pick(block: string, tag: string): string | null {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&").replace(/<[^>]+>/g, "").trim() : null;
}
async function fetchRss(feed: { url: string; org: string }) {
  try {
    const r = await fetch(feed.url, { headers: { "User-Agent": "mazingira-opportunity-scanner" }, signal: AbortSignal.timeout(15000) });
    if (!r.ok) return { items: [] as any[], status: r.status };
    const xml = await r.text();
    const blocks = xml.split(/<item[\s>]/i).slice(1);
    const items = blocks.map((b) => {
      const title = pick(b, "title"); const link = (pick(b, "link") || "").split("<")[0].trim();
      const src = pick(b, "source") || feed.org;
      return title && link ? { title, link, org: src } : null;
    }).filter(Boolean);
    return { items, status: r.status };
  } catch (e) { return { items: [] as any[], status: "err:" + String(e).slice(0, 50) }; }
}
async function reliefweb() {
  const body = { query: { value: QUERY, operator: "OR" }, fields: { include: ["title", "source", "date", "url"] }, limit: 40, sort: ["date.created:desc"] };
  try {
    const r = await fetch(`https://api.reliefweb.int/v1/opportunities?appname=${APP}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) return { items: [] as any[], status: r.status };
    const j = await r.json();
    const items = (j.data || []).map((d: any) => {
      const f = d.fields || {};
      return { title: f.title, link: f.url ?? null, org: Array.isArray(f.source) ? (f.source[0]?.name ?? "ReliefWeb") : "ReliefWeb" };
    });
    return { items, status: r.status };
  } catch (e) { return { items: [] as any[], status: "err:" + String(e).slice(0, 50) }; }
}

async function pageText(url: string): Promise<string> {
  if (!url) return "";
  try {
    const r = await fetch(url, { headers: { "User-Agent": "mazingira-opportunity-scanner" }, signal: AbortSignal.timeout(12000) });
    if (!r.ok) return "";
    const html = await r.text();
    return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim().slice(0, 4000);
  } catch { return ""; }
}
async function extract(today: string, title: string, url: string, body: string): Promise<any | null> {
  if (!ANTHROPIC_KEY) return null;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001", max_tokens: 350,
        system: `Today is ${today}. You curate climate / environmental-justice OPPORTUNITIES (grants, calls, fellowships, scholarships, accreditations, funds) for a Kenya / East Africa / pan-African hub. ` +
          `Given an opportunity's title, URL and page text, reply ONLY with compact JSON: ` +
          `{"keep":bool,"opp_type":"Grant|Fellowship|Scholarship|Accreditation|Fund|Call|Consultancy","deadline":"human e.g. 31 Aug 2026 or Rolling or null","deadline_iso":"YYYY-MM-DD or null","amount":"e.g. Up to USD 20,000 or null","eligibility":"one line: who can apply / geographic focus or null"}. ` +
          `Set keep=true ONLY if ALL hold: (a) genuinely about climate/environment/conservation/climate-justice; (b) open to Kenyan / East African / African applicants; (c) STILL OPEN — deadline_iso is today (${today}) or later, OR clearly rolling/ongoing. ` +
          `If the deadline has passed, or it is off-topic, or it is just news coverage rather than an actual opportunity to apply for, set keep=false.`,
        messages: [{ role: "user", content: `TITLE: ${title}\nURL: ${url}\n\nPAGE:\n${body}`.slice(0, 5000) }],
      }),
      signal: AbortSignal.timeout(25000),
    });
    const j = await r.json();
    const txt = (j?.content?.[0]?.text ?? "").trim().replace(/^```json\s*|\s*```$/g, "");
    return JSON.parse(txt);
  } catch { return null; }
}

Deno.serve(async (req) => {
  if (CRON_SECRET && req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { "content-type": "application/json" } });
  }
  const today = new Date().toISOString().slice(0, 10);
  try {
    const debug: Record<string, unknown> = {};
    let all: any[] = [];
    for (const f of RSS_FEEDS) { const res = await fetchRss(f); debug[f.org] = `${res.status}/${res.items.length}`; all = all.concat(res.items); }
    const rw = await reliefweb(); debug["ReliefWeb"] = `${rw.status}/${rw.items.length}`; all = all.concat(rw.items);

    // pre-filter by keyword, drop dupes vs existing, cap the LLM workload
    const rough = all.filter((x) => x.title && x.link && relevant(x.title));
    const { data: existing } = await sb.from("resources").select("url").in("url", rough.map((x) => x.link));
    const have = new Set((existing || []).map((e: any) => e.url));
    const cands = rough.filter((x) => !have.has(x.link)).slice(0, MAX_CANDIDATES);

    let inserted = 0, rejected = 0, skipped = 0;
    for (const c of cands) {
      const body = await pageText(c.link);
      const x = await extract(today, c.title, c.link, body);
      if (!x) { skipped++; continue; }
      if (!x.keep) { rejected++; continue; }                 // stale / off-topic — never inserted
      const deadline = (x.deadline && String(x.deadline).trim()) || "Rolling";
      const meta = [x.opp_type, c.org, deadline !== "Rolling" ? `closes ${deadline}` : "Rolling"].filter(Boolean).join(" · ");
      const { error } = await sb.from("resources").insert({
        category: "Opportunities", title: String(c.title).slice(0, 300),
        meta, url: c.link, kind: "LINK", by: c.org, published: false,
        opp_type: x.opp_type ?? null, deadline, amount: x.amount ?? null, eligibility: x.eligibility ?? null,
      });
      if (!error) { inserted++; have.add(c.link); }
    }
    return new Response(JSON.stringify({ candidates: cands.length, inserted, rejected, skipped, before_relevance: all.length, today, debug }),
      { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { "content-type": "application/json" } });
  }
});
