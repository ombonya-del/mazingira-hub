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
//   opportunity (default):
//     { opportunity, partners:[{name,emails:[...]}] }
//   fundable project (Je, Hatua?) — one email per partner, proposal templates attached:
//     { kind:"project", project:{title,lane,county,sector,budget,funder,pitch,gap,description,kitUrl,sources:[{t,u,s}]},
//       attachments:[{filename,content(base64)}], note?, partners:[{name,emails}] }
//   project digest — each partner gets ONE email listing the projects matched to them:
//     { kind:"digest", note?, partners:[{name,emails,projects:[{title,lane,county,sector,budget,funder,pitch,kitUrl}]}] }

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

    const body = await req.json();
    const { opportunity: o, partners } = body;
    const list = (partners ?? []).filter((p: any) => p && Array.isArray(p.emails) && p.emails.filter((e: string) => e && /@/.test(e)).length);
    if (body.kind === "project" || body.kind === "digest") {
      if (!list.length) return json({ error: "partners[] required" }, 400);
      return json(await sendProjects(body, list));
    }
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

/* ==================== Je, Hatua? fundable projects ==================== */
const btn = (href: string, label: string, bg: string, fg = "#ffffff") =>
  `<a href="${esc(href)}" style="display:inline-block;background:${bg};color:${fg};padding:11px 20px;border-radius:8px;text-decoration:none;font-weight:700;margin:0 8px 8px 0">${label}</a>`;
const noteBlock = (note?: string) => note && String(note).trim()
  ? `<div style="border-left:3px solid #EE9455;padding:6px 12px;margin:14px 0;color:#333;white-space:pre-wrap">${esc(String(note).trim())}</div>` : "";
const interestLink = (title: string, url: string, name: string, email: string) =>
  `${SUPABASE_URL}/functions/v1/register-interest?t=${encodeURIComponent("Fundable project: " + title)}&u=${encodeURIComponent(url || "")}&n=${encodeURIComponent(name || "")}&e=${encodeURIComponent(email || "")}`;
const factRows = (p: any) => [
  p.lane ? `<li><b>Lane:</b> ${esc(p.lane)}</li>` : "",
  p.county ? `<li><b>Counties:</b> ${esc(p.county)}</li>` : "",
  p.sector ? `<li><b>Sector:</b> ${esc(p.sector)}</li>` : "",
  p.budget ? `<li><b>Indicative budget:</b> ${esc(p.budget)}</li>` : "",
  p.funder ? `<li><b>Funder fit:</b> ${esc(p.funder)}</li>` : "",
].join("");

async function sendProjects(body: any, list: any[]) {
  let sent = 0;
  const errors: unknown[] = [];
  const atts = Array.isArray(body.attachments)
    ? body.attachments.filter((a: any) => a && a.filename && a.content).slice(0, 4) : [];
  for (const p of list) {
    const to = p.emails.filter((e: string) => e && /@/.test(e));
    let subject = "", html = "";
    const hello = `<p>Hello${p.name ? " " + esc(p.name) : ""},</p>`;
    const sign = `<p>&mdash; deCOALonize / MazingiraKenya</p>`;
    if (body.kind === "project") {
      const pr = body.project || {};
      if (!pr.title) return { error: "project.title required" };
      const src = Array.isArray(pr.sources) && pr.sources.length
        ? `<p style="margin:14px 0 4px"><b>Supporting evidence to start from:</b></p><ul>` +
          pr.sources.slice(0, 5).map((r: any) => `<li><a href="${esc(r.u)}">${esc(r.t)}</a>${r.s ? ` <span style="color:#666">— ${esc(r.s)}</span>` : ""}</li>`).join("") + `</ul>` : "";
      subject = `Fundable project: ${pr.title} — proposal kit inside`;
      html = hello +
        `<p>The <strong>MazingiraKenya</strong> coalition has mapped a fundable project that matches your work, and prepared a proposal kit to help you apply — alone or with other partners.</p>` +
        noteBlock(body.note) +
        `<p style="font-size:1.1rem;margin:16px 0 4px"><strong>${esc(pr.title)}</strong></p>` +
        (pr.pitch ? `<p style="margin:0 0 8px">${esc(pr.pitch)}</p>` : "") +
        (pr.gap ? `<p style="color:#A34612;margin:0 0 8px"><b>Gap it closes:</b> ${esc(pr.gap)}</p>` : "") +
        (factRows(pr) ? `<ul>${factRows(pr)}</ul>` : "") +
        (pr.description ? `<p style="color:#333">${esc(pr.description)}</p>` : "") + src +
        (atts.length ? `<p><b>Attached:</b> pre-filled proposal templates (Word) for an individual organisation and for a consortium. Grey italic text is guidance — adapt the rest in your own voice.</p>` : "") +
        `<p style="margin:18px 0 6px">` +
          btn(interestLink(pr.title, pr.kitUrl, p.name, to[0]), "I'm interested in this project &#10003;", "#1B6B4A") +
          (pr.kitUrl ? btn(pr.kitUrl, "Open the full kit on the hub", "#EDEAE0", "#0F2A20") : "") + `</p>` +
        `<p style="color:#666;font-size:.9em">Registering interest tells the coalition you may apply, so we can coordinate partners and avoid two applications to the same funder for the same gap. The hub link works for coalition members.</p>` +
        `<p style="color:#666;font-size:.9em">Budgets are indicative planning figures, not quotes.</p>` + sign;
    } else {
      const prs = (Array.isArray(p.projects) ? p.projects : []).filter((x: any) => x && x.title);
      if (!prs.length) continue;
      subject = prs.length === 1 ? `Fundable project for you: ${prs[0].title}` : `${prs.length} fundable projects matched to your work`;
      html = hello +
        `<p>The <strong>MazingiraKenya</strong> coalition's <em>Je, Hatua?</em> desk maps specific, fundable projects that close gaps in Kenya's climate-justice response. ` +
        `Based on your focus and region, ${prs.length === 1 ? "this one matches" : "these match"} your work:</p>` + noteBlock(body.note) +
        prs.map((pr: any) =>
          `<div style="border:1px solid #D9E2DC;border-radius:8px;padding:12px 14px;margin:0 0 12px">` +
          `<p style="margin:0 0 4px;font-size:1.05rem"><strong>${esc(pr.title)}</strong></p>` +
          `<p style="margin:0 0 6px;color:#555;font-size:.9em">${[pr.lane, pr.county, pr.sector, pr.budget].filter(Boolean).map(esc).join(" · ")}${pr.funder ? ` · <span style="color:#1B6B4A">${esc(pr.funder)}</span>` : ""}</p>` +
          (pr.pitch ? `<p style="margin:0 0 8px">${esc(pr.pitch)}</p>` : "") +
          btn(interestLink(pr.title, pr.kitUrl, p.name, to[0]), "I'm interested &#10003;", "#1B6B4A") +
          `</div>`).join("") +
        `<p style="color:#666;font-size:.9em">Click "I'm interested" on any project and we'll send you its full proposal kit — description, evidence, funder notes, and Word templates for applying alone or as a consortium.</p>` + sign;
    }
    const payload: any = { from: FROM, to, subject, html };
    if (body.kind === "project" && atts.length) payload.attachments = atts;
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (r.ok) sent++; else errors.push(await r.json().catch(() => r.status));
  }
  return { sent, partners: list.length, errors: errors.length ? errors : undefined };
}
