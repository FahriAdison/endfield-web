-- Run this once in Supabase SQL Editor.
-- It creates the table used by Card Creator "Save Link" feature.

create extension if not exists pgcrypto;

create table if not exists public.creator_showcases (
  id text primary key,
  alias text not null default '',
  character_id text not null default '',
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists creator_showcases_created_at_idx
  on public.creator_showcases (created_at desc);

alter table public.creator_showcases enable row level security;

drop policy if exists creator_showcases_public_read on public.creator_showcases;
create policy creator_showcases_public_read
  on public.creator_showcases
  for select
  to anon, authenticated
  using (true);

drop policy if exists creator_showcases_public_insert on public.creator_showcases;
create policy creator_showcases_public_insert
  on public.creator_showcases
  for insert
  to anon, authenticated
  with check (
    jsonb_typeof(payload) = 'object'
    and length(id) between 8 and 64
  );

