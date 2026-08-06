-- MemoryGlen: Security Hardening V2
-- Migration 20260806 — closes gaps found in a full RLS audit of the schema
-- actually present in this repo (supabase/migrations/ + "websites
-- corrections"/0002_memorials_and_media.sql). Run in the Supabase SQL editor.
--
-- NOTE ON SCOPE: an earlier draft of this migration targeted tables named
-- family_spaces, space_members and timeline_events. Those tables do not
-- exist anywhere in this repo's migrations (or under any other name that
-- matches their described shape), so no policy can legitimately be written
-- for them here — CREATE POLICY on a nonexistent relation errors outright,
-- it does not silently no-op. This migration instead hardens the tables
-- that actually exist: memorial_invites, memorial_members, funeral_notices,
-- time_capsules and memorial_media.
--
-- UPDATE 2026-08-06, against a live-schema diagnostic: `pending_contributions`
-- and `timeline_events` are handled in
-- supabase/migrations/20260806_02_contributions_and_timeline.sql (its column
-- set was corrected to match the live table exactly — no contributor_id, no
-- updated_at). `live_streams` is handled in
-- supabase/migrations/20260806_03_live_streams.sql. `profiles.is_admin` is
-- still open — referenced by src/lib/phase2Api.ts's admin gating, no column
-- or migration for it anywhere, live schema not yet checked.
--
-- CRITICAL PREREQUISITE: the same diagnostic confirmed `memorial_invites` and
-- `memorial_members` do NOT exist live. Both are defined — correctly, with
-- their own initial RLS and the is_active_member() helper this migration
-- also depends on — in supabase/migrations/20260731_gated_membership_and_invites.sql,
-- which is already in this repo and has apparently never been run against
-- production. This migration does NOT recreate those tables; it only tightens
-- policies on top of them, so it will error (relation/function does not
-- exist) unless 20260731 runs first. This also means funeral_notices,
-- family_contributions and anniversary_messages are CURRENTLY LIVE with
-- their ORIGINAL, pre-20260731 policies — public unrestricted SELECT on all
-- three, and unrestricted INSERT on family_contributions/anniversary_messages
-- — since the migration that was supposed to gate them on active membership
-- never applied. Run every migration in supabase/migrations/ in filename
-- order, not just this file, before assuming any of this is fixed.

-- --------------------------------------------------------------------
-- 1. memorial_invites: close a full-table enumeration leak.
--
-- The existing policy ("Read active invite by code") has no scoping to the
-- requesting user at all — any authenticated user can `select * from
-- memorial_invites` and read every unexpired invite code, its target email
-- and role, for every memorial on the platform. Replace it with a policy
-- scoped to the invite's creator or the memorial's owner, and move code
-- validation into a SECURITY DEFINER RPC so the join flow in
-- membershipApi.ts (which looks up a single code by memorial_slug) keeps
-- working without needing broad table access.
-- --------------------------------------------------------------------
drop policy if exists "Read active invite by code" on public.memorial_invites;
drop policy if exists "Creator or memorial owner reads invites" on public.memorial_invites;
create policy "Creator or memorial owner reads invites" on public.memorial_invites
  for select to authenticated
  using (
    created_by = auth.uid()
    or exists (
      select 1 from public.memorials m
      where m.slug = memorial_invites.memorial_slug
        and m.owner_id = auth.uid()
    )
  );

create or replace function public.redeem_invite_code(p_memorial_slug text, p_invite_code text)
returns table(role text, email text)
language sql
security definer
set search_path = public
as $$
  select i.role, i.email
  from public.memorial_invites i
  where i.memorial_slug = p_memorial_slug
    and i.invite_code = p_invite_code
    and (i.expires_at is null or i.expires_at > now())
  limit 1;
$$;

grant execute on function public.redeem_invite_code(text, text) to authenticated;

-- --------------------------------------------------------------------
-- 2. memorial_members: add the missing UPDATE policy.
--
-- joinMemorial() in membershipApi.ts does an upsert with
-- onConflict: 'memorial_slug,user_id' — when a user who already has a
-- 'pending' row later joins with a valid invite, Postgres routes that
-- through the UPDATE branch of the upsert. With no UPDATE policy at all,
-- that branch is rejected by RLS, silently breaking the documented
-- "a valid unexpired invite grants immediate active access" flow for
-- anyone who had already self-requested pending membership.
-- --------------------------------------------------------------------
drop policy if exists "Self upgrade membership with valid invite" on public.memorial_members;
create policy "Self upgrade membership with valid invite" on public.memorial_members
  for update to authenticated
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and (
      status = 'pending'
      or exists (
        select 1 from public.memorial_invites i
        where i.memorial_slug = memorial_members.memorial_slug
          and (i.expires_at is null or i.expires_at > now())
          and (i.email is null or lower(i.email) = lower(memorial_members.email))
      )
    )
  );

-- --------------------------------------------------------------------
-- 3. funeral_notices: add the missing INSERT policy.
--
-- RLS is enabled with a SELECT-only policy — there is currently no write
-- path at all, even for an active member of the memorial. Matches the
-- insert pattern already used for family_contributions/anniversary_messages.
-- --------------------------------------------------------------------
drop policy if exists "Members insert notices" on public.funeral_notices;
create policy "Members insert notices" on public.funeral_notices
  for insert to authenticated
  with check (public.is_active_member(memorial_slug));

-- --------------------------------------------------------------------
-- 4. time_capsules: close the WITH CHECK gap on UPDATE.
--
-- time_capsules_update has a USING clause but no explicit WITH CHECK.
-- Postgres reuses USING as the check when it's omitted, which blocks most
-- abuse, but life_record_id itself isn't constrained by that expression —
-- a caller could re-parent a time capsule they own onto a different
-- life_records row (as long as that other record is also ACTIVE and they
-- happen to own it too). RLS can't reference the pre-update row, so the
-- reliable fix is a trigger that makes life_record_id and created_by
-- immutable after insert, plus an explicit WITH CHECK for clarity.
-- --------------------------------------------------------------------
create or replace function public.lock_time_capsule_ownership()
returns trigger
language plpgsql
as $$
begin
  if new.life_record_id is distinct from old.life_record_id
     or new.created_by is distinct from old.created_by then
    raise exception 'time_capsules: life_record_id and created_by cannot be changed after creation';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_lock_time_capsule_ownership on public.time_capsules;
create trigger trg_lock_time_capsule_ownership
  before update on public.time_capsules
  for each row execute function public.lock_time_capsule_ownership();

drop policy if exists time_capsules_update on public.time_capsules;
create policy time_capsules_update on public.time_capsules
  for update
  using (
    created_by = auth.uid()
    and exists (
      select 1 from public.life_records r
      where r.id = life_record_id and r.status = 'ACTIVE'
    )
  )
  with check (
    created_by = auth.uid()
    and exists (
      select 1 from public.life_records r
      where r.id = life_record_id and r.status = 'ACTIVE'
    )
  );

-- --------------------------------------------------------------------
-- 5. memorial_media: explicit WITH CHECK on UPDATE (defense in depth).
--
-- Same class of gap as time_capsules_update — USING with no WITH CHECK.
-- Currently unreachable from the frontend (no .update() call on this table
-- in src/), but making the check explicit costs nothing and removes the
-- reliance on Postgres's implicit USING-as-check behaviour.
-- --------------------------------------------------------------------
drop policy if exists "media: owner update" on public.memorial_media;
create policy "media: owner update" on public.memorial_media
  for update
  using (
    exists (
      select 1 from public.memorials m
      where m.id = memorial_media.memorial_id
        and m.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.memorials m
      where m.id = memorial_media.memorial_id
        and m.owner_id = auth.uid()
    )
  );

-- --------------------------------------------------------------------
-- 6. family_contributions: constrain is_verified on insert.
--
-- The insert policy only checks active membership — it doesn't stop a
-- member from setting is_verified: false on their own submitted row
-- (the column defaults to true). Low-severity data-integrity issue on a
-- finance-adjacent table; cheap to close explicitly.
-- --------------------------------------------------------------------
drop policy if exists "Members insert contributions" on public.family_contributions;
create policy "Members insert contributions" on public.family_contributions
  for insert to authenticated
  with check (
    public.is_active_member(memorial_slug)
    and is_verified = true
  );
