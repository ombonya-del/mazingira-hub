#!/usr/bin/env bash
# MazingiraKenya — Weekly Opportunities Watch — queued drafts for 2026-09-19
# 5 NEW verified-open climate / environmental-justice opportunities (Kenya / East Africa / pan-African).
# These were inserted as DRAFTS (published=false) into Supabase via a connected browser on 2026-09-19
# (both the Mac device shell and the cloud container are proxy-blocked from Supabase).
# Re-running these commands from a machine WITH network access is idempotent-safe for the admin queue.
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-opportunity-draft.mjs '{"title":"SEWA Grants 2026 — Strengthening Early Warning in Africa","meta":"Grant · ECMWF (EU Global Gateway) · closes 30 Sep 2026","url":"https://www.ecmwf.int/en/about/grants/sewa-grants","by":"European Centre for Medium-Range Weather Forecasts (ECMWF)"}'
node scripts/insert-opportunity-draft.mjs '{"title":"Aqua for All — Kenya Call 2026 (Water & Sanitation Enterprises)","meta":"Call · Aqua for All · closes 20 Sep 2026","url":"https://aquaforall.org/call-for-applications-kenya","by":"Aqua for All"}'
node scripts/insert-opportunity-draft.mjs '{"title":"Voices for Climate Justice — Accountability Storytellers","meta":"Fellowship · Africa No Filter & Comic Relief · closes 25 Sep 2026","url":"https://africanofilter.org/what-we-do/community/voices-for-climate-justice","by":"Africa No Filter & Comic Relief"}'
node scripts/insert-opportunity-draft.mjs '{"title":"Global EbA Fund — Small-Size Grants (Ecosystem-based Adaptation)","meta":"Grant · Global EbA Fund · closes 26 Oct 2026","url":"https://globalebafund.org/small-size-grants","by":"Global EbA Fund"}'
node scripts/insert-opportunity-draft.mjs '{"title":"CFC 29th Call — Thriving Farmers, Resilient Ecosystems, Empowered Communities","meta":"Grant · Common Fund for Commodities · closes 1 Oct 2026","url":"https://www.common-fund.org/call-for-proposals","by":"Common Fund for Commodities (CFC)"}'

echo "5 opportunity drafts queued — awaiting admin review."
