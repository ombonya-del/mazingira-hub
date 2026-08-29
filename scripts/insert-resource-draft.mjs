// Queue an UNPUBLISHED Resource draft into Supabase (used by the weekly
// "Resources Watch" task). Draft rows are never public (public read requires
// published=true) — an admin Accepts them in admin → Resources review.
// Uses the public anon key + the resources_draft_insert RLS policy (published=false
// only); no secret required. Mirrors scripts/insert-opportunity-draft.mjs — same
// `resources` table, just category="Resources".
//
// Usage:  node scripts/insert-resource-draft.mjs '<row-json>'
//   row-json keys: title (required), meta, url, by, kind
//     title : resource name (report / toolkit / policy / guideline / dataset)
//     meta  : hub meta line, e.g. "Report · WHO · 2026" or "Toolkit · UNEP"
//     url   : link to the resource
//     by    : publisher / source org (optional; shown as "by …")
//     kind  : LINK | WEB | PDF … (default LINK)
//
const URL  = "https://uueemckdoozsuowcqkhl.supabase.co";
const ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1ZWVtY2tkb296c3Vvd2Nxa2hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNzcwMTUsImV4cCI6MjEwMDY1MzAxNX0.lRpyb6AdGft0eN21vOlH_dVtSMBrmqCPDbO77IHufyA";

let row;
try { row = JSON.parse(process.argv[2] || "{}"); }
catch (e) { console.error("Bad JSON:", e.message); process.exit(1); }

if (!row.title) { console.error("Need a title."); process.exit(1); }

const draft = {
  category:  "Resources",
  title:     String(row.title).trim(),
  meta:      row.meta ? String(row.meta).trim() : null,
  url:       row.url  ? String(row.url).trim()  : null,
  by:        row.by   ? String(row.by).trim()   : null,
  kind:      row.kind ? String(row.kind).trim() : "LINK",
  source:    "watch",     // provenance: found by the watcher, not a member
  published: false        // enforce draft — never public until an admin accepts
};

const res = await fetch(URL + "/rest/v1/resources", {
  method: "POST",
  headers: { apikey: ANON, Authorization: "Bearer " + ANON, "Content-Type": "application/json", Prefer: "return=minimal" },
  body: JSON.stringify(draft)
});
const text = await res.text();
if (!res.ok) { console.error("Insert failed", res.status, text); process.exit(1); }
console.log("Resource draft queued OK (" + res.status + ") — awaiting admin review.");
