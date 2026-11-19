// Supabase Edge Function: jaas-webhook
// Receives JaaS (8x8) webhooks for the coalition video rooms:
//   ROOM_CREATED / ROOM_DESTROYED   -> open / close a call_sessions row
//   PARTICIPANT_JOINED / _LEFT      -> attendance (kicked participants are excluded from minutes)
//   TRANSCRIPTION_UPLOADED          -> download transcript, Claude writes minutes,
//                                      save to call_sessions, email them via Resend
// Recipients = the people ticked when the call was scheduled  +  everyone who joined
// (minus anyone kicked)  +  for members' QUICK calls, all hub admins (public.admins).
// Never the whole partner directory.
//
// Deploy:  supabase functions deploy jaas-webhook --no-verify-jwt
// Webhook URL to paste in the JaaS console:
//   https://<project>.supabase.co/functions/v1/jaas-webhook?key=<JAAS_WEBHOOK_SECRET>
// Secrets: JAAS_WEBHOOK_SECRET, ANTHROPIC_API_KEY, RESEND_API_KEY, MINUTES_MODEL (optional)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { askTool } from "../_shared/llm.ts";

const SECRET       = Deno.env.get("JAAS_WEBHOOK_SECRET") ?? "";
const RESEND_KEY   = Deno.env.get("RESEND_API_KEY") ?? "";
const MODEL        = Deno.env.get("MINUTES_MODEL") ?? "claude-sonnet-4-5";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_KEY  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const FROM    = "MazingiraKenya <admin@mazingirakenya.org>";
const HUB_URL = "https://hub.mazingirakenya.org/#virtual";
const COALITION_ROOM = "mazingirakenya-coalition-a7f3c9e2b18d4f6a";

const db = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const ok = (b: unknown = { ok: true }) => new Response(JSON.stringify(b), { headers: { "Content-Type": "application/json" } });
const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const roomOf = (fqn: string) => String(fqn ?? "").split("/").pop()!.toLowerCase();
const iso = (ms: number) => new Date(ms || Date.now()).toISOString();

function safeEqual(a: string, b: string) {
  if (!a || a.length !== b.length) return false;
  let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

// The coalition room is reused for every call, so pick the call BOOKED for this time
// (host may open the room up to 90 min early or start up to 45 min late).
// A private room belongs to exactly one scheduled call.
async function findCall(room: string, ts: number) {
  if (room === COALITION_ROOM) {
    const lo = new Date(ts - 45 * 60000).toISOString(), hi = new Date(ts + 90 * 60000).toISOString();
    const { data } = await db.from("calls").select("id,title,start_at,minutes_to").ilike("room", room)
      .gte("start_at", lo).lte("start_at", hi);
    if (!data?.length) return null;
    return data.sort((a: any, b: any) => Math.abs(+new Date(a.start_at) - ts) - Math.abs(+new Date(b.start_at) - ts))[0];
  }
  const { data } = await db.from("calls").select("id,title,start_at,minutes_to").ilike("room", room)
    .order("start_at", { ascending: false }).limit(1);
  return data?.[0] ?? null;
}

async function ensureSession(sessionId: string, room: string, ts: number) {
  const { data } = await db.from("call_sessions").select("session_id").eq("session_id", sessionId).maybeSingle();
  if (data) return;
  const call = await findCall(room, ts);
  await db.from("call_sessions").upsert({
    session_id: sessionId, room, call_id: call?.id ?? null,
    title: call?.title ?? (room === COALITION_ROOM ? "Coalition room call" : "Coalition call"),
    started_at: iso(ts), status: "open",
  }, { onConflict: "session_id", ignoreDuplicates: true });
}

// ---------- minutes ----------
const MINUTES_SCHEMA = {
  type: "object",
  properties: {
    summary:      { type: "string", description: "3-6 sentence plain-language summary of the call" },
    key_points:   { type: "array", items: { type: "string" } },
    decisions:    { type: "array", items: { type: "string" } },
    action_items: { type: "array", items: { type: "object", properties: {
      task: { type: "string" }, owner: { type: "string" }, due: { type: "string" } }, required: ["task"] } },
    next_steps:   { type: "array", items: { type: "string" } },
    next_meeting: { type: "string", description: "Date/time of the next meeting if agreed, else empty" },
  },
  required: ["summary", "key_points", "decisions", "action_items", "next_steps"],
};

function transcriptToText(raw: string): string {
  try {
    const j = JSON.parse(raw);
    const items: any[] = Array.isArray(j) ? j : (j.transcript ?? j.messages ?? j.results ?? j.chunks ?? []);
    if (Array.isArray(items) && items.length) {
      return items.map((m: any) => {
        const who = m.participant?.name ?? m.name ?? m.speaker ?? m.participantName ?? "Speaker";
        const txt = m.final ?? m.text ?? m.transcript ?? m.message ?? (m.stable ?? "");
        return `${who}: ${typeof txt === "string" ? txt : JSON.stringify(txt)}`;
      }).join("\n");
    }
    return JSON.stringify(j);
  } catch { return raw; }
}

function minutesHtml(title: string, when: string, attendees: string[], m: any) {
  const li = (a: string[]) => (a?.length ? "<ul>" + a.map((x) => `<li>${esc(x)}</li>`).join("") + "</ul>" : "<p style='color:#777'>None recorded.</p>");
  const acts = (m.action_items ?? []).length
    ? "<table style='border-collapse:collapse;width:100%'><tr><th align='left' style='border-bottom:1px solid #ccc;padding:4px'>Action</th><th align='left' style='border-bottom:1px solid #ccc;padding:4px'>Owner</th><th align='left' style='border-bottom:1px solid #ccc;padding:4px'>Due</th></tr>" +
      m.action_items.map((a: any) => `<tr><td style='padding:4px;border-bottom:1px solid #eee'>${esc(a.task)}</td><td style='padding:4px;border-bottom:1px solid #eee'>${esc(a.owner || "—")}</td><td style='padding:4px;border-bottom:1px solid #eee'>${esc(a.due || "—")}</td></tr>`).join("") + "</table>"
    : "<p style='color:#777'>None recorded.</p>";
  return `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:680px;color:#1d1d1d">
  <p style="color:#1B6B4A;font-weight:700;margin:0">MazingiraKenya · Coalition call minutes</p>
  <h2 style="margin:6px 0 2px">${esc(title)}</h2>
  <p style="color:#555;margin:0 0 14px">${esc(when)}${attendees.length ? " · Attendees: " + esc(attendees.join(", ")) : ""}</p>
  <h3>Summary</h3><p>${esc(m.summary)}</p>
  <h3>Decisions</h3>${li(m.decisions)}
  <h3>Action items</h3>${acts}
  <h3>Key points</h3>${li(m.key_points)}
  <h3>Next steps</h3>${li(m.next_steps)}
  ${m.next_meeting ? `<p><b>Next meeting:</b> ${esc(m.next_meeting)}</p>` : ""}
  <p style="color:#777;font-size:.85em;margin-top:22px">These minutes were drafted automatically by AI from the call transcript, so names or details may be imperfect. Reply to this email with corrections.
  Members can also find them in the hub: <a href="${HUB_URL}">${HUB_URL}</a></p></div>`;
}

async function recipientsFor(sess: any): Promise<{ to: string[]; attendees: string[] }> {
  // attendees: webhook rows for this session, else token log for the room during the session window
  let { data: rows } = await db.from("call_attendees").select("email,name,kicked,source")
    .eq("session_id", sess.session_id).eq("source", "webhook");
  if (!rows || !rows.length) {
    const start = new Date(new Date(sess.started_at ?? Date.now()).getTime() - 30 * 60000).toISOString();
    const end = sess.ended_at ?? new Date().toISOString();
    ({ data: rows } = await db.from("call_attendees").select("email,name,kicked,source")
      .eq("room", sess.room).eq("source", "token").gte("joined_at", start).lte("joined_at", end));
  }
  const kicked = new Set((rows ?? []).filter((r: any) => r.kicked && r.email).map((r: any) => r.email.toLowerCase()));
  const names = new Map<string, string>();
  for (const r of rows ?? []) {
    if (r.email && !kicked.has(r.email.toLowerCase())) names.set(r.email.toLowerCase(), r.name || r.email);
  }
  const to = new Set<string>(names.keys());

  const call = sess.call_id ? (await db.from("calls").select("minutes_to,kind").eq("id", sess.call_id).maybeSingle()).data : null;
  for (const e of call?.minutes_to ?? []) to.add(String(e).toLowerCase());
  if (call?.kind === "quick") {
    const { data: ads } = await db.from("admins").select("email");
    for (const a of ads ?? []) if (a.email) to.add(String(a.email).toLowerCase());
  }
  for (const k of kicked) to.delete(k);
  return { to: [...to].filter((e) => EMAIL_RE.test(e)), attendees: [...names.values()] };
}

async function processTranscript(sessionId: string, room: string, link: string, ts: number) {
  await ensureSession(sessionId, room, ts);
  await db.from("call_sessions").update({ status: "processing", ended_at: iso(ts) }).eq("session_id", sessionId).is("ended_at", null);
  await db.from("call_sessions").update({ status: "processing" }).eq("session_id", sessionId);
  try {
    const r = await fetch(link);
    if (!r.ok) throw new Error("transcript download failed: HTTP " + r.status);
    const text = transcriptToText(await r.text()).slice(0, 180000);
    const { data: sess } = await db.from("call_sessions").select("*").eq("session_id", sessionId).single();
    await db.from("call_sessions").update({ transcript: text }).eq("session_id", sessionId);
    if (text.replace(/\s/g, "").length < 40) throw new Error("transcript was empty (was anyone speaking, and was transcription on?)");

    const when = new Date(sess.started_at ?? Date.now()).toLocaleString("en-GB", { timeZone: "Africa/Nairobi", dateStyle: "full", timeStyle: "short" }) + " EAT";
    const { to, attendees } = await recipientsFor(sess);
    const system =
      "You write concise, accurate meeting minutes for MazingiraKenya, a Kenyan climate & environmental-justice coalition convened by deCOALonize. " +
      "Write in clear English (translate any Kiswahili/Sheng content). Only record what was actually said; never invent decisions, owners or dates. " +
      "Use speakers' names for owners where the transcript shows them. If something is unclear, say so briefly. Leave lists empty if nothing applies.";
    const user = `Call: ${sess.title}\nWhen: ${when}\nAttendees: ${attendees.join(", ") || "unknown"}\n\nTranscript:\n${text}`;
    const res = await askTool(system, user, "submit_minutes", MINUTES_SCHEMA, 4000, 120000, MODEL);
    if (res.err || !res.data) throw new Error("minutes generation failed: " + res.err);
    const m = res.data;
    await db.from("call_sessions").update({ minutes: { ...m, attendees, when } }).eq("session_id", sessionId);

    if (!RESEND_KEY) throw new Error("RESEND_API_KEY not set — minutes saved but not emailed");
    if (!to.length)  throw new Error("no recipients — minutes saved in the hub but not emailed");
    const html = minutesHtml(sess.title, when, attendees, m);
    const subject = `Minutes: ${sess.title} — ${new Date(sess.started_at ?? Date.now()).toLocaleDateString("en-GB", { timeZone: "Africa/Nairobi", day: "numeric", month: "short", year: "numeric" })}`;
    const sent: string[] = [];
    for (let i = 0; i < to.length; i += 90) {   // one private email per person (no shared To/CC list)
      const batch = to.slice(i, i + 90).map((e) => ({ from: FROM, to: [e], reply_to: "admin@mazingirakenya.org", subject, html }));
      const rr = await fetch("https://api.resend.com/emails/batch", {
        method: "POST", headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify(batch),
      });
      if (!rr.ok) throw new Error("Resend failed: " + (await rr.text()).slice(0, 200));
      sent.push(...to.slice(i, i + 90));
    }
    await db.from("call_sessions").update({ status: "sent", sent_to: sent, error: null }).eq("session_id", sessionId);
  } catch (e) {
    await db.from("call_sessions").update({ status: "failed", error: String(e).slice(0, 500) }).eq("session_id", sessionId);
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return ok({ ok: true, hint: "JaaS webhook endpoint" });
  const key = new URL(req.url).searchParams.get("key") ?? "";
  if (!SECRET || !safeEqual(key, SECRET)) return new Response("forbidden", { status: 403 });

  const ev = await req.json().catch(() => null) as any;
  if (!ev?.eventType) return ok({ ok: false, message: "no eventType" });
  const room = roomOf(ev.fqn);
  const sessionId = String(ev.sessionId ?? "");
  const ts = Number(ev.timestamp) || Date.now();
  const d = ev.data ?? {};

  // De-duplicate retries
  if (ev.idempotencyKey) {
    const { error } = await db.from("jaas_events").insert({ idempotency_key: ev.idempotencyKey, event_type: ev.eventType });
    if (error && /duplicate|unique/i.test(error.message)) return ok({ ok: true, duplicate: true });
  }

  switch (ev.eventType) {
    case "ROOM_CREATED":
      if (sessionId) await ensureSession(sessionId, room, ts);
      break;
    case "PARTICIPANT_JOINED":
      if (sessionId) {
        await ensureSession(sessionId, room, ts);
        await db.from("call_attendees").insert({
          room, session_id: sessionId, email: (d.email ?? "").toLowerCase() || null, name: d.name ?? null,
          moderator: String(d.moderator) === "true", source: "webhook", joined_at: iso(ts),
        });
      }
      break;
    case "PARTICIPANT_LEFT":
      if (sessionId && /kick/i.test(String(d.disconnectReason ?? "")) && d.email) {
        await db.from("call_attendees").update({ kicked: true }).eq("session_id", sessionId).ilike("email", d.email);
      }
      break;
    case "ROOM_DESTROYED":
      if (sessionId) {
        await ensureSession(sessionId, room, ts);
        await db.from("call_sessions").update({ ended_at: iso(ts), status: "ended" }).eq("session_id", sessionId).eq("status", "open");
      }
      break;
    case "TRANSCRIPTION_UPLOADED":
      if (sessionId && d.preAuthenticatedLink) {
        // reply to JaaS straight away; write + send the minutes in the background
        // @ts-ignore EdgeRuntime is provided by Supabase
        EdgeRuntime.waitUntil(processTranscript(sessionId, room, d.preAuthenticatedLink, ts));
      }
      break;
  }
  return ok();
});
