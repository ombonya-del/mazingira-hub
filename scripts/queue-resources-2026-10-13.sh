#!/usr/bin/env bash
# Replay: Resources Watch drafts queued 2026-10-13 (weekly task firing).
# 3 genuinely new items, deduped against the 37 distinct drafts already logged.
# published=false, source=watch, category=Resources, into Supabase project uueemckdoozsuowcqkhl.
# The Mac device shell cannot reach Supabase (curl 56 — proxy 403, host not on the
# device egress allowlist), so the live run POSTed these via a connected Chrome
# (same-origin fetch to /rest/v1/resources with the public anon key — each HTTP 201).
# This script is the device-side replay using the insert helper; run only if the
# shell later gains Supabase egress. Each call prints "Resource draft queued OK".
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-resource-draft.mjs '{
  "title": "New Data for Africa'\''s Changing Climate: Mapping Risks, Readiness and Policy Action",
  "meta":  "Report · OECD & World Bank · 2026",
  "url":   "https://www.oecd.org/en/publications/new-data-for-africa-s-changing-climate_27d083ca-en.html",
  "by":    "OECD & World Bank",
  "kind":  "WEB"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "Building Forests and Farms: Accelerating Tree Adoption for Climate and Livelihood Gains (PB017)",
  "meta":  "Policy brief · KIPPRA · 2025/26",
  "url":   "https://kippra.or.ke/download/building-forests-and-farms-accelerating-tree-adoption-for-climate-and-livelihood-gains-pb017/",
  "by":    "Kenya Institute for Public Policy Research and Analysis (KIPPRA)",
  "kind":  "WEB"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "African Leaders'\'' Addis Ababa Declaration on Climate Change and Call to Action",
  "meta":  "Declaration · African Union (ACS2) · Sept 2025",
  "url":   "https://au.int/sites/default/files/pressreleases/45673-pr-Climate_Change_Declaration.pdf",
  "by":    "African Union — Second Africa Climate Summit (ACS2)",
  "kind":  "PDF"
}'
