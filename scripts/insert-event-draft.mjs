// Queue an UNPUBLISHED Event draft into Supabase (used by the weekly events watcher).
// Draft rows are never public (public read requires published=true) — an admin Accepts
// them in admin → Events review. Uses the public anon key + the calevents_draft_insert
// RLS policy (published=false only); no secret required.
//
// Usage:  node scripts/insert-event-draft.mjs '<row-json>'
//   row-json keys: title (required), start_date, time, location, mode, description, org, link
//     title       : event name
//     start_date  : YYYY-MM-DD
//     time        : free text, e.g. "10:00" or "10am–1pm"
//     location    : venue / city
//     mode        : "In person" | "Virtual" | "Hybrid"
//     description : one-line summary
//     org         : organiser / host
//     link        : registration / info URL
//
const URL  = "https://uueemckdoozsuowcqkhl.supabase.co";
const ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1ZWVtY2tkb296c3Vvd2Nxa2hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNzcwMTUsImV4cCI6MjEwMDY1MzAxNX0.lRpyb6AdGft0eN21vOlH_dVtSMBrmqCPDbO77IHufyA";

let row;
try { row = JSON.parse(process.argv[2] || "{}"); }
catch (e) { console.error("Bad JSON:", e.message); process.exit(1); }

if (!row.title) { console.error("Need a title."); process.exit(1); }

const draft = {
  title:       String(row.title).trim(),
  start_date:  row.start_date ? String(row.start_date).slice(0, 10) : null,
  time:        row.time        ? String(row.time).trim()        : null,
  location:    row.location    ? String(row.location).trim()    : null,
  mode:        row.mode        ? String(row.mode).trim()        : null,
  description: row.description ? String(row.description).trim() : null,
  org:         row.org         ? String(row.org).trim()         : null,
  link:        row.link        ? String(row.link).trim()        : null,
  source:      "watch",     // provenance: found by the watcher, not a member
  published:   false        // enforce draft — never public until an admin accepts
};

const res = await fetch(URL + "/rest/v1/calendar_events", {
  method: "POST",
  headers: { apikey: ANON, Authorization: "Bearer " + ANON, "Content-Type": "application/json", Prefer: "return=minimal" },
  body: JSON.stringify(draft)
});
const text = await res.text();
if (!res.ok) { console.error("Insert failed", res.status, text); process.exit(1); }
console.log("Event draft queued OK (" + res.status + ") — awaiting admin review.");
