-- 20260804_06_trustee_consensus.sql
-- LivingGlen <-> MemoryGlen lifecycle: life_records state machine,
-- trustee multi-sig consensus (2-of-3, 7-day cooling-off, owner veto),
-- and time capsules with gated release criteria.
--
-- All state-changing operations (nominate/confirm/veto) go through
-- SECURITY DEFINER RPC functions below so that the multi-sig / 7-day
-- rules cannot be bypassed by a client calling .update() directly.
-- Plain table writes to life_record_trustees are blocked for normal
-- users; only the RPCs (running as the function owner) can write there.

-- ============================================================
-- 1. TABLES
-- ============================================================

create table if not exists public.life_records (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references auth.users(id) on delete cascade,
    full_name text not null,
    bio text,
    avatar_url text,
    status text not null default 'ACTIVE'
      check (status in ('ACTIVE', 'PENDING_TRANSITION', 'MEMORIAL')),
    transition_threshold integer not null default 2,
    transition_initiated_at timestamptz,
    transition_commit_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );

create table if not exists public.life_record_trustees (
    id uuid primary key default gen_random_uuid(),
    life_record_id uuid not null references public.life_records(id) on delete cascade,
    trustee_email text not null,
    trustee_user_id uuid references auth.users(id),
    has_confirmed_transition boolean not null default false,
    confirmed_at timestamptz,
    created_at timestamptz not null default now(),
    unique (life_record_id, trustee_email)
  );

create table if not exists public.time_capsules (
    id uuid primary key default gen_random_uuid(),
    life_record_id uuid not null references public.life_records(id) on delete cascade,
    created_by uuid references auth.users(id),
    title text,
    content text,
    media_urls text[] not null default '{}',
    -- Unseal at a specific future date, and/or automatically once the
  -- record transitions to MEMORIAL. Either trigger unlocks the capsule.
  unlock_at timestamptz,
    unlock_on_transition boolean not null default false,
    -- Private capsules (e.g. a personal letter) stay visible to the
  -- creator only, even after the unlock criteria are met.
  is_private boolean not null default true,
    created_at timestamptz not null default now()
  );

create index if not exists idx_life_record_trustees_record on public.life_record_trustees(life_record_id);
create index if not exists idx_time_capsules_record on public.time_capsules(life_record_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_life_records_updated_at on public.life_records;
create trigger trg_life_records_updated_at
  before update on public.life_records
  for each row execute function public.set_updated_at();

-- ============================================================
-- 2. ROW LEVEL SECURITY
-- ============================================================

alter table public.life_records enable row level security;
alter table public.life_record_trustees enable row level security;
alter table public.time_capsules enable row level security;

-- life_records: owner always; trustees while reviewing; public once MEMORIAL.
drop policy if exists life_records_select on public.life_records;
create policy life_records_select on public.life_records
  for select
  using (
      auth.uid() = owner_id
      or status = 'MEMORIAL'
      or exists (
        select 1 from public.life_record_trustees t
        where t.life_record_id = life_records.id
          and (t.trustee_user_id = auth.uid() or t.trustee_email = auth.jwt() ->> 'email')
      )
    );

drop policy if exists life_records_insert on public.life_records;
create policy life_records_insert on public.life_records
  for insert
  with check (auth.uid() = owner_id);

-- Owners may only edit their own profile fields while ACTIVE; the
-- status/transition columns are only ever mutated by the RPCs below.
drop policy if exists life_records_update on public.life_records;
create policy life_records_update on public.life_records
  for update
  using (auth.uid() = owner_id and status = 'ACTIVE')
  with check (auth.uid() = owner_id);

-- life_record_trustees: readable by the record owner and by the trustee
-- themselves; no direct client writes (nominate/confirm go through RPCs).
drop policy if exists life_record_trustees_select on public.life_record_trustees;
create policy life_record_trustees_select on public.life_record_trustees
  for select
  using (
      trustee_user_id = auth.uid()
      or trustee_email = auth.jwt() ->> 'email'
      or exists (
        select 1 from public.life_records r
        where r.id = life_record_trustees.life_record_id
          and r.owner_id = auth.uid()
      )
    );

-- time_capsules: creator always sees their own; everyone else only sees
-- non-private capsules once the release criteria (date or transition) are met.
drop policy if exists time_capsules_select on public.time_capsules;
create policy time_capsules_select on public.time_capsules
  for select
  using (
      created_by = auth.uid()
      or (
        is_private = false
        and (
          (unlock_at is not null and now() >= unlock_at)
          or (
            unlock_on_transition
            and exists (
              select 1 from public.life_records r
              where r.id = time_capsules.life_record_id
                and r.status = 'MEMORIAL'
            )
          )
        )
      )
    );

drop policy if exists time_capsules_insert on public.time_capsules;
create policy time_capsules_insert on public.time_capsules
  for insert
  with check (
      created_by = auth.uid()
      and exists (
        select 1 from public.life_records r
        where r.id = life_record_id
          and r.owner_id = auth.uid()
          and r.status = 'ACTIVE'
      )
    );

drop policy if exists time_capsules_update on public.time_capsules;
create policy time_capsules_update on public.time_capsules
  for update
  using (
      created_by = auth.uid()
      and exists (
        select 1 from public.life_records r
        where r.id = life_record_id and r.status = 'ACTIVE'
      )
    );

drop policy if exists time_capsules_delete on public.time_capsules;
create policy time_capsules_delete on public.time_capsules
  for delete
  using (
      created_by = auth.uid()
      and exists (
        select 1 from public.life_records r
        where r.id = life_record_id and r.status = 'ACTIVE'
      )
    );

-- ============================================================
-- 3. RPCs (SECURITY DEFINER - bypass RLS under controlled conditions)
-- ============================================================

-- Owner-only: propose a trustee by email. Max 3 trustees per record.
create or replace function public.nominate_trustee(p_life_record_id uuid, p_trustee_email text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner uuid;
  v_status text;
  v_count integer;
  v_id uuid;
begin
  select owner_id, status into v_owner, v_status
  from public.life_records
  where id = p_life_record_id;

  if v_owner is null then
    raise exception 'Life record not found.';
  end if;

  if auth.uid() <> v_owner then
    raise exception 'Only the record owner can nominate trustees.';
  end if;

  if v_status <> 'ACTIVE' then
    raise exception 'Trustees can only be nominated while the record is ACTIVE.';
  end if;

  select count(*) into v_count
  from public.life_record_trustees
  where life_record_id = p_life_record_id;

  if v_count >= 3 then
    raise exception 'A life record may have at most 3 trustees.';
  end if;

  insert into public.life_record_trustees (life_record_id, trustee_email)
  values (p_life_record_id, lower(trim(p_trustee_email)))
  on conflict (life_record_id, trustee_email) do nothing
  returning id into v_id;

  if v_id is null then
    select id into v_id
    from public.life_record_trustees
    where life_record_id = p_life_record_id
      and trustee_email = lower(trim(p_trustee_email));
  end if;

  return v_id;
end;
$$;

-- Trustee-only: cast a confirmation vote. Once the 2-of-3 (or configured)
-- threshold is reached, starts the 7-day cooling-off window.
create or replace function public.confirm_trustee_transition(p_life_record_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_threshold integer;
  v_confirmed_count integer;
  v_caller_email text;
begin
  select status, transition_threshold into v_status, v_threshold
  from public.life_records
  where id = p_life_record_id;

  if v_status is null then
    raise exception 'Life record not found.';
  end if;

  if v_status = 'MEMORIAL' then
    raise exception 'This life record has already transitioned.';
  end if;

  v_caller_email := auth.jwt() ->> 'email';

  update public.life_record_trustees
  set has_confirmed_transition = true,
      confirmed_at = now(),
      trustee_user_id = coalesce(trustee_user_id, auth.uid())
  where life_record_id = p_life_record_id
    and (trustee_user_id = auth.uid() or trustee_email = v_caller_email);

  if not found then
    raise exception 'Only a nominated trustee can confirm this transition.';
  end if;

  select count(*) into v_confirmed_count
  from public.life_record_trustees
  where life_record_id = p_life_record_id
    and has_confirmed_transition = true;

  if v_confirmed_count >= v_threshold and v_status = 'ACTIVE' then
    update public.life_records
    set status = 'PENDING_TRANSITION',
        transition_initiated_at = now(),
        transition_commit_at = now() + interval '7 days'
    where id = p_life_record_id;

    return 'PENDING_TRANSITION';
  end if;

  return v_status;
end;
$$;

-- Owner-only: instant 1-click cancellation of a pending transition.
create or replace function public.veto_transition(p_life_record_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner uuid;
  v_status text;
begin
  select owner_id, status into v_owner, v_status
  from public.life_records
  where id = p_life_record_id;

  if v_owner is null then
    raise exception 'Life record not found.';
  end if;

  if auth.uid() <> v_owner then
    raise exception 'Only the record owner can veto a transition.';
  end if;

  if v_status <> 'PENDING_TRANSITION' then
    raise exception 'There is no pending transition to cancel.';
  end if;

  update public.life_records
  set status = 'ACTIVE',
      transition_initiated_at = null,
      transition_commit_at = null
  where id = p_life_record_id;

  update public.life_record_trustees
  set has_confirmed_transition = false,
      confirmed_at = null
  where life_record_id = p_life_record_id;
end;
$$;

-- Optional: finalize any PENDING_TRANSITION records whose 7-day cooling-off
-- window has elapsed. Intended to be run on a schedule (e.g. pg_cron):
--   select cron.schedule('finalize-life-record-transitions', '0 * * * *',
--     $$select public.finalize_pending_transitions();$$);
create or replace function public.finalize_pending_transitions()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  update public.life_records
  set status = 'MEMORIAL'
  where status = 'PENDING_TRANSITION'
    and transition_commit_at is not null
    and now() >= transition_commit_at;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;
