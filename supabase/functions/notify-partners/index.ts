// Supabase Edge Function: notify-partners
// Emails matched partners about an opportunity, via Resend — ONE personalised email per
// partner (to their primary + alternate addresses), each carrying a "Register interest"
// button that links to the public register-interest function. Admin-only.
//
// Deploy:
//   supabase functions deploy notify-partners
//   supabase secrets set RESEND_API_KEY=re_xxx
//
// Called from the admin console:
//   ASB.functions.invoke("notify-partners", { body: { opportunity, partners:[{name,emails:[...]}] } })

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const SUPABASE_URL   = Deno.env.get("SUPABASE_URL") ?? "";
const ANON_KEY       = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const FROM = "MazingiraKenya <admin@mazingirakenya.org>";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  try {
    if (!RESEND_API_KEY) return json({ error: "RESEND_API_KEY not set" }, 500);

    // Admin gate: evaluate is_admin() in the caller's JWT context.
    const authHeader = req.headers.get("Authorization") ?? "";
    const supa = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
    const { data: isAdmin, error: adminErr } = await supa.rpc("is_admin");
    if (adminErr || !isAdmin) return json({ error: "admin only" }, 403);

    const { opportunity: o, partners } = await req.json();
    const list = (partners ?? []).filter((p: any) => p && Array.isArray(p.emails) && p.emails.filter((e: string) => e && /@/.test(e)).length);
    if (!o || !o.title || !list.length) return json({ error: "opportunity.title + partners[] required" }, 400);

    const rows = [
      o.opp_type ? `<li><b>Type:</b> ${esc(o.opp_type)}</li>` : "",
      o.deadline ? `<li><b>Deadline:</b> ${esc(o.deadline)}</li>` : "",
      o.amount ? `<li><b>Amount:</b> ${esc(o.amount)}</li>` : "",
      o.by ? `<li><b>Funder / host:</b> ${esc(o.by)}</li>` : "",
      o.eligibility ? `<li><b>Eligibility:</b> ${esc(o.eligibility)}</li>` : "",
    ].join("");
    const fnBase = `${SUPABASE_URL}/functions/v1/register-interest`;

    let sent = 0;
    const errors: unknown[] = [];
    for (const p of list) {
      const to = p.emails.filter((e: string) => e && /@/.test(e));
      const link = `${fnBase}?t=${encodeURIComponent(o.title)}&u=${encodeURIComponent(o.url || "")}&n=${encodeURIComponent(p.name || "")}&e=${encodeURIComponent(to[0] || "")}`;
      const html =
        `<p>Hello${p.name ? " " + esc(p.name) : ""},</p>` +
        `<p>Through the <strong>MazingiraKenya</strong> coalition hub we've flagged an opportunity that may fit your work:</p>` +
        `<p style="font-size:1.05rem"><strong>${esc(o.title)}</strong></p>` +
        (rows ? `<ul>${rows}</ul>` : "") +
        (o.url ? `<p><a href="${esc(o.url)}">View the opportunity and apply &rarr;</a></p>` : "") +
        `<p style="margin:18px 0"><a href="${esc(link)}" style="display:inline-block;background:#1B6B4A;color:#ffffff;padding:11px 20px;border-radius:8px;text-decoration:none;font-weight:700">Register your interest &#10003;</a></p>` +
        `<p style="color:#666;font-size:.9em">One click lets the coalition know you're interested and we'll follow up to support your application.</p>` +
        `<p>&mdash; deCOALonize / MazingiraKenya</p>`;
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: FROM, to, subject: `Opportunity: ${o.title}`, html }),
      });
      if (r.ok) sent++; else errors.push(await r.json().catch(() => r.status));
    }
    return json({ sent, partners: list.length, errors: errors.length ? errors : undefined });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
