#!/usr/bin/env bash
# Opportunities Watch — queue script — 2026-10-19
# Re-runnable commands to queue this week's verified-open OPPORTUNITY drafts
# (published=false) into Supabase for admin Accept/Reject in admin → Opportunities review.
#
# NOTE: the Mac device shell and the cloud container are both proxy-blocked from
# uueemckdoozsuowcqkhl.supabase.co (curl → HTTP 000). During the 2026-10-19 run the 4
# drafts below were inserted successfully (HTTP 201) via the connected-Chrome JS fetch
# write path (Browser 1). This node command is the equivalent, for a machine WITH
# network access to Supabase.
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-opportunity-draft.mjs '{"title":"UNEP Small Grants Programme — Community-based Marine & Coastal Ecosystem Restoration","meta":"Grant · UNEP · closes 2 Nov 2026","url":"https://www.unep.org/calls-for-proposals","by":"UN Environment Programme (UNEP)"}'

node scripts/insert-opportunity-draft.mjs '{"title":"African Climate Alliance 2027 Ambassador Programme","meta":"Programme · African Climate Alliance · closes 1 Nov 2026","url":"https://cloud.seatable.io/dtable/forms/31493685-e7e3-4f67-9081-f0873f94c633/","by":"African Climate Alliance"}'

node scripts/insert-opportunity-draft.mjs '{"title":"International Blue Carbon Institute (IBCI) Fellowship 2026","meta":"Fellowship · IBCI & Conservation International · closes 23 Nov 2026","url":"https://www.conservation.org/ibci/fellowship","by":"International Blue Carbon Institute / Conservation International"}'

node scripts/insert-opportunity-draft.mjs '{"title":"IKI Medium Grants 2026 (Climate & Biodiversity)","meta":"Grant · International Climate Initiative (IKI) · closes 12 Jan 2027","url":"https://www.international-climate-initiative.com/en/find-funding/medium-grants/medium-grants-2026/","by":"International Climate Initiative (IKI), German Federal Government"}'

echo "All 2026-10-19 opportunity drafts queued."
