-- MazingiraKenya — let admins EDIT and DELETE Voices posts (submissions)
-- Run in Supabase → SQL Editor AFTER voices-media.sql. Safe to re-run.

grant update, delete on public.submissions to authenticated;

drop policy if exists sub_review_update on public.submissions;
create policy sub_review_update on public.submissions for update to authenticated
  using ( public.voices_can_review() ) with check ( public.voices_can_review() );

drop policy if exists sub_review_delete on public.submissions;
create policy sub_review_delete on public.submissions for delete to authenticated
  using ( public.voices_can_review() );

-- admins can also read every submission (needed to edit/delete from any queue)
drop policy if exists sub_review_read on public.submissions;
create policy sub_review_read on public.submissions for select to authenticated
  using ( public.voices_can_review() );
