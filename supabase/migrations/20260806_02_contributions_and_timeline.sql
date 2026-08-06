-- MemoryGlen/LivingGlen: pending_contributions + timeline_events
-- Migration 20260806_02 — these two tables are read/written by
-- src/components/ContributeModal.tsx, src/components/OwnerModerationQueue.tsx
-- and src/lib/phase2Api.ts, but had no CREATE TABLE anywhere in this repo
-- (phase2Api.ts even names a migration file,
-- 20260803_liferecord_lifecycle_and_analytics.sql, that does not exist on
-- disk — it may only ever have been applied by hand in the Supabase
-- dashboard, or never applied at all). Both frontend components are
-- currently unwired (not imported by any page), so this migration is
-- additive and cannot break anything live.
--
-- Columns below match exactly what the existing, already-written frontend
-- code sends and reads:
--   ContributeModal.tsx:  life_record_id, contributor_name, target_event_id,
--                         story_text, media_urls, status
--   OwnerModerationQueue.tsx: reads id, contributor_name, story_text,
--                         media_urls, target_event_id, created_at;
--                         on approve, appends media_urls onto the target
--                         timeline_events row and marks the contribution
--                         APPROVED. No RPC is called anywhere for this —
--                         access control is entirely RLS, so that is what
--                         this migration provides.
--   phase2Api.ts:         same pending_contributions shape, plus
--                         listTrustees()/life_record_trustees as the real
--                         steward mechanism (there is no "space_members"
--                         table anywhere in this codebase).
--
-- --------------------------------------------------------------------
-- 1. timeline_events
-- --------------------------------------------------------------------
create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  life_record_id uuid not null references public.life_records(id) on delete cascade,
  title text not null,
  event_date date not null default current_date,
  description text,
  media_urls text[] not null default '{}',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists timeline_events_life_record_idx
  on public.timeline_events (life_record_id, event_date desc);

alter table public.timeline_events enable row level security;

-- Visibility mirrors life_records itself: owner/trustee always, everyone
-- once the record is a public memorial. A private ACTIVE life record's
-- timeline is not meant to be public.
drop policy if exists timeline_events_select on public.timeline_events;
create policy timeline_events_select on public.timeline_events
  for select
  using (
    exists (
      select 1 from public.life_records r
      where r.id = timeline_events.life_record_id
        and (
          r.owner_id = auth.uid()
          or r.status = 'MEMORIAL'
          or exists (
            select 1 from public.life_record_trustees t
            where t.life_record_id = r.id
              and (t.trustee_user_id = auth.uid() or t.trustee_email = auth.jwt() ->> 'email')
          )
        )
    )
  );

-- New milestones are owner-authored and freeze at MEMORIAL, same rule as
-- life_records_update and time_capsules_insert: a life record stops
-- generating new "I did X today" entries once it has become a memorial.
drop policy if exists timeline_events_insert on public.timeline_events;
create policy timeline_events_insert on public.timeline_events
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and exists (
      select 1 from public.life_records r
      where r.id = life_record_id
        and r.owner_id = auth.uid()
        and r.status = 'ACTIVE'
    )
  );

-- UPDATE is deliberately NOT frozen at MEMORIAL: this is the path
-- OwnerModerationQueue.tsx uses to append an approved contributor's media
-- onto an existing milestone, and family/steward curation of a memorial's
-- timeline is expected to continue indefinitely after death.
drop policy if exists timeline_events_update on public.timeline_events;
create policy timeline_events_update on public.timeline_events
  for update to authenticated
  using (
    exists (
      select 1 from public.life_records r
      where r.id = timeline_events.life_record_id
        and (
          r.owner_id = auth.uid()
          or exists (
            select 1 from public.life_record_trustees t
            where t.life_record_id = r.id
              and (t.trustee_user_id = auth.uid() or t.trustee_email = auth.jwt() ->> 'email')
          )
        )
    )
  )
  with check (
    exists (
      select 1 from public.life_records r
      where r.id = life_record_id
        and (
          r.owner_id = auth.uid()
          or exists (
            select 1 from public.life_record_trustees t
            where t.life_record_id = r.id
              and (t.trustee_user_id = auth.uid() or t.trustee_email = auth.jwt() ->> 'email')
          )
        )
    )
  );

-- --------------------------------------------------------------------
-- 2. pending_contributions
-- --------------------------------------------------------------------
create table if not exists public.pending_contributions (
  id uuid primary key default gen_random_uuid(),
  life_record_id uuid not null references public.life_records(id) on delete cascade,
  contributor_id uuid references auth.users(id),
  contributor_name text not null,
  story_text text not null,
  media_urls text[] not null default '{}',
  target_event_id uuid references public.timeline_events(id) on delete set null,
  status text not null default 'PENDING_APPROVAL'
    check (status in ('PENDING_APPROVAL', 'APPROVED', 'REJECTED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pending_contributions_life_record_idx
  on public.pending_contributions (life_record_id, status);

alter table public.pending_contributions enable row level security;

-- Public, unauthenticated insert is intentional (this is the "anyone who
-- knew them can contribute a memory" flow, matching guestbook_entries'
-- own anon-insert pattern) — deliberately NOT frozen at MEMORIAL, since
-- family contributing memories after a death is the point of this table.
-- contributor_id is pinned to the caller's own uid when signed in, and
-- must be null when anonymous, so a submission can never be forged as
-- coming from another real user.
drop policy if exists "Anyone submit pending contribution" on public.pending_contributions;
create policy "Anyone submit pending contribution" on public.pending_contributions
  for insert to anon, authenticated
  with check (
    status = 'PENDING_APPROVAL'
    and (contributor_id is null or contributor_id = auth.uid())
    and exists (select 1 from public.life_records r where r.id = life_record_id)
  );

-- The contributor can see their own pending submission (so they know it
-- went through); owner/trustee can see every submission for moderation.
drop policy if exists "Contributor or steward reads contribution" on public.pending_contributions;
create policy "Contributor or steward reads contribution" on public.pending_contributions
  for select to authenticated
  using (
    contributor_id = auth.uid()
    or exists (
      select 1 from public.life_records r
      where r.id = pending_contributions.life_record_id
        and (
          r.owner_id = auth.uid()
          or exists (
            select 1 from public.life_record_trustees t
            where t.life_record_id = r.id
              and (t.trustee_user_id = auth.uid() or t.trustee_email = auth.jwt() ->> 'email')
          )
        )
    )
  );

-- Only the owner/steward can moderate (approve/reject).
drop policy if exists "Steward moderates contribution" on public.pending_contributions;
create policy "Steward moderates contribution" on public.pending_contributions
  for update to authenticated
  using (
    exists (
      select 1 from public.life_records r
      where r.id = pending_contributions.life_record_id
        and (
          r.owner_id = auth.uid()
          or exists (
            select 1 from public.life_record_trustees t
            where t.life_record_id = r.id
              and (t.trustee_user_id = auth.uid() or t.trustee_email = auth.jwt() ->> 'email')
          )
        )
    )
  )
  with check (
    exists (
      select 1 from public.life_records r
      where r.id = life_record_id
        and (
          r.owner_id = auth.uid()
          or exists (
            select 1 from public.life_record_trustees t
            where t.life_record_id = r.id
              and (t.trustee_user_id = auth.uid() or t.trustee_email = auth.jwt() ->> 'email')
          )
        )
    )
  );
