#!/usr/bin/env bash
# MazingiraKenya — Resources Watch queue (run 2026-09-29, weekly task)
# 4 genuinely NEW, verified climate/environmental-justice knowledge resources,
# deduped against all 19 items already in RESOURCES-REVIEW.md, queued as DRAFTS
# (published=false, source=watch, category=Resources) for admin Accept/Reject in
# admin -> Resources review. The Mac device shell still cannot reach Supabase
# (curl 56 / proxy 403 — host not on device egress allowlist); the 4 inserts were
# made through a connected Chrome (same-origin POST to /rest/v1/resources, public
# anon key only). Each returned HTTP 201. This script is the node-based replay for
# an environment that CAN reach Supabase.
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-resource-draft.mjs '{"title": "State of the Climate in Africa 2025", "meta": "Report · WMO · 2026", "url": "https://wmo.int/resources/publication-series/state-of-climate-africa/state-of-climate-africa-2025", "by": "World Meteorological Organization", "kind": "WEB"}'

node scripts/insert-resource-draft.mjs '{"title": "Kenya'\''s Second Nationally Determined Contribution (2031–2035)", "meta": "Policy · Government of Kenya (UNFCCC) · 2025", "url": "https://unfccc.int/sites/default/files/2025-05/KENYAS%20SECOND%20NATIONALLY%20DETERMINED%20CONTRIBUTION%202031_2035.pdf", "by": "Ministry of Environment, Climate Change and Forestry, Kenya", "kind": "PDF"}'

node scripts/insert-resource-draft.mjs '{"title": "Adaptation Finance Flows to Africa — State and Future Trends", "meta": "Report · Global Center on Adaptation & Climate Policy Initiative · 2025", "url": "https://gca.org/reports/adaptation-finance-flows-to-africa-state-and-future-trends/", "by": "Global Center on Adaptation & CPI", "kind": "WEB"}'

node scripts/insert-resource-draft.mjs '{"title": "Climate Risk Index 2026", "meta": "Report · Germanwatch · 2025", "url": "https://www.germanwatch.org/en/cri", "by": "Germanwatch", "kind": "WEB"}'

echo "Queued 4 resource drafts — awaiting admin review."
