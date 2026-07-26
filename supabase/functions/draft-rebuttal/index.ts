// Supabase Edge Function: draft-rebuttal
// Given a narrative_items.id, retrieve the coalition's OWN evidence, ask Claude to draft a
// GROUNDED inline rebuttal (cite-only, never free memory), and store it for human review.
//
// Place at:  supabase/functions/draft-rebuttal/index.ts
// Deploy:    supabase functions deploy draft-rebuttal
// Secrets:   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//            (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically)

import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,   // server-side ONLY — never ships to the browser
);
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const MODEL = "claude-sonnet-5";
const PROMPT_VERSION = "rebuttal-v1";

Deno.serve(async (req) => {
  const { narrative_id } = await req.json().catch(() => ({}));
  if (!narrative_id) return json({ error: "narrative_id required" }, 400);

  // 1) the flagged narrative
  const { data: narr } = await supabase.from("narrative_items").select("*").eq("id", narrative_id).single();
  if (!narr) return json({ error: "narrative not found" }, 404);

  // 2) RETRIEVE the coalition's own verified evidence — this is the anti-hallucination guardrail.
  //    Claude may use ONLY what we hand it here.
  const [{ data: issue }, { data: classic }, { data: news }] = await Promise.all([
    supabase.from("issues").select("title,summary,streams,action").eq("slug", narr.issue_slug ?? "").maybeSingle(),
    supabase.from("classic_disinfo").select("claim,truth,source_url").limit(6),
    supabase.from("sentiment_items").select("title,url,source").order("published_at", { ascending: false }).limit(8),
  ]);
  const evidence = { issue, classic_debunks: classic, recent_coverage: news };

  // 3) ask Claude to draft ONLY from the retrieved evidence, and cite it
  const system = [
    "You write rapid rebuttals to climate/environmental-justice disinformation for a Kenyan coalition (MazingiraKenya).",
    "STRICT RULE: use ONLY facts present in the provided EVIDENCE. Never add facts from your own memory.",
    "If the evidence is insufficient to rebut safely, reply exactly: {\"insufficient\":true}.",
    "Voice: plain Kenyan English, calm, specific, 2–4 sentences. Name who is actually affected. Never insult.",
    "Return JSON only: {\"rebuttal\":string,\"sources\":string[],\"confidence\":0-1,\"risk_tier\":\"standard\"|\"sensitive\"}.",
    "Set risk_tier=\"sensitive\" if the claim or your rebuttal names an individual, a death, or a legal allegation.",
  ].join(" ");
  const user = `CLAIM (from ${narr.platform}): ${narr.claim}\n\nEVIDENCE:\n${JSON.stringify(evidence)}`;

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: MODEL, max_tokens: 700, system, messages: [{ role: "user", content: user }] }),
  });
  const ai = await resp.json();
  let out: any = {};
  try { out = JSON.parse(ai?.content?.[0]?.text ?? "{}"); } catch { /* leave empty */ }
  if (out.insufficient) {
    await supabase.from("narrative_items").update({ status: "needs_human" }).eq("id", narrative_id);
    return json({ status: "insufficient", note: "not enough grounded evidence — routed to a human" });
  }

  // 4) store as a rebuttal in 'pending' — a human always verifies before it publishes
  const { data: row, error } = await supabase.from("rebuttals").insert({
    narrative_id, draft_body: out.rebuttal, model: MODEL, prompt_version: PROMPT_VERSION,
    sources: out.sources ?? [], confidence: out.confidence ?? null,
    risk_tier: out.risk_tier ?? "standard", status: "pending",
  }).select().single();
  if (error) return json({ error: error.message }, 500);

  await supabase.from("narrative_items").update({ status: "drafted" }).eq("id", narrative_id);
  return json({ status: "drafted", rebuttal: row });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}
