// Thin wrapper around the Supabase JS client (loaded globally via CDN in index.html).
// Credentials are entered once in Settings and stored in localStorage — they are
// public-safe values (protected by Row Level Security on the server side).

const URL_KEY = 'qp_supabase_url';
const ANON_KEY = 'qp_supabase_anon_key';

let client = null;

export function isSupabaseConfigured() {
  return !!(localStorage.getItem(URL_KEY) && localStorage.getItem(ANON_KEY));
}

export function getSupabaseConfig() {
  return {
    url: localStorage.getItem(URL_KEY) || '',
    anonKey: localStorage.getItem(ANON_KEY) || '',
  };
}

export function configureSupabase(url, anonKey) {
  localStorage.setItem(URL_KEY, url.trim());
  localStorage.setItem(ANON_KEY, anonKey.trim());
  client = null; // force re-init with new credentials
}

export function disconnectSupabase() {
  localStorage.removeItem(URL_KEY);
  localStorage.removeItem(ANON_KEY);
  client = null;
}

export function getSupabase() {
  if (client) return client;
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey || !window.supabase) return null;
  client = window.supabase.createClient(url, anonKey);
  return client;
}
