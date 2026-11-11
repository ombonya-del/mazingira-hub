// Supabase Edge Function: scan-sentiment  (Pipeline C — the "radar")  v2 (2026-11-11)
// Fetches curated RSS feeds SERVER-SIDE, keeps environmental headlines, stance-scores the NEW
// ones with Claude and stores them in sentiment_items (the hub's Media pulse + raia's radar).
//
// v2 changes (the radar had gone stale):
//  - v1 fetched 10 feeds one after another and made one Claude call for EVERY headline, including
//    ones already stored, so a run could hit Supabase's ~150s limit and be cut off before the later
//    feeds were reached. v2 fetches all feeds in parallel, drops already-stored URLs BEFORE calling
//    Claude, and scores new headlines in batches of 25 (one call per batch).
//  - Dates are normalised: unparseable or future-dated pubDates become "now", so a bad feed date
//    can no longer pin an item to the top of the radar.
//  - Reports real numbers: new_items / already_seen / per-feed status / Claude errors, so the
//    GitHub run shows when it is broken instead of a meaningless "added" count.
//
// Deploy:  supabase functions deploy scan-sentiment --project-ref uueemckdoozsuowcqkhl
// Secrets: ANTHROPIC_API_KEY, optional CRON_SECRET, optional SCANNER_MODEL

import { createClient } from "jsr:@supabase/supabase-js@2";
import { askJson, LlmStats } from "../_shared/llm.ts";
import { fetchAll, TIME_BUDGET_MS, type Feed } from "../_shared/rss.ts";

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";
const PER_FEED = 20, BATCH = 25;

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
const ENV = /(climate|carbon|emission|coal|fossil|refinery|petroleum|geotherm|solar|renewable|hydropower|nuclear|NuPEA|atomic|uranium|drought|flood|\brain|weather|Kenya Met|El Ni|famine|locust|forest|deforest|reforest|afforest|\btree|seedling|logging|mangrove|wetland|conservan|wildlife|elephant|rhino|poach|biodivers|ecosystem|mining|\bgold\b|quarry|sand harvest|charcoal|pollution|\bwaste\b|plastic|sewage|\bwater|river|\blake|\bdam\b|land rights|eviction|displac|Lamu|Turkana|Siaya|Dangote|environment|\boil\b|\bgas\b|green energy)/i;

function normDate(s: string | null): string {
  const t = s ? Date.parse(s) : NaN;
  const now = Date.now();
  if (isNaN(t) || t > now + 3600_000) return new Date(now).toISOString();
  return new Date(t).toISOString();
}

const SYSTEM = "You classify Kenyan climate/environmental-justice headlines by their stance toward the justice framing " +
  "(communities, accountability, climate justice). supportive = advances or sympathises with it; critical = dismisses or works " +
  "against it (e.g. uncritical promotion of fossil projects, attacks on activists); neutral = straight reporting. " +
  'Reply ONLY with JSON: {"s":["supportive"|"neutral"|"critical", ...]} with exactly one entry per numbered headline, in order.';

Deno.serve(async (req) => {
  if (CRON_SECRET && req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { "content-type": "application/json" } });
  }
  const started = Date.now();
  const llm = new LlmStats();
  try {
    const feeds: (Feed & { type: string; source: string })[] = FEEDS.map((f) => ({ ...f, label: f.source }));
    // fetch each feed separately (parallel) so we know which source each item came from
    const per = await Promise.all(feeds.map(async (f) => ({ f, r: await fetchAll([f]) })));
    const debug: Record<string, string> = {};
    const seen = new Set<string>();
    const cand: { source: string; type: string; title: string; url: string; published_at: string }[] = [];
    for (const { f, r } of per) {
      Object.assign(debug, r.debug);
      for (const it of r.all.filter((i) => ENV.test(i.title)).slice(0, PER_FEED)) {
        if (seen.has(it.link)) continue; seen.add(it.link);
        cand.push({ source: f.source, type: f.type, title: it.title, url: it.link, published_at: normDate(it.pubDate) });
      }
    }
    // drop what is already stored BEFORE spending Claude calls
    const have = new Set<string>();
    for (let i = 0; i < cand.length; i += 100) {
      const { data } = await supabase.from("sentiment_items").select("url").in("url", cand.slice(i, i + 100).map((c) => c.url));
      (data || []).forEach((d: any) => have.add(d.url));
    }
    const fresh = cand.filter((c) => !have.has(c.url));

    let inserted = 0, timed_out = false;
    for (let i = 0; i < fresh.length; i += BATCH) {
      if (Date.now() - started > TIME_BUDGET_MS) { timed_out = true; break; }
      const batch = fresh.slice(i, i + BATCH);
      const res = await askJson(SYSTEM, batch.map((b, n) => `${n + 1}. ${b.title}`).join("\n"), 400, 30000);
      llm.record(res);
      const st: string[] = Array.isArray(res.data?.s) ? res.data.s : [];
      const rows = batch.map((b, n) => ({
        source: b.source, source_type: b.type, title: b.title, url: b.url, published_at: b.published_at,
        stance: ["supportive", "neutral", "critical"].includes(String(st[n]).toLowerCase()) ? String(st[n]).toLowerCase() : "neutral",
      }));
      // store even if scoring failed (stance falls back to neutral) — the radar must not go stale
      const { error, count } = await supabase.from("sentiment_items")
        .upsert(rows, { onConflict: "url", ignoreDuplicates: true, count: "exact" });
      if (!error) inserted += count ?? rows.length;
      if (res.fatal) { // key/credit/model problem: store the rest unscored and stop calling Claude
        const rest = fresh.slice(i + BATCH).map((b) => ({ source: b.source, source_type: b.type, title: b.title, url: b.url, published_at: b.published_at, stance: "neutral" }));
        if (rest.length) { const r2 = await supabase.from("sentiment_items").upsert(rest, { onConflict: "url", ignoreDuplicates: true, count: "exact" }); if (!r2.error) inserted += r2.count ?? rest.length; }
        break;
      }
    }
    return new Response(JSON.stringify({ new_items: inserted, already_seen: cand.length - fresh.length, candidates: cand.length, timed_out, llm, debug }),
      { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e), llm }), { status: 500, headers: { "content-type": "application/json" } });
  }
});
