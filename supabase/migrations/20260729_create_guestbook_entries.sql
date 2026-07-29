-- MemoryGlen — public guestbook tributes.
-- Run this in the Supabase SQL editor before enabling the guestbook form.
--
-- Row Level Security is the ONLY thing protecting this data. The anon key ships
-- in the browser bundle; without the policies below, anyone could read and write
-- every row. Do not disable RLS on this table.

create table if not exists public.guestbook_entries (
  id             uuid primary key default gen_random_uuid(),
  memorial_slug  text not null,
  guest_name     text not null,
  message        text not null,
  media_url      text,
  is_approved    boolean not null default false,
  created_at     timestamptz not null default now()
);

create index if not exists guestbook_entries_slug_idx
  on public.guestbook_entries (memorial_slug);

alter table public.guestbook_entries enable row level security;

-- Anyone may SUBMIT a tribute, but only as an unapproved row. The WITH CHECK
-- forbids a submitter from setting is_approved = true themselves.
drop policy if exists "guestbook: public insert" on public.guestbook_entries;
create policy "guestbook: public insert"
  on public.guestbook_entries for insert
  to anon, authenticated
  with check (is_approved = false);

-- Anyone may READ, but only rows the family has approved.
drop policy if exists "guestbook: public read approved" on public.guestbook_entries;
create policy "guestbook: public read approved"
  on public.guestbook_entries for select
  to anon, authenticated
  using (is_approved = true);

-- Moderation is restricted to the service_role (server-side / admin only).
-- Ordinary signed-in users cannot approve tributes.
drop policy if exists "guestbook: admin all" on public.guestbook_entries;
create policy "guestbook: admin all"
  on public.guestbook_entries for all
  to service_role
  using (true)
  with check (true);
