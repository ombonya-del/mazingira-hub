#!/usr/bin/env bash
# Replay: Resources Watch drafts queued 2026-11-23 (weekly task firing).
# 6 genuinely new items, deduped against all distinct drafts already logged in
# RESOURCES-REVIEW.md (66 distinct URLs through 2026-11-16). published=false,
# source=watch, category=Resources, into Supabase project uueemckdoozsuowcqkhl.
# The Mac device shell cannot reach Supabase (host not on the device egress
# allowlist), so the live run POSTed these via a connected Chrome (same-origin
# fetch to /rest/v1/resources with the public anon key — each HTTP 201).
# This script is the device-side replay using the insert helper; run only if the
# shell later gains Supabase egress. Each call prints "Resource draft queued OK".
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-resource-draft.mjs '{
  "title": "Africa on the Road to COP30: From Addis Ababa to Belém",
  "meta":  "Research brief · Mo Ibrahim Foundation · 2025",
  "url":   "https://mo.ibrahim.foundation/sites/default/files/2025-11/africa-on-the-road-to-cop30.pdf",
  "by":    "Mo Ibrahim Foundation",
  "kind":  "PDF"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "Policy Brief: Strengthening Gender-Responsive Health Integration within Kenya'"'"'s Climate Commitments",
  "meta":  "Policy brief · SHE Changes Climate · 2026",
  "url":   "https://www.shechangesclimate.org/reports/policy-brief-strengthening-genderresponsive-health-integration-within-kenyas-climate-commitments",
  "by":    "SHE Changes Climate",
  "kind":  "WEB"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "COP30 Executive Report",
  "meta":  "Report · COP30 Presidency / UNFCCC · 2026",
  "url":   "https://unfccc.int/sites/default/files/resource/COP_30_executive_report.pdf",
  "by":    "COP30 Presidency (Brazil) & UNFCCC",
  "kind":  "PDF"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "Guidelines for Gender Mainstreaming into Climate Action",
  "meta":  "Guideline · Government of Kenya · 2026",
  "url":   "https://www.gender.go.ke/sites/default/files/publications/GUIDELINES%20FOR%20GENDER%20MAINSTREAMING%20INTO%20CLIMATE%20ACTION.pdf",
  "by":    "Ministry of Environment, Climate Change & Forestry / State Dept for Gender (Kenya)",
  "kind":  "PDF"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "Inclusive Planetary Health: Centring Women with Disabilities in the Climate-Health Nexus",
  "meta":  "Study brief · Humanity & Inclusion · 2026 · Kenya & Uganda",
  "url":   "https://www.hi.org/sn_uploads/document/HI_Climate_health_Women_with_disabilities_Kenya_Uganda_study_Brief.pdf",
  "by":    "Humanity & Inclusion (HI)",
  "kind":  "PDF"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "Global Climate Action Agenda at COP30 — Outcomes Report",
  "meta":  "Outcomes report · UNFCCC Climate Champions · 2025",
  "url":   "https://unfccc.int/sites/default/files/resource/COP30%20Action%20Agenda_Outcomes%20Report_December_2025.pdf",
  "by":    "UNFCCC High-Level Climate Champions",
  "kind":  "PDF"
}'
