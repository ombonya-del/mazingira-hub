// Supabase Edge Function: health-check  (MazingiraKenya)  v2 (2026-11-11)
// Freshness monitor. Every 3 hours (pg_cron, see supabase/freshness-monitor.sql) it checks that
// every feed partners and the public rely on is still being refreshed, and emails an alert the
// moment one goes quiet — instead of finding out weeks later.
//
// Two kinds of check:
//   PIPELINE  — is the scanner / sweep still WRITING?  (e.g. no new radar items in 12 hours)
//   PUBLISHED — are people actually SEEING fresh items? (drafts piling up unreviewed, or nothing
//               published for days even though the scanner is writing)
// Plus: sites up, key secrets present.
//
// Email rules (no spam): an alert goes out when a check FIRST fails, a reminder every 24h while it
// stays failing, and a "back to normal" note when it recovers. State lives in public.health_state,
// which the admin Overview reads to show the live freshness board.
//
// Deploy:  supabase functions deploy health-check --project-ref uueemckdoozsuowcqkhl
// Secrets: RESEND_API_KEY, optional ALERT_TO (extra recipients, comma-separated)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const CFG = {
  project: "MazingiraKenya",
  to: ["mazingirakhub@gmail.com"],
  from: "alerts@mazingirakenya.org",                    // domain verified in Resend
  admin: "https://hub.mazingirakenya.org/admin/",
  sites: [
    { name: "Hub site", url: "https://hub.mazingirakenya.org" },
    { name: "raia site", url: "https://hub.mazingirakenya.org/raia/" },
  ],
  copWindow: ["2026-11-09", "2026-11-21"],               // COP31 digest checks only run in this window
}

type Filter = [string, "eq" | "neq" | "gte" | "lte", unknown]
type Fresh = { key: string; name: string; group: "Pipeline" | "Published"; table: string; col: string; staleHours: number;
  filters?: Filter[]; fix: string; copOnly?: boolean }
type Backlog = { key: string; name: string; table: string; col: string; olderThanHours: number; filters: Filter[]; fix: string; copOnly?: boolean }

// ---- what "fresh" means for each feed -----------------------------------------------------------
const FRESH: Fresh[] = [
  // PIPELINE: the writers
  { key: "radar", name: "Media radar (Latest scanned items)", group: "Pipeline", table: "sentiment_items", col: "ingested_at", staleHours: 12,
    fix: "Check GitHub → Actions → MazingiraKenya Media Radar / Scanners (scan-sentiment)." },
  { key: "x-sweep", name: "Community pulse — daily X sweep", group: "Pipeline", table: "pulse_items", col: "created_at", staleHours: 30,
    fix: "The CoalHub X-bookmark sweep is a Claude scheduled task: the Mac must be awake and the MazingirahubKenya Chrome connected when it runs. Check the task's last run in the Claude sidebar." },
  { key: "socials-sweep", name: "Partner socials sweep (Baraza wall)", group: "Pipeline", table: "baraza_posts", col: "created_at", staleHours: 48,
    filters: [["kind", "eq", "social"]],
    fix: "Check the partner socials sweep (Claude scheduled task) and that its Chrome is connected." },
  { key: "opps", name: "Opportunities scanner", group: "Pipeline", table: "resources", col: "created_at", staleHours: 24 * 7,
    filters: [["category", "eq", "Opportunities"]], fix: "Check the opportunity-scanner job in GitHub Actions → MazingiraKenya Scanners." },
  { key: "resources", name: "Resources scanner", group: "Pipeline", table: "resources", col: "created_at", staleHours: 24 * 7,
    filters: [["category", "neq", "Opportunities"]], fix: "Check the resource-scanner job in GitHub Actions → MazingiraKenya Scanners." },
  { key: "events", name: "Events scanner", group: "Pipeline", table: "calendar_events", col: "created_at", staleHours: 24 * 7,
    fix: "Check the event-scanner job in GitHub Actions → MazingiraKenya Scanners." },
  { key: "disinfo", name: "Narrative disinfo scanner", group: "Pipeline", table: "disinfo_items", col: "created_at", staleHours: 24 * 7,
    fix: "Check the disinfo-scanner job in GitHub Actions → MazingiraKenya Scanners." },
  { key: "sector-extract", name: "Sector stream — Extractive", group: "Pipeline", table: "extractive_signals", col: "created_at", staleHours: 24 * 7, fix: "Check the scan-sectors job in GitHub Actions." },
  { key: "sector-legal", name: "Sector stream — Litigation", group: "Pipeline", table: "litigation_updates", col: "created_at", staleHours: 24 * 7, fix: "Check the scan-sectors job in GitHub Actions." },
  { key: "sector-policy", name: "Sector stream — Policy", group: "Pipeline", table: "policy_updates", col: "created_at", staleHours: 24 * 7, fix: "Check the scan-sectors job in GitHub Actions." },
  { key: "sector-funding", name: "Sector stream — Funding", group: "Pipeline", table: "funding_opportunities", col: "created_at", staleHours: 24 * 7, fix: "Check the scan-sectors job in GitHub Actions." },
  { key: "cop-digest", name: "COP31 Daily — digest drafts", group: "Pipeline", table: "cop_digests", col: "updated_at", staleHours: 14, copOnly: true,
    fix: "Check the cop-digest job in GitHub Actions → MazingiraKenya Scanners." },

  // PUBLISHED: what partners and the public actually see
  { key: "pulse-live", name: "Community pulse — published on the hub", group: "Published", table: "pulse_items", col: "created_at", staleHours: 48,
    filters: [["published", "eq", true]], fix: "Publish new community pulse items in the admin console." },
  { key: "cop-hub-live", name: "COP31 Daily — live on the hub", group: "Published", table: "cop_digests", col: "updated_at", staleHours: 24, copOnly: true,
    filters: [["published", "eq", true]], fix: "Publish today's digest: Admin → Review → COP31 digest." },
  { key: "cop-raia-live", name: "COP31 Daily — live on raia", group: "Published", table: "cop_digests", col: "updated_at", staleHours: 24, copOnly: true,
    filters: [["raia_published", "eq", true]], fix: "Publish today's raia version: Admin → Review → COP31 digest." },
]

// ---- review backlogs: drafts waiting too long keep the public view stale -------------------------
const BACKLOG: Backlog[] = [
  { key: "cop-backlog", name: "COP31 digest drafts awaiting review", table: "cop_digests", col: "updated_at", olderThanHours: 10, copOnly: true,
    filters: [["published", "eq", false], ["raia_published", "eq", false]], fix: "Admin → Review → COP31 digest." },
  { key: "disinfo-backlog", name: "Narrative disinfo drafts awaiting review", table: "disinfo_items", col: "created_at", olderThanHours: 72,
    filters: [["published", "eq", false]], fix: "Admin → Publishing → Narrative disinfo." },
  { key: "events-backlog", name: "Event drafts awaiting review", table: "calendar_events", col: "created_at", olderThanHours: 72,
    filters: [["published", "eq", false]], fix: "Admin → Review → Events review." },
  { key: "opps-backlog", name: "Opportunity drafts awaiting review", table: "resources", col: "created_at", olderThanHours: 72,
    filters: [["published", "eq", false], ["category", "eq", "Opportunities"]], fix: "Admin → Review → Opportunities review." },
  { key: "pulse-backlog", name: "Community pulse drafts awaiting review", table: "pulse_items", col: "created_at", olderThanHours: 48,
    filters: [["published", "eq", false]], fix: "Publish or discard the waiting community pulse items in the admin console." },
]

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? ""
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
const RESEND = Deno.env.get("RESEND_API_KEY") ?? ""
const ANTHROPIC = Deno.env.get("ANTHROPIC_API_KEY") ?? ""
const EXTRA_TO = (Deno.env.get("ALERT_TO") ?? "").split(",").map((s) => s.trim()).filter(Boolean)
const sb = createClient(SUPABASE_URL, SERVICE)

type Check = { key: string; group: string; name: string; ok: boolean; level: "ok" | "stale" | "backlog" | "error"; detail: string; last_at: string | null; fix: string }

const inCop = () => { const d = new Date(Date.now() + 3 * 3600_000).toISOString().slice(0, 10); return d >= CFG.copWindow[0] && d <= CFG.copWindow[1] }
const ago = (h: number) => h < 1 ? `${Math.round(h * 60)} min ago` : h < 48 ? `${h.toFixed(1)} h ago` : `${(h / 24).toFixed(1)} days ago`
const win = (h: number) => h < 48 ? `${h} h` : `${Math.round(h / 24)} days`
function apply(q: any, filters?: Filter[]) { for (const [c, op, v] of filters ?? []) q = q[op](c, v); return q }

async function sites(): Promise<Check[]> {
  return Promise.all(CFG.sites.map(async (s) => {
    try {
      const r = await fetch(s.url, { method: "HEAD", signal: AbortSignal.timeout(8000) })
      const ok = r.ok || r.status === 301 || r.status === 302
      return { key: "site:" + s.url, group: "Site", name: s.name, ok, level: ok ? "ok" : "error", detail: `HTTP ${r.status}`, last_at: null, fix: "Check Vercel deployments." } as Check
    } catch (e) {
      return { key: "site:" + s.url, group: "Site", name: s.name, ok: false, level: "error", detail: `unreachable: ${String(e).slice(0, 50)}`, last_at: null, fix: "Check Vercel and DNS." } as Check
    }
  }))
}

async function fresh(): Promise<Check[]> {
  const list = FRESH.filter((f) => !f.copOnly || inCop())
  return Promise.all(list.map(async (f) => {
    const base = { key: f.key, group: f.group, name: f.name, fix: f.fix }
    try {
      const { data, error } = await apply(sb.from(f.table).select(f.col), f.filters).order(f.col, { ascending: false }).limit(1)
      if (error) return { ...base, ok: false, level: "error", detail: `query error: ${error.message}`, last_at: null } as Check
      const ts = (data?.[0] as any)?.[f.col]
      if (!ts) return { ...base, ok: false, level: "stale", detail: "nothing yet", last_at: null } as Check
      const h = (Date.now() - new Date(ts).getTime()) / 3600_000
      const ok = h < f.staleHours
      return { ...base, ok, level: ok ? "ok" : "stale", detail: `last update ${ago(h)} (alert after ${win(f.staleHours)})`, last_at: ts } as Check
    } catch (e) {
      return { ...base, ok: false, level: "error", detail: String(e).slice(0, 60), last_at: null } as Check
    }
  }))
}

async function backlog(): Promise<Check[]> {
  const list = BACKLOG.filter((b) => !b.copOnly || inCop())
  return Promise.all(list.map(async (b) => {
    const base = { key: b.key, group: "Review queue", name: b.name, fix: b.fix }
    try {
      const cutoff = new Date(Date.now() - b.olderThanHours * 3600_000).toISOString()
      const { count, error } = await apply(sb.from(b.table).select("*", { count: "exact", head: true }), b.filters).lte(b.col, cutoff)
      if (error) return { ...base, ok: false, level: "error", detail: `query error: ${error.message}`, last_at: null } as Check
      const n = count ?? 0
      return { ...base, ok: n === 0, level: n ? "backlog" : "ok", detail: n ? `${n} waiting longer than ${win(b.olderThanHours)}` : "nothing overdue", last_at: null } as Check
    } catch (e) {
      return { ...base, ok: false, level: "error", detail: String(e).slice(0, 60), last_at: null } as Check
    }
  }))
}

const secrets = (): Check[] => [
  { key: "secret:resend", group: "Setup", name: "Email alerts (RESEND key)", ok: !!RESEND, level: RESEND ? "ok" : "error", detail: RESEND ? "configured" : "MISSING — alerts cannot be emailed", last_at: null, fix: "supabase secrets set RESEND_API_KEY=…" },
  { key: "secret:anthropic", group: "Setup", name: "Scanner AI (ANTHROPIC key)", ok: !!ANTHROPIC, level: ANTHROPIC ? "ok" : "error", detail: ANTHROPIC ? "configured" : "MISSING — scanners will fail", last_at: null, fix: "supabase secrets set ANTHROPIC_API_KEY=…" },
]

// ---- state + de-duplicated email ---------------------------------------------------------------
async function record(checks: Check[]) {
  const { data: prev, error } = await sb.from("health_state").select("key,ok,since,last_emailed")
  if (error) throw new Error(error.message)
  const P: Record<string, any> = {}; (prev ?? []).forEach((r: any) => P[r.key] = r)
  const now = new Date().toISOString()
  const newlyBad: Check[] = [], stillBadDue: Check[] = [], recovered: Check[] = []
  const rows = checks.map((c, i) => {
    const p = P[c.key]
    const changed = !p || p.ok !== c.ok
    if (!c.ok && (!p || p.ok)) newlyBad.push(c)
    else if (!c.ok && p && (!p.last_emailed || Date.now() - Date.parse(p.last_emailed) > 24 * 3600_000)) stillBadDue.push(c)
    if (c.ok && p && !p.ok) recovered.push(c)
    return { key: c.key, grp: c.group, name: c.name, ok: c.ok, level: c.level, detail: c.detail, last_at: c.last_at, fix: c.fix,
      since: changed ? now : (p?.since ?? now), checked_at: now, last_emailed: p?.last_emailed ?? null, sort: i }
  })
  // drop rows for checks that no longer exist (e.g. COP checks after the COP window)
  const keep = new Set(checks.map((c) => c.key))
  const gone = Object.keys(P).filter((k) => !keep.has(k))
  if (gone.length) await sb.from("health_state").delete().in("key", gone)
  return { rows, newlyBad, stillBadDue, recovered }
}

async function email(all: Check[], newlyBad: Check[], stillBadDue: Check[], recovered: Check[]) {
  const failing = all.filter((c) => !c.ok)
  const send = newlyBad.length || stillBadDue.length || recovered.length
  if (!send) return { sent: false, reason: failing.length ? "failing, reminder not due yet" : "all green" }
  if (!RESEND) return { sent: false, reason: "no RESEND_API_KEY" }
  const when = new Date(Date.now() + 3 * 3600_000).toISOString().slice(0, 16).replace("T", " ") + " EAT"
  const icon = (c: Check) => c.ok ? "✅" : c.level === "backlog" ? "🟡" : "🔴"
  const row = (c: Check, tag = "") => `<tr style="border-bottom:1px solid #eee;background:${c.ok ? "#F3FBF6" : c.level === "backlog" ? "#FFF9EC" : "#FFF1F1"}">
      <td style="padding:8px 10px;font-size:15px;vertical-align:top">${icon(c)}</td>
      <td style="padding:8px 10px;font-size:13px;vertical-align:top"><b>${c.name}</b>${tag ? ` <span style="font-size:11px;color:#B3261E;font-weight:700">${tag}</span>` : ""}<br>
        <span style="color:#555;font-size:12px">${c.detail}</span>${c.ok ? "" : `<br><span style="color:#333;font-size:12px">→ ${c.fix}</span>`}</td></tr>`
  const newKeys = new Set(newlyBad.map((c) => c.key))
  const body = [
    failing.length ? `<h3 style="font-size:14px;margin:16px 0 6px">Needs attention (${failing.length})</h3><table style="width:100%;border-collapse:collapse;border:1px solid #eee">${failing.map((c) => row(c, newKeys.has(c.key) ? "NEW" : "")).join("")}</table>` : "",
    recovered.length ? `<h3 style="font-size:14px;margin:16px 0 6px">Back to normal (${recovered.length})</h3><table style="width:100%;border-collapse:collapse;border:1px solid #eee">${recovered.map((c) => row(c)).join("")}</table>` : "",
  ].join("")
  const subject = failing.length
    ? `⚠️ ${CFG.project}: ${failing.length} feed${failing.length > 1 ? "s" : ""} need attention${newlyBad.length ? ` (${newlyBad.length} new)` : ""}`
    : `✅ ${CFG.project}: all feeds fresh again`
  const html = `<div style="font-family:system-ui,Arial,sans-serif;max-width:600px;margin:0 auto;color:#160B03">
    <h2 style="font-size:18px;margin:0 0 4px">${CFG.project} — freshness monitor</h2>
    <p style="font-size:12px;color:#888;margin:0">${when} · checks every 3 hours · reminders every 24 h while something stays stale</p>
    ${body}
    <p style="font-size:12px;margin-top:16px"><a href="${CFG.admin}">Open the admin console</a> — the Overview page shows the live freshness board.</p></div>`
  const to = [...CFG.to, ...EXTRA_TO]
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST", headers: { Authorization: `Bearer ${RESEND}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: `${CFG.project} Monitor <${CFG.from}>`, to, subject, html }),
  })
  return { sent: r.ok, reason: r.ok ? `emailed ${to.join(", ")}` : `resend HTTP ${r.status}` }
}

Deno.serve(async (req) => {
  if (req.method === "GET") return new Response(JSON.stringify({ status: "ok", project: CFG.project }), { headers: { "Content-Type": "application/json" } })
  const checks = [...(await fresh()), ...(await backlog()), ...(await sites()), ...secrets()]
  let em: any
  try {
    const st = await record(checks)
    em = await email(checks, st.newlyBad, st.stillBadDue, st.recovered)
    const emailedKeys = new Set([...st.newlyBad, ...st.stillBadDue].map((c) => c.key))
    const now = new Date().toISOString()
    const rows = st.rows.map((r) => r.ok ? { ...r, last_emailed: null } : (em?.sent && emailedKeys.has(r.key) ? { ...r, last_emailed: now } : r))
    const { error } = await sb.from("health_state").upsert(rows, { onConflict: "key" })
    if (error) em = { ...em, state_error: error.message }
  } catch (e) {
    // No state table yet: still alert on every failing check so nothing is missed.
    em = await email(checks, checks.filter((c) => !c.ok), [], [])
    em = { ...em, state_error: "health_state table missing — run supabase/freshness-monitor.sql (" + String(e).slice(0, 60) + ")" }
  }
  return new Response(JSON.stringify({ project: CFG.project, ok: checks.every((c) => c.ok), failing: checks.filter((c) => !c.ok).map((c) => c.name), checks, email: em }, null, 2),
    { headers: { "Content-Type": "application/json" } })
})
