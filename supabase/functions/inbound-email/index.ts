// Supabase Edge Function: inbound-email
// Webhook for mail received at admin@mazingirakenya.org, fed by Resend Inbound.
// It simply FORWARDS each incoming message to the team Gmail via Resend, with
// Reply-To set to the original sender so a reply goes to the right person.
// (Receive-only forwarding — no mailbox, no storage. Keeps the stack to Resend.)
//
// Deploy:
//   supabase functions deploy inbound-email --no-verify-jwt
//   supabase secrets set RESEND_API_KEY=re_xxx FORWARD_TO=ombonya@gmail.com INBOUND_SECRET=<random>
// Then set Resend Inbound's webhook URL to:
//   https://<project-ref>.functions.supabase.co/inbound-email?secret=<INBOUND_SECRET>

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
// FORWARD_TO may be a comma-separated list — mail is forwarded to every address.
const FORWARD_TO = (Deno.env.get("FORWARD_TO") ?? "mazingirakhub@gmail.com,ombonya@gmail.com")
  .split(",").map((s) => s.trim()).filter(Boolean);
const INBOUND_SECRET = Deno.env.get("INBOUND_SECRET") ?? "";
const FROM = "MazingiraKenya (admin inbox) <admin@mazingirakenya.org>";

const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { "Content-Type": "application/json" } });

// Pull a plain address + display name out of "Name <a@b.com>" or "a@b.com".
function parseAddr(v: unknown): { email: string; name: string } {
  const s = Array.isArray(v) ? String(v[0] ?? "") : String(v ?? "");
  const m = s.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  if (m) return { name: m[1].trim(), email: m[2].trim() };
  return { name: "", email: s.trim() };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  // Shared-secret check (query ?secret= or x-inbound-secret header).
  if (INBOUND_SECRET) {
    const url = new URL(req.url);
    const got = url.searchParams.get("secret") || req.headers.get("x-inbound-secret") || "";
    if (got !== INBOUND_SECRET) return json({ error: "unauthorized" }, 401);
  }
  try {
    if (!RESEND_API_KEY) return json({ error: "RESEND_API_KEY not set" }, 500);
    const payload = await req.json().catch(() => ({}));

    // LOOP GUARD 1 — only act on genuine inbound/received events. If the webhook is
    // (mis)subscribed to sending events, our own forward would re-trigger this and
    // loop forever; ignore anything that isn't a received-email event.
    const evType = String(payload?.type ?? payload?.event ?? "").toLowerCase();
    if (evType && !/receiv|inbound/.test(evType)) return json({ ok: true, ignored: evType });

    // Resend Inbound wraps the message in { type, data:{...} }; accept a bare shape too.
    const d = (payload && typeof payload === "object" && payload.data) ? payload.data : payload;

    const from = parseAddr(d.from ?? d.From ?? d.sender);
    const subject = String(d.subject ?? d.Subject ?? "(no subject)");
    const text_body = String(d.text ?? d.text_body ?? d["body-plain"] ?? "");
    const html_body = String(d.html ?? d.html_body ?? d["body-html"] ?? "");

    // LOOP GUARD 2 — never forward our own forwards or mail from our own addresses.
    const self = new Set([...FORWARD_TO.map((a) => a.toLowerCase()),
      "admin@mazingirakenya.org", "admin@mail.mazingirakenya.org"]);
    if (self.has(from.email.toLowerCase())) return json({ ok: true, skipped: "self-sender" });
    if (/^\s*\[admin@\]/i.test(subject)) return json({ ok: true, skipped: "already-forwarded" });

    const banner = `<div style="font:13px system-ui;color:#555;border-left:3px solid #E2552F;padding:6px 10px;margin-bottom:12px">`
      + `Forwarded from <b>admin@mazingirakenya.org</b> · originally from ${esc(from.name || from.email)} &lt;${esc(from.email)}&gt;</div>`;
    const bodyHtml = banner + (html_body || `<pre style="font:13px/1.5 system-ui;white-space:pre-wrap">${esc(text_body)}</pre>`);

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM, to: FORWARD_TO, reply_to: from.email || undefined,
        subject: `[admin@] ${subject}`, html: bodyHtml, text: text_body || undefined,
      }),
    });
    if (!r.ok) { const t = await r.text(); console.error("Resend forward failed:", r.status, t); return json({ error: `forward failed: ${r.status}` }, 502); }
    return json({ ok: true, forwarded: true });
  } catch (e) {
    console.error("inbound-email error:", String(e));
    return json({ error: String(e) }, 500);
  }
});
