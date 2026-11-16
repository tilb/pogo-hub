// Supabase configuration
// Fill these in from your Supabase project (Settings → API → Project URL and the "anon public" key)
// to turn on accounts, synced schedules and the admin page. Both values are meant to be public.
// Leave them empty to run the site without accounts: events then come from data/events.json.
const SUPABASE_URL = 'https://dsfttdrwsukxuhoptgdn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_I4nZEwRWg3_KBgPvG9fBmA_5VGobKMk';

// Which parts of the site use Supabase. Turn the others on once their tables exist (see supabase/README.md).
window.siteFeatures = {
    friendCodes: true,          // Friends page (supabase/friend_codes.sql)
    accounts: false,            // login, synced saved events, admin page (supabase/schema.sql)
    eventsFromDatabase: false   // events from the database instead of data/events.json (supabase/seed.sql)
};

// Initialize Supabase client (use supabaseClient to avoid conflict with library on window.supabase)
window.supabaseClient = (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase)
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
