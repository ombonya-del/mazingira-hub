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

## 2. Invite each member
Supabase dashboard → **Authentication → Users → Invite user** → enter their email.
They receive an email to set a password and are added as a user. Do this for:
- `ombonya@gmail.com` (you)
- each coalition member's email

A member can then either use their password, or click **"Email me a sign-in link"** on
the hub (magic link) — both work once they exist as a user.

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

### 5a. Pick a sender
Use a transactional email provider that lets you verify a domain (best deliverability):
**Resend**, **SendGrid**, **Postmark**, or **Mailgun** — or, if `admin@mazingirakenya.org`
is a Google Workspace mailbox, Google's SMTP relay. A dedicated transactional provider is
the most reliable for auth email.

### 5b. Verify the domain + add DNS (this is what keeps it out of spam)
In the provider, add and verify `mazingirakenya.org`, then add the DNS records it gives you
at your domain registrar:
- **SPF** — a TXT record authorising the provider to send for your domain.
- **DKIM** — the CNAME/TXT keys the provider supplies (cryptographic signing).
- **DMARC** — a TXT record at `_dmarc.mazingirakenya.org`, start with `v=DMARC1; p=none;
  rua=mailto:admin@mazingirakenya.org` and tighten to `p=quarantine` later.
Without SPF + DKIM aligned to your domain, invite mail will keep hitting spam.

### 5c. Point Supabase at it
Supabase dashboard → **Authentication → Emails → SMTP Settings** → enable **Custom SMTP**:
- **Sender email:** `admin@mazingirakenya.org`
- **Sender name:** `MazingiraKenya`
- **Host / Port / Username / Password:** from your provider (port usually 587)
Save, then send yourself a test invite and confirm it arrives from admin@ and not in spam.

### 5d. Make the emails read as official
Authentication → **Email Templates** → edit **Invite user** and **Magic Link**. Suggested:
- **Invite subject:** `You're invited to the MazingiraKenya coalition hub`
- **Invite body:** "Hello, you've been invited to the MazingiraKenya coordination hub — the
  coalition's shared dashboard for extractive-pressure and civil-society response across
  Kenya. Click below to set your password and sign in. If you weren't expecting this, you
  can ignore it. — deCOALonize / MazingiraKenya" + the `{{ .ConfirmationURL }}` button.
- **Magic-link subject:** `Your MazingiraKenya hub sign-in link`
- Keep `{{ .ConfirmationURL }}` / `{{ .Token }}` variables intact.

## Security note (honest)
This is a solid **application-level** gate: the page won't function and the sign-in is
real Supabase auth. But because the hub is a static client-side app, a determined person
could still read the raw HTML source. For **hard** members-only security, also put
`hub.mazingirakenya.org` behind an identity proxy (Vercel Access or Cloudflare Access)
with the same allow-list — exactly as the Admin Access Protocol prescribes for the admin
subdomain — and (optionally) tighten the Supabase RLS on the hub's data tables to
`authenticated` only. Say the word and I'll do the RLS tightening.
