-- MemoryGlen — memorials, media and storage.
-- Run this in the Supabase SQL editor after 0001_auth_and_profiles.sql.
--
-- Row Level Security is the ONLY thing protecting this data. The anon key is
-- public by design and ships in the browser bundle; without the policies below,
-- anyone could read and write every row. Do not disable RLS on these tables.
--
-- Ownership model, deliberately simple for now: one owner per memorial, held in
-- `owner_id`. Co-ownership is a real requirement in real families and will need
-- a `memorial_editors` join table later — the policies below are written so
-- that change is additive rather than a rewrite.

-- --------------------------------------------------------------- memorials --
create table if not exists public.memorials (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users (id) on delete cascade,
  slug          text not null unique,
  full_name     text not null,
  born_on       date,
  died_on       date,
  tagline       text,
  story         text,
  resting_place text,
  cover_path    text,          -- storage object path, not a public URL
  status        text not null default 'draft'
                check (status in ('draft', 'published', 'archived')),
  consent_given boolean not null default false,
  consent_at    timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists memorials_owner_idx  on public.memorials (owner_id);
create index if not exists memorials_status_idx on public.memorials (status);

alter table public.memorials enable row level security;

-- Anyone, signed in or not, may read a published memorial. This is the whole
-- point of the product: a link shared on WhatsApp must open for a stranger.
drop policy if exists "memorials: public read published" on public.memorials;
create policy "memorials: public read published"
  on public.memorials for select
  using (status = 'published');

-- An owner can always see their own memorials, including drafts.
drop policy if exists "memorials: owner read own" on public.memorials;
create policy "memorials: owner read own"
  on public.memorials for select
  using (auth.uid() = owner_id);

drop policy if exists "memorials: owner insert" on public.memorials;
create policy "memorials: owner insert"
  on public.memorials for insert
  with check (auth.uid() = owner_id);

drop policy if exists "memorials: owner update" on public.memorials;
create policy "memorials: owner update"
  on public.memorials for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- No delete policy. Memorial content must not be destroyable by a single
-- click, and family disputes over ownership are inevitable. Set status to
-- 'archived' instead. Hard deletion, if ever needed, is a deliberate
-- server-side action.

-- ----------------------------------------------------------- memorial_media --
create table if not exists public.memorial_media (
  id           uuid primary key default gen_random_uuid(),
  memorial_id  uuid not null references public.memorials (id) on delete cascade,
  uploader_id  uuid not null references auth.users (id) on delete cascade,
  storage_path text not null unique,   -- path within the 'memorial-media' bucket
  kind         text not null default 'image'
               check (kind in ('image', 'video', 'audio')),
  caption      text,
  category     text,                   -- free-text grouping, e.g. 'Family', 'Church'
  sort_order   int  not null default 0,
  bytes        bigint,
  created_at   timestamptz not null default now()
);

create index if not exists memorial_media_memorial_idx
  on public.memorial_media (memorial_id, sort_order, created_at);

alter table public.memorial_media enable row level security;

-- Media of a published memorial is public, mirroring the memorial itself.
drop policy if exists "media: public read published" on public.memorial_media;
create policy "media: public read published"
  on public.memorial_media for select
  using (
    exists (
      select 1 from public.memorials m
      where m.id = memorial_media.memorial_id
        and m.status = 'published'
    )
  );

drop policy if exists "media: owner read own" on public.memorial_media;
create policy "media: owner read own"
  on public.memorial_media for select
  using (
    exists (
      select 1 from public.memorials m
      where m.id = memorial_media.memorial_id
        and m.owner_id = auth.uid()
    )
  );

-- Only the memorial owner may add media, and only as themselves.
drop policy if exists "media: owner insert" on public.memorial_media;
create policy "media: owner insert"
  on public.memorial_media for insert
  with check (
    auth.uid() = uploader_id
    and exists (
      select 1 from public.memorials m
      where m.id = memorial_media.memorial_id
        and m.owner_id = auth.uid()
    )
  );

drop policy if exists "media: owner update" on public.memorial_media;
create policy "media: owner update"
  on public.memorial_media for update
  using (
    exists (
      select 1 from public.memorials m
      where m.id = memorial_media.memorial_id
        and m.owner_id = auth.uid()
    )
  );

drop policy if exists "media: owner delete" on public.memorial_media;
create policy "media: owner delete"
  on public.memorial_media for delete
  using (
    exists (
      select 1 from public.memorials m
      where m.id = memorial_media.memorial_id
        and m.owner_id = auth.uid()
    )
  );

-- ------------------------------------------------------------ updated_at --
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists memorials_touch_updated_at on public.memorials;
create trigger memorials_touch_updated_at
  before update on public.memorials
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------- storage --
-- Public bucket: memorial photographs are meant to be seen by anyone holding
-- the link, and a public bucket means plain <img src> with no signed-URL
-- round trip. 10 MB ceiling — modern phone photos run 3–6 MB and a free-tier
-- project fills up fast.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'memorial-media',
  'memorial-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Objects are stored at:  <memorial_id>/<uuid>.<ext>
-- The first path segment is the memorial id, which is what the policies below
-- check against. Do not change the layout without changing these policies.

drop policy if exists "memorial media: public read" on storage.objects;
create policy "memorial media: public read"
  on storage.objects for select
  using (bucket_id = 'memorial-media');

drop policy if exists "memorial media: owner upload" on storage.objects;
create policy "memorial media: owner upload"
  on storage.objects for insert
  with check (
    bucket_id = 'memorial-media'
    and exists (
      select 1 from public.memorials m
      where m.id::text = (storage.foldername(name))[1]
        and m.owner_id = auth.uid()
    )
  );

drop policy if exists "memorial media: owner delete" on storage.objects;
create policy "memorial media: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'memorial-media'
    and exists (
      select 1 from public.memorials m
      where m.id::text = (storage.foldername(name))[1]
        and m.owner_id = auth.uid()
    )
  );
