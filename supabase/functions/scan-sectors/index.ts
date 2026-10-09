// Supabase Edge Function: scan-sectors
// Auto-populates the four Live-Streams sector tables from sector-scoped Google News feeds.
// Pure RSS + keyword relevance (no LLM) → fast, cheap, no API key needed.
// Writes with the service role (bypasses RLS); de-dupes on `link` (upsert).
//
// Place at:  supabase/functions/scan-sectors/index.ts
// Deploy:    supabase functions deploy scan-sectors   (or paste in the dashboard editor)
// Secrets:   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are injected automatically.

import { createClient } from "jsr:@supabase/supabase-js@2";
const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const SECTORS = [
  {
    table: "extractive_signals",
    rx: /(mining|miner|prospect|quarr|licen[cs]e|fluorspar|gold (?:min|deposit|field|rush|site|block|prospect)|titanium|sand harvest|chromite|explorat|mineral|drilling|seismic|tailings|\bcoal\b|refinery|extractive)/i,
    feeds: [
      "https://news.google.com/rss/search?q=Kenya+(mining+OR+prospecting+OR+quarry+OR+%22mining+licence%22+OR+fluorspar+OR+gold+OR+titanium+OR+%22sand+harvesting%22+OR+chromite+OR+exploration+OR+mineral)&hl=en&gl=KE&ceid=KE:en",
    ],
  },
  {
    table: "litigation_updates",
    rx: /(court|tribunal|judgment|judgement|ruling|petition|affidavit|appeal|litigation|lawsuit|\bELC\b|injunction|conservatory|\bsued\b|\bsuit\b|verdict|hearing)/i,
    feeds: [
      "https://news.google.com/rss/search?q=Kenya+(court+OR+%22Environment+and+Land+Court%22+OR+ELC+OR+tribunal+OR+judgment+OR+ruling+OR+petition)+(environment+OR+mining+OR+land+OR+pollution+OR+coal+OR+conservation)&hl=en&gl=KE&ceid=KE:en",
    ],
  },
  {
    table: "policy_updates",
    rx: /(\bbill\b|public participation|gazette|regulation|\bpolicy\b|parliament|senate|amendment|NEMA|\bEIA\b|benefit.sharing|county assembly|moratorium|licensing|framework)/i,
    feeds: [
      "https://news.google.com/rss/search?q=Kenya+(bill+OR+%22public+participation%22+OR+gazette+OR+NEMA+OR+regulation+OR+parliament+OR+senate)+(environment+OR+climate+OR+mining+OR+energy+OR+carbon+OR+land)&hl=en&gl=KE&ceid=KE:en",
    ],
  },
  {
    table: "funding_opportunities",
    rx: /(grant|fellowship|call for proposal|funding|scholarship|accreditation|sub.grant|\bfund\b|bursary|stipend|\baward\b|financing)/i,
    feeds: [
      "https://news.google.com/rss/search?q=(Kenya+OR+Africa)+(grant+OR+fellowship+OR+%22call+for+proposals%22+OR+funding+OR+scholarship+OR+accreditation)+(climate+OR+environment+OR+%22climate+justice%22+OR+conservation+OR+%22land+rights%22)&hl=en&gl=KE&ceid=KE:en",
    ],
  },
];

Deno.serve(async () => {
  const added: Record<string, number> = {};
  for (const s of SECTORS) {
    added[s.table] = 0;
    for (const url of s.feeds) {
      try {
        const xml = await (await fetch(url)).text();
        for (const it of parseRss(xml).filter((i) => s.rx.test(i.title)).slice(0, 12)) {
          const { title, source } = splitTitle(it.title);
          const row: Record<string, unknown> = { headline: title, source, link: it.link, published: true };
          if (it.pubDate) { const d = new Date(it.pubDate); if (!isNaN(+d)) row.happened_at = d.toISOString(); }
          const { error } = await supabase.from(s.table).upsert(row, { onConflict: "link", ignoreDuplicates: true });
          if (!error) added[s.table]++;
        }
      } catch (_) { /* skip a bad feed, keep going */ }
    }
  }
  return new Response(JSON.stringify({ added }), { headers: { "content-type": "application/json" } });
});

function splitTitle(t: string) {
  const m = t.match(/^(.*?)\s+-\s+([^-]+)$/);
  return m ? { title: m[1].trim(), source: m[2].trim() } : { title: t.trim(), source: null };
}

function parseRss(xml: string) {
  const out: { title: string; link: string; pubDate: string | null }[] = [];
  for (const m of xml.matchAll(/<item[\s\S]*?<\/item>/g)) {
    const b = m[0];
    const grab = (re: RegExp) => (b.match(re)?.[1] ?? "").replace(/<!\[CDATA\[|\]\]>/g, "").trim();
    out.push({
      title: grab(/<title>([\s\S]*?)<\/title>/),
      link: grab(/<link>([\s\S]*?)<\/link>/),
      pubDate: grab(/<pubDate>([\s\S]*?)<\/pubDate>/) || null,
    });
  }
  return out;
}
