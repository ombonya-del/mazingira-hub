# Manual uploads — Supabase setup (one-time)

Lets allow-listed editors publish to the **Community Pulse** and **Narrative Disinfo**
feeds from the admin dashboard, securely (magic-link sign-in + row-level security).
The hub falls back to the built-in cards until the tables have rows, so nothing breaks
before this is done.

## 1. Create the tables + security
Supabase → **SQL Editor** → paste and run [`manual-uploads.sql`](./manual-uploads.sql).
Edit the last block to list every editor's email before running (or re-run to add more).

## 2. Turn on magic-link sign-in
Supabase → **Authentication → Providers → Email** → enable **Email**, and turn ON
"Email OTP / magic link". (No password needed — editors get a one-time link.)

## 3. Point the sign-in link back to admin
Supabase → **Authentication → URL Configuration**:
- **Site URL:** `https://admin.mazingirakenya.org`
- **Redirect URLs:** add `https://admin.mazingirakenya.org` and
  `https://admin.mazingirakenya.org/**`

## 4. Use it
Open **admin.mazingirakenya.org** → **Manual upload** → enter your (allow-listed) email →
click the link in your inbox → you're signed in. Paste an X post URL, fill the fields,
choose **Pulse** or **Disinfo**, and **Publish**. It appears at the top of the live feed
on the next load (the hub reads the newest 6, then fills with the built-in cards).

## Notes
- The public **anon key** in the client can only *read published rows* — it cannot write.
  Writes require a signed-in session whose email is in the `admins` table (RLS enforces this).
- Set `published = false` to stage a draft that won't show publicly.
- This does not touch the existing prototype passcode gate on the rest of the admin console.
