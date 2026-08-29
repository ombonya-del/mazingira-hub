// Supabase Edge Function: opportunity-cleanup  (MazingiraKenya) — ONE-OFF MAINTENANCE
// Reviews the pending Opportunity drafts already sitting in admin review, deletes the
// stale / off-topic ones, and enriches the survivors with opp_type / deadline / amount /
// eligibility. Processes drafts whose `deadline` is NULL in batches; returns `remaining`
// so a loop can call it until remaining = 0.
//
// Deploy:  supabase functions deploy opportunity-cleanup --project-ref uueemckdoozsuowcqkhl
// Secrets: CRON_SECRET, ANTHROPIC_API_KEY

import { createClient } from "jsr:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
const MODEL = Deno.env.get("CLEANUP_MODEL") ?? "claude-haiku-4-5-20251001";
const BATCH = 12;

async function pageText(url: string): Promise<string> {
  if (!url) return "";
  try {
    const r = await fetch(url, { headers: { "User-Agent": "mazingira-opportunity-cleanup" }, signal: AbortSignal.timeout(12000) });
    if (!r.ok) return "";
    const html = await r.text();
    return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim().slice(0, 4000);
  } catch { return ""; }
}

// Returns the parsed object on success, or {__err: "..."} describing the failure.
async function extract(today: string, title: string, url: string, body: string): Promise<any> {
  if (!ANTHROPIC_KEY) return { __err: "no ANTHROPIC_API_KEY" };
  let raw = "";
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: MODEL, max_tokens: 350,
        system: `Today is ${today}. You curate climate / environmental-justice OPPORTUNITIES (grants, calls, fellowships, scholarships, accreditations, funds) for a Kenya / East Africa / pan-African hub. ` +
          `Given an opportunity's title, URL and page text, reply ONLY with compact JSON: ` +
          `{"keep":bool,"opp_type":"Grant|Fellowship|Scholarship|Accreditation|Fund|Call|Consultancy","deadline":"human e.g. 31 Aug 2026 or Rolling or null","deadline_iso":"YYYY-MM-DD or null","amount":"e.g. Up to USD 20,000 or null","eligibility":"one line: who can apply / geographic focus or null"}. ` +
          `Set keep=true ONLY if ALL hold: (a) genuinely about climate/environment/conservation/climate-justice; (b) open to Kenyan / East African / African applicants; (c) STILL OPEN — deadline_iso is today (${today}) or later, OR clearly rolling/ongoing. ` +
          `If the deadline has passed, or it is off-topic, or it is just news coverage rather than an actual opportunity, set keep=false.`,
        messages: [{ role: "user", content: `TITLE: ${title}\nURL: ${url}\n\nPAGE:\n${body}`.slice(0, 5000) }],
      }),
      signal: AbortSignal.timeout(25000),
    });
    const j = await r.json();
    if (!r.ok || j?.type === "error") return { __err: `API ${r.status}: ${JSON.stringify(j?.error ?? j).slice(0, 200)}` };
    raw = (j?.content?.[0]?.text ?? "").trim().replace(/^```json\s*|\s*```$/g, "");
    return JSON.parse(raw);
  } catch (e) {
    return { __err: `exc: ${String(e).slice(0, 120)}${raw ? " | raw:" + raw.slice(0, 120) : ""}` };
  }
}

Deno.serve(async (req) => {
  if (CRON_SECRET && req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { "content-type": "application/json" } });
  }
  const today = new Date().toISOString().slice(0, 10);
  try {
    const { data: rows, error } = await sb.from("resources")
      .select("id,title,url,by,meta")
      .eq("category", "Opportunities").eq("published", false).is("deadline", null)
      .order("id", { ascending: true }).limit(BATCH);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "content-type": "application/json" } });

    let deleted = 0, enriched = 0, skipped = 0, sample_error = "";
    for (const row of rows ?? []) {
      const body = await pageText(row.url ?? "");
      const x = await extract(today, row.title ?? "", row.url ?? "", body);
      if (!x || x.__err) { skipped++; if (!sample_error && x?.__err) sample_error = x.__err; continue; }
      if (!x.keep) {
        const { error: de } = await sb.from("resources").delete().eq("id", row.id);
        if (!de) deleted++; else { skipped++; if (!sample_error) sample_error = "del:" + de.message; }
        continue;
      }
      const deadline = (x.deadline && String(x.deadline).trim()) || "Rolling";
      const meta = [x.opp_type, row.by, deadline !== "Rolling" ? `closes ${deadline}` : "Rolling"].filter(Boolean).join(" · ");
      const { error: ue } = await sb.from("resources").update({
        opp_type: x.opp_type ?? null, deadline, amount: x.amount ?? null, eligibility: x.eligibility ?? null, meta,
      }).eq("id", row.id);
      if (!ue) enriched++; else { skipped++; if (!sample_error) sample_error = "upd:" + ue.message; }
    }

    const { count: remaining } = await sb.from("resources")
      .select("id", { count: "exact", head: true })
      .eq("category", "Opportunities").eq("published", false).is("deadline", null);

    return new Response(JSON.stringify({ reviewed: (rows ?? []).length, deleted, enriched, skipped, remaining: remaining ?? 0, sample_error, today }),
      { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { "content-type": "application/json" } });
  }
});
