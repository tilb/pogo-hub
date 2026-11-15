// Admin page: add, change and delete events in our own database.
// Uses eventDefinitions, escapeHtml, buildEventSummary and getSession from script.js.

const adminState = { events: [], editingId: null };

function $(id) { return document.getElementById(id); }

function showGate(title, text, { login = false } = {}) {
    $('admin-gate').hidden = false;
    $('admin-view').hidden = true;
    $('gate-title').innerHTML = `<i class="ph-duotone ph-lock-key"></i> ${escapeHtml(title)}`;
    $('gate-text').innerHTML = text;
    $('admin-login').hidden = !login;
}

function slugify(text) {
    return String(text).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// "2026-11-21T14:00" (local) or "2026-11-10T21:00Z" (global) → value for a datetime-local input
function toInputValue(stored) {
    if (!stored) return '';
    if (!stored.endsWith('Z')) return stored.slice(0, 16);
    const d = new Date(stored);
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// datetime-local value → what we store
function fromInputValue(value, global) {
    if (!global) return value;
    return new Date(value).toISOString().slice(0, 16) + 'Z';
}

function lines(text) {
    return text.split('\n').map(l => l.trim()).filter(Boolean);
}

function readForm() {
    const global = $('f-global').checked;
    return {
        name: $('f-name').value.trim(),
        type: $('f-type').value,
        starts_at: fromInputValue($('f-start').value, global),
        ends_at: fromInputValue($('f-end').value, global),
        image_url: $('f-image').value.trim() || null,
        pokemon: lines($('f-pokemon').value).map(l => ({ name: l.replace(/\s*\*$/, ''), shiny: /\*$/.test(l) })),
        bonuses: lines($('f-bonuses').value),
        promo_codes: lines($('f-codes').value),
        description: $('f-description').value.trim() || null
    };
}

function fillForm(row) {
    adminState.editingId = row ? row.id : null;
    $('form-title').textContent = row ? 'Edit event' : 'New event';
    $('delete-btn').hidden = !row;
    $('f-name').value = row?.name || '';
    $('f-type').value = row?.type || 'event';
    $('f-image').value = row?.image_url || '';
    const global = !!row?.starts_at?.endsWith('Z');
    $('f-global').checked = global;
    $('f-start').value = toInputValue(row?.starts_at);
    $('f-end').value = toInputValue(row?.ends_at);
    $('f-pokemon').value = (row?.pokemon || []).map(p => p.name + (p.shiny ? ' *' : '')).join('\n');
    $('f-bonuses').value = (row?.bonuses || []).join('\n');
    $('f-codes').value = (row?.promo_codes || []).join('\n');
    $('f-description').value = row?.description || '';
    updatePreview();
}

// Show the description visitors will see, using the same wording as the site
function updatePreview() {
    const f = readForm();
    const start = new Date(f.starts_at);
    const end = new Date(f.ends_at);
    if (!f.name || isNaN(start) || isNaN(end)) {
        $('f-preview').textContent = '';
        return;
    }
    const preview = {
        name: f.name, eventID: adminState.editingId || 'preview', eventType: f.type, start, end,
        pokemon: f.pokemon, bonuses: f.bonuses, promoCodes: f.promo_codes, description: f.description
    };
    const def = eventDefinitions[f.type] || eventDefinitions['default'];
    $('f-preview').innerHTML = `<strong>Visitors will read:</strong> ${escapeHtml(buildEventSummary(preview, def))}`;
}

async function loadAdminEvents() {
    const { data, error } = await window.supabaseClient.from('events').select('*').order('starts_at');
    if (error) {
        $('admin-list').innerHTML = `<p class="subtitle">Could not load events: ${escapeHtml(error.message)}</p>`;
        return;
    }
    adminState.events = data;
    // script.js uses the global events list to link Raid Hours to their raids in the preview
    events = data.map(r => ({ ...r, eventID: r.id, eventType: r.type, pokemon: r.pokemon || [], start: new Date(r.starts_at), end: new Date(r.ends_at) }));
    renderAdminList();
}

function renderAdminList() {
    const now = new Date();
    const list = $('admin-list');
    if (!adminState.events.length) {
        list.innerHTML = '<p class="subtitle">No events yet. Add the first one above.</p>';
        return;
    }
    list.innerHTML = adminState.events.map(r => {
        const start = new Date(r.starts_at);
        const end = new Date(r.ends_at);
        const def = eventDefinitions[r.type] || eventDefinitions['default'];
        const past = end < now;
        return `
            <div class="list-item admin-row${past ? ' is-past' : ''}">
                <div class="list-date-box">
                    <span class="list-month">${start.toLocaleString('en-US', { month: 'short' })}</span>
                    <span class="list-day">${start.getDate()}</span>
                </div>
                <div class="list-content">
                    <span class="event-type">${escapeHtml(def.name)}${past ? ' · ended' : ''}</span>
                    <h4 style="font-size: 1.05rem; margin-top: 0.3rem;">${escapeHtml(r.name)}</h4>
                    <span style="color: var(--text-secondary); font-size: 0.85rem;">${start.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })} → ${end.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
                <button class="nav-btn" onclick="editEvent('${escapeHtml(r.id)}')"><i class="ph-bold ph-pencil-simple"></i> Edit</button>
            </div>`;
    }).join('');
}

window.editEvent = function (id) {
    const row = adminState.events.find(r => r.id === id);
    if (!row) return;
    fillForm(row);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function saveEvent(e) {
    e.preventDefault();
    const f = readForm();
    if (new Date(f.ends_at) <= new Date(f.starts_at)) {
        alert('The end has to be after the start.');
        return;
    }

    let id = adminState.editingId;
    if (!id) {
        const base = slugify(`${f.name} ${f.starts_at.slice(0, 10)}`) || 'event';
        id = base;
        let n = 2;
        while (adminState.events.some(r => r.id === id)) id = `${base}-${n++}`;
    }

    $('save-btn').disabled = true;
    const { error } = await window.supabaseClient.from('events').upsert({ id, ...f, updated_at: new Date().toISOString() });
    $('save-btn').disabled = false;

    if (error) {
        alert('Could not save: ' + error.message);
        return;
    }
    await loadAdminEvents();
    fillForm(adminState.events.find(r => r.id === id));
    $('save-btn').textContent = 'Saved ✓';
    setTimeout(() => { $('save-btn').textContent = 'Save event'; }, 1500);
}

async function deleteEvent() {
    const row = adminState.events.find(r => r.id === adminState.editingId);
    if (!row) return;
    if (!confirm(`Delete "${row.name}"? This can't be undone.`)) return;

    const { error } = await window.supabaseClient.from('events').delete().eq('id', row.id);
    if (error) {
        alert('Could not delete: ' + error.message);
        return;
    }
    fillForm(null);
    await loadAdminEvents();
}

async function initAdmin() {
    const typeSelect = $('f-type');
    typeSelect.innerHTML = Object.entries(eventDefinitions)
        .filter(([key]) => key !== 'default')
        .map(([key, def]) => `<option value="${escapeHtml(key)}">${escapeHtml(def.name)}</option>`)
        .join('');

    if (!window.supabaseClient) {
        showGate('Admin not available yet',
            'This page needs a Supabase project. Follow the steps in <code>supabase/README.md</code> to connect one.');
        return;
    }

    const session = await window.getSession();
    if (!session) {
        showGate('Admin login', 'Log in with your admin account to manage events.', { login: true });
        $('admin-login').onsubmit = async (e) => {
            e.preventDefault();
            const { error } = await window.supabaseClient.auth.signInWithPassword({
                email: $('admin-email').value.trim(),
                password: $('admin-password').value
            });
            if (error) alert('Login failed: ' + error.message);
            else window.location.reload();
        };
        return;
    }

    const { data: isAdmin, error } = await window.supabaseClient.rpc('is_admin');
    if (error || isAdmin !== true) {
        showGate('No admin access',
            'You\'re logged in, but this account isn\'t an admin. Add it to the <code>admins</code> table as described in <code>supabase/README.md</code>.');
        return;
    }

    $('admin-gate').hidden = true;
    $('admin-view').hidden = false;

    $('event-form').addEventListener('submit', saveEvent);
    $('event-form').addEventListener('input', updatePreview);
    $('delete-btn').addEventListener('click', deleteEvent);
    $('new-event-btn').addEventListener('click', () => fillForm(null));

    fillForm(null);
    await loadAdminEvents();
}

document.addEventListener('DOMContentLoaded', initAdmin);
