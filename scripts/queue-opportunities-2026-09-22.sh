#!/usr/bin/env bash
# Opportunities Watch — queue script — 2026-09-22
# Re-runnable commands to queue this week's verified-open OPPORTUNITY drafts
# (published=false) into Supabase for admin Accept/Reject in admin → Opportunities review.
#
# NOTE: the Mac device shell and the cloud container are both proxy-blocked from
# uueemckdoozsuowcqkhl.supabase.co. During the 2026-09-22 run these 4 drafts were
# inserted successfully (HTTP 201) via the connected-Chrome JS fetch write path.
# These node commands are the equivalent, for a machine WITH network access to Supabase.
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-opportunity-draft.mjs '{"title":"Nairobi Youth Climate Action Fund (YCAF) 2026–2027","meta":"Grant · Nairobi City County / Youth Climate Action Fund · closes 16 Oct 2026","url":"https://nairobi.go.ke/nairobi-selected-for-2026-2027-youth-climate-action-fund-unlocking-50000-for-youth-led-climate-solutions","by":"Nairobi City County (Youth Climate Action Fund)"}'

node scripts/insert-opportunity-draft.mjs '{"title":"Commonwealth Foundation Grants 2026–27","meta":"Grant · Commonwealth Foundation · closes 26 Oct 2026 (opens 23 Sep)","url":"https://commonwealthfoundation.com/grants/annual","by":"Commonwealth Foundation"}'

node scripts/insert-opportunity-draft.mjs '{"title":"AFD 2026 CSO Call for Expressions of Project Intentions","meta":"Call · Agence Française de Développement (CSO Initiatives) · closes 9 Oct 2026","url":"https://www.afd.fr/en/calls-for-projects/2026-cso-call-expressions-project-intentions","by":"Agence Française de Développement (AFD)"}'

node scripts/insert-opportunity-draft.mjs '{"title":"AGNES–Bayer Research Grant 2026 (Biodiversity & Sustainable Agriculture)","meta":"Research grant · AGNES / Bayer Foundation · closes 16 Oct 2026","url":"https://agnes-h.org/agnes-bayer-research-grant/","by":"AGNES / Bayer Foundation"}'

echo "All 2026-09-22 opportunity drafts queued."
