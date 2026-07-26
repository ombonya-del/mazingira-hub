# MazingiraKenya — Supabase setup (Pipeline 1 + sentiment + narrative AI)

This kit makes the dashboards read/write a real database. It covers the deferred **content +
sentiment** work *and* the new **narrative-disinfo AI** pipeline.

## The only things you MUST do yourself
1. **Create the project** at supabase.com (I can't create accounts).
2. **Run the schema** — paste `supabase-schema.sql` into the dashboard SQL Editor, click Run.
3. **Send me the Project URL + anon key** — both are *public* (they belong in the HTML), so it's
   safe to share. **I'll wire all three dashboards to read from the database** — you don't touch
   any HTML/JS.

That's the whole "reads" tier: live data everywhere, with **no terminal, no cron, no edge
functions**. Everything below (the scanner + the AI drafter) is optional and can come later.

For the AI parts, one extra thing that's genuinely yours: a **Claude API key**
(console.anthropic.com) — a real secret you paste into Supabase's function env and never share.

> Cron and the CLI are **not required**. The scanner can run on-demand, or on a **Schedule**
> toggle in the Supabase dashboard (clicks, not SQL). The two functions can be pasted into the
> dashboard's **function editor** instead of using a terminal.

Files in this kit:
- `supabase-schema.sql` — tables + row-level security
- `draft-rebuttal.ts` — edge function: Claude drafts a grounded rebuttal for review
- `scan-sentiment.ts` — edge function: RSS scanner + stance scoring (the "radar")

---

## 1. Create the project (you)
1. supabase.com → **New project** (free tier is fine). Pick a region near Kenya (eu-central works).
2. **Project Settings → API**: copy the **Project URL** and the **anon public** key. Keep the
   **service_role** key secret.

## 2. Create the schema (you, 30 seconds)
Supabase dashboard → **SQL Editor** → paste all of `supabase-schema.sql` → **Run**. That creates
the tables and the RLS policies (anon can read published content and insert submissions, but
never read the PII table).

## 3. Seed the content you already have (optional now)
The issues / Big Questions / myths / classic-disinfo currently live in the HTML. When ready,
insert them into `issues` / `bigq` / `myths` / `classic_disinfo` (same trilingual `{en,sw,sh}`
shape). Until then, the frontend can keep its in-file copies — nothing breaks.

## 4. Deploy the edge functions — ONLY for the scanner + AI drafter (optional)
Reads don't need this. When you want the scanner/AI: either paste the two `.ts` files into the
Supabase dashboard's **Edge Functions → new function** editor and deploy (no terminal), or use
the CLI:
```
supabase login
supabase link --project-ref <your-ref>
mkdir -p supabase/functions/draft-rebuttal supabase/functions/scan-sentiment
cp draft-rebuttal.ts supabase/functions/draft-rebuttal/index.ts
cp scan-sentiment.ts supabase/functions/scan-sentiment/index.ts
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...      # your Claude API key — stays server-side
supabase functions deploy draft-rebuttal
supabase functions deploy scan-sentiment
```

## 5. Schedule the scanner (OPTIONAL — you never need to touch cron)
Easiest: don't. Run `scan-sentiment` on demand (a button, or when the Sentiment tab opens). If
you want it automatic, use the dashboard **Schedule** toggle on the function. The SQL below is
only if you prefer `pg_cron`:
```sql
select cron.schedule('scan-sentiment','0 */6 * * *', $$
  select net.http_post(
    url:='https://<ref>.functions.supabase.co/scan-sentiment',
    headers:='{"Authorization":"Bearer <anon-or-service-key>"}'::jsonb) $$);
```

## 6. Wire the frontends (drop-in, ~15 lines)
At the top of each `index.html` script, add the client (anon key only):
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const sb = supabase.createClient("https://<ref>.supabase.co", "<anon-public-key>");
</script>
```
Then swap a mock array for a live read. Example — the sentiment feed on the hub:
```js
async function loadSentimentFeed(){
  const { data } = await sb.from("sentiment_items")
    .select("source,title,url,stance").order("published_at",{ascending:false}).limit(8);
  document.querySelector(".sent-feed").innerHTML = (data||[]).map(function(i){
    return '<a class="sf-item" href="'+i.url+'" target="_blank" rel="noopener noreferrer">'
      + '<span class="sf-src">'+i.source+'</span><span class="sf-h">'+i.title+'</span>'
      + '<span class="sf-tag '+({supportive:"pos",neutral:"neu",critical:"neg"}[i.stance])+'">'+i.stance+'</span></a>';
  }).join("");
}
loadSentimentFeed();
```
The render functions don't change — you only replace where the data comes from. Do the same for
`issues`, `classic_disinfo`, `narrative_items`/`rebuttals` (raia reads `published` + `rebuttals`
where `status='published'`).

## 7. The narrative-AI loop, live
1. The scanner (or a manual insert) adds a row to `narrative_items`.
2. Call `draft-rebuttal` with `{ "narrative_id": "<id>" }` → Claude drafts a **grounded** rebuttal
   from your own evidence and stores it in `rebuttals` as `pending` (or returns "insufficient →
   needs a human" instead of inventing).
3. A moderator opens the admin queue (the prototype's Review modal), checks the draft + its cited
   sources, and **Approves** → set `rebuttals.status='published'` and insert a row into `published`
   (surface `raia`, the matching `issue_slug`).
4. raia reads `published` + `rebuttals` and shows the debunk on the issue page, in the Trending-lies
   feed, and as a shareable card.

## Security checklist
- Only the **anon** key is in the HTML. `service_role` + `ANTHROPIC_API_KEY` live in function env.
- RLS is the perimeter: anon can't read `submissions` (PII).
- Put **admin.mazingirakenya.org** behind Vercel/Cloudflare Access on top of Supabase Auth.
- Add Cloudflare Turnstile to public write forms before launch.
- Sensitive rebuttals (`risk_tier='sensitive'`) never auto-publish — human sign-off required.

> Keep this `supabase/` folder OUT of the deployed web root (it's for the CLI, not the browser).
> If it sits in the hub repo, add `supabase` to a `.vercelignore` for the hub project.
