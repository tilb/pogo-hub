-- Friend codes per country: players share their Pokémon GO friend code without an account.
-- Run this in the Supabase SQL Editor (after schema.sql, or on its own).
--
-- How it works:
-- - Anyone can read the list (only code, country, team and date; never the secret key).
-- - Adding goes through add_friend_code(), which returns a secret key. The site keeps that key in
--   the player's browser; with it they can renew or remove their code.
-- - Codes disappear from the list 7 days after they were added or last renewed.
-- - Nobody can add, change or delete rows directly; only through the two functions below.
-- - The country is stored as its two-letter code ('NL', 'BE', 'US'); the site shows the name.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.friend_codes (
    id uuid primary key default gen_random_uuid(),
    code text not null unique check (code ~ '^[0-9]{12}$'),
    country text not null check (country ~ '^[A-Z]{2}$'),
    team text check (team is null or team in ('mystic', 'valor', 'instinct')),
    secret_hash text not null,
    created_at timestamptz not null default now()
);

create index if not exists friend_codes_country on public.friend_codes (country);

alter table public.friend_codes enable row level security;

-- Visitors may only read these columns, never secret_hash
revoke all on public.friend_codes from anon, authenticated;
grant select (id, code, country, team, created_at) on public.friend_codes to anon, authenticated;

drop policy if exists "Everyone can read recent friend codes" on public.friend_codes;
create policy "Everyone can read recent friend codes"
    on public.friend_codes for select
    to anon, authenticated
    using (created_at > now() - interval '7 days');

-- The earlier version took a town and a nickname; remove it so only the new function exists
drop function if exists public.add_friend_code(text, text, text, text, text);

-- Add a code, or renew/update it when the right secret key is given.
-- Returns the secret key to keep. Raises 'already_listed' when someone else's live code is taken.
create or replace function public.add_friend_code(
    p_code text,
    p_country text,
    p_team text default null,
    p_secret text default null
)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
    clean_code text := regexp_replace(coalesce(p_code, ''), '[^0-9]', '', 'g');
    clean_country text := upper(btrim(coalesce(p_country, '')));
    clean_team text := nullif(lower(btrim(coalesce(p_team, ''))), '');
    existing public.friend_codes%rowtype;
    new_secret text;
begin
    if clean_code !~ '^[0-9]{12}$' then
        raise exception 'invalid_code';
    end if;
    if clean_country !~ '^[A-Z]{2}$' then
        raise exception 'invalid_country';
    end if;

    select * into existing from public.friend_codes where code = clean_code;

    if found then
        if p_secret is not null and existing.secret_hash = encode(digest(p_secret, 'sha256'), 'hex') then
            -- Owner renews or updates their entry; the key stays the same
            update public.friend_codes
               set country = clean_country, team = clean_team, created_at = now()
             where id = existing.id;
            return p_secret;
        elsif existing.created_at > now() - interval '7 days' then
            raise exception 'already_listed';
        else
            -- Expired entry: someone may list the code again
            delete from public.friend_codes where id = existing.id;
        end if;
    end if;

    new_secret := encode(gen_random_bytes(16), 'hex');
    insert into public.friend_codes (code, country, team, secret_hash)
    values (clean_code, clean_country, clean_team, encode(digest(new_secret, 'sha256'), 'hex'));
    return new_secret;
end;
$$;

-- Remove a code with its secret key. Returns true when something was removed.
create or replace function public.remove_friend_code(p_code text, p_secret text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
    removed integer;
begin
    delete from public.friend_codes
     where code = regexp_replace(coalesce(p_code, ''), '[^0-9]', '', 'g')
       and secret_hash = encode(digest(coalesce(p_secret, ''), 'sha256'), 'hex');
    get diagnostics removed = row_count;
    return removed > 0;
end;
$$;

revoke all on function public.add_friend_code(text, text, text, text) from public;
revoke all on function public.remove_friend_code(text, text) from public;
grant execute on function public.add_friend_code(text, text, text, text) to anon, authenticated;
grant execute on function public.remove_friend_code(text, text) to anon, authenticated;
