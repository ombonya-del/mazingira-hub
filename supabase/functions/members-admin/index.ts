// Supabase Edge Function: members-admin
// Admin-only view of the REAL hub membership (Supabase Auth), for the admin page's
// "Members & access" screen. Replaces the old placeholder list.
//
//   POST { action:"list" }                              -> { ok, members:[...] }
//   POST { action:"update", id, person?, org?, role? }  -> saves name / organisation / role label
//   POST { action:"suspend", id, suspended:boolean }    -> blocks / restores sign-in (reversible)
// (Re-sending a sign-in link uses the existing invite-member function.)
//
// Deploy:  supabase functions deploy members-admin
// Env injected automatically: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const ANON_KEY     = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const SERVICE_KEY  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });
const clean = (v: unknown, n = 120) => String(v ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST")    return json({ ok: false, message: "POST only" }, 405);
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const caller = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
    const { data: isAdmin, error: adminErr } = await caller.rpc("is_admin");
    if (adminErr || !isAdmin) return json({ ok: false, message: "admin only" }, 403);
    const { data: me } = await caller.auth.getUser();

    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
    const body = await req.json().catch(() => ({} as any));
    const action = String(body.action ?? "list");

    if (action === "list") {
      const users: any[] = [];
      for (let page = 1; page <= 20; page++) {
        const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
        if (error) return json({ ok: false, message: error.message }, 500);
        users.push(...(data?.users ?? []));
        if (!data?.users || data.users.length < 1000) break;
      }
      const { data: admins } = await admin.from("admins").select("email");
      const adminSet = new Set((admins ?? []).map((a: any) => String(a.email).toLowerCase()));
      const members = users.map((u: any) => {
        const m = u.user_metadata ?? {};
        return {
          id: u.id, email: u.email,
          person: m.person || m.full_name || "", org: m.org || "", role: m.role || "",
          is_admin: adminSet.has(String(u.email ?? "").toLowerCase()),
          created_at: u.created_at, last_sign_in_at: u.last_sign_in_at,
          confirmed: !!(u.email_confirmed_at || u.confirmed_at),
          suspended: !!(u.banned_until && new Date(u.banned_until) > new Date()),
        };
      }).sort((a, b) => (a.org || "~").localeCompare(b.org || "~") || (a.person || a.email).localeCompare(b.person || b.email));
      return json({ ok: true, members });
    }

    const id = clean(body.id, 64);
    if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ ok: false, message: "member id required" }, 400);

    if (action === "update") {
      const { data: cur, error: gErr } = await admin.auth.admin.getUserById(id);
      if (gErr || !cur?.user) return json({ ok: false, message: "member not found" }, 404);
      const meta: Record<string, unknown> = { ...(cur.user.user_metadata ?? {}) };
      if ("person" in body) meta.person = clean(body.person, 80);
      if ("org" in body)    meta.org    = clean(body.org, 120);
      if ("role" in body)   meta.role   = clean(body.role, 40);
      const { error } = await admin.auth.admin.updateUserById(id, { user_metadata: meta });
      if (error) return json({ ok: false, message: error.message }, 500);
      return json({ ok: true });
    }

    if (action === "suspend") {
      if (me?.user?.id === id) return json({ ok: false, message: "You can't suspend your own account" }, 400);
      const { error } = await admin.auth.admin.updateUserById(id, { ban_duration: body.suspended ? "876000h" : "none" } as any);
      if (error) return json({ ok: false, message: error.message }, 500);
      return json({ ok: true });
    }

    return json({ ok: false, message: "unknown action" }, 400);
  } catch (e) {
    return json({ ok: false, message: "error: " + String(e).slice(0, 200) }, 500);
  }
});
