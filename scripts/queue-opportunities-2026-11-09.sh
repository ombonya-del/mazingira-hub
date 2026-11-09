#!/usr/bin/env bash
# Opportunities Watch — queue script — 2026-11-09
# Re-runnable commands to queue this week's verified-open OPPORTUNITY drafts
# (published=false) into Supabase for admin Accept/Reject in admin → Opportunities review.
#
# NOTE: the Mac device shell and the cloud container are both proxy-blocked from
# uueemckdoozsuowcqkhl.supabase.co (curl/node fetch → HTTP 000). During the 2026-11-09 run the 3
# drafts below were inserted successfully (HTTP 201) via the connected-Chrome JS fetch
# write path (Browser 1). This node command is the equivalent, for a machine WITH
# network access to Supabase.
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-opportunity-draft.mjs '{"title":"Oilwatch International Small Grants Programme 2026 — Community-Led Action for Climate & Environmental Justice","meta":"Grant · Oilwatch International & Global Greengrants Fund · closes 13 Nov 2026","url":"https://www.oilwatch.org/2026/08/12/small-grants-programme-2026","by":"Oilwatch International & Global Greengrants Fund"}'

node scripts/insert-opportunity-draft.mjs '{"title":"Officially Green Global Fellowship 2027","meta":"Fellowship · The Green Institute · closes 7 Jan 2027","url":"https://greeninstitute.ng/greenfellow2026","by":"The Green Institute"}'

node scripts/insert-opportunity-draft.mjs '{"title":"Keeling Curve Prize 2027 (Global Warming Mitigation Project)","meta":"Prize · Global Warming Mitigation Project · closes 15 Jan 2027","url":"https://kcp-conduit.org/apply/kcp/","by":"Global Warming Mitigation Project (Keeling Curve Prize)"}'

echo "All 2026-11-09 opportunity drafts queued."
