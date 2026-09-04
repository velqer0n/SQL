import { getSupabase } from './supabaseClient.js';
import { Store } from './state.js';

const TABLE = 'sql_progress';

export async function getSession() {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.auth.getSession();
  if (error) return null;
  return data.session;
}

export async function signUp(email, password) {
  const sb = getSupabase();
  if (!sb) return { ok: false, error: 'Supabase не настроен' };
  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) return { ok: false, error: error.message };
  return { ok: true, session: data.session };
}

export async function signIn(email, password) {
  const sb = getSupabase();
  if (!sb) return { ok: false, error: 'Supabase не настроен' };
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };
  return { ok: true, session: data.session };
}

export async function signOut() {
  const sb = getSupabase();
  if (!sb) return;
  await sb.auth.signOut();
}

/** Uploads the current local state to the cloud, overwriting the cloud copy. */
export async function pushProgress() {
  const sb = getSupabase();
  const session = await getSession();
  if (!sb || !session) return { ok: false };
  const { error } = await sb.from(TABLE).upsert({
    user_id: session.user.id,
    state: Store.get(),
    updated_at: new Date().toISOString(),
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Fetches the cloud copy of the state, or null if none exists yet. */
export async function pullProgress() {
  const sb = getSupabase();
  const session = await getSession();
  if (!sb || !session) return { ok: false };
  const { data, error } = await sb.from(TABLE).select('state, updated_at').eq('user_id', session.user.id).maybeSingle();
  if (error) return { ok: false, error: error.message };
  return { ok: true, state: data ? data.state : null, updatedAt: data ? data.updated_at : null };
}

/** Overwrites local progress with a cloud snapshot. */
export function applyCloudState(cloudState) {
  Store.importData(JSON.stringify(cloudState));
}

let pushTimer = null;
let syncEnabled = false;

export function setSyncEnabled(enabled) {
  syncEnabled = enabled;
}

/** Call after any local state change; pushes to the cloud after a short debounce. */
export function scheduleCloudPush() {
  if (!syncEnabled) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => { pushProgress(); }, 2500);
}
