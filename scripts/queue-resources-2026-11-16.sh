#!/usr/bin/env bash
# Replay: Resources Watch drafts queued 2026-11-16 (weekly task firing).
# 5 genuinely new items, deduped against all distinct drafts already logged in
# RESOURCES-REVIEW.md. published=false, source=watch, category=Resources, into
# Supabase project uueemckdoozsuowcqkhl.
# The Mac device shell cannot reach Supabase (host not on the device egress
# allowlist), so the live run POSTed these via a connected Chrome (same-origin
# fetch to /rest/v1/resources with the public anon key — each HTTP 201).
# This script is the device-side replay using the insert helper; run only if the
# shell later gains Supabase egress. Each call prints "Resource draft queued OK".
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-resource-draft.mjs '{
  "title": "Adaptation Gap Report 2026",
  "meta":  "Report · UNEP · 2026",
  "url":   "https://www.unep.org/en/publications/report/adaptation-gap-report-2026",
  "by":    "United Nations Environment Programme",
  "kind":  "WEB"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "Loss and Damage from Climate Change in the IGAD Region Assessment Report",
  "meta":  "Report · IGAD / ICPAC · 2026",
  "url":   "https://caep.igad.int/wp-content/uploads/2020/07/IGAD-LD-from-Climate-Change-Assessment-Report_2026.pdf",
  "by":    "Intergovernmental Authority on Development (IGAD)",
  "kind":  "PDF"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "Towards Anticipatory Disaster Risk Financing and Index Insurance Mechanisms for Resilience Building in Eastern Africa",
  "meta":  "Report · ICPAC · 2026",
  "url":   "https://www.icpac.net/documents/1069/Towards_Anticipatory_Disaster_Risk_Financing.pdf",
  "by":    "IGAD Climate Prediction and Applications Centre (ICPAC)",
  "kind":  "PDF"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "Unlocking a Just Transition in Kenya: Policy Gaps, Opportunities and Global Support",
  "meta":  "Policy brief · Climate Strategies / CECG · 2026",
  "url":   "https://www.efdinitiative.org/publications/unlocking-just-transition-kenya-policy-gaps-opportunities-and-global-support",
  "by":    "Climate Strategies (CECG)",
  "kind":  "WEB"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "I-CAN Policy Brief: Unlocking Kenya'"'"'s Potential for Health, Resilience, and Inclusive Growth",
  "meta":  "Policy brief · GAIN · 2026",
  "url":   "https://www.gainhealth.org/resources/reports-and-publications/i-can-policy-brief-unlocking-kenyas-potential-health-resilience",
  "by":    "Global Alliance for Improved Nutrition (GAIN)",
  "kind":  "WEB"
}'
