// Supabase Edge Function: disinfo-scanner  (MazingiraKenya)
// Web-based scan of Kenyan / East African climate-and-environment media for
// DISINFORMATION and misleading narratives (denialism, greenwashing, false claims,
// manipulated framings). Claude flags each candidate, assigns a verdict, and writes
// an evidence-based rebuttal; confirmed items are filed into `disinfo_items` as DRAFTS
// (published=false) for the admin Narrative-disinfo review queue.
//
// Deploy:  supabase functions deploy disinfo-scanner --project-ref uueemckdoozsuowcqkhl
// Secrets: CRON_SECRET, ANTHROPIC_API_KEY

import { createClient } from "jsr:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";

const FEEDS = [
  { url: "https://www.standardmedia.co.ke/rss/headlines.php", source: "The Standard" },
  { url: "https://news.mongabay.com/feed/", source: "Mongabay" },
  { url: "https://www.climatechangenews.com/feed/", source: "Climate Home News" },
  { url: "https://news.google.com/rss/search?q=Kenya+(climate+OR+coal+OR+carbon+OR+oil+OR+environment)+(claim+OR+false+OR+misleading+OR+hoax+OR+denial+OR+greenwash)&hl=en-KE&gl=KE&ceid=KE:en", source: "Google News" },
  { url: "https://news.google.com/rss/search?q=Africa+(climate+OR+fossil+fuel+OR+carbon+credit)+(disinformation+OR+misleading+OR+greenwashing+OR+false)&hl=en&gl=KE&ceid=KE:en", source: "Google News" },
];

const KW = /(climate|carbon|coal|oil|gas|fossil|refinery|geotherm|drought|flood|conservanc|land|Lamu|Turkana|environment|Dangote|greenwash|emission|deforest|carbon credit)/i;

function pick(block: string, tag: string): string | null {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&").replace(/<[^>]+>/g, "").trim() : null;
}

async function fetchRss(feed: { url: string; source: string }) {
  try {
    const r = await fetch(feed.url, { headers: { "User-Agent": "mazingira-disinfo-scanner" }, signal: AbortSignal.timeout(15000) });
    if (!r.ok) return { items: [] as any[], status: r.status };
    const xml = await r.text();
    const blocks = xml.split(/<item[\s>]/i).slice(1);
    const items = blocks.map((b) => {
      const title = pick(b, "title");
      const link = (pick(b, "link") || "").split("<")[0].trim();
      const desc = pick(b, "description") || "";
      const pub = pick(b, "pubDate");
      return title && link ? { title, link, desc, source: feed.source, pubDate: pub } : null;
    }).filter(Boolean);
    return { items, status: r.status };
  } catch (e) { return { items: [] as any[], status: "err:" + String(e).slice(0, 50) }; }
}

async function analyse(title: string, desc: string): Promise<any | null> {
  if (!ANTHROPIC_KEY) return null;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001", max_tokens: 320,
        system: "You screen Kenyan/African climate & environment news for DISINFORMATION or materially misleading narratives " +
          "(climate denial, greenwashing, false or unsupported claims, manipulated framing that downplays environmental harm). " +
          "Reply ONLY with compact JSON: {\"is_disinfo\":bool,\"verdict\":\"False\"|\"Misleading\"|\"Unsupported\"|\"Lacks context\",\"rebuttal\":str}. " +
          "Set is_disinfo true ONLY when the item itself carries or amplifies a misleading/false environmental claim — NOT for accurate reporting, fact-checks, or advocacy. " +
          "rebuttal: 1-2 sentences of evidence-based correction/context.",
        messages: [{ role: "user", content: `${title}\n\n${desc}`.slice(0, 1500) }],
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
    for (const f of FEEDS) { const res = await fetchRss(f); debug[f.source] = `${res.status}/${res.items.length}`; all = all.concat(res.items); }
    const cands = all.filter((x) => x.title && x.link && KW.test(x.title + " " + x.desc)).slice(0, 20);

    const { data: existing } = await sb.from("disinfo_items").select("tweet_url").in("tweet_url", cands.map((x) => x.link));
    const have = new Set((existing || []).map((e: any) => e.tweet_url));

    let inserted = 0, screened = 0;
    for (const c of cands) {
      if (have.has(c.link)) continue;
      screened++;
      const a = await analyse(c.title, c.desc);
      if (!a || !a.is_disinfo || !a.rebuttal || !a.verdict) continue;
      const verdict = String(a.verdict);
      const { error } = await sb.from("disinfo_items").insert({
        name: c.source, handle: null, posted_at: c.pubDate ?? null,
        body: String(c.title).slice(0, 600), eng: null,
        verdict, verdict_class: verdict.toLowerCase().replace(/\s+/g, "-"),
        tweet_url: c.link, rebuttal: String(a.rebuttal).slice(0, 800), published: false,
      });
      if (!error) { inserted++; have.add(c.link); }
    }
    return new Response(JSON.stringify({ candidates: cands.length, screened, inserted, debug }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { "content-type": "application/json" } });
  }
});
