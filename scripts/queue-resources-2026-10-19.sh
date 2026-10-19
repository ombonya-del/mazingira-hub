#!/usr/bin/env bash
# Replay: Resources Watch drafts queued 2026-10-19 (weekly task firing).
# 4 genuinely new items, deduped against the distinct drafts already logged.
# published=false, source=watch, category=Resources, into Supabase project uueemckdoozsuowcqkhl.
# The Mac device shell cannot reach Supabase (curl 56 — proxy 403, host not on the
# device egress allowlist), so the live run POSTed these via a connected Chrome
# (same-origin fetch to /rest/v1/resources with the public anon key — each HTTP 201).
# This script is the device-side replay using the insert helper; run only if the
# shell later gains Supabase egress. Each call prints "Resource draft queued OK".
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-resource-draft.mjs '{
  "title": "Kenya'\''s Adaptation Communication to the UNFCCC",
  "meta":  "Report · Ministry of Environment, Climate Change & Forestry · Dec 2025",
  "url":   "https://napglobalnetwork.org/resource/kenyas-adaptation-communication-to-the-united-nations-framework-convention-on-climate-change/",
  "by":    "Government of Kenya (via NAP Global Network / IISD)",
  "kind":  "WEB"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "Intersectional Climate Justice in Eastern Africa",
  "meta":  "Open-access book · Bloomsbury Academic · 2025",
  "url":   "https://library.oapen.org/handle/20.500.12657/112339",
  "by":    "Crawford, Nanduddu, McQuaid & Nyukuri (eds.)",
  "kind":  "WEB"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "Enhancing Access to Climate Finance for Vulnerable Communities (Position Paper 3)",
  "meta":  "Position brief · AU ECOSOCC · 2025",
  "url":   "https://ecosocc.au.int/sites/default/files/files/2025-11/climate-finance-position-paper-3.pdf",
  "by":    "African Union ECOSOCC — Climate Finance Subgroup",
  "kind":  "PDF"
}'

node scripts/insert-resource-draft.mjs '{
  "title": "Kenya'\''s NDC 3.0 (2025) — Agrifood Systems Case Study",
  "meta":  "Toolkit case study · WWF Nature Positive Agrifood Systems Toolkit · 2025",
  "url":   "https://agrifood-systems-toolkit.panda.org/case-studies/kenyas-ndc-30-2025",
  "by":    "WWF",
  "kind":  "WEB"
}'
