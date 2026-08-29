# Scheduled Tasks — Recovery & Inventory

_Rebuilt 2026-08-21. Covers all four CMT projects: MazingiraKenya, FemSaidia, ImaarishaSRHR, Nairobi 2055._

There are **two layers** of scheduled work in this ecosystem. They fail and get
rebuilt in completely different ways, so keep them straight.

---

## Layer 1 — Infrastructure crons (GitHub Actions)

These live **in each repo** under `.github/workflows/`. They POST to Supabase edge
functions on a fixed schedule. They were **never lost** — the YAML files are all
present. Their real failure mode is that **GitHub auto-disables a scheduled workflow
after 60 days with no repo commits**, and these files date to ~February 2026, so they
have almost certainly gone dormant. That matches the "scanner keeps going stale" note
in `femsaidiakenya/SCHEDULER-SETUP.md`.

| Project | Workflow | What it does | Schedule (UTC) | Schedule (EAT) |
|---|---|---|---|---|
| FemSaidia | `intel-pipeline.yml` → rss-scanner | RSS scan → Socials & Sentiment | `15 */2 * * *` | every 2h at :15 |
| FemSaidia | `intel-pipeline.yml` → health-check | status email + auto-fix stale pipeline | `0 */6 * * *` | every 6h |
| FemSaidia | `intel-pipeline.yml` → intel-brief | biweekly brief draft | `0 6 1,15 * *` | 1st & 15th, 09:00 |
| FemSaidia | `generate-brief.yml` | render brief PDF (event-driven, on publish) | on dispatch | — |
| ImaarishaSRHR | `radar.yml` | SRHR disinfo radar + Narrative Index | `20 */3 * * *` | every 3h at :20 |
| ImaarishaSRHR | `imara-scanner.yml` | Imara TV → Ukweli Learn | `40 */6 * * *` | every 6h at :40 |
| ImaarishaSRHR | `opportunity-scanner.yml` | SRHR opportunities → Opportunity Desk | `30 6 * * 1,4` | Mon & Thu 09:30 |
| ImaarishaSRHR | `resource-scanner.yml` | SRHR knowledge resources → Exchange | `0 5 * * 1` | Mon 08:00 |
| ImaarishaSRHR | `ingest-resources.yml` | host/watermark resource PDFs | `0 4 * * 1` | Mon 07:00 |
| Nairobi 2055 | `pages.yml` | deploy site on push | on push | — |

### Re-arming Layer 1

An empty commit is **not** enough to wake an already-disabled workflow — GitHub
requires an explicit re-enable. For each repo, either click **Actions → (workflow) →
"Enable workflow"**, or run the helper script `rearm-github-scanners.sh` (uses the
`gh` CLI). After re-enabling, the regular commits from the scanners themselves keep
the 60-day clock from expiring again.

> More reliable long-term option, already documented in `femsaidiakenya/SCHEDULER-SETUP.md`:
> move the FemSaidia rss-scanner + health-check to an external uptime cron
> (cron-job.org / UptimeRobot) that pings the Supabase function URLs. That is
> independent of GitHub's best-effort scheduler and also keeps the Supabase project warm.

---

## Layer 2 — Browser-based Claude scheduled tasks  ✅ REBUILT

These lived in the **Cowork/Claude account**, not in any repo, so when that earlier
session was lost they vanished with it. They exist because the paid X API is disabled
(402), so the X-derived feeds are refreshed by a Claude session using the browser
instead. Your own code comments point right at them (`x-poller.yml`, `voices.yml`,
`WATCH-DRAFTS-README.md`).

All five below were **recreated as durable scheduled tasks on 2026-08-21** and first
run **Monday 2026-08-24**. Each runs as a fresh weekly cloud session that researches
via web/browser, writes a ready-to-run queue script into the repo, runs it against
your Mac when connected, and notifies you (push + email). Everything is queued as a
**draft** (`published=false` / `active=false`) for your admin Accept/Reject — nothing
is ever auto-published except Nairobi Voices, which auto-publishes by design.

| Task | Project | Runs (EAT) | Queues into |
|---|---|---|---|
| FemSaidia — Weekly X Sentiment + MOTD sweep | femsaidiakenya | Mon 09:00 | `misogyny_highlights` (active=false), `sentiment_articles` |
| Nairobi 2055 — Weekly Voices refresh | nairobi2055.org | Mon 10:00 | `voices-auto.json` (auto-publishes) |
| MazingiraKenya — Weekly Opportunities Watch | mazingira-hub | Mon 11:00 | opportunity drafts (published=false) |
| MazingiraKenya — Weekly Events Watch | mazingira-hub | Mon 11:30 | event drafts (published=false) |
| MazingiraKenya — Weekly Narrative-Disinfo Scan | mazingira-hub | Mon 12:00 | disinfo drafts (published=false) |

Trigger IDs (for editing later):

- `trig_016fWZMUZem14PkUtjGBBzSJ` — FemSaidia X Sentiment + MOTD
- `trig_01NMuQEnBKWEv1opmtA7CWbo` — Nairobi 2055 Voices
- `trig_01CemekNM76X5LfSCbk3Zaf2` — Mazingira Opportunities
- `trig_01RwmA1DnXKZqUt78KP76xyX` — Mazingira Events
- `trig_01NiAANKTUoJ8XbhRiCcatcK` — Mazingira Narrative-Disinfo

---

## Why the loss happened (so it doesn't again)

The trigger for all of this was advice to delete a folder "to free space in the
workspace VM." That was wrong: the workspace VM's scratch disk is **completely
separate** from your Mac and your projects. Freeing space should only ever touch
caches, build artifacts, and temp files inside that sandbox — never source folders,
git repos, or working files.

The Layer-2 tasks were separately fragile because they were created with a
**non-durable in-session scheduler**, which is discarded when the session ends. The
rebuilt versions above use the **durable** scheduled-task system, so they persist
across sessions and show up in your scheduled-tasks list.
