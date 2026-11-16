#!/usr/bin/env bash
# Opportunities Watch — queue script — 2026-11-16
# Re-runnable commands to queue this week's verified-open OPPORTUNITY drafts
# (published=false) into Supabase for admin Accept/Reject in admin → Opportunities review.
#
# NOTE: the Mac device shell and the cloud container are both proxy-blocked from
# uueemckdoozsuowcqkhl.supabase.co (curl/node fetch → HTTP 000). During the 2026-11-16 run the 2
# drafts below were inserted successfully (HTTP 201) via the connected-Chrome JS fetch
# write path (Browser 1), POSTed from the hub.mazingirakenya.org origin. This node command is
# the equivalent, for a machine WITH network access to Supabase.
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-opportunity-draft.mjs '{"title":"Africa Youth Climate Fund (AYCF) 2026/2027 — Youth-Led Climate Action Grants (up to US$20,000)","meta":"Grant · Africa Youth Climate Fund (hosted by GAYO) · closes 15 Jan 2027","url":"https://aycf.org/funding/6cf80744-a907-406f-92e3-5e94ba46d008","by":"Africa Youth Climate Fund (Green Africa Youth Organization)"}'

node scripts/insert-opportunity-draft.mjs '{"title":"Nature Culture Fellowship 2027 (NCF) — Storytelling & Artivism for Environmental Justice","meta":"Fellowship · Kinship · closes 1 Dec 2026","url":"https://www.kinship.earth/nature-culture-fellowship","by":"Kinship"}'

echo "All 2026-11-16 opportunity drafts queued."
