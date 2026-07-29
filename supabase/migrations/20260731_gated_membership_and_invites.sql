-- MemoryGlen: Gated Membership & Invitation System
-- Migration 20260731 — introduces memorial_members and memorial_invites,
-- and tightens RLS so notices, contributions and chat are readable only by
-- APPROVED (active) members of the specific memorial. Run in the Supabase
-- SQL editor. Self-join without a valid invite lands in 'pending'; a valid
-- unexpired invite grants immediate 'active' access.

-- 1. Memorial Members
create table if not exists public.memorial_members (
  id uuid primary key default gen_random_uuid(),
  memorial_slug text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'guest',   -- 'owner', 'family', 'guest'
  status text not null default 'pending', -- 'active', 'pending'
  created_at timestamptz not null default now(),
  unique (memorial_slug, user_id)
);

-- 2. Memorial Invitations
create table if not exists public.memorial_invites (
  id uuid primary key default gen_random_uuid(),
  memorial_slug text not null,
  invite_code text unique not null default encode(gen_random_bytes(6), 'hex'),
  email text,                              -- optional: targeted to an email
  role text not null default 'guest',
  created_by uuid references auth.users(id),
  expires_at timestamptz default (now() + interval '30 days'),
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.memorial_members enable row level security;
alter table public.memorial_invites enable row level security;

-- Helper: is the current user an ACTIVE member of a given memorial?
create or replace function public.is_active_member(slug text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.memorial_members m
    where m.memorial_slug = slug
      and m.user_id = auth.uid()
      and m.status = 'active'
  );
$$;

-- ------------------------------------------------------------------
-- Members RLS
-- ------------------------------------------------------------------
drop policy if exists "Members read own memberships" on public.memorial_members;
create policy "Members read own memberships" on public.memorial_members
  for select to authenticated using (user_id = auth.uid());

-- Self-join WITHOUT invite: only a 'pending', 'guest' row for oneself.
drop policy if exists "Self request pending membership" on public.memorial_members;
create policy "Self request pending membership" on public.memorial_members
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and status = 'pending'
    and role = 'guest'
  );

-- Join WITH a valid, unexpired invite: an 'active' row is permitted only when
-- a matching invite exists for this memorial (and, if the invite is targeted
-- to an email, it matches the joining user's email).
drop policy if exists "Active membership requires valid invite" on public.memorial_members;
create policy "Active membership requires valid invite" on public.memorial_members
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and status = 'active'
    and exists (
      select 1 from public.memorial_invites i
      where i.memorial_slug = memorial_members.memorial_slug
        and (i.expires_at is null or i.expires_at > now())
        and (i.email is null or lower(i.email) = lower(memorial_members.email))
    )
  );

-- ------------------------------------------------------------------
-- Invites RLS
-- ------------------------------------------------------------------
-- A user may read a specific active invite (needed to validate a code).
drop policy if exists "Read active invite by code" on public.memorial_invites;
create policy "Read active invite by code" on public.memorial_invites
  for select to authenticated
  using (expires_at is null or expires_at > now());

-- ------------------------------------------------------------------
-- Tighten existing tables: reads/writes require ACTIVE membership.
-- ------------------------------------------------------------------
drop policy if exists "Public read notices" on public.funeral_notices;
drop policy if exists "Members read notices" on public.funeral_notices;
create policy "Members read notices" on public.funeral_notices
  for select to authenticated using (public.is_active_member(memorial_slug));

drop policy if exists "Public read contributions" on public.family_contributions;
drop policy if exists "Members read contributions" on public.family_contributions;
create policy "Members read contributions" on public.family_contributions
  for select to authenticated using (public.is_active_member(memorial_slug));

drop policy if exists "Authenticated insert contributions" on public.family_contributions;
create policy "Members insert contributions" on public.family_contributions
  for insert to authenticated
  with check (public.is_active_member(memorial_slug));

drop policy if exists "Public read chat" on public.anniversary_messages;
drop policy if exists "Members read chat" on public.anniversary_messages;
create policy "Members read chat" on public.anniversary_messages
  for select to authenticated using (public.is_active_member(memorial_slug));

drop policy if exists "Public insert chat" on public.anniversary_messages;
drop policy if exists "Authenticated insert chat" on public.anniversary_messages;
create policy "Members insert chat" on public.anniversary_messages
  for insert to authenticated
  with check (
    public.is_active_member(memorial_slug)
    and length(trim(message)) > 0
  );
