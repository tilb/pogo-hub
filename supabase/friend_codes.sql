-- Friend codes per town: players share their Pokémon GO friend code without an account.
-- Run this in the Supabase SQL Editor (after schema.sql, or on its own).
--
-- How it works:
-- - Anyone can read the list (only code, town, play spot, nickname, team and date; never the secret key).
-- - Adding goes through add_friend_code(), which returns a secret key. The site keeps that key in
--   the player's browser; with it they can renew or remove their code.
-- - Codes disappear from the list 7 days after they were added or last renewed.
-- - Nobody can add, change or delete rows directly; only through the two functions below.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.friend_codes (
    id uuid primary key default gen_random_uuid(),
    code text not null unique check (code ~ '^[0-9]{12}$'),
    town text not null check (char_length(town) between 2 and 60),
    town_key text not null,                         -- lower-case town, for matching "Utrecht" and "utrecht "
    nickname text check (nickname is null or char_length(nickname) between 1 and 30),
    team text check (team is null or team in ('mystic', 'valor', 'instinct')),
    spot text check (spot is null or char_length(spot) between 2 and 60),   -- favourite place to play, e.g. 'Valkhof'
    spot_key text,                                  -- lower-case spot, for matching spellings
    secret_hash text not null,
    created_at timestamptz not null default now()
);

-- For projects that ran an earlier version of this file
alter table public.friend_codes add column if not exists spot text check (spot is null or char_length(spot) between 2 and 60);
alter table public.friend_codes add column if not exists spot_key text;

create index if not exists friend_codes_town_key on public.friend_codes (town_key);

alter table public.friend_codes enable row level security;

-- Visitors may only read these columns, never secret_hash
revoke all on public.friend_codes from anon, authenticated;
grant select (id, code, town, town_key, spot, spot_key, nickname, team, created_at) on public.friend_codes to anon, authenticated;

drop policy if exists "Everyone can read recent friend codes" on public.friend_codes;
create policy "Everyone can read recent friend codes"
    on public.friend_codes for select
    to anon, authenticated
    using (created_at > now() - interval '7 days');

-- The earlier version had no play spot; remove it so only the new function exists
drop function if exists public.add_friend_code(text, text, text, text, text);

-- Add a code, or renew/update it when the right secret key is given.
-- Returns the secret key to keep. Raises 'already_listed' when someone else's live code is taken.
create or replace function public.add_friend_code(
    p_code text,
    p_town text,
    p_nickname text default null,
    p_team text default null,
    p_secret text default null,
    p_spot text default null
)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
    clean_code text := regexp_replace(coalesce(p_code, ''), '[^0-9]', '', 'g');
    clean_town text := btrim(regexp_replace(coalesce(p_town, ''), '\s+', ' ', 'g'));
    clean_nick text := nullif(btrim(coalesce(p_nickname, '')), '');
    clean_team text := nullif(lower(btrim(coalesce(p_team, ''))), '');
    clean_spot text := nullif(btrim(regexp_replace(coalesce(p_spot, ''), '\s+', ' ', 'g')), '');
    existing public.friend_codes%rowtype;
    new_secret text;
begin
    if clean_code !~ '^[0-9]{12}$' then
        raise exception 'invalid_code';
    end if;
    if char_length(clean_town) < 2 or char_length(clean_town) > 60 then
        raise exception 'invalid_town';
    end if;
    if clean_spot is not null and (char_length(clean_spot) < 2 or char_length(clean_spot) > 60) then
        raise exception 'invalid_spot';
    end if;

    select * into existing from public.friend_codes where code = clean_code;

    if found then
        if p_secret is not null and existing.secret_hash = encode(digest(p_secret, 'sha256'), 'hex') then
            -- Owner renews or updates their entry; the key stays the same
            update public.friend_codes
               set town = clean_town, town_key = lower(clean_town), spot = clean_spot, spot_key = lower(clean_spot),
                   nickname = clean_nick, team = clean_team, created_at = now()
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
    insert into public.friend_codes (code, town, town_key, spot, spot_key, nickname, team, secret_hash)
    values (clean_code, clean_town, lower(clean_town), clean_spot, lower(clean_spot), clean_nick, clean_team, encode(digest(new_secret, 'sha256'), 'hex'));
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

revoke all on function public.add_friend_code(text, text, text, text, text, text) from public;
revoke all on function public.remove_friend_code(text, text) from public;
grant execute on function public.add_friend_code(text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.remove_friend_code(text, text) to anon, authenticated;
