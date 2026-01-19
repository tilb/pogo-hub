// Supabase Configuration
const SUPABASE_URL = 'https://ssbbewshwqgvfpmaxgzg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzYmJld3Nod3FndmZwbWF4Z3pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NTY0MDksImV4cCI6MjA4NDMzMjQwOX0.4fybWGY1u4k3x7-dnQ5de0tGzLr1OKGMEVppre1Jq_g';

// Initialize Supabase client (use supabaseClient to avoid conflict with library on window.supabase)
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
