-- MemoryGlen: Funeral Notices, GPS Sharing, Family Finance & Anniversary Chat
-- Migration 20260730 — creates funeral_notices, family_contributions and
-- anniversary_messages, with RLS. Run in the Supabase SQL editor.

-- 1. Funeral Notices & GPS Locations (both coordinates double precision)
create table if not exists public.funeral_notices (
  id uuid primary key default gen_random_uuid(),
  memorial_slug text not null,
  title text not null,
  venue_name text not null,
  address text not null,
  latitude double precision not null,
  longitude double precision not null,
  service_date timestamptz not null,
  created_at timestamptz not null default now()
);

-- 2. Family Finance & Contribution Tracker
create table if not exists public.family_contributions (
  id uuid primary key default gen_random_uuid(),
  memorial_slug text not null,
  contributor_name text not null,
  amount decimal(10,2) not null,
  currency text not null default 'USD',
  expense_category text not null default 'General', -- e.g. Catering, Venue, Transport
  note text,
  is_verified boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3. Anniversary Chat Rooms
create table if not exists public.anniversary_messages (
  id uuid primary key default gen_random_uuid(),
  memorial_slug text not null,
  sender_name text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.funeral_notices enable row level security;
alter table public.family_contributions enable row level security;
alter table public.anniversary_messages enable row level security;

-- Public READ policies
drop policy if exists "Public read notices" on public.funeral_notices;
create policy "Public read notices"
  on public.funeral_notices for select
  to anon, authenticated using (true);

drop policy if exists "Public read contributions" on public.family_contributions;
create policy "Public read contributions"
  on public.family_contributions for select
  to anon, authenticated using (true);

drop policy if exists "Public read chat" on public.anniversary_messages;
create policy "Public read chat"
  on public.anniversary_messages for select
  to anon, authenticated using (true);

-- Secured INSERT policies
-- Financial contributions: authenticated users only (fraud / spam protection).
drop policy if exists "Authenticated insert contributions" on public.family_contributions;
create policy "Authenticated insert contributions"
  on public.family_contributions for insert
  to authenticated with check (true);

-- Anniversary chat: allow anon + authenticated, but require non-empty message.
drop policy if exists "Public insert chat" on public.anniversary_messages;
create policy "Public insert chat"
  on public.anniversary_messages for insert
  to anon, authenticated
  with check (length(trim(message)) > 0 and length(trim(sender_name)) > 0);

-- Enable Supabase Realtime for the anniversary chat table.
alter publication supabase_realtime add table public.anniversary_messages;
