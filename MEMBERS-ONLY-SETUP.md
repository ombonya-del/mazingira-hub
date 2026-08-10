# MazingiraKenya Hub — Members-only setup

The hub (`hub.mazingirakenya.org`) is now gated behind Supabase Auth. Members sign in
with **a magic link OR a password**, and access is **invite-only**. raia stays public;
admin keeps its own gate. This file is the one-time Supabase configuration.

## How the gate behaves
- Every real host is gated; `file://` and `localhost` stay open for development.
- Add `?gate=1` to any URL to preview the gate. There is **no production bypass** (by design).
- On sign-in the session persists in the browser; **Sign out** (footer) clears it.

> ⚠️ **Do step 2 (invite yourself) BEFORE relying on the deployed gate.** Because sign-ups
> are invite-only, if no users exist yet, nobody — including you — can sign in. Create your
> own user in Supabase first, then deploy / test. If you ever get locked out, the fix is in
> Supabase (invite the user), not in the app.
- The magic-link button calls `signInWithOtp({ shouldCreateUser:false })`, so an email
  that isn't already a member is rejected ("not on the members list").

## 1. Turn OFF public sign-ups (makes it invite-only)
Supabase dashboard → **Authentication → Sign In / Providers** (or **Settings**) →
disable **"Allow new users to sign up"**. Now only users you create can get in.

## 2. Add each member (invite-only — only admins do this)

Two things are different and easy to confuse:
- **Adding a member** = creating their account (an admin action). Below.
- **Signing in** = how a member gets in once they exist → **magic link OR password** (§ "How the gate behaves").

Magic link is fully available — as the **sign-in** method (the hub's "Email me a sign-in
link"). It is *not* a way to self-invite: `shouldCreateUser:false` means an email that
isn't already a member is turned away. So an admin adds people first, one of two ways:

**Path A — Invite user (Authentication → Users → Invite user) — use this for passwordless.**
Enter their email → they get an invite email → they click **Accept** → they land on the hub
**already signed in**. There is *no* "set a password" step, and that's expected — the hub
doesn't force one. From then on they sign in with **"Email me a sign-in link"** (magic link).
This is the right route for people like `ombonya@gmail.com` who don't want a password.

**Path B — Add user (Authentication → Users → Add user) — only if you want to assign a password.**
The dashboard **requires** a password here (you can't leave it blank), so use Path B only
when you deliberately want to give someone a starting password. Set one, share it, and they
can change it later.

**Either way, a member can set/choose a password themselves** once signed in: on the hub,
footer → **"Set password"** (calls a secure Supabase update). So magic-link-only members can
add a password later if they want one, and invited members never have to.

Do Path A for `ombonya@gmail.com` and most members; it stays invite-only because public
sign-ups are off (step 1) and only admins can add users.

## 3. (Optional) confirm the email templates
Authentication → **Email Templates** → make sure "Invite user" and "Magic Link"
templates are enabled and the redirect URL is your hub domain.

## 4. Onboarding / offboarding
- **Add:** Invite user (step 2).
- **Remove:** Authentication → Users → delete or ban the user. They can no longer sign in.
- Review the user list quarterly; remove anyone who has left a partner org.

## 5. Send invites & links from admin@mazingirakenya.org (official + not spam)

By default Supabase sends auth email from its own address, rate-limited (~3–4/hour) and
often landing in spam. To send from **admin@mazingirakenya.org** and stay out of spam, wire
Supabase to a custom SMTP sender and add the domain's email-auth DNS records. (I can't do
this for you — it needs SMTP credentials and DNS access — but here's the whole path.)

You're on **Resend**, so here are the exact values.

### 5a. Verify the domain in Resend + add its DNS (this is what stops spam)
Resend dashboard → **Domains → Add domain** → `mazingirakenya.org`. Resend shows a set of
records — add them **exactly as shown** at your DNS registrar (they're unique to your
account). They are, in shape:
- **SPF** — a TXT record on the `send` subdomain: `v=spf1 include:amazonses.com ~all`
- **DKIM** — the TXT/CNAME record(s) Resend lists under `resend._domainkey…`
- **MX** — on `send.mazingirakenya.org` → `feedback-smtp.<region>.amazonses.com` (return path)
- **DMARC** — add a TXT at `_dmarc.mazingirakenya.org`:
  `v=DMARC1; p=none; rua=mailto:admin@mazingirakenya.org`
Wait for Resend to show the domain **Verified** (green) before sending.

### 5b. Create a Resend API key
Resend → **API Keys → Create** → copy the `re_…` key (this is the SMTP password).

### 5c. Point Supabase at Resend
Supabase dashboard → **Authentication → Emails → SMTP Settings** → enable **Custom SMTP**:
- **Host:** `smtp.resend.com`
- **Port:** `587`
- **Username:** `resend`
- **Password:** your `re_…` API key
- **Sender email:** `admin@mazingirakenya.org`  (must be on the verified domain)
- **Sender name:** `MazingiraKenya`

Then in **Authentication → Rate limits**, if you'll invite several members at once, raise
the email cap and drop the "minimum interval between emails". Send yourself a test invite
and confirm it arrives from admin@ and not in spam.

### 5d. Email templates (ready to paste)
Authentication → **Email Templates**. Edit each template's Subject and Body (Source view).

**Invite user**
- Subject:
  `You're invited to the MazingiraKenya coalition hub`
- Body:
  ```html
  <p>Hello,</p>
  <p>You've been invited to the <strong>MazingiraKenya</strong> coordination hub — the coalition's shared dashboard for extractive-pressure and civil-society response across Kenya.</p>
  <p><a href="{{ .ConfirmationURL }}">Accept invitation</a></p>
  <p>If you weren't expecting this, you can ignore this email.</p>
  <p>— deCOALonize / MazingiraKenya</p>
  ```

**Magic Link**
- Subject:
  `Your MazingiraKenya hub sign-in link`
- Body:
  ```html
  <p>Hello,</p>
  <p>Here's your one-time sign-in link for the <strong>MazingiraKenya</strong> coalition hub. It signs you straight in, no password needed.</p>
  <p><a href="{{ .ConfirmationURL }}">Sign in to the hub</a></p>
  <p>This link works once and expires shortly. If you didn't request it, you can safely ignore this email.</p>
  <p>— deCOALonize / MazingiraKenya</p>
  ```

> Use `{{ .ConfirmationURL }}` exactly — Supabase substitutes the real working link. Never
> hardcode a URL there (that causes "refused to connect"). `{{ .Token }}` is only the raw
> OTP code, for hand-built links — not needed here.

> ⚠️ **The link MUST be `{{ .ConfirmationURL }}`** — Supabase substitutes the real working
> link. Do NOT hardcode `{{ hub.mazingirakenya.org }}` or any URL there; that produces a
> dead link ("refused to connect"). `{{ .ConfirmationURL }}` = the full invite/confirm link
> (Supabase builds it and redirects to your Site URL). `{{ .Token }}` = the raw 6-digit OTP
> code, only for hand-built links — you don't need it here.

### 5e. Point the redirect at the hub (required, or the link fails)
Authentication → **URL Configuration**:
- **Site URL:** `https://hub.mazingirakenya.org`
- **Redirect URLs (allow-list):** add `https://hub.mazingirakenya.org/**`
Without this, `{{ .ConfirmationURL }}` redirects to `localhost:3000` and looks broken.

### 5f. Admins with no password — cross over from the console
An admin who signed into **admin.mazingirakenya.org** by magic link can click
**"Members' hub ↗"** in the admin top bar — it opens the hub carrying that session, so you
land straight in without a password. (Admins can also just use "Email me a sign-in link" on
the hub.)

## Security note (honest)
This is a solid **application-level** gate: the page won't function and the sign-in is
real Supabase auth. But because the hub is a static client-side app, a determined person
could still read the raw HTML source. For **hard** members-only security, also put
`hub.mazingirakenya.org` behind an identity proxy (Vercel Access or Cloudflare Access)
with the same allow-list — exactly as the Admin Access Protocol prescribes for the admin
subdomain — and (optionally) tighten the Supabase RLS on the hub's data tables to
`authenticated` only. Say the word and I'll do the RLS tightening.
