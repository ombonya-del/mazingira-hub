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

const SYSTEM = (today: string) =>
  `Today is ${today}. You extract a single upcoming climate/environment EVENT relevant to Kenya, East Africa or African climate justice from a news or feed snippet. ` +
  `Reply ONLY with compact JSON: {"is_event":bool,"title":str|null,"start_date":"YYYY-MM-DD"|null,"location":str|null,"mode":"In person"|"Virtual"|"Hybrid"|null,"org":str|null,"description":str|null}. ` +
  `is_event=true when the snippet names a specific conference/summit/forum/workshop/COP that has NOT yet happened (start date ${today} or later, or announced as upcoming without an exact date). ` +
  `Coverage published before an upcoming event counts. is_event=false if the event is already over or the item is only general news. ` +
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

    let inserted = 0, not_event = 0, failed = 0, aborted = false, timed_out = false;
    for (const c of cands) {
      if (Date.now() - started > TIME_BUDGET_MS) { timed_out = true; break; }
      const res = await askJson(SYSTEM(today), `HEADLINE: ${c.title}\nSOURCE: ${c.source}\nPUBLISHED: ${c.pubDate ?? "unknown"}\n\n${c.desc}`.slice(0, 1500), 260);
      llm.record(res);
      if (res.err) { failed++; if (res.fatal) { aborted = true; break; } continue; }
      const ev = res.data;
      if (!ev.is_event) { not_event++; continue; }
      const start = ev.start_date && /^\d{4}-\d{2}-\d{2}$/.test(ev.start_date) ? ev.start_date : null;
      if (start && start < today) { not_event++; continue; }   // belt-and-braces: never file past events
      const { error } = await sb.from("calendar_events").insert({
        title: String(ev.title || c.title).slice(0, 300), start_date: start,
        time: null, location: ev.location ?? null, mode: ev.mode ?? null,
        description: ev.description ?? null, org: ev.org ?? null, link: c.link,
        source: "watch", published: false,
      });
      if (!error) { inserted++; have.add(c.link); }
    }
    return new Response(JSON.stringify({
      candidates: cands.length, already_seen: rough.length - fresh.length, inserted, not_event, failed, aborted, timed_out,
      before_filter: all.length, today, llm, debug,
    }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e), llm }), { status: 500, headers: { "content-type": "application/json" } });
  }
});
