// Supabase Edge Function: resource-scanner  (MazingiraKenya)
// Discovers climate / environmental-justice KNOWLEDGE RESOURCES (reports, policy
// briefs, toolkits, guidelines, research, datasets) relevant to Kenya / East Africa /
// pan-African climate justice and files them into the hub `resources` table as DRAFTS
// (category='Resources', published=false) for admin Accept/Reject.
//
// Deploy:  supabase functions deploy resource-scanner --project-ref uueemckdoozsuowcqkhl
// Secret:  CRON_SECRET

import { createClient } from "jsr:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";

const FEEDS = [
  { url: "https://news.google.com/rss/search?q=Kenya+(climate+OR+environment+OR+conservation)+(report+OR+policy+OR+guideline+OR+strategy+OR+toolkit+OR+framework)&hl=en-KE&gl=KE&ceid=KE:en", org: "Google News" },
  { url: "https://news.google.com/rss/search?q=Africa+(climate+justice+OR+%22just+transition%22+OR+biodiversity)+(report+OR+guideline+OR+framework+OR+toolkit+OR+research)&hl=en&gl=KE&ceid=KE:en", org: "Google News" },
  { url: "https://news.mongabay.com/feed/", org: "Mongabay" },
  { url: "https://reliefweb.int/updates/rss.xml?advanced-search=%28PC131%29", org: "ReliefWeb Kenya" },
];

const REL = ["climate", "environment", "conservation", "biodiversity", "carbon", "renewable",
  "drought", "adaptation", "resilience", "deforestation", "forest", "land", "water", "wash",
  "energy", "just transition", "nature", "ecosystem", "wildlife", "waste", "sustainab",
  "restoration", "emissions", "pollution", "reparations", "pastoralist", "drylands"];
const DOCWORD = ["policy", "guideline", "report", "strategy", "toolkit", "manual", "framework",
  "assessment", "study", "survey", "research", "review", "estimates", "handbook", "guide", "brief", "dataset", "atlas"];
const relevant = (t: string) => {
  const s = (t || "").toLowerCase();
  return REL.some((k) => s.includes(k)) && DOCWORD.some((k) => s.includes(k));
};

function typeOf(t: string): string {
  const s = (t || "").toLowerCase();
  if (/policy|strategy|\bact\b|declaration|charter/.test(s)) return "Policy";
  if (/toolkit|manual|handbook|guide\b|guidance/.test(s)) return "Toolkit";
  if (/guideline/.test(s)) return "Guideline";
  if (/study|research|survey|evidence|journal|estimates|assessment|dataset|atlas/.test(s)) return "Research";
  return "Report";
}

function pick(block: string, tag: string): string | null {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&").replace(/<[^>]+>/g, "").trim() : null;
}

async function fetchRss(feed: { url: string; org: string }) {
  try {
    const r = await fetch(feed.url, { headers: { "User-Agent": "mazingira-resource-scanner" }, signal: AbortSignal.timeout(15000) });
    if (!r.ok) return { items: [] as any[], status: r.status };
    const xml = await r.text();
    const blocks = xml.split(/<item[\s>]/i).slice(1);
    const items = blocks.map((b) => {
      const title = pick(b, "title");
      const link = (pick(b, "link") || "").split("<")[0].trim();
      const src = pick(b, "source") || feed.org;
      return title && link ? { title, link, org: src, type: typeOf(title) } : null;
    }).filter(Boolean);
    return { items, status: r.status };
  } catch (e) { return { items: [] as any[], status: "err:" + String(e).slice(0, 50) }; }
}

Deno.serve(async (req) => {
  if (CRON_SECRET && req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { "content-type": "application/json" } });
  }
  try {
    const debug: Record<string, unknown> = {};
    let all: any[] = [];
    for (const f of FEEDS) { const res = await fetchRss(f); debug[f.org] = `${res.status}/${res.items.length}`; all = all.concat(res.items); }
    const items = all.filter((x) => x.title && x.link && relevant(x.title));

    let inserted = 0;
    if (items.length) {
      const { data: existing } = await sb.from("resources").select("url").in("url", items.map((x) => x.link));
      const have = new Set((existing || []).map((e: any) => e.url));
      for (const it of items) {
        if (have.has(it.link)) continue;
        const { error } = await sb.from("resources").insert({
          category: "Resources", title: String(it.title).slice(0, 300),
          meta: [it.type, it.org].filter(Boolean).join(" · "), url: it.link, kind: "LINK", by: it.org, published: false,
        });
        if (!error) { inserted++; have.add(it.link); }
      }
    }
    return new Response(JSON.stringify({ scanned: items.length, inserted, before_relevance: all.length, debug }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { "content-type": "application/json" } });
  }
});
