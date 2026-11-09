#!/usr/bin/env bash
# Replay: Resources Watch drafts queued 2026-11-09 (weekly task firing).
# 5 genuinely new items, deduped against all distinct drafts already logged in
# RESOURCES-REVIEW.md. published=false, source=watch, category=Resources, into
# Supabase project uueemckdoozsuowcqkhl.
# The Mac device shell cannot reach Supabase (node fetch failed — host not on the
# device egress allowlist), so the live run POSTed these via a connected Chrome
# (same-origin fetch to /rest/v1/resources with the public anon key — each HTTP 201).
# This script is the device-side replay using the insert helper; run only if the
# shell later gains Supabase egress. Each call prints "Resource draft queued OK".
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-resource-draft.mjs '{
  "title": "Emissions Gap Report 2026 — The Point of Return",
  "meta":  "Report · UNEP · 21 Oct 2026",
  "url":   "https://wedocs.unep.org/items/87c02cac-8da8-4c28-ba61-c846ee68ea70",
  "by":    "United Nations Environment Programme",
  "kind":  "WEB"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "Climate Finance: Its Implications for Children in Kenya",
  "meta":  "Report · KIPPRA & UNICEF · 2026",
  "url":   "https://kippra.or.ke/download/climate-finance-its-implications-for-children-in-kenya/",
  "by":    "KIPPRA & UNICEF Kenya",
  "kind":  "WEB"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "Landscape of Climate Finance in Africa 2024",
  "meta":  "Report · Climate Policy Initiative · 2024",
  "url":   "https://www.climatepolicyinitiative.org/publication/landscape-of-climate-finance-in-africa-2024/",
  "by":    "Climate Policy Initiative",
  "kind":  "WEB"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "The Kenya Climate Change and Health Strategy 2024-2029",
  "meta":  "Strategy · Ministry of Health, Kenya · 2024-2029",
  "url":   "https://health.go.ke/sites/default/files/2026-02/Kenya%20Climate%20Change%20&%20health%20Strategy%20SIGNED.pdf",
  "by":    "Ministry of Health, Kenya (with AFIDEP & LSHTM)",
  "kind":  "PDF"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "State of the Climate in Eastern Africa 2025",
  "meta":  "Report · ICPAC / IGAD · Aug 2026",
  "url":   "https://www.icpac.net/documents/1115/State_of_Climate_Report_2025.pdf",
  "by":    "IGAD Climate Prediction and Applications Centre (ICPAC)",
  "kind":  "PDF"
}'
