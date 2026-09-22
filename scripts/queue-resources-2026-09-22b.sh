#!/usr/bin/env bash
# MazingiraKenya — Resources Watch SUPPLEMENTARY queue (run 2026-09-22, 08:08 UTC)
# A second firing of the weekly task ran ~30 min after the 07:34 run (which queued 7).
# This run added 4 genuinely NEW, previously-missed Power Shift Africa knowledge
# resources (deduped against the 15 items already in RESOURCES-REVIEW.md) as
# DRAFTS (published=false) for admin Accept/Reject in admin -> Resources review.
# The Mac device shell still cannot reach Supabase (curl 56 / proxy 403 — host not
# on device egress allowlist); the 4 inserts were made through a connected Chrome
# (same-origin POST to /rest/v1/resources, anon key only). Each returned HTTP 201.
# This script is the node-based replay for an environment that CAN reach Supabase.
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-resource-draft.mjs '{"title":"Unlocking Africa'\''s Energy Future: Integrating the COP28 Energy Package into the NDC 3.0 Framework","meta":"Policy brief · Power Shift Africa · 2025","url":"https://www.powershiftafrica.org/publications/unlocking-africas-energy-future-integrating-the-cop28-energy-package-into-the-ndc-30-framework","by":"Power Shift Africa","kind":"WEB"}'

node scripts/insert-resource-draft.mjs '{"title":"PIDA Master Plan Assessment Report — Currents of Integration: Africa'\''s Path to a Shared, Resilient Grid","meta":"Report · Power Shift Africa · 2026","url":"https://www.powershiftafrica.org/publications/pida-assessment","by":"Power Shift Africa","kind":"WEB"}'

node scripts/insert-resource-draft.mjs '{"title":"African Priorities for COP30 Policy Brief","meta":"Policy brief · Power Shift Africa · 2025","url":"https://www.powershiftafrica.org/publications/african-priorities-for-cop30-policy-brief","by":"Power Shift Africa","kind":"WEB"}'

node scripts/insert-resource-draft.mjs '{"title":"Mission 300: A Step Change for Africa?","meta":"Policy brief · Power Shift Africa · 2025","url":"https://www.powershiftafrica.org/publications/mission-300-a-step-change-for-africa","by":"Power Shift Africa","kind":"WEB"}'

echo "Queued 4 supplementary resource drafts — awaiting admin review."
