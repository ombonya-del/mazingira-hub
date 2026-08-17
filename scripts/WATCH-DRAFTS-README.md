# Opportunities & Events review queue (watcher → admin → hub)

Replaces the old flow (watcher writes a markdown list → admin retypes it into the
Exchange "Upload a resource" form). Now the weekly watchers **queue drafts straight
into the admin console**, where an admin previews each item inline and clicks
**Accept** (publishes to the hub) or **Reject** (discards). Modelled on the existing
Narrative-disinfo review flow.

## Flow

```
Weekly watcher  ──insert draft (published=false)──►  Supabase
                                                        │
                          admin → "Opportunities review" / "Events review"
                                    inline preview  ·  Accept / Reject
                                                        │
                        Accept → published=true ──►  hub Opportunities tab / calendar
                        Reject → row deleted
```

Nothing is ever public until an admin accepts: public read requires `published=true`;
anon/scripts may only INSERT `published=false`; only a signed-in admin (`is_admin()`)
can read drafts and flip them live. Only the public anon key is used — no secret.

## One-time setup

Run `supabase/watch-drafts.sql` once in Supabase → SQL Editor (project
`uueemckdoozsuowcqkhl`). It adds the `source` column and the draft-insert RLS
policies. Safe to re-run.

## How the watchers queue drafts

**Opportunities** — one call per verified item:

```bash
node scripts/insert-opportunity-draft.mjs '{
  "title": "Young Innovators Challenge 2026 (YIC)",
  "meta":  "Challenge · KCDF & I&M Foundation · closes 31 Aug 2026",
  "url":   "https://kcdf.or.ke/our-focus-areas/community-led-development/environmentalist-innovative-challenge-yeic",
  "by":    "Kenya Community Development Foundation"
}'
```

**Events** — one call per verified item:

```bash
node scripts/insert-event-draft.mjs '{
  "title":       "Africa Climate Week 2026",
  "start_date":  "2026-09-14",
  "time":        "09:00",
  "location":    "Nairobi",
  "mode":        "Hybrid",
  "org":         "UNFCCC",
  "link":        "https://unfccc.int/...",
  "description": "Regional climate dialogue and thematic sessions."
}'
```

Each successful call prints `… draft queued OK — awaiting admin review`.

## Wiring it into the recurring tasks

In the Opportunities Watch and Events Watch task instructions, after the verify step,
replace "write the markdown list / await manual form entry" with a step that calls the
matching script once per verified item. The markdown file (`OPPORTUNITIES-REVIEW.md` /
`EVENTS-REVIEW.md`) can still be written as a human-readable log, but publishing now
happens through the admin Accept/Reject queue rather than the Exchange upload form.

## Admin

`admin/index.html` gains two Publishing-group tabs — **Opportunities review** and
**Events review** — each showing pending drafts as inline cards with Accept / Edit /
Reject and a live count badge.
