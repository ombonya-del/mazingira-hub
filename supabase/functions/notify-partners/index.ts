// Supabase Edge Function: notify-partners
// Emails matched partners about an opportunity, via Resend. BCC so partners
// don't see each other. Admin-only (verifies is_admin() with the caller's JWT).
//
// Deploy:
//   supabase functions deploy notify-partners
//   supabase secrets set RESEND_API_KEY=re_xxx
// (The SUPABASE_URL and SUPABASE_ANON_KEY secrets are injected automatically.)
//
// Called from the admin console:
//   ASB.functions.invoke("notify-partners", { body: { opportunity, recipients } })

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

    const { opportunity: o, recipients } = await req.json();
    const to = (recipients ?? []).filter((e: string) => e && /@/.test(e));
    if (!o || !o.title || !to.length) return json({ error: "opportunity.title + recipients required" }, 400);

    const rows = [
      o.opp_type ? `<li><b>Type:</b> ${esc(o.opp_type)}</li>` : "",
      o.deadline ? `<li><b>Deadline:</b> ${esc(o.deadline)}</li>` : "",
      o.amount ? `<li><b>Amount:</b> ${esc(o.amount)}</li>` : "",
      o.by ? `<li><b>Funder / host:</b> ${esc(o.by)}</li>` : "",
      o.eligibility ? `<li><b>Eligibility:</b> ${esc(o.eligibility)}</li>` : "",
    ].join("");
    const html =
      `<p>Hello,</p>` +
      `<p>Through the <strong>MazingiraKenya</strong> coalition hub we've flagged an opportunity that may fit your work:</p>` +
      `<p style="font-size:1.05rem"><strong>${esc(o.title)}</strong></p>` +
      (rows ? `<ul>${rows}</ul>` : "") +
      (o.url ? `<p><a href="${esc(o.url)}">View the opportunity and apply &rarr;</a></p>` : "") +
      `<p>If it's relevant, reply to this email to register interest and we'll support your application.</p>` +
      `<p>&mdash; deCOALonize / MazingiraKenya</p>`;

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: FROM, bcc: to, subject: `Opportunity: ${o.title}`, html }),
    });
    const data = await r.json();
    if (!r.ok) return json({ error: data }, 502);
    return json({ sent: to.length, id: data.id });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
