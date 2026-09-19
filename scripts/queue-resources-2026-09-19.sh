#!/usr/bin/env bash
# MazingiraKenya — Resources Watch queue (run 2026-09-19)
# Queues verified NEW climate / environmental-justice knowledge resources as
# DRAFTS (published=false) into Supabase for admin Accept/Reject in
# admin -> Resources review. Uses the public anon key only (see
# scripts/insert-resource-draft.mjs). Re-running is safe but will create
# duplicate drafts — this file is a record of what this run queued.
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-resource-draft.mjs '{"title":"State of the Climate in Africa 2024","meta":"Report · WMO · 2024","url":"https://wmo.int/publication-series/state-of-climate-africa-2024","by":"World Meteorological Organization","kind":"WEB"}'

node scripts/insert-resource-draft.mjs '{"title":"Adaptation Gap Report 2024: Come hell and high water","meta":"Report · UNEP · 2024","url":"https://www.unep.org/resources/adaptation-gap-report-2024","by":"UN Environment Programme","kind":"WEB"}'

node scripts/insert-resource-draft.mjs '{"title":"Emissions Gap Report 2024: No more hot air … please!","meta":"Report · UNEP · 2024","url":"https://www.unep.org/resources/emissions-gap-report-2024","by":"UN Environment Programme","kind":"WEB"}'

node scripts/insert-resource-draft.mjs '{"title":"Climate Change Laws of the World — Kenya","meta":"Database · Grantham Institute, LSE · updated 2026","url":"https://climate-laws.org/geographies/kenya","by":"Grantham Research Institute (LSE) & Climate Policy Radar","kind":"WEB"}'

node scripts/insert-resource-draft.mjs '{"title":"Mission 300: Building Just Transition Pathways Through Kenya'\''s National Energy Compact","meta":"Policy brief · Power Shift Africa · 2026","url":"https://www.powershiftafrica.org/publications/mission-300-building-just-transition-pathways-kenya-compact","by":"Power Shift Africa","kind":"WEB"}'

node scripts/insert-resource-draft.mjs '{"title":"Pipe Dreams: How Oil and Gas Fail to Deliver Economic Development in Africa","meta":"Report · Power Shift Africa · 2026","url":"https://www.powershiftafrica.org/publications/pipe-dreams-how-oil-and-gas-fail-to-deliver-economic-development-for-africa-254","by":"Power Shift Africa","kind":"WEB"}'

node scripts/insert-resource-draft.mjs '{"title":"Clean Cooking in Sub-Saharan Africa","meta":"Policy brief · Power Shift Africa · 2026","url":"https://www.powershiftafrica.org/publications/clean-cooking-in-sub-saharan-africa","by":"Power Shift Africa","kind":"WEB"}'

node scripts/insert-resource-draft.mjs '{"title":"Africa Forward: Africa-France Partnership for Innovation and Growth","meta":"Policy brief · Power Shift Africa · 2026","url":"https://www.powershiftafrica.org/publications/africa-forward-summit-policy-brief","by":"Power Shift Africa","kind":"WEB"}'

echo "Queued 8 resource drafts — awaiting admin review."
