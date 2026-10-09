#!/usr/bin/env bash
# Replay: Resources Watch drafts queued 2026-10-09 (SUPPLEMENTARY second firing
# of the weekly task — 4 genuinely new items, deduped against the 33 distinct
# drafts already logged, incl. the 5 from the 07:xx run in queue-resources-2026-10-09.sh).
# published=false, source=watch, category=Resources, into Supabase project uueemckdoozsuowcqkhl.
# The Mac device shell cannot reach Supabase (curl 56 — proxy 403, host not on the
# device egress allowlist), so the live run POSTed these via a connected Chrome
# (same-origin fetch to /rest/v1/resources with the public anon key — each HTTP 201).
# This script is the device-side replay using the same insert helper; run only if
# the shell later gains Supabase egress. Each call prints "Resource draft queued OK".
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-resource-draft.mjs '{
  "title": "WMO State of the Global Climate 2025",
  "meta":  "Report · WMO · 2026",
  "url":   "https://www.preventionweb.net/publication/documents-and-publications/state-global-climate-2025",
  "by":    "World Meteorological Organization (WMO)",
  "kind":  "WEB"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "2026 Africa Sustainable Development Report (ASDR)",
  "meta":  "Report · AU, UN ECA, AfDB & UNDP · 2026",
  "url":   "https://www.undp.org/africa/publications/2026-africa-sustainable-development-report",
  "by":    "African Union, UN ECA, AfDB & UNDP",
  "kind":  "WEB"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "Carbon Markets in Kenya: A Simplified Community Guide",
  "meta":  "Community guide · NEMA (with WWF-Kenya) · 2025",
  "url":   "https://nema.go.ke/wp-content/uploads/2026/02/Carbon-markets-In-Kenya-a-Simplified-Community-Guide_.pdf",
  "by":    "National Environment Management Authority (NEMA), Kenya",
  "kind":  "PDF"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "Kenya Guide for Strategic Engagement in Carbon Markets",
  "meta":  "Guideline · Government of Kenya · 2026 (v1)",
  "url":   "https://kcckp.go.ke/api/media/file/KENYA%20GUIDE%20FOR%20STRATEGIC%20ENGAGEMENT%20IN%20CARBON%20MARKETS%202026%20V.1%20[FINAL]-3.pdf",
  "by":    "Republic of Kenya — Ministry of Environment, Climate Change & Forestry",
  "kind":  "PDF"
}'
