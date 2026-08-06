-- MemoryGlen/LivingGlen: live_streams
-- Migration 20260806_03 — brand-new table, no existing frontend references
-- it yet (no LiveStreamTab.tsx exists in this repo). Added on request as
-- schema/RLS groundwork for the live-streaming feature described in the
-- product brief; the UI that consumes it still needs to be built and wired
-- into a life-record detail page, neither of which exist in this repo yet
-- (life_records has no page of its own at all — see README/CLAUDE-HANDOFF
-- for whatever routing plan already exists before building one).
--
-- RLS corrected against the schema that actually exists in this repo:
-- the originally-proposed policies referenced "public.space_members",
-- which is not a table anywhere in this codebase. The real steward
-- mechanism for a life_record is life_record_trustees (see
-- 20260804_06_trustee_consensus.sql). SELECT also does not default to
-- unconditional public read — that would leak an unpublished, private
-- ACTIVE life record's stream schedule/embed URL to anyone; visibility
-- instead mirrors life_records_select (owner, trustee, or once MEMORIAL).

create table if not exists public.live_streams (
  id uuid primary key default gen_random_uuid(),
  life_record_id uuid not null references public.life_records(id) on delete cascade,
  title text not null,
  description text,
  provider text not null
    check (provider in ('youtube', 'youtube_nocookie', 'hls', 'vimeo', 'custom_embed')),
  embed_url text not null,
  scheduled_start_time timestamptz not null,
  is_live boolean not null default false,
  is_ended boolean not null default false,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists live_streams_life_record_idx
  on public.live_streams (life_record_id, scheduled_start_time desc);

alter table public.live_streams enable row level security;

drop policy if exists live_streams_select on public.live_streams;
create policy live_streams_select on public.live_streams
  for select
  using (
    exists (
      select 1 from public.life_records r
      where r.id = live_streams.life_record_id
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

drop policy if exists live_streams_insert on public.live_streams;
create policy live_streams_insert on public.live_streams
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and exists (
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

drop policy if exists live_streams_update on public.live_streams;
create policy live_streams_update on public.live_streams
  for update to authenticated
  using (
    exists (
      select 1 from public.life_records r
      where r.id = live_streams.life_record_id
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

-- set_updated_at() (not touch_updated_at(), which is defined only in
-- "websites corrections"/0002_memorials_and_media.sql, outside
-- supabase/migrations/ and of unconfirmed live status) is the
-- updated_at trigger already used by life_records itself, tracked here.
drop trigger if exists trg_live_streams_updated_at on public.live_streams;
create trigger trg_live_streams_updated_at
  before update on public.live_streams
  for each row execute function public.set_updated_at();
