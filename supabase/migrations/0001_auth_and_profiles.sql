-- MemoryGlen — auth, profiles and family invitations.
-- Run this in the Supabase SQL editor before using sign-up.
--
-- Row Level Security is the ONLY thing protecting this data. The anon key is
-- public by design and ships in the browser bundle; without the policies below,
-- anyone could read and write every row. Do not disable RLS on these tables.

-- ---------------------------------------------------------------- profiles --
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  email       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A signed-in person can read and edit only their own profile.
drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles: insert own" on public.profiles;
create policy "profiles: insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Create the profile row automatically on sign-up, from the metadata the
-- client sends. security definer so it can write before any session exists.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------ invitations --
create table if not exists public.invitations (
  id          uuid primary key default gen_random_uuid(),
  inviter_id  uuid not null references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  status      text not null default 'pending'
              check (status in ('pending', 'accepted', 'revoked')),
  created_at  timestamptz not null default now()
);

create index if not exists invitations_inviter_idx on public.invitations (inviter_id);
create unique index if not exists invitations_unique_pending
  on public.invitations (inviter_id, lower(email))
  where status = 'pending';

alter table public.invitations enable row level security;

-- You can only see and manage invitations you sent.
drop policy if exists "invitations: read own" on public.invitations;
create policy "invitations: read own"
  on public.invitations for select
  using (auth.uid() = inviter_id);

drop policy if exists "invitations: insert own" on public.invitations;
create policy "invitations: insert own"
  on public.invitations for insert
  with check (auth.uid() = inviter_id);

drop policy if exists "invitations: update own" on public.invitations;
create policy "invitations: update own"
  on public.invitations for update
  using (auth.uid() = inviter_id)
  with check (auth.uid() = inviter_id);
