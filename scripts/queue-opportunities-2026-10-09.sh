#!/usr/bin/env bash
# Opportunities Watch — queue script — 2026-10-09
# Re-runnable commands to queue this week's verified-open OPPORTUNITY drafts
# (published=false) into Supabase for admin Accept/Reject in admin → Opportunities review.
#
# NOTE: the Mac device shell and the cloud container are both proxy-blocked from
# uueemckdoozsuowcqkhl.supabase.co (curl → HTTP 000). During the 2026-10-09 run the 2
# drafts below were inserted successfully (HTTP 201) via the connected-Chrome JS fetch
# write path (Browser 1). This node command is the equivalent, for a machine WITH
# network access to Supabase.
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-opportunity-draft.mjs '{"title":"Future Conservationist Award 2027 (Conservation Leadership Programme)","meta":"Award · Conservation Leadership Programme · closes 30 Oct 2026","url":"https://www.conservationleadershipprogramme.org/awards-opportunities/team-awards/future-conservationist-award","by":"Conservation Leadership Programme (BirdLife International, FFI, WCS)"}'

node scripts/insert-opportunity-draft.mjs '{"title":"Global EbA Fund — Medium-size Grants (Ecosystem-based Adaptation)","meta":"Grant · Global EbA Fund (IUCN & UNEP) · closes 16 Nov 2026","url":"https://globalebafund.org/medium-size-grants","by":"Global EbA Fund (IUCN & UNEP)"}'

echo "All 2026-10-09 opportunity drafts queued."
