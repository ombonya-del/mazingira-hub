#!/usr/bin/env bash
# Opportunities Watch — queue script — 2026-09-29
# Re-runnable commands to queue this week's verified-open OPPORTUNITY drafts
# (published=false) into Supabase for admin Accept/Reject in admin → Opportunities review.
#
# NOTE: the Mac device shell and the cloud container are both proxy-blocked from
# uueemckdoozsuowcqkhl.supabase.co. During the 2026-09-29 run the 1 draft below was
# inserted successfully (HTTP 201) via the connected-Chrome JS fetch write path.
# This node command is the equivalent, for a machine WITH network access to Supabase.
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-opportunity-draft.mjs '{"title":"Whitley Awards 2027 (Whitley Fund for Nature)","meta":"Award · Whitley Fund for Nature · closes 30 Oct 2026","url":"https://whitleyaward.org/apply-for-conservation-funding/apply-for-a-whitley-award/","by":"Whitley Fund for Nature (WFN)"}'

echo "All 2026-09-29 opportunity drafts queued."
