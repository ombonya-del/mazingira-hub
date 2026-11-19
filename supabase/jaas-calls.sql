-- MazingiraKenya — Coalition room on JaaS (8x8) + automatic minutes
-- Run once in Supabase -> SQL Editor. Safe to re-run.
-- Requires public.calls (calls.sql), public.partners (partners.sql) and public.is_admin().

-- 1) Who gets the minutes for a scheduled call
alter table public.calls add column if not exists minutes_to    text[] not null default '{}';  -- extra recipient emails
-- 'scheduled' = booked call (coalition or private room, admins host, Lobby on)
-- 'quick'     = a member's instant call (the starter hosts, no Lobby; minutes also go to all admins)
alter table public.calls add column if not exists kind          text    not null default 'scheduled';
alter table public.calls add column if not exists take_minutes  boolean not null default true;

-- 2) One row per call session (a room can be used many times)
create table if not exists public.call_sessions (
  session_id   text primary key,            -- JaaS sessionId
  room         text not null,               -- lower-case room name (no app id)
  call_id      uuid references public.calls(id) on delete set null,
  title        text,
  started_at   timestamptz,
  ended_at     timestamptz,
  status       text not null default 'open', -- open | ended | processing | sent | failed
  transcript   text,                         -- admin-only (column grant below)
  minutes      jsonb,                        -- {summary, decisions[], action_items[], next_steps[], key_points[]}
  sent_to      text[],                       -- admin-only (column grant below)
  error        text,
  created_at   timestamptz not null default now()
);
create index if not exists call_sessions_started_idx on public.call_sessions(started_at desc);

-- 3) Attendance (from JaaS webhooks; 'token' rows are a fallback log from the join function)
create table if not exists public.call_attendees (
  id          bigserial primary key,
  room        text not null,
  session_id  text,
  email       text,
  name        text,
  moderator   boolean default false,
  kicked      boolean default false,
  source      text not null default 'webhook',  -- webhook | token
  joined_at   timestamptz not null default now()
);
create index if not exists call_attendees_session_idx on public.call_attendees(session_id);
create index if not exists call_attendees_room_idx    on public.call_attendees(room, joined_at);

-- 4) Webhook de-duplication (JaaS retries)
create table if not exists public.jaas_events (
  idempotency_key text primary key,
  event_type      text,
  received_at     timestamptz not null default now()
);

-- RLS: members can read minutes; admins see everything; only the service role writes.
alter table public.call_sessions  enable row level security;
alter table public.call_attendees enable row level security;
alter table public.jaas_events    enable row level security;

drop policy if exists call_sessions_read  on public.call_sessions;
drop policy if exists call_sessions_admin on public.call_sessions;
create policy call_sessions_read  on public.call_sessions for select to authenticated using (true);
create policy call_sessions_admin on public.call_sessions for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists call_attendees_admin on public.call_attendees;
create policy call_attendees_admin on public.call_attendees for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Members may read minutes but NOT the raw transcript or the recipient emails.
revoke select on public.call_sessions from authenticated, anon;
grant select (session_id, room, call_id, title, started_at, ended_at, status, minutes, created_at)
  on public.call_sessions to authenticated;
grant delete on public.call_sessions to authenticated;  -- RLS still limits to is_admin()

-- Members may set minutes recipients when scheduling (insert policy on calls already exists).
grant insert on public.calls to authenticated;
