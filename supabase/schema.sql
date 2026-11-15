-- PoGo Hub database
-- Run this once in a new Supabase project: Dashboard → SQL Editor → paste → Run.
-- Then run seed.sql to fill the events table with the starting list.

-- ── Admins ──────────────────────────────────────────────────────────────
-- Who may add, change and delete events. Add yourself after you've signed up
-- on the site (replace the email address):
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'you@example.com';
create table if not exists public.admins (
    user_id uuid primary key references auth.users (id) on delete cascade,
    created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "Admins can see their own row" on public.admins;
create policy "Admins can see their own row"
    on public.admins for select
    to authenticated
    using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ── Events ──────────────────────────────────────────────────────────────
-- starts_at / ends_at: "2026-11-21T14:00" means local time wherever you play
-- (most events); a trailing Z ("2026-11-10T21:00Z") means one global moment.
create table if not exists public.events (
    id text primary key,
    name text not null,
    type text not null,
    starts_at text not null,
    ends_at text not null,
    pokemon jsonb not null default '[]'::jsonb,   -- [{"name": "Pawniard", "shiny": true}]
    bonuses text[] not null default '{}',
    promo_codes text[] not null default '{}',
    description text,                              -- optional: replaces the automatic description
    image_url text,
    updated_at timestamptz not null default now()
);

alter table public.events enable row level security;

drop policy if exists "Everyone can read events" on public.events;
create policy "Everyone can read events"
    on public.events for select
    to anon, authenticated
    using (true);

drop policy if exists "Admins can add events" on public.events;
create policy "Admins can add events"
    on public.events for insert
    to authenticated
    with check (public.is_admin());

drop policy if exists "Admins can change events" on public.events;
create policy "Admins can change events"
    on public.events for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "Admins can delete events" on public.events;
create policy "Admins can delete events"
    on public.events for delete
    to authenticated
    using (public.is_admin());

-- ── Saved events ────────────────────────────────────────────────────────
-- Each user's own schedule; nobody else can see or change it.
create table if not exists public.saved_events (
    user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
    event_id text not null,
    created_at timestamptz not null default now(),
    primary key (user_id, event_id)
);

alter table public.saved_events enable row level security;

drop policy if exists "Users see their own saved events" on public.saved_events;
create policy "Users see their own saved events"
    on public.saved_events for select
    to authenticated
    using (user_id = auth.uid());

drop policy if exists "Users save events for themselves" on public.saved_events;
create policy "Users save events for themselves"
    on public.saved_events for insert
    to authenticated
    with check (user_id = auth.uid());

drop policy if exists "Users remove their own saved events" on public.saved_events;
create policy "Users remove their own saved events"
    on public.saved_events for delete
    to authenticated
    using (user_id = auth.uid());
