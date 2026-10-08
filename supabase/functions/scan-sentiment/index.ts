// Supabase Edge Function: scan-sentiment  (Pipeline C — the "radar")
// Fetches curated RSS feeds SERVER-SIDE (no CORS), de-dupes, stance-scores each headline with
// Claude, and stores them in sentiment_items. Schedule it (see SUPABASE-SETUP.md, cron).
//
// Place at:  supabase/functions/scan-sentiment/index.ts
// Deploy:    supabase functions deploy scan-sentiment
// Secret:    ANTHROPIC_API_KEY (SUPABASE_URL / SERVICE_ROLE injected automatically)

import { createClient } from "jsr:@supabase/supabase-js@2";
const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

// curated source list — extend freely
const FEEDS = [
  { url: "https://news.google.com/rss/search?q=(Kenya+OR+%22East+Africa%22)+(climate+OR+environment+OR+conservation+OR+coal+OR+drought+OR+%22land+rights%22)&hl=en&gl=KE&ceid=KE:en", type: "news", source: "Google News (Kenya climate)" },
  { url: "https://www.standardmedia.co.ke/rss/headlines.php",  type: "news", source: "The Standard" },
  { url: "https://news.mongabay.com/feed/",                    type: "news", source: "Mongabay" },
  { url: "https://www.climatechangenews.com/feed/",            type: "news", source: "Climate Home News" },
  { url: "https://news.google.com/rss/search?q=(Siaya+OR+Kenya)+(nuclear+OR+NuPEA+OR+%22nuclear+power%22+OR+%22nuclear+plant%22)&hl=en&gl=KE&ceid=KE:en", type: "news", source: "Google News (Kenya nuclear)" },
  { url: "https://news.google.com/rss/search?q=(Lamu+OR+Kenya)+(Dangote+OR+refinery+OR+%22oil+refinery%22)&hl=en&gl=KE&ceid=KE:en", type: "news", source: "Google News (Lamu/Dangote refinery)" },
  { url: "https://news.google.com/rss/search?q=site:nation.africa+(climate+OR+environment+OR+coal+OR+refinery+OR+nuclear+OR+drought+OR+conservation+OR+%22land+rights%22+OR+Lamu+OR+Turkana+OR+geothermal+OR+pollution)&hl=en&gl=KE&ceid=KE:en", type: "news", source: "Nation (Kenya)" },
  { url: "https://news.google.com/rss/search?q=site:the-star.co.ke+(climate+OR+environment+OR+coal+OR+refinery+OR+nuclear+OR+drought+OR+conservation+OR+%22land+rights%22+OR+Lamu+OR+Turkana+OR+geothermal+OR+pollution)&hl=en&gl=KE&ceid=KE:en", type: "news", source: "The Star (Kenya)" },
  { url: "https://news.google.com/rss/search?q=site:citizen.digital+(climate+OR+environment+OR+coal+OR+refinery+OR+nuclear+OR+drought+OR+conservation+OR+%22land+rights%22+OR+Lamu+OR+Turkana+OR+geothermal+OR+pollution)&hl=en&gl=KE&ceid=KE:en", type: "news", source: "Citizen Digital" },
  { url: "https://news.google.com/rss/search?q=site:tuko.co.ke+(climate+OR+environment+OR+coal+OR+refinery+OR+nuclear+OR+drought+OR+conservation+OR+%22land+rights%22+OR+Lamu+OR+Turkana+OR+geothermal+OR+pollution)&hl=en&gl=KE&ceid=KE:en", type: "news", source: "Tuko" },
];
const ENV = /(climate|carbon|emission|coal|fossil|refinery|petroleum|geotherm|solar|renewable|hydropower|nuclear|NuPEA|atomic|uranium|drought|flood|\brain|weather|Kenya Met|El Ni|famine|locust|forest|deforest|logging|mangrove|wetland|conservan|wildlife|elephant|rhino|poach|biodivers|ecosystem|mining|\bgold\b|quarry|sand harvest|charcoal|pollution|\bwaste\b|plastic|sewage|\bwater|river|\blake|\bdam\b|land rights|eviction|displac|Lamu|Turkana|Siaya|Dangote|environment|\boil\b|\bgas\b|green energy)/i;

Deno.serve(async () => {
  let added = 0;
  for (const f of FEEDS) {
    try {
      const xml = await (await fetch(f.url)).text();
      const items = parseRss(xml);
      // Keep only genuinely environmental headlines. ENV is broad (forests, mining, weather,
      // water, wildlife, energy, El Nino...) so on-topic Kenyan stories pass, but tangential
      // outlet noise (accidents, disease outbreaks, celebrity/business items) is dropped.
      const picked = items.filter((i) => ENV.test(i.title)).slice(0, 20);
      for (const it of picked) {
        const stance = await scoreStance(it.title);
        const { error } = await supabase.from("sentiment_items").upsert(
          { source: f.source, source_type: f.type, title: it.title, url: it.link, published_at: it.pubDate, stance },
          { onConflict: "url", ignoreDuplicates: true },
        );
        if (!error) added++;
      }
    } catch (_) { /* skip a bad feed, keep going */ }
  }
  return new Response(JSON.stringify({ added }), { headers: { "content-type": "application/json" } });
});

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

async function scoreStance(title: string): Promise<string> {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001", max_tokens: 6,
      system: "Classify this Kenyan climate/environmental-justice headline's stance toward the justice framing. Reply ONE word: supportive, neutral, or critical.",
      messages: [{ role: "user", content: title }],
    }),
  });
  const j = await r.json();
  const w = (j?.content?.[0]?.text ?? "neutral").toLowerCase().trim();
  return ["supportive", "neutral", "critical"].includes(w) ? w : "neutral";
}
