// Supabase Edge Function: jaas-token
// Signs a JaaS (8x8 Jitsi-as-a-Service) JWT so someone can enter a coalition video room.
//   - Signed-in hub ADMINS  -> moderator (can mute, kick, run the Lobby, start transcription)
//   - The member who STARTED a quick call -> moderator of that room (no admin needed)
//   - Signed-in members (partners are hub members) -> participant
// No guest access: you must be signed in to the hub.
// Only rooms that exist (the standing coalition room or a row in public.calls) are allowed.
//
// Deploy:  supabase functions deploy jaas-token --no-verify-jwt
// Secrets: JAAS_APP_ID, JAAS_KID, JAAS_PRIVATE_KEY (PKCS#8 PEM)
//          (SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are injected automatically)
//
// Call:  POST { room, name?, email? }   (Authorization: Bearer <member session> optional)
// Reply: { ok, jwt, appId, roomName: "<appId>/<room>", moderator }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SignJWT, importPKCS8 } from "https://esm.sh/jose@5.9.6";

const APP_ID      = Deno.env.get("JAAS_APP_ID") ?? "";
const KID         = Deno.env.get("JAAS_KID") ?? "";
const PRIVATE_KEY = (Deno.env.get("JAAS_PRIVATE_KEY") ?? "").replace(/\\n/g, "\n");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const ANON_KEY     = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const SERVICE_KEY  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
export const COALITION_ROOM = "mazingirakenya-coalition-a7f3c9e2b18d4f6a";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

let keyPromise: Promise<CryptoKey> | null = null;
const signingKey = () => (keyPromise ??= importPKCS8(PRIVATE_KEY, "RS256"));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST")    return json({ ok: false, message: "POST only" }, 405);
  try {
    if (!APP_ID || !KID || !PRIVATE_KEY) return json({ ok: false, message: "JaaS secrets are not set" }, 500);
    const body = await req.json().catch(() => ({} as any));
    const room = String(body.room ?? "").trim().toLowerCase();
    if (!/^[a-z0-9-]{6,80}$/.test(room)) return json({ ok: false, message: "invalid room" }, 400);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

    // Room must be the standing coalition room or a scheduled/quick call.
    let call: any = null;
    if (room !== COALITION_ROOM) {
      const { data } = await admin.from("calls").select("id,created_by,kind,take_minutes").ilike("room", room)
        .order("created_at", { ascending: false }).limit(1);
      if (!data || !data.length) return json({ ok: false, message: "This call link isn't valid. Ask the organiser for a new one." }, 404);
      call = data[0];
    }
    const quick = call?.kind === "quick";
    const minutes = call ? call.take_minutes !== false : true;

    // Who is asking? A signed-in member, or a guest.
    let name = String(body.name ?? "").trim().slice(0, 80);
    let email = String(body.email ?? "").trim().toLowerCase().slice(0, 160);
    let userId = "";
    let moderator = false;
    const auth = req.headers.get("Authorization") ?? "";
    const token = auth.replace(/^Bearer\s+/i, "");
    if (token && token !== ANON_KEY) {
      const { data: u } = await admin.auth.getUser(token);
      if (u?.user) {
        userId = u.user.id;
        email = (u.user.email ?? email).toLowerCase();
        const meta: any = u.user.user_metadata ?? {};
        if (!name) name = String(meta.person || meta.full_name || meta.name || email.split("@")[0]);
        const caller = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: auth } } });
        const { data: isAdmin } = await caller.rpc("is_admin");
        moderator = !!isAdmin || (quick && call?.created_by === userId);
      }
    }
    if (!userId) return json({ ok: false, message: "Please sign in to the hub to join the call" }, 401);

    const now = Math.floor(Date.now() / 1000);
    const jwt = await new SignJWT({
      aud: "jitsi", iss: "chat", sub: APP_ID, room,
      context: {
        user: { id: userId, name, email, avatar: "", moderator: moderator ? "true" : "false" },
        features: { livestreaming: "false", recording: "false", transcription: moderator && minutes ? "true" : "false", "outbound-call": "false", "sip-outbound-call": "false" },
        room: { regex: false },
      },
    })
      .setProtectedHeader({ alg: "RS256", kid: KID, typ: "JWT" })
      .setIssuedAt(now).setNotBefore(now - 10).setExpirationTime(now + 4 * 3600)
      .sign(await signingKey());

    // Fallback attendance log (the webhook is the main source).
    await admin.from("call_attendees").insert({ room, email, name, moderator, source: "token" });

    return json({ ok: true, jwt, appId: APP_ID, roomName: `${APP_ID}/${room}`, moderator, lobby: !quick, minutes, quick });
  } catch (e) {
    return json({ ok: false, message: "token error: " + String(e).slice(0, 200) }, 500);
  }
});
