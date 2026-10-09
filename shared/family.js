/* ════════════════════════════════════════════════════════════════
   FAMILY HELPERS — shared by every tool. Load after site.js:

     <script src="../../site.js"></script>
     <script src="../../shared/family.js"></script>

   What you get on window.Family:
     Family.store('tool-id')  shared data that syncs between devices
     Family.me()              who is using this device (e.g. "Mitch")
     Family.entries(obj)      [id, item] pairs sorted oldest-first
     Family.esc(text)         make text safe to put in innerHTML
     Family.url('tools/x/')   link relative to the site root
     Family.signOut()

   Saving data:
     • Supabase filled in (site.js)  → family sign-in, live sync on every device
     • Supabase left blank           → saves in this browser only

   A page with <body data-tool="tool-id"> also gets the family menu bar
   at the top, linking back home and to every other tool.
═════════════════════════════════════════════════════════════════ */
(function () {
  const SITE = window.SITE || { name: 'Family', tools: [], people: [] };
  const ROOT = new URL('..', document.currentScript.src).href;   // this file lives in /shared/
  const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';

  const esc = s => String(s ?? '').replace(/[&<>"']/g, m =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const uid = () => (crypto.randomUUID ? crypto.randomUUID()
    : 'id' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
  const url = path => new URL(path || '', ROOT).href;
  const clone = v => (v == null ? v : JSON.parse(JSON.stringify(v)));
  const entries = obj => Object.entries(obj || {}).sort((a, b) => (a[1].ts || 0) - (b[1].ts || 0));

  let member = null;   // { user_id, name } once signed in to Supabase
  function me() {
    if (member) return member.name;
    return localStorage.getItem('family_me') || (SITE.people || [])[0] || 'Someone';
  }

  /* ───────── Supabase connection + family sign-in ───────── */
  let clientPromise = null;
  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  /* Resolves to a signed-in Supabase client, or null when the site runs on this device only. */
  function connect() {
    if (clientPromise) return clientPromise;
    const cfg = SITE.supabase || {};
    if (!cfg.url || !cfg.key) return (clientPromise = Promise.resolve(null));
    clientPromise = (async () => {
      try {
        if (!window.supabase) await loadScript(SUPABASE_JS);
      } catch (e) {
        console.warn('Could not load Supabase, saving on this device only.', e);
        return null;
      }
      const sb = window.supabase.createClient(cfg.url, cfg.key);
      await signIn(sb);
      return sb;
    })();
    return clientPromise;
  }

  async function lookupMember(sb) {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return null;
    const { data } = await sb.from('family_members').select('user_id,name').eq('user_id', user.id).maybeSingle();
    return data ? data : { notMember: true, email: user.email, id: user.id };
  }

  /* Shows the sign-in card until a family member is signed in. */
  async function signIn(sb) {
    let m = await lookupMember(sb);
    if (m && !m.notMember) { member = m; renderUser(); return; }
    const ui = authCard();
    await new Promise(resolve => {
      const showNotMember = m => {
        ui.box.innerHTML = `
          <h2>Almost there 🌱</h2>
          <p>You're signed in as <b>${esc(m.email)}</b>, but this account isn't on the family list yet.</p>
          <p>Ask whoever runs the site to add you. They'll need this:</p>
          <code>${esc(m.email)}</code>
          <div class="fam-acts"><button class="fam-btn ghost" data-act="retry">I've been added</button>
          <button class="fam-btn ghost" data-act="out">Sign out</button></div>`;
        ui.box.querySelector('[data-act=retry]').onclick = check;
        ui.box.querySelector('[data-act=out]').onclick = async () => { await sb.auth.signOut(); showForm(); };
      };
      const check = async () => {
        const m = await lookupMember(sb);
        if (!m) return showForm();
        if (m.notMember) return showNotMember(m);
        member = m; ui.close(); renderUser(); resolve();
      };
      const showForm = (msg = '') => {
        ui.box.innerHTML = `
          <h2>🏔️ ${esc(SITE.name)}</h2>
          <p>Sign in to see the family's stuff. You'll only need to do this once on each device.</p>
          <form>
            <label>Email<input type="email" name="email" autocomplete="email" required></label>
            <label>Password<input type="password" name="password" autocomplete="current-password" required minlength="6"></label>
            <p class="fam-msg">${msg}</p>
            <div class="fam-acts">
              <button class="fam-btn" type="submit">Sign in</button>
              <button class="fam-btn ghost" type="button" data-act="new">First time? Create account</button>
            </div>
          </form>`;
        const f = ui.box.querySelector('form');
        const say = t => { f.querySelector('.fam-msg').textContent = t; };
        f.onsubmit = async e => {
          e.preventDefault();
          say('Signing in…');
          const { error } = await sb.auth.signInWithPassword({ email: f.email.value.trim(), password: f.password.value });
          if (error) return say(error.message);
          check();
        };
        f.querySelector('[data-act=new]').onclick = async () => {
          if (!f.reportValidity()) return;
          say('Creating your account…');
          const { data, error } = await sb.auth.signUp({ email: f.email.value.trim(), password: f.password.value });
          if (error) return say(error.message);
          if (!data.session) return say('Check your email to confirm your account, then sign in here.');
          check();
        };
      };
      if (m && m.notMember) showNotMember(m); else showForm();
    });
  }

  async function signOut() {
    const sb = await connect();
    if (sb) { await sb.auth.signOut(); location.reload(); }
  }

  /* ───────── store: one API, cloud (Supabase) or this device (localStorage) ─────────
     Data is organised as  tool → collection → items.  Every item is a plain
     object; add() stamps it with ts (time added) and by (who added it).

       const store = Family.store('chore-chart');
       store.watch('chores', chores => draw(chores));   // { id: item, … }, live
       const id = await store.add('chores', { text: 'Bins', done: false });
       store.update('chores', id, { done: true });
       store.remove('chores', id);                                          */
  function store(toolId) {
    if (!toolId) throw new Error('Family.store needs a tool id');
    const s = { mode: 'connecting' };
    const localKey = 'family:' + toolId;
    let sb = null;
    let data = {};               // { collection: { id: item } }
    const where = {};            // id → collection (to place realtime deletes)
    const watchers = [];         // [collection, callback]

    const notify = () => watchers.forEach(([c, cb]) => cb(clone(data[c] || {})));
    const saveLocal = () => { if (!sb) localStorage.setItem(localKey, JSON.stringify(data)); };
    const put = (c, id, item) => { (data[c] = data[c] || {})[id] = item; where[id] = c; };
    const drop = id => { const c = where[id]; if (c && data[c]) delete data[c][id]; delete where[id]; };
    const loadLocal = () => {
      try { data = JSON.parse(localStorage.getItem(localKey)) || {}; } catch (e) { data = {}; }
      Object.entries(data).forEach(([c, items]) => Object.keys(items).forEach(id => { where[id] = c; }));
    };

    async function loadCloud() {
      const { data: rows, error } = await sb.from('family_items').select('id,collection,data').eq('tool', toolId);
      if (error) { console.error('Family: could not load data', error); return; }
      data = {};
      rows.forEach(r => put(r.collection, r.id, r.data));
      notify();
    }
    // Write failed? Say so and reload what's really saved, so the page doesn't lie.
    const check = ({ error }) => { if (error) { console.error('Family: save failed', error); alert('Sorry, that didn\'t save: ' + error.message); loadCloud(); } };

    s.ready = connect().then(async client => {
      sb = client;
      s.mode = sb ? 'cloud' : 'local';
      if (sb) {
        await loadCloud();
        sb.channel('family:' + toolId)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'family_items' }, p => {
            if (p.eventType === 'DELETE') { if (where[p.old.id]) { drop(p.old.id); notify(); } return; }
            if (p.new.tool !== toolId) return;
            drop(p.new.id); put(p.new.collection, p.new.id, p.new.data); notify();
          })
          .subscribe(status => { if (status === 'SUBSCRIBED') loadCloud(); });   // catch anything missed while connecting
      } else {
        loadLocal();
        window.addEventListener('storage', e => { if (e.key === localKey) { loadLocal(); notify(); } });
      }
      return s;
    });

    /* Call cb(items) now and every time that collection changes, on any device. Returns an unsubscribe fn. */
    s.watch = (collection, cb) => {
      const w = [collection, cb];
      watchers.push(w);
      s.ready.then(() => { if (watchers.includes(w)) cb(clone(data[collection] || {})); });
      return () => { const i = watchers.indexOf(w); if (i >= 0) watchers.splice(i, 1); };
    };
    /* One-time read of a whole collection, or one item. */
    s.get = async (collection, id) => {
      await s.ready;
      const items = data[collection] || {};
      return clone(id ? items[id] : items);
    };
    /* Add a new item. Returns its id. */
    s.add = async (collection, item) => {
      await s.ready;
      const id = uid();
      const obj = Object.assign({ ts: Date.now(), by: me() }, clone(item));
      put(collection, id, obj); saveLocal(); notify();
      if (sb) check(await sb.from('family_items').insert({ id, tool: toolId, collection, data: obj }));
      return id;
    };
    /* Change some fields of an item, keeping the rest. */
    s.update = async (collection, id, fields) => {
      await s.ready;
      const obj = Object.assign({}, (data[collection] || {})[id], clone(fields));
      put(collection, id, obj); saveLocal(); notify();
      if (sb) check(await sb.from('family_items').update({ data: obj }).eq('id', id));
    };
    /* Replace an item completely (creates it if it doesn't exist). Handy for settings: set('settings', 'theme', {...}). */
    s.set = async (collection, id, item) => {
      await s.ready;
      const obj = clone(item);
      put(collection, id, obj); saveLocal(); notify();
      if (sb) check(await sb.from('family_items').upsert({ id, tool: toolId, collection, data: obj }));
    };
    s.remove = async (collection, id) => {
      await s.ready;
      drop(id); saveLocal(); notify();
      if (sb) check(await sb.from('family_items').delete().eq('id', id));
    };
    return s;
  }

  /* ───────── page chrome: menu bar + sign-in card (self-contained styles) ───────── */
  const CSS = `
    .fam-bar{position:relative;z-index:200;display:flex;align-items:center;gap:10px;
      padding:7px 14px;background:#3f5e44;color:#fff;font:700 .88rem 'Nunito',system-ui,sans-serif;}
    .fam-bar a{color:#fff;text-decoration:none;}
    .fam-home{display:flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;transition:.15s;}
    .fam-home:hover{background:rgba(255,255,255,.14);}
    .fam-sp{flex:1;}
    .fam-user{opacity:.9;font-weight:700;}
    .fam-user button{border:none;background:none;color:#fff;font:inherit;text-decoration:underline;cursor:pointer;opacity:.8;}
    .fam-menu{position:relative;}
    .fam-menu>button{border:none;background:rgba(255,255,255,.14);color:#fff;font:inherit;
      padding:5px 12px;border-radius:999px;cursor:pointer;}
    .fam-menu>button:hover{background:rgba(255,255,255,.24);}
    .fam-list{display:none;position:absolute;right:0;top:calc(100% + 6px);min-width:220px;max-width:80vw;
      background:#fffdf7;border:1px solid #e9e2d2;border-radius:14px;padding:6px;
      box-shadow:0 14px 40px rgba(80,90,60,.22);}
    .fam-menu.open .fam-list{display:block;}
    .fam-list a{display:flex;align-items:center;gap:9px;color:#3c4138;padding:9px 10px;border-radius:10px;}
    .fam-list a:hover{background:#eef6ea;}
    .fam-list a.cur{background:#7fa874;color:#fff;}
    .fam-auth{position:fixed;inset:0;z-index:300;background:rgba(251,247,238,.96);display:flex;
      align-items:center;justify-content:center;padding:16px;font-family:'Nunito',system-ui,sans-serif;color:#3c4138;}
    .fam-card{background:#fffdf7;border:1px solid #e9e2d2;border-radius:22px;padding:24px;max-width:400px;width:100%;
      box-shadow:0 14px 40px rgba(80,90,60,.16);}
    .fam-card h2{margin:0 0 6px;font-family:'Fredoka',sans-serif;color:#3f5e44;}
    .fam-card p{color:#6f7468;margin:0 0 12px;line-height:1.4;}
    .fam-card label{display:block;font-weight:800;font-size:.82rem;color:#6f7468;margin:10px 0 0;}
    .fam-card input{display:block;width:100%;box-sizing:border-box;margin-top:5px;border:2px solid #e9e2d2;border-radius:12px;
      padding:10px;font:inherit;outline:none;}
    .fam-card input:focus{border-color:#7fa874;}
    .fam-card code{display:block;background:#eef0e8;padding:8px 10px;border-radius:10px;word-break:break-all;}
    .fam-msg{min-height:1.2em;font-weight:700;color:#e89b6f !important;margin:10px 0 0 !important;}
    .fam-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;}
    .fam-btn{border:none;border-radius:12px;padding:10px 16px;font:700 1rem 'Nunito',system-ui,sans-serif;color:#fff;
      background:#7fa874;cursor:pointer;}
    .fam-btn:hover{background:#5d8a5f;}
    .fam-btn.ghost{background:#fff;color:#3f5e44;border:2px solid #e9e2d2;}`;
  let styled = false;
  function addStyles() {
    if (styled) return; styled = true;
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  }

  function authCard() {
    addStyles();
    const wrap = document.createElement('div');
    wrap.className = 'fam-auth';
    wrap.innerHTML = '<div class="fam-card"></div>';
    document.body.appendChild(wrap);
    return { box: wrap.firstChild, close: () => wrap.remove() };
  }

  function renderUser() {
    const slot = document.querySelector('.fam-user');
    if (!slot || !member) return;
    slot.innerHTML = `👤 ${esc(member.name)} · <button type="button">sign out</button>`;
    slot.querySelector('button').onclick = signOut;
  }

  function injectNav() {
    const toolId = document.body && document.body.dataset.tool;
    if (!toolId) return;
    addStyles();
    const tools = (SITE.tools || []).filter(t => !t.hidden || t.id === toolId);
    const bar = document.createElement('div');
    bar.className = 'fam-bar';
    bar.innerHTML = `
      <a class="fam-home" href="${esc(url(''))}">🏔️ ${esc(SITE.name)}</a>
      <span class="fam-sp"></span>
      <span class="fam-user"></span>
      <div class="fam-menu">
        <button type="button" aria-haspopup="true">☰ Tools</button>
        <div class="fam-list">
          <a href="${esc(url(''))}">🏔️ Home</a>
          ${tools.map(t => `<a href="${esc(url('tools/' + t.id + '/'))}"${t.id === toolId ? ' class="cur"' : ''}>${esc(t.emoji || '🧩')} ${esc(t.name)}</a>`).join('')}
        </div>
      </div>`;
    document.body.prepend(bar);
    renderUser();
    const menu = bar.querySelector('.fam-menu');
    menu.querySelector('button').onclick = e => { e.stopPropagation(); menu.classList.toggle('open'); };
    document.addEventListener('click', () => menu.classList.remove('open'));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') menu.classList.remove('open'); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectNav);
  else injectNav();

  window.Family = { site: SITE, store, me, entries, esc, uid, url, signOut };
})();
