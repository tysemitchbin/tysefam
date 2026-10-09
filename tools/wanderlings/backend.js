// Supabase: sign-in, saved game state, and the Ride with GPS edge function.

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

export const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

let session = null;

// Resolves once someone is signed in, showing the sign-in screen if needed.
export async function requireSession() {
  ({ data: { session } } = await sb.auth.getSession());
  sb.auth.onAuthStateChange((_e, s) => { session = s; });
  if (session) return session;
  return new Promise(resolve => showSignIn(s => { session = s; resolve(s); }));
}

export function userId() { return session?.user?.id; }
export function userEmail() { return session?.user?.email; }

export async function signOut() {
  await sb.auth.signOut();
  location.reload();
}

// Calls the `rwgps` edge function as the signed-in user.
export async function api(route, init = {}) {
  const { data: { session: s } } = await sb.auth.getSession();
  const res = await fetch(`${SUPABASE_URL}/functions/v1/rwgps/${route}`, {
    ...init,
    headers: { Authorization: `Bearer ${s?.access_token}`, apikey: SUPABASE_ANON_KEY, ...(init.headers || {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`);
  return body;
}

export async function loadState() {
  const { data, error } = await sb.from('game_state').select('state').maybeSingle();
  if (error) throw error;
  return data?.state || null;
}

export async function saveState(state) {
  const { error } = await sb.from('game_state').upsert({ user_id: userId(), state, updated_at: new Date().toISOString() });
  if (error) throw error;
}

// --- sharing ------------------------------------------------------------------
// A garden can be shared read-only with another invited person (by email).

export async function sharedGardens() {
  const { data, error } = await sb.rpc('shared_gardens');
  if (error) throw error;
  return data || [];
}

export async function loadStateFor(ownerId) {
  const { data, error } = await sb.from('game_state').select('state').eq('user_id', ownerId).maybeSingle();
  if (error) throw error;
  return data?.state || null;
}

export async function myShares() {
  const { data, error } = await sb.from('garden_shares').select('viewer_email').eq('owner_email', userEmail()?.toLowerCase());
  if (error) throw error;
  return (data || []).map(r => r.viewer_email);
}

export async function addShare(viewerEmail) {
  const { error } = await sb.from('garden_shares').insert({ owner_email: userEmail().toLowerCase(), viewer_email: viewerEmail.trim().toLowerCase() });
  if (error && error.code !== '23505') throw error; // already shared is fine
}

export async function removeShare(viewerEmail) {
  const { error } = await sb.from('garden_shares').delete().eq('owner_email', userEmail().toLowerCase()).eq('viewer_email', viewerEmail);
  if (error) throw error;
}

// --- sign-in screen -----------------------------------------------------------
// Email + password, no emails sent. Only addresses on the guest list
// (public.allowed_emails) can create an account.

function showSignIn(done) {
  const el = document.querySelector('#signin');
  el.hidden = false;
  const form = el.querySelector('form');
  const msg = el.querySelector('.signin-msg');
  const toggle = el.querySelector('.signin-toggle');
  let creating = false;
  const setMode = c => {
    creating = c;
    form.querySelector('button[type=submit]').textContent = c ? 'Create my account' : 'Sign in';
    form.password.autocomplete = c ? 'new-password' : 'current-password';
    el.querySelector('.signin-hint').hidden = !c;
    toggle.textContent = c ? 'I already have a password' : 'First time here? Create a password';
    msg.textContent = '';
  };
  setMode(false);
  toggle.onclick = () => setMode(!creating);

  form.onsubmit = async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    msg.textContent = '';
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    try {
      const { data, error } = creating
        ? await sb.auth.signUp({ email, password })
        : await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.session) throw new Error('confirm_email_on');
      el.hidden = true;
      done(data.session);
    } catch (err) {
      const m = String(err.message || err);
      msg.textContent = /database error|not invited/i.test(m) ? 'That email isn’t on the guest list.'
        : /already registered/i.test(m) ? 'You already have an account. Sign in instead.'
        : /invalid login/i.test(m) ? 'Email or password didn’t match.'
        : /password should be/i.test(m) ? 'Please use at least 6 characters.'
        : /rate|too many/i.test(m) ? 'Too many tries. Wait a minute and try again.'
        : m === 'confirm_email_on' ? 'Almost! Email confirmation is still switched on in Supabase (see README).'
        : m;
    }
    btn.disabled = false;
  };
}
