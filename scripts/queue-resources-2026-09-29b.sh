#!/usr/bin/env bash
# MazingiraKenya — Resources Watch SUPPLEMENTARY queue (run 2026-09-29b)
# A concurrent firing of the same weekly task (session_013f5xxB, commit bb1e638)
# committed the canonical 2026-09-29 run of 8 items while THIS session (013uusXk)
# was mid-run. This session had independently queued 4 drafts to Supabase; 3 of them
# (WMO State of the Climate in Africa 2025, Kenya's Second NDC 2031-2035, Climate
# Risk Index 2026) DUPLICATE items in bb1e638 — the admin should Reject one copy of
# each duplicate pair in admin -> Resources review. Only the 1 item below was NOT in
# bb1e638. It was queued as a DRAFT (published=false, source=watch) via connected
# Chrome (HTTP 201). This script is the node-based replay for that 1 unique item.
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-resource-draft.mjs '{"title": "Adaptation Finance Flows to Africa — State and Future Trends", "meta": "Report · Global Center on Adaptation & Climate Policy Initiative · 2025", "url": "https://gca.org/reports/adaptation-finance-flows-to-africa-state-and-future-trends/", "by": "Global Center on Adaptation & CPI", "kind": "WEB"}'

echo "Queued 1 supplementary resource draft (Adaptation Finance Flows to Africa) — awaiting admin review."
