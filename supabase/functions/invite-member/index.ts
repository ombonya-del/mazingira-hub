// Supabase Edge Function: invite-member
// Admin-only. Invites a new member via auth.admin.inviteUserByEmail (email sent through the
// project's SMTP = Resend). If the person ALREADY exists (e.g. stuck "waiting for
// verification"), it sends them a fresh magic-link sign-in instead of erroring — so admins
// never need to delete-and-reinvite.
//
// Deploy:  supabase functions deploy invite-member
// Env injected automatically: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.
// Uses the existing RESEND_API_KEY secret for the magic-link fallback email.
//
// Called from the admin console:
//   ASB.functions.invoke("invite-member", { body: { email, org?, person?, role? } })

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL   = Deno.env.get("SUPABASE_URL") ?? "";
const ANON_KEY       = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const SERVICE_KEY    = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM    = "MazingiraKenya <admin@mazingirakenya.org>";
const HUB_URL = "https://hub.mazingirakenya.org";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });
const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST")    return json({ ok: false, message: "POST only" }, 405);
  try {
    if (!SERVICE_KEY) return json({ ok: false, message: "SUPABASE_SERVICE_ROLE_KEY not set" }, 500);

    // Admin gate: evaluate is_admin() in the CALLER's JWT context.
    const authHeader = req.headers.get("Authorization") ?? "";
    const caller = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
    const { data: isAdmin, error: adminErr } = await caller.rpc("is_admin");
    if (adminErr || !isAdmin) return json({ ok: false, message: "admin only" }, 403);

    const body = await req.json().catch(() => ({} as any));
    const email = String(body.email ?? "").trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ ok: false, message: "a valid email is required" });

    const meta: Record<string, unknown> = {};
    if (body.org)    meta.org    = String(body.org);
    if (body.person) meta.person = String(body.person);
    if (body.role)   meta.role   = String(body.role);

    // Privileged client (service role) — server-side only, never exposed to the browser.
    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

    // 1) Try a normal invite (sends the "You're invited" email via project SMTP = Resend).
    const { error: invErr } = await admin.auth.admin.inviteUserByEmail(email, { data: meta, redirectTo: HUB_URL });
    if (!invErr) return json({ ok: true, status: "invited", email });

    // 2) Already a member -> send a fresh magic-link sign-in (no delete needed).
    if (/already|registered|exists/i.test(invErr.message || "")) {
      const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
        type: "magiclink", email, options: { redirectTo: HUB_URL },
      });
      const actionLink = (linkData as any)?.properties?.action_link;
      if (linkErr || !actionLink) return json({ ok: false, message: "already a member, but couldn't generate a sign-in link: " + (linkErr?.message || "no link") });
      if (!RESEND_API_KEY)        return json({ ok: false, message: "already a member; set RESEND_API_KEY to send a sign-in link" });

      const html =
        `<p>Hello${meta.person ? " " + esc(meta.person) : ""},</p>` +
        `<p>Here's your one-time sign-in link for the <strong>MazingiraKenya</strong> coalition hub. It signs you straight in, no password needed.</p>` +
        `<p style="margin:18px 0"><a href="${esc(actionLink)}" style="display:inline-block;background:#1B6B4A;color:#fff;padding:11px 20px;border-radius:8px;text-decoration:none;font-weight:700">Sign in to the hub</a></p>` +
        `<p style="color:#666;font-size:.9em">This link works once and expires shortly. If you didn't request it, you can ignore this email.</p>` +
        `<p>&mdash; deCOALonize / MazingiraKenya</p>`;
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: FROM, to: [email], subject: "Your MazingiraKenya hub sign-in link", html }),
      });
      if (!r.ok) return json({ ok: false, message: "already a member; sending the sign-in link failed: " + (await r.text().catch(() => String(r.status))) });
      return json({ ok: true, status: "magic_link_sent", email });
    }

    return json({ ok: false, message: invErr.message || "invite failed" });
  } catch (e) {
    return json({ ok: false, message: String(e) }, 500);
  }
});
