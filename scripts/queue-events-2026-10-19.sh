#!/usr/bin/env bash
# Reproducible record — Events Watch run 2026-10-19 (MazingiraKenya).
# 3 NEW verified, future-dated events queued as DRAFTS (published=false, source=watch).
# These were written straight to Supabase via the connected-Chrome write path this run
# (the Mac device-bridge shell could not reach Supabase — proxy blocked the host: curl -> HTTP 000).
# Re-running these inserts from a machine WITH Supabase network access is safe (admin can Reject duplicates).
# Nothing is public until an admin Accepts in admin -> Events review.
set -euo pipefail
cd "$(dirname "$0")/.."

node scripts/insert-event-draft.mjs '{"title":"Global Youth Summit for Climate Change 2026","start_date":"2026-12-15","time":"15–18 Dec 2026","location":"Nairobi, Kenya (UNEP HQ / Nairobi National Park field visit)","mode":"In person","org":"UNITAR United Nations Immersion Programmes & YCDP","link":"https://unitar.org/sustainable-development-goals/multilateral-diplomacy/our-portfolio/immersion-programmes/global-youth-summit-climate-change","description":"Four-day UNITAR youth immersion summit in Nairobi for leaders, activists and professionals aged 18–35 on climate action, multilateral diplomacy and SDGs."}'

node scripts/insert-event-draft.mjs '{"title":"5th African Symposium on Climate Change Adaptation","start_date":"2027-02-18","time":"18–19 Feb 2027","location":"Addis Ababa University, Addis Ababa, Ethiopia","mode":"In person","org":"HAW Hamburg & Addis Ababa University (Prof. Walter Leal / Prof. Desalegn Ayal)","link":"https://www.haw-hamburg.de/detail/news/news/show/5th-african-symposium-on-climate-change-adaptation/","description":"Pan-African symposium on climate change adaptation — food security, water resources and urban resilience; knowledge exchange, capacity building and policy engagement."}'

node scripts/insert-event-draft.mjs '{"title":"Africa Energy Indaba 2027 (19th edition)","start_date":"2027-03-02","time":"2–4 Mar 2027","location":"Cape Town International Convention Centre (CTICC), Cape Town, South Africa","mode":"In person","org":"Africa Energy Indaba","link":"https://africaenergyindaba.com/","description":"Africa premier energy event — mobilising capital for energy access, advancing renewables, grid resilience and cross-border power trade across the continent."}'

echo "Done — 3 event drafts queued (published=false). Review in admin -> Events review."
