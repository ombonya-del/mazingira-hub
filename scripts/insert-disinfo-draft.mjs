// Insert an UNPUBLISHED disinfo draft into Supabase (used by the weekly disinfo scanner).
// Draft rows are never public (public read requires published=true) — an admin approves
// them in admin → Manual upload → "Pending review". Uses the public anon key + the
// disinfo_draft_insert RLS policy (published=false only); no secret required.
//
// Usage:  node scripts/insert-disinfo-draft.mjs '<row-json>'
//   row-json keys: name, handle, posted_at, body, eng, verdict, verdict_class, tweet_url, rebuttal
//
const URL = "https://uueemckdoozsuowcqkhl.supabase.co";
const ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1ZWVtY2tkb296c3Vvd2Nxa2hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNzcwMTUsImV4cCI6MjEwMDY1MzAxNX0.lRpyb6AdGft0eN21vOlH_dVtSMBrmqCPDbO77IHufyA";

let row;
try { row = JSON.parse(process.argv[2] || "{}"); }
catch (e) { console.error("Bad JSON:", e.message); process.exit(1); }
row.published = false;                                  // enforce draft
if (row.tweet_url) row.tweet_url = String(row.tweet_url).replace("://x.com/", "://twitter.com/").split("?")[0];
if (!row.body || !row.verdict || !row.rebuttal) { console.error("Need body, verdict, rebuttal."); process.exit(1); }

const res = await fetch(URL + "/rest/v1/disinfo_items", {
  method: "POST",
  headers: { apikey: ANON, Authorization: "Bearer " + ANON, "Content-Type": "application/json", Prefer: "return=minimal" },
  body: JSON.stringify(row)
});
const text = await res.text();
if (!res.ok) { console.error("Insert failed", res.status, text); process.exit(1); }
console.log("Draft queued OK (" + res.status + ") — awaiting admin review.");
