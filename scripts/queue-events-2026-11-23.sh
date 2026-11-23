#!/usr/bin/env bash
# Events Watch — reproducible record for run 2026-11-23.
# Queues UNPUBLISHED event drafts (published=false, source=watch) into Supabase
# for admin Accept/Reject in admin → Events review. Public anon key only.
#
# NOTE: on this run the Mac device-bridge shell could NOT reach Supabase
# (node fetch -> "fetch failed"; host blocked by the proxy), so the actual
# insert was performed via the connected-Chrome write path (POST to
# ${URL}/rest/v1/calendar_events, returned HTTP 201). This script is the
# reproducible equivalent for an environment that CAN reach Supabase.
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-event-draft.mjs '{
  "title":       "6th African Conference of Science Journalists (ACSJ 2027)",
  "start_date":  "2027-04-26",
  "time":        "09:00",
  "location":    "Nairobi, Kenya",
  "mode":        "In person",
  "org":         "Media for Environment, Science, Health and Agriculture (MESHA)",
  "link":        "https://capitalfm.africa/ai-climate-change-to-feature-at-african-science-journalism-conference/",
  "description": "Sixth edition of MESHA'\''s flagship conference (26-28 Apr 2027), themed '\''Frontlines of Resilience: Science, AI, and the Future of African Reporting'\'' - with a lead programme track on climate change, environment and energy reporting across African newsrooms."
}'
