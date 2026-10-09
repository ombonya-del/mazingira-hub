#!/usr/bin/env bash
# Replay: Resources Watch drafts queued 2026-10-09 (published=false, source=watch,
# category=Resources) into Supabase project uueemckdoozsuowcqkhl.
# The Mac device shell cannot reach Supabase (proxy 403 — host not on the device
# egress allowlist), so the live run POSTed these via a connected Chrome
# (same-origin fetch to /rest/v1/resources with the public anon key). This script
# is the device-side replay using the same insert helper; run only if the shell
# later gains Supabase egress. Each call prints "Resource draft queued OK".
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-resource-draft.mjs '{
  "title": "Kenya'\''s First Biennial Transparency Report (BTR1) to the UNFCCC",
  "meta":  "Report · Government of Kenya · 2024",
  "url":   "https://alliancebioversityciat.org/publications-data/kenyas-first-biennial-transparency-report-btr-first-btr-united-nations-framework",
  "by":    "Government of Kenya",
  "kind":  "WEB"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "Africa Civil Society Position Paper for COP30",
  "meta":  "Position paper · CAN Africa · 2025",
  "url":   "https://can-africa.org/wp-content/uploads/2025/11/Africa-CSOs_COP30-Position-Paper.pdf",
  "by":    "Climate Action Network Africa (CAN Africa)",
  "kind":  "PDF"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "Road to Belem: Key Takeaways and Main Outcomes of COP29 and the Road to COP30",
  "meta":  "Report · AU ECOSOCC · 2025",
  "url":   "https://ecosocc.au.int/en/documents/2025-11-12/road-belem",
  "by":    "African Union ECOSOCC",
  "kind":  "WEB"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "Greater Horn of Africa Climate Outlook — October–December (OND) 2026 Season",
  "meta":  "Seasonal climate outlook · ICPAC (IGAD) · 2026",
  "url":   "https://www.icpac.net/news/the-greater-horn-of-africa-is-expected-to-experience-a-wetter-than-normal-october-december-ond-2026-season-as-el-ni%C3%B1o-strengthens/",
  "by":    "IGAD Climate Prediction and Applications Centre (ICPAC)",
  "kind":  "WEB"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "Operationalizing the Loss and Damage Fund: learning from the intended beneficiaries",
  "meta":  "Report · SEI & ICCCAD · 2023",
  "url":   "https://www.sei.org/publications/operationalizing-loss-and-damage-fund-for-beneficiaries/",
  "by":    "Stockholm Environment Institute (SEI)",
  "kind":  "WEB"
}'
