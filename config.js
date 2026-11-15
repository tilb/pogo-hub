// Supabase configuration
// Fill these in from your Supabase project (Settings → API → Project URL and the "anon public" key)
// to turn on accounts, synced schedules and the admin page. Both values are meant to be public.
// Leave them empty to run the site without accounts: events then come from data/events.json.
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';

// Initialize Supabase client (use supabaseClient to avoid conflict with library on window.supabase)
window.supabaseClient = (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase)
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
