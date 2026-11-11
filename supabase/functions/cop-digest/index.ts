// Supabase Edge Function: cop-digest  (MazingiraKenya)  2026-11-11
// "COP31 Daily": twice a day during COP31 (Antalya, 9-20 Nov 2026) it reads the latest
// COP31 coverage and has Claude write ONE draft into `cop_digests` with two versions:
//   hub  -> analytical English digest for members (highlights, declarations, negotiations,
//           Kenya, Africa Group, Belém comparison, what to watch)
//   raia -> plain-language community version in English, Swahili and Sheng
// Drafts are published=false / raia_published=false. An admin reviews and publishes each
// version separately (admin → Review → COP31 digest). A row an admin has already published
// is never overwritten; the next run creates/updates the other edition instead.
//
// Deploy:  supabase functions deploy cop-digest --project-ref uueemckdoozsuowcqkhl
// SQL:     run supabase/cop-digest.sql once in the SQL Editor
// Secrets: CRON_SECRET, ANTHROPIC_API_KEY, optional COP_DIGEST_MODEL (default claude-sonnet-5-5)

import { createClient } from "jsr:@supabase/supabase-js@2";
import { askTool, LlmStats } from "../_shared/llm.ts";
import { bingNews, fetchAll, googleNews, type Feed, type FeedItem } from "../_shared/rss.ts";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";
const MODEL = Deno.env.get("COP_DIGEST_MODEL") ?? "claude-sonnet-5-5";

const COP_START = "2026-11-09";   // Day 1
const COP_LAST_RUN = "2026-11-21"; // allows a wrap-up digest the day after the close
const MAX_ITEMS = 45;

const FEEDS: Feed[] = [
  googleNews("COP31 Antalya"), googleNews("COP31 Kenya"),
  googleNews("COP31 Africa negotiators OR \"African Group\""),
  googleNews("COP31 declaration OR pledge OR initiative OR \"draft text\""),
  bingNews("COP31 Antalya"), bingNews("COP31 Kenya"), bingNews("COP31 Africa"),
  bingNews("COP31 climate summit"), bingNews("COP31 negotiations OR \"draft text\""), bingNews("COP31 pledge OR declaration OR initiative"),
  bingNews("Antalya climate talks"),
  { url: "https://news.un.org/feed/subscribe/en/news/topic/climate-change/feed/rss.xml", label: "UN News" },
  { url: "https://www.carbonbrief.org/feed/", label: "Carbon Brief" },
  { url: "https://www.climatechangenews.com/feed/", label: "Climate Home News" },
  { url: "https://allafrica.com/tools/headlines/rdf/kenya/headlines.rdf", label: "AllAfrica Kenya" },
];
const ON_TOPIC = /COP\s?-?31|Antalya|Belém|Belem|climate (summit|talks|conference)|UNFCCC/i;

// Fixed baseline so the comparison is anchored, not improvised.
const BELEM_BASELINE = `COP30 (Belém, Nov 2025) baseline:
- Global Mutirão decision: urged faster emission cuts in line with 1.5C; created the Global Implementation Accelerator and the "Belém Mission to 1.5"; set up a Work Programme on Climate Finance (Mar 2026 - Nov 2027).
- Adaptation: committed to at least TRIPLE adaptation finance by 2035 (vulnerable countries had asked for 2030), with no baseline, no burden-sharing formula and no interim milestones; adopted 59 Global Goal on Adaptation indicators.
- Fossil fuels: no phase-out. The proposed formal roadmap to "transition away from fossil fuels" was dropped from the final text; only a voluntary roadmap outside the negotiations survived.
- Just transition: a just transition mechanism/roadmap was agreed in principle; how it is financed was left open.
- Health: Belém Health Action Plan adopted.
- Finance: Baku-to-Belém roadmap toward mobilising USD 1.3 trillion a year by 2035 (on top of the USD 300bn NCQG from COP29); grant vs loan composition unresolved.
COP31 set-up: Türkiye hosts and runs the Action Agenda (President Murat Kurum); Australia's Chris Bowen is President of Negotiations; World Leaders' Summit 11-12 Nov; COP closes 20 Nov. Fossil fuel phase-out is not a formal agenda item. Türkiye is pushing an electrification goal.
Kenya going in: President Ruto is not attending; the delegation is led by the Environment, Climate Change and Forestry Cabinet Secretary. Ruto coordinates the AU's climate committee (CAHOSCC) and set Africa's common position: implementation, grant-based finance not debt, adaptation, renewables, clean cooking (Nairobi hosts the Africa Clean Cooking Summit, Jan 2027), climate-positive growth; Kenya backs the "35 by 35" electrification goal. Ethiopia hosts COP32 in 2027.`;

const SYSTEM = `You are the COP31 desk editor for MazingiraKenya, a Kenyan climate and environmental-justice coalition hub. You write a daily digest of COP31 from the news items provided.

RULES
- Use ONLY the news items provided (plus the fixed baseline for background). Never invent quotes, numbers, names, decisions or Kenyan statements. If coverage does not say something, do not say it.
- Name who said or announced what. Distinguish clearly between: speeches, announcements/initiatives, draft negotiating text, and formally agreed decisions (which only come at the end).
- If there is nothing new on Kenya in the items, say so plainly instead of padding with the baseline.
- Be factual and fair. The coalition cares about climate justice, so DO highlight finance-as-debt vs grants, adaptation, fossil fuel expansion and community impacts, but do not editorialise beyond what the coverage supports.
- Compare with Belém using the baseline: is Antalya moving ahead of, level with, or behind what Belém agreed on each topic, or is it too early to tell ("unclear")?
- vs_belem feeds the hub's commitment tracker, so tag each entry with the matching key: adaptation-finance (tripling adaptation finance), finance-1-3tn (USD 1.3tn roadmap / NCQG / climate finance work programme), gga-indicators (Global Goal on Adaptation, indicators, Adaptation Fund), just-transition (just transition mechanism / its finance), fossil-roadmap (transition away from fossil fuels, electrification goal, new fossil infrastructure), forests-tfff (Tropical Forests Forever Fund, forests), health (Belém Health Action Plan, health resilience), kenya-ndc (Kenya's own pledge, finance for it, Kenya's asks), other. Only include a key when today's items actually say something about it; one entry per key.

RAIA (public, community version)
- Plain everyday language for ordinary Kenyans, no jargon (explain any unavoidable term in a few words). Short sentences.
- Three languages for every field: "en" English, "sw" standard Kiswahili, "sh" Nairobi Sheng (natural mixed Sheng/Swahili/English as young Nairobians speak it, e.g. "Hizo nchi tajiri zinasema...", "doo", "project", "ni fiti" — respectful, not slang-heavy, never mocking).
- Connect to daily life in Kenya (drought, floods, food prices, power bills, jobs, debt) only where the story genuinely connects.

OUTPUT: call the submit_digest tool exactly once with this structure:
{
 "headline": str,                          // hub headline, max 14 words
 "summary": str,                           // 2-3 sentences: the day in brief
 "highlights": [{"title": str, "detail": str, "src": [int]}],   // 3-6, most important first; src = item numbers used
 "declarations": [{"name": str, "who": str, "what": str, "status": "speech"|"announced"|"launched"|"endorsed"|"draft text"|"agreed", "src": [int]}],  // 0-6
 "negotiations": str,                      // where the formal talks stand today (2-4 sentences) or "" if no coverage
 "kenya": {"summary": str, "points": [str], "src": [int]},     // Kenya's statements/moves today; say plainly if none reported
 "africa": str,                            // African Group / AU positions today, or ""
 "vs_belem": [{"key": "adaptation-finance"|"finance-1-3tn"|"gga-indicators"|"just-transition"|"fossil-roadmap"|"forests-tfff"|"health"|"kenya-ndc"|"other", "topic": str, "belem": str, "antalya": str, "direction": "ahead"|"level"|"behind"|"unclear"}],  // 3-8 topics; "antalya" = what happened on it in TODAY's coverage
 "watch_next": [str],                      // 2-4 things to watch in the coming days
 "raia": {
   "headline": {"en": str, "sw": str, "sh": str},
   "summary":  {"en": str, "sw": str, "sh": str},           // 2-3 short sentences
   "points":   [{"en": str, "sw": str, "sh": str}],          // 3-4 key things that happened
   "kenya":    {"en": str, "sw": str, "sh": str},            // what Kenya is saying / asking for
   "belem":    {"en": str, "sw": str, "sh": str},            // one or two sentences: compared with last year's COP
   "why_care": {"en": str, "sw": str, "sh": str}             // why this matters for ordinary Kenyans
 }
}`;

const T3 = { type: "object", properties: { en: { type: "string" }, sw: { type: "string" }, sh: { type: "string" } }, required: ["en", "sw", "sh"] };
const SRC = { type: "array", items: { type: "integer" } };
const SCHEMA = {
  type: "object",
  properties: {
    headline: { type: "string" }, summary: { type: "string" },
    highlights: { type: "array", items: { type: "object", properties: { title: { type: "string" }, detail: { type: "string" }, src: SRC }, required: ["title", "detail"] } },
    declarations: { type: "array", items: { type: "object", properties: { name: { type: "string" }, who: { type: "string" }, what: { type: "string" },
      status: { type: "string", enum: ["speech", "announced", "launched", "endorsed", "draft text", "agreed"] }, src: SRC }, required: ["name", "who", "what", "status"] } },
    negotiations: { type: "string" },
    kenya: { type: "object", properties: { summary: { type: "string" }, points: { type: "array", items: { type: "string" } }, src: SRC }, required: ["summary"] },
    africa: { type: "string" },
    vs_belem: { type: "array", items: { type: "object", properties: {
      key: { type: "string", enum: ["adaptation-finance", "finance-1-3tn", "gga-indicators", "just-transition", "fossil-roadmap", "forests-tfff", "health", "kenya-ndc", "other"] },
      topic: { type: "string" }, belem: { type: "string" }, antalya: { type: "string" },
      direction: { type: "string", enum: ["ahead", "level", "behind", "unclear"] } }, required: ["key", "topic", "belem", "antalya", "direction"] } },
    watch_next: { type: "array", items: { type: "string" } },
    raia: { type: "object", properties: { headline: T3, summary: T3, points: { type: "array", items: T3 }, kenya: T3, belem: T3, why_care: T3 },
      required: ["headline", "summary", "points", "kenya", "belem", "why_care"] },
  },
  required: ["headline", "summary", "highlights", "kenya", "vs_belem", "raia"],
};

function eatNow() { return new Date(Date.now() + 3 * 3600_000); }           // Kenya/Türkiye are both UTC+3
const ymd = (d: Date) => d.toISOString().slice(0, 10);
function within(it: FeedItem, hours: number) {
  if (!it.pubDate) return true;
  const t = Date.parse(it.pubDate);
  return isNaN(t) ? true : Date.now() - t < hours * 3600_000;
}

Deno.serve(async (req) => {
  if (CRON_SECRET && req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { "content-type": "application/json" } });
  }
  const llm = new LlmStats(MODEL);
  const now = eatNow();
  const today = ymd(now);
  const reply = (o: unknown, status = 200) =>
    new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json" } });

  if (today < COP_START || today > COP_LAST_RUN) return reply({ skipped: "outside COP31 window", today, llm });

  const copDay = Math.floor((Date.parse(today) - Date.parse(COP_START)) / 86400_000) + 1;
  const edition = now.getUTCHours() < 13 ? "am" : "pm";   // EAT hour (now is shifted to EAT)

  try {
    // Never overwrite a version an admin already published.
    const { data: existing } = await sb.from("cop_digests").select("id,published,raia_published")
      .eq("digest_date", today).eq("edition", edition).maybeSingle();
    if (existing && (existing.published || existing.raia_published)) {
      return reply({ skipped: "this edition is already published", today, edition, llm });
    }

    const { all, debug } = await fetchAll(FEEDS);
    const items = all
      .filter((x) => ON_TOPIC.test(x.title + " " + x.desc) && within(x, 30))
      .sort((a, b) => (Date.parse(b.pubDate ?? "") || 0) - (Date.parse(a.pubDate ?? "") || 0))
      .slice(0, MAX_ITEMS);
    if (items.length < 4) return reply({ skipped: "too little fresh COP31 coverage", found: items.length, today, edition, llm, debug });

    // Continuity: what the previous digest already covered.
    const { data: prev } = await sb.from("cop_digests").select("digest_date,edition,hub")
      .or(`digest_date.lt.${today},and(digest_date.eq.${today},edition.lt.${edition})`)
      .order("digest_date", { ascending: false }).order("edition", { ascending: false }).limit(1).maybeSingle();
    const prevNote = prev?.hub?.headline
      ? `PREVIOUS DIGEST (${prev.digest_date} ${prev.edition}): ${prev.hub.headline}. ${prev.hub.summary ?? ""}\nFocus on what is NEW since then; mention earlier events only for context.`
      : "This is the first digest of COP31.";

    const list = items.map((it, i) =>
      `[${i + 1}] ${it.source} | ${it.pubDate ?? "date unknown"}\n${it.title}\n${(it.desc || "").replace(/\s+/g, " ").slice(0, 320)}`).join("\n\n");
    const user = `${BELEM_BASELINE}\n\nTODAY: ${today}, COP31 day ${copDay} of 12 (${edition === "am" ? "morning" : "evening"} edition).\n${prevNote}\n\nNEWS ITEMS:\n${list}`;

    const res = await askTool(SYSTEM, user, "submit_digest", SCHEMA, 9000, 125_000, MODEL);
    llm.record(res);
    if (res.err) return reply({ inserted: 0, failed: 1, today, edition, items: items.length, llm, debug });
    const d = res.data ?? {};

    // Map cited item numbers back to links.
    const cited = new Set<number>();
    const walk = (v: any) => { if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === "object") { if (Array.isArray(v.src)) v.src.forEach((n: any) => cited.add(Number(n))); Object.values(v).forEach(walk); } };
    walk(d);
    const sources = [...cited].filter((n) => n >= 1 && n <= items.length).sort((a, b) => a - b)
      .map((n) => ({ n, title: items[n - 1].title, url: items[n - 1].link, source: items[n - 1].source }));

    const raia = d.raia ?? {};
    delete d.raia;
    const row = { digest_date: today, edition, cop_day: copDay, hub: d, raia, sources, updated_at: new Date().toISOString() };
    const { error } = existing
      ? await sb.from("cop_digests").update(row).eq("id", existing.id)
      : await sb.from("cop_digests").insert(row);
    if (error) return reply({ error: "db: " + error.message, llm }, 500);

    return reply({ inserted: existing ? 0 : 1, updated: existing ? 1 : 0, today, edition, cop_day: copDay,
      items: items.length, sources: sources.length, headline: d.headline ?? null, llm, debug });
  } catch (e) {
    return reply({ error: String(e), llm }, 500);
  }
});
