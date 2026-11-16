# Connecting Supabase

Without Supabase the site works read-only: events come from `data/events.json` and there is no login.
With Supabase you get accounts, saved events that sync across devices, and the admin page (`admin.html`).

1. Create a free project at supabase.com.
2. In the project, open **SQL Editor**, paste the contents of `schema.sql` and click **Run**.
3. Do the same with `seed.sql`. This fills the events table with the starting list.
   Then run `friend_codes.sql` for the Friends page (friend codes per country).
4. Open **Project Settings → API** and copy the **Project URL** and the **anon public** key into `config.js`.
   Both are meant to be public; the access rules in `schema.sql` decide who may change what.
5. Sign up on the site with your own email address.
6. Make yourself an admin: in the SQL Editor run (with your email address):

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```

7. Log in again. An **Admin** button now appears in the header.

## Event times

- `2026-11-21T14:00` means 2:00 PM local time wherever someone plays (most events).
- `2026-11-10T21:00Z` (with a Z) means one moment worldwide, shown in each visitor's own time zone.
  In the admin page this is the "Same moment worldwide" checkbox.

## Local list

`data/events.json` is the site's own starting list and the fallback when the database can't be reached.
Once Supabase is connected, the admin page is where you add and change events.
