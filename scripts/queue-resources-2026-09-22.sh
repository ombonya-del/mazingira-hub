#!/usr/bin/env bash
# MazingiraKenya — Resources Watch queue (run 2026-09-22)
# Queues verified NEW climate / environmental-justice knowledge resources as
# DRAFTS (published=false) into Supabase for admin Accept/Reject in
# admin -> Resources review. Uses the public anon key only (see
# scripts/insert-resource-draft.mjs). Re-running is safe but will create
# duplicate drafts — this file is a record of what this run queued.
# NOTE: the Mac device shell cannot reach Supabase (host not on device egress
# allowlist); this run's 7 inserts were made through a connected Chrome
# (same-origin POST to /rest/v1/resources, anon key only). This script is the
# node-based replay for an environment that CAN reach Supabase.
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-resource-draft.mjs '{"title":"Adaptation Gap Report 2025","meta":"Report · UNEP · 2025","url":"https://www.unep.org/resources/adaptation-gap-report-2025","by":"UN Environment Programme","kind":"WEB"}'

node scripts/insert-resource-draft.mjs '{"title":"Emissions Gap Report 2025","meta":"Report · UNEP · 2025","url":"https://www.unep.org/resources/emissions-gap-report-2025","by":"UN Environment Programme","kind":"WEB"}'

node scripts/insert-resource-draft.mjs '{"title":"Implications of the ICJ Advisory Opinion on the Climate Obligations of African States","meta":"Policy brief · Power Shift Africa · 2025","url":"https://www.powershiftafrica.org/publications/icj-advisory-opinion-policy-brief-for-africa","by":"Power Shift Africa","kind":"WEB"}'

node scripts/insert-resource-draft.mjs '{"title":"COP30 Scorecard: Technical Assessment of Outcomes Against the African Agenda","meta":"Report · Power Shift Africa · 2025","url":"https://www.powershiftafrica.org/publications/cop30scorecard","by":"Power Shift Africa","kind":"WEB"}'

node scripts/insert-resource-draft.mjs '{"title":"African Energy Leadership Report: The Case for 100% Renewable Energy","meta":"Report · Power Shift Africa · 2025","url":"https://www.powershiftafrica.org/publications/african-energy-leadership-report","by":"Power Shift Africa","kind":"WEB"}'

node scripts/insert-resource-draft.mjs '{"title":"The Africa Green Industrialization Initiative (AGII) — Policy Brief","meta":"Policy brief · Power Shift Africa · 2025","url":"https://www.powershiftafrica.org/publications/the-africa-green-industrialization-initiative-agii-policy-brief","by":"Power Shift Africa","kind":"WEB"}'

node scripts/insert-resource-draft.mjs '{"title":"Why Carbon Markets Are a Dangerous Distraction for Africa","meta":"Policy brief · Power Shift Africa · 2024","url":"https://www.powershiftafrica.org/publications/policy-brief-why-carbon-markets-are-a-dangerous-distraction-for-africa","by":"Power Shift Africa","kind":"WEB"}'

echo "Queued 7 resource drafts — awaiting admin review."
