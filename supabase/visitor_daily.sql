-- Run this once in Supabase SQL Editor.
-- Table untuk counter unique visitor harian (berdasarkan visitor_id lokal browser).

create table if not exists public.visitor_daily (
  visit_date date not null,
  visitor_id text not null,
  created_at timestamptz not null default now(),
  primary key (visit_date, visitor_id)
);

alter table public.visitor_daily enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert on table public.visitor_daily to anon, authenticated;

drop policy if exists visitor_daily_public_read on public.visitor_daily;
create policy visitor_daily_public_read
  on public.visitor_daily
  for select
  to anon, authenticated
  using (true);

drop policy if exists visitor_daily_public_insert on public.visitor_daily;
create policy visitor_daily_public_insert
  on public.visitor_daily
  for insert
  to anon, authenticated
  with check (
    length(visitor_id) between 12 and 96
    and visitor_id ~ '^[A-Za-z0-9._:-]+$'
    and visit_date >= current_date - 2
    and visit_date <= current_date + 2
  );
