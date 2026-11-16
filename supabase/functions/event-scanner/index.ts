// Supabase Edge Function: event-scanner  (MazingiraKenya)  v2 (2026-11-09)
// Discovers upcoming climate / environmental-justice EVENTS (conferences, summits,
// forums, COP-related) relevant to Kenya / East Africa / pan-African climate justice
// and files them into `calendar_events` as DRAFTS (published=false) for admin Accept/Reject.
//
// v2 changes:
//  - No longer depends on Google News alone (it returned 503 → 0 candidates on Nov 9).
//    Sources: Google News + Bing News (same queries), AllAfrica environment, Mongabay,
//    Climate Home News. Every source is reported in `debug`.
//  - Considers title AND description, and up to 30 candidates (was 15, title-only).
//  - Claude failures are reported (llm.errors / llm.sample_error) instead of hidden.
//
// v3 (2026-11-13): only events with REAL details are filed. Many drafts had no date or venue
// because headlines rarely carry them and v2 accepted "announced as upcoming without an exact
// date". Now each candidate's article page is read (in parallel) so Claude can find the date
// and venue, and a draft is filed only with an exact start date that is today or later AND a
// venue/city or a clearly virtual format. Everything else is counted as missing_details.
//
// Deploy:  supabase functions deploy event-scanner --project-ref uueemckdoozsuowcqkhl
// Secrets: CRON_SECRET, ANTHROPIC_API_KEY, optional SCANNER_MODEL

import { createClient } from "jsr:@supabase/supabase-js@2";
import { askJson, LlmStats } from "../_shared/llm.ts";
import { bingNews, fetchAll, googleNews, TIME_BUDGET_MS, type Feed } from "../_shared/rss.ts";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";
const MAX_CANDIDATES = 30;

const YEAR = new Date().getUTCFullYear();
const Q1 = `Africa (climate OR environment OR biodiversity OR "climate justice") (conference OR summit OR forum OR symposium) ${YEAR}`;
const Q2 = `Kenya (climate OR environment OR conservation OR energy) (conference OR summit OR forum OR workshop OR expo)`;
const Q3 = `Nairobi (climate OR environment OR "just transition") (summit OR conference OR "climate week" OR convening)`;
const FEEDS: Feed[] = [
  googleNews(Q1), googleNews(Q2), googleNews(Q3),
  bingNews(Q1), bingNews(Q2), bingNews(Q3),
  { url: "https://allafrica.com/tools/headlines/rdf/environment/headlines.rdf", label: "AllAfrica Environment" },
  { url: "https://allafrica.com/tools/headlines/rdf/kenya/headlines.rdf", label: "AllAfrica Kenya" },
  { url: "https://news.mongabay.com/feed/", label: "Mongabay" },
  { url: "https://www.climatechangenews.com/feed/", label: "Climate Home News" },
];

const REL = ["climate", "environment", "conservation", "biodiversity", "carbon", "energy",
  "just transition", "nature", "ecosystem", "drought", "adaptation", "resilience", "cop",
  "reparations", "green", "sustainab", "land", "water", "forest", "coal", "oil", "nuclear"];
const EVENTWORD = ["conference", "summit", "forum", "cop3", "cop 3", "symposium", "convening", "workshop",
  "expo", "dialogue", "climate week", "congress", "assembly", "webinar", "hackathon", "festival"];
const candidate = (t: string) => {
  const s = (t || "").toLowerCase();
  return REL.some((k) => s.includes(k)) && EVENTWORD.some((k) => s.includes(k));
};

async function pageText(url: string): Promise<string> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 MazingiraKenyaScanner/3.0" }, signal: AbortSignal.timeout(9000) });
    if (!r.ok) return "";
    const html = await r.text();
    return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim().slice(0, 3500);
  } catch { return ""; }
}

const SYSTEM = (today: string) =>
  `Today is ${today}. You extract a single upcoming climate/environment EVENT relevant to Kenya, East Africa or African climate justice from a news or feed snippet. ` +
  `Reply ONLY with compact JSON: {"is_event":bool,"title":str|null,"start_date":"YYYY-MM-DD"|null,"time":str|null,"location":str|null,"mode":"In person"|"Virtual"|"Hybrid"|null,"org":str|null,"description":str|null}. ` +
  `Use the headline AND the article text. is_event=true ONLY when ALL of these are stated in the text: (1) a specific named conference/summit/forum/workshop/webinar/COP session that has NOT yet happened; ` +
  `(2) its exact start date (day, month and year, on or after ${today}); (3) where it happens: a venue or city (location), or that it is online (mode "Virtual"). ` +
  `If the date or the place is missing, vague ("later this year", "next month") or only guessed, set is_event=false. Never invent or estimate a date or venue. ` +
  `Coverage published before an upcoming event counts. is_event=false if the event is already over or the item is only general news. time: start time if stated, else null. ` +
  `title: the event's own name (not the headline). description: one sentence on what it is and who it is for.`;

Deno.serve(async (req) => {
  if (CRON_SECRET && req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { "content-type": "application/json" } });
  }
  const today = new Date().toISOString().slice(0, 10);
  const llm = new LlmStats();
  const started = Date.now();
  try {
    const { all, debug } = await fetchAll(FEEDS);
    const rough = all.filter((x) => candidate(x.title + " " + x.desc));

    const { data: existing } = await sb.from("calendar_events").select("link").in("link", rough.map((x) => x.link));
    const have = new Set((existing || []).map((e: any) => e.link));
    const fresh = rough.filter((x) => !have.has(x.link));
    const cands = fresh.slice(0, MAX_CANDIDATES);

    // read the candidates' article pages in parallel (dates and venues are rarely in headlines)
    const pages: string[] = [];
    for (let i = 0; i < cands.length; i += 8) {
      if (Date.now() - started > 45_000) break;
      pages.push(...await Promise.all(cands.slice(i, i + 8).map((c) => pageText(c.link))));
    }
    let inserted = 0, not_event = 0, missing_details = 0, failed = 0, aborted = false, timed_out = false;
    for (const [idx, c] of cands.entries()) {
      if (Date.now() - started > TIME_BUDGET_MS) { timed_out = true; break; }
      const res = await askJson(SYSTEM(today), `HEADLINE: ${c.title}\nSOURCE: ${c.source}\nPUBLISHED: ${c.pubDate ?? "unknown"}\n\nSUMMARY: ${c.desc}\n\nARTICLE: ${pages[idx] ?? ""}`.slice(0, 5000), 300);
      llm.record(res);
      if (res.err) { failed++; if (res.fatal) { aborted = true; break; } continue; }
      const ev = res.data;
      if (!ev.is_event) { not_event++; continue; }
      const start = ev.start_date && /^\d{4}-\d{2}-\d{2}$/.test(ev.start_date) ? ev.start_date : null;
      if (start && start < today) { not_event++; continue; }   // belt-and-braces: never file past events
      const place = String(ev.location ?? "").trim();
      const online = ev.mode === "Virtual" || ev.mode === "Hybrid";
      if (!start || (!place && !online)) { missing_details++; continue; }   // date AND venue/online required
      const { error } = await sb.from("calendar_events").insert({
        title: String(ev.title || c.title).slice(0, 300), start_date: start,
        time: ev.time ?? null, location: place || (ev.mode === "Virtual" ? "Online" : null), mode: ev.mode ?? null,
        description: ev.description ?? null, org: ev.org ?? null, link: c.link,
        source: "watch", published: false,
      });
      if (!error) { inserted++; have.add(c.link); }
    }
    return new Response(JSON.stringify({
      candidates: cands.length, already_seen: rough.length - fresh.length, inserted, not_event, missing_details, failed, aborted, timed_out,
      before_filter: all.length, today, llm, debug,
    }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e), llm }), { status: 500, headers: { "content-type": "application/json" } });
  }
});
