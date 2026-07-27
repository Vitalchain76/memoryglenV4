-- MemoryGlen — security hardening.
-- Run in the Supabase SQL editor after 0002_memorials_and_media.sql.
--
-- Addresses threats T-02 (media reachable independently of the memorial),
-- T-09 (storage abuse), T-15 (deletion and ownership disputes) and part of
-- T-24 (minimisation) from the master threat model.

-- ------------------------------------------------- T-02: gate storage reads --
-- The original policy allowed anonymous read of every object in the bucket.
-- That meant the photographs of a DRAFT memorial — one the family has not
-- published — were retrievable by anyone holding or guessing the object URL,
-- even though the memorial row itself was correctly hidden by RLS. Hiding the
-- page did not hide the files.
--
-- Object paths are <memorial_id>/<uuid>.jpg, so the memorial's status can be
-- checked from the first path segment.

drop policy if exists "memorial media: public read" on storage.objects;
create policy "memorial media: public read published"
  on storage.objects for select
  using (
    bucket_id = 'memorial-media'
    and exists (
      select 1 from public.memorials m
      where m.id::text = (storage.foldername(name))[1]
        and m.status = 'published'
    )
  );

-- The owner can always see their own memorial's media, published or not.
drop policy if exists "memorial media: owner read" on storage.objects;
create policy "memorial media: owner read"
  on storage.objects for select
  using (
    bucket_id = 'memorial-media'
    and exists (
      select 1 from public.memorials m
      where m.id::text = (storage.foldername(name))[1]
        and m.owner_id = auth.uid()
    )
  );

-- ------------------------------------------------ T-09: enforce media quota --
-- The client checks this too, but a check that runs only in the browser is
-- advisory. This is the enforcement.

create or replace function public.enforce_media_quota()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  existing int;
begin
  select count(*) into existing
  from public.memorial_media
  where memorial_id = new.memorial_id;

  if existing >= 300 then
    raise exception 'This memorial has reached its limit of 300 photographs.'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

drop trigger if exists memorial_media_quota on public.memorial_media;
create trigger memorial_media_quota
  before insert on public.memorial_media
  for each row execute function public.enforce_media_quota();

-- --------------------------------------- T-15: audit trail for status change --
-- Ownership and deletion disputes between relatives are not hypothetical. An
-- append-only record of who changed what, and when, is what makes such a
-- dispute resolvable rather than a matter of competing recollections.

create table if not exists public.memorial_audit (
  id          bigserial primary key,
  memorial_id uuid not null references public.memorials (id) on delete cascade,
  actor_id    uuid,
  action      text not null,
  detail      jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists memorial_audit_memorial_idx
  on public.memorial_audit (memorial_id, created_at desc);

alter table public.memorial_audit enable row level security;

-- Readable by the memorial's owner only. No insert, update or delete policy:
-- rows are written solely by the SECURITY DEFINER trigger below, so the log
-- cannot be forged or rewritten through the API.
drop policy if exists "audit: owner read" on public.memorial_audit;
create policy "audit: owner read"
  on public.memorial_audit for select
  using (
    exists (
      select 1 from public.memorials m
      where m.id = memorial_audit.memorial_id
        and m.owner_id = auth.uid()
    )
  );

create or replace function public.log_memorial_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.memorial_audit (memorial_id, actor_id, action, detail)
    values (new.id, auth.uid(), 'created',
            jsonb_build_object('status', new.status));
  elsif tg_op = 'UPDATE' then
    if new.status is distinct from old.status then
      insert into public.memorial_audit (memorial_id, actor_id, action, detail)
      values (new.id, auth.uid(), 'status_changed',
              jsonb_build_object('from', old.status, 'to', new.status));
    end if;
    if new.owner_id is distinct from old.owner_id then
      insert into public.memorial_audit (memorial_id, actor_id, action, detail)
      values (new.id, auth.uid(), 'owner_changed',
              jsonb_build_object('from', old.owner_id, 'to', new.owner_id));
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists memorials_audit on public.memorials;
create trigger memorials_audit
  after insert or update on public.memorials
  for each row execute function public.log_memorial_change();

-- ------------------------------------------------ T-24: length constraints --
-- Bounded free text limits both storage abuse and the blast radius of any
-- injection that gets past output encoding.

alter table public.memorials
  drop constraint if exists memorials_text_bounds;
alter table public.memorials
  add constraint memorials_text_bounds check (
    length(full_name) between 1 and 120
    and (tagline is null or length(tagline) <= 300)
    and (story is null or length(story) <= 20000)
    and (resting_place is null or length(resting_place) <= 200)
  );

alter table public.memorial_media
  drop constraint if exists memorial_media_caption_bounds;
alter table public.memorial_media
  add constraint memorial_media_caption_bounds check (
    caption is null or length(caption) <= 500
  );
