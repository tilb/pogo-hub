// Friends page: find Pokémon GO friend codes from players in your town, and list your own.
// No account needed: adding a code returns a secret key that this browser keeps, so you can
// renew or remove the code later. Uses escapeHtml from script.js and t() from settings.js.

const FRIEND_DAYS = 7;            // codes disappear this long after they were added or renewed
const MY_CODE_KEY = 'pogo_friend_code';
const TOWN_KEY = 'pogo_town';

const friendState = { codes: [], loaded: false, error: null, spot: '' };

function readJson(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}

function writeJson(key, value) {
    try {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, JSON.stringify(value));
    } catch { /* private mode: lasts until the page closes */ }
}

function readText(key) {
    try { return localStorage.getItem(key) || ''; } catch { return ''; }
}

function writeText(key, value) {
    try { localStorage.setItem(key, value); } catch { /* ignore */ }
}

function digitsOnly(value) {
    return String(value || '').replace(/\D/g, '');
}

// "123456789012" → "1234 5678 9012"
function formatCode(code) {
    return digitsOnly(code).replace(/(\d{4})(?=\d)/g, '$1 ');
}

function townKey(town) {
    return String(town || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function daysLeft(createdAt) {
    const expires = new Date(createdAt).getTime() + FRIEND_DAYS * 86400000;
    return Math.max(0, Math.ceil((expires - Date.now()) / 86400000));
}

function friendError(error) {
    const message = String(error?.message || error || '');
    if (message.includes('already_listed')) return window.t('friends.errorTaken');
    if (message.includes('invalid_code')) return window.t('friends.errorCode');
    if (message.includes('invalid_town')) return window.t('friends.errorTown');
    if (message.includes('invalid_spot')) return window.t('friends.errorSpot');
    return window.t('friends.errorGeneral', { message });
}

async function loadFriendCodes() {
    if (!window.supabaseClient) return;
    const { data, error } = await window.supabaseClient
        .from('friend_codes')
        .select('id, code, town, town_key, spot, spot_key, nickname, team, created_at')
        .order('created_at', { ascending: false })
        .limit(2000);
    friendState.loaded = true;
    friendState.error = error ? error.message : null;
    friendState.codes = data || [];
}

// ── Finding codes ───────────────────────────────────────────────────────

function townsWithCounts() {
    const towns = new Map();
    friendState.codes.forEach(c => {
        const entry = towns.get(c.town_key) || { name: c.town, count: 0 };
        entry.count++;
        towns.set(c.town_key, entry);
    });
    return [...towns.entries()].sort((a, b) => b[1].count - a[1].count || a[1].name.localeCompare(b[1].name));
}

function codeCard(c) {
    const mine = readJson(MY_CODE_KEY)?.code === c.code;
    const team = c.team ? `<span class="team-dot team-${escapeHtml(c.team)}" title="${window.t('friends.team.' + c.team)}"></span>` : '';
    return `
        <div class="friend-card${mine ? ' is-mine' : ''}">
            <div class="friend-top">
                ${team}
                <span class="friend-name">${escapeHtml(c.nickname || window.t('friends.anonymous'))}${mine ? ` <span class="friend-you">${window.t('friends.you')}</span>` : ''}</span>
            </div>
            <button type="button" class="friend-code" data-code="${escapeHtml(c.code)}" title="${window.t('friends.copy')}">
                <code>${formatCode(c.code)}</code><i class="ph-bold ph-copy"></i>
            </button>
            <span class="friend-meta"><i class="ph-bold ph-map-pin"></i> ${escapeHtml(c.town)}</span>
            ${c.spot ? `<span class="friend-meta friend-spot"><i class="ph-bold ph-push-pin"></i> ${escapeHtml(c.spot)}</span>` : ''}
        </div>`;
}

function renderFriendResults() {
    const root = document.getElementById('friend-results');
    const input = document.getElementById('friend-town');
    if (!root || !input) return;

    const query = townKey(input.value);
    const towns = townsWithCounts();
    document.getElementById('friend-town-list').innerHTML = towns.map(([, t]) => `<option value="${escapeHtml(t.name)}">`).join('');

    if (!friendState.codes.length) {
        root.innerHTML = `<p class="subtitle">${window.t('friends.noneYet')}</p>`;
        return;
    }

    if (!query) {
        root.innerHTML = `
            <p class="friend-hint">${window.t('friends.pickTown')}</p>
            <div class="town-chips">${towns.slice(0, 40).map(([key, t]) => `
                <button type="button" class="town-chip" data-town="${escapeHtml(t.name)}">${escapeHtml(t.name)} <span>${t.count}</span></button>`).join('')}
            </div>`;
        return;
    }

    const matches = friendState.codes.filter(c => c.town_key.includes(query));

    // Favourite play spots in this town, so players in a big city can find people nearby
    const spots = new Map();
    matches.forEach(c => {
        if (!c.spot_key) return;
        const entry = spots.get(c.spot_key) || { name: c.spot, count: 0 };
        entry.count++;
        spots.set(c.spot_key, entry);
    });
    if (friendState.spot && !spots.has(friendState.spot)) friendState.spot = '';
    const shown = friendState.spot ? matches.filter(c => c.spot_key === friendState.spot) : matches;
    const spotChips = spots.size ? `
        <div class="town-chips spot-chips">
            <button type="button" class="town-chip spot-chip${friendState.spot ? '' : ' is-active'}" data-spot=""><i class="ph-bold ph-push-pin"></i> ${window.t('friends.allSpots')}</button>
            ${[...spots.entries()].sort((a, b) => b[1].count - a[1].count || a[1].name.localeCompare(b[1].name)).map(([key, sp]) => `
                <button type="button" class="town-chip spot-chip${friendState.spot === key ? ' is-active' : ''}" data-spot="${escapeHtml(key)}">${escapeHtml(sp.name)} <span>${sp.count}</span></button>`).join('')}
        </div>` : '';

    root.innerHTML = matches.length
        ? `<p class="friend-hint">${window.t(matches.length === 1 ? 'friends.foundOne' : 'friends.found', { count: matches.length, town: escapeHtml(input.value.trim()) })}</p>
           ${spotChips}
           <div class="friend-grid">${shown.map(codeCard).join('')}</div>
           <p class="friend-note"><i class="ph-bold ph-info"></i> ${window.t('friends.howToAdd')}</p>`
        : `<p class="subtitle">${window.t('friends.noneInTown', { town: escapeHtml(input.value.trim()) })}</p>`;
}

// ── Your own code ───────────────────────────────────────────────────────

function teamOptions(selected) {
    return ['', 'mystic', 'valor', 'instinct'].map(team => `
        <option value="${team}"${team === (selected || '') ? ' selected' : ''}>${team ? window.t('friends.team.' + team) : window.t('friends.teamNone')}</option>`).join('');
}

function renderMyCode() {
    const root = document.getElementById('my-code');
    if (!root) return;
    const mine = readJson(MY_CODE_KEY);
    const listed = mine && friendState.codes.find(c => c.code === mine.code);

    if (mine && listed) {
        root.innerHTML = `
            <div class="my-code-card">
                <div>
                    <span class="my-code-label">${window.t('friends.yourCode')}</span>
                    <code class="my-code-value">${formatCode(mine.code)}</code>
                    <span class="friend-meta"><i class="ph-bold ph-map-pin"></i> ${escapeHtml(listed.town)}${listed.spot ? ` · ${escapeHtml(listed.spot)}` : ''} · ${window.t('friends.expires', { days: daysLeft(listed.created_at) })}</span>
                </div>
                <div class="my-code-actions">
                    <button type="button" class="nav-btn" id="renew-code"><i class="ph-bold ph-arrow-clockwise"></i> ${window.t('friends.renew')}</button>
                    <button type="button" class="nav-btn danger" id="remove-code"><i class="ph-bold ph-trash"></i> ${window.t('friends.remove')}</button>
                </div>
                <details class="my-code-key">
                    <summary>${window.t('friends.keyTitle')}</summary>
                    <p>${window.t('friends.keyText')}</p>
                    <button type="button" class="friend-code" data-copy="${escapeHtml(mine.secret)}"><code>${escapeHtml(mine.secret)}</code><i class="ph-bold ph-copy"></i></button>
                </details>
            </div>`;
        document.getElementById('renew-code').onclick = () => submitCode({ ...mine, town: listed.town, spot: listed.spot, nickname: listed.nickname, team: listed.team }, true);
        document.getElementById('remove-code').onclick = () => removeCode(mine.code, mine.secret);
        return;
    }

    // Saved in this browser but no longer on the list (expired or removed elsewhere)
    const draft = mine || {};
    root.innerHTML = `
        ${mine ? `<p class="friend-hint">${window.t('friends.expired')}</p>` : ''}
        <form id="code-form" class="admin-form friend-form">
            <label class="admin-field">
                <span>${window.t('friends.codeLabel')}</span>
                <input type="text" id="f-code" inputmode="numeric" autocomplete="off" required placeholder="1234 5678 9012" value="${escapeHtml(formatCode(draft.code || ''))}">
            </label>
            <label class="admin-field">
                <span>${window.t('friends.townLabel')}</span>
                <input type="text" id="f-town" list="friend-town-list" required maxlength="60" placeholder="${window.t('friends.townPlaceholder')}" value="${escapeHtml(draft.town || readText(TOWN_KEY))}">
            </label>
            <label class="admin-field admin-wide">
                <span>${window.t('friends.spotLabel')}</span>
                <input type="text" id="f-spot" list="friend-spot-list" maxlength="60" placeholder="${window.t('friends.spotPlaceholder')}" value="${escapeHtml(draft.spot || '')}">
                <datalist id="friend-spot-list"></datalist>
                <small class="field-hint"><i class="ph-bold ph-shield-warning"></i> ${window.t('friends.spotHint')}</small>
            </label>
            <label class="admin-field">
                <span>${window.t('friends.nickLabel')}</span>
                <input type="text" id="f-nick" maxlength="30" placeholder="${window.t('friends.nickPlaceholder')}" value="${escapeHtml(draft.nickname || '')}">
            </label>
            <label class="admin-field">
                <span>${window.t('friends.teamLabel')}</span>
                <select id="f-team">${teamOptions(draft.team)}</select>
            </label>
            <p class="friend-note admin-wide"><i class="ph-bold ph-shield-check"></i> ${window.t('friends.privacy', { days: FRIEND_DAYS })}</p>
            <div class="admin-actions admin-wide">
                <button type="submit" class="action-btn">${window.t('friends.submit')}</button>
            </div>
        </form>
        <details class="my-code-key">
            <summary>${window.t('friends.removeWithKey')}</summary>
            <form id="key-form" class="key-form">
                <input type="text" id="k-code" inputmode="numeric" placeholder="${window.t('friends.codeLabel')}" required>
                <input type="text" id="k-secret" placeholder="${window.t('friends.keyPlaceholder')}" required>
                <button type="submit" class="nav-btn danger">${window.t('friends.remove')}</button>
            </form>
        </details>`;

    const codeInput = document.getElementById('f-code');
    codeInput.addEventListener('input', () => {
        const pos = codeInput.value.length;
        codeInput.value = formatCode(digitsOnly(codeInput.value).slice(0, 12));
        if (pos >= codeInput.value.length) codeInput.setSelectionRange(codeInput.value.length, codeInput.value.length);
    });

    const townField = document.getElementById('f-town');
    const fillSpotSuggestions = () => {
        const key = townKey(townField.value);
        const names = new Map();
        friendState.codes.filter(c => c.town_key === key && c.spot_key).forEach(c => names.set(c.spot_key, c.spot));
        document.getElementById('friend-spot-list').innerHTML = [...names.values()].map(n => `<option value="${escapeHtml(n)}">`).join('');
    };
    townField.addEventListener('input', fillSpotSuggestions);
    fillSpotSuggestions();

    document.getElementById('code-form').onsubmit = (e) => {
        e.preventDefault();
        const code = digitsOnly(codeInput.value);
        if (code.length !== 12) {
            alert(window.t('friends.errorCode'));
            return;
        }
        submitCode({
            code,
            town: document.getElementById('f-town').value.trim(),
            spot: document.getElementById('f-spot').value.trim(),
            nickname: document.getElementById('f-nick').value.trim(),
            team: document.getElementById('f-team').value,
            secret: mine?.code === code ? mine.secret : null
        }, false);
    };

    document.getElementById('key-form').onsubmit = (e) => {
        e.preventDefault();
        removeCode(digitsOnly(document.getElementById('k-code').value), document.getElementById('k-secret').value.trim());
    };
}

// Use the spelling that's already on the list ("Utrecht" for "utrecht "), otherwise start with a capital
function tidyTown(town) {
    const clean = String(town || '').trim().replace(/\s+/g, ' ');
    const existing = friendState.codes.find(c => c.town_key === clean.toLowerCase());
    if (existing) return existing.town;
    return clean === clean.toLowerCase() ? clean.charAt(0).toUpperCase() + clean.slice(1) : clean;
}

// Same for play spots, within the same town ("Valkhof" for "valkhof")
function tidySpot(town, spot) {
    const clean = String(spot || '').trim().replace(/\s+/g, ' ');
    if (!clean) return '';
    const existing = friendState.codes.find(c => c.town_key === townKey(town) && c.spot_key === clean.toLowerCase());
    if (existing) return existing.spot;
    return clean === clean.toLowerCase() ? clean.charAt(0).toUpperCase() + clean.slice(1) : clean;
}

async function submitCode(entry, renewing) {
    const town = tidyTown(entry.town);
    entry = { ...entry, town, spot: tidySpot(town, entry.spot) };
    const { data, error } = await window.supabaseClient.rpc('add_friend_code', {
        p_code: entry.code,
        p_town: entry.town,
        p_nickname: entry.nickname || null,
        p_team: entry.team || null,
        p_secret: entry.secret || null,
        p_spot: entry.spot || null
    });
    if (error) {
        alert(friendError(error));
        return;
    }
    writeJson(MY_CODE_KEY, { code: entry.code, secret: data, town: entry.town, spot: entry.spot || '', nickname: entry.nickname || '', team: entry.team || '' });
    writeText(TOWN_KEY, entry.town);
    await refreshFriends();
    if (renewing) alert(window.t('friends.renewed', { days: FRIEND_DAYS }));
}

async function removeCode(code, secret) {
    if (!confirm(window.t('friends.confirmRemove', { code: formatCode(code) }))) return;
    const { data, error } = await window.supabaseClient.rpc('remove_friend_code', { p_code: code, p_secret: secret });
    if (error) {
        alert(friendError(error));
        return;
    }
    if (data !== true) {
        alert(window.t('friends.wrongKey'));
        return;
    }
    if (readJson(MY_CODE_KEY)?.code === code) writeJson(MY_CODE_KEY, null);
    await refreshFriends();
}

// ── Page ────────────────────────────────────────────────────────────────

async function refreshFriends() {
    await loadFriendCodes();
    renderFriendsPage();
}

function renderFriendsPage() {
    const page = document.getElementById('friends-view');
    if (!page) return;

    if (!window.supabaseClient) {
        page.innerHTML = `
            <div class="auth-check-msg friend-soon">
                <h2><i class="ph-duotone ph-users-three"></i> ${window.t('friends.soonTitle')}</h2>
                <p>${window.t('friends.soonText')}</p>
            </div>`;
        return;
    }
    if (friendState.error) {
        page.innerHTML = `<p class="subtitle">${window.t('friends.errorGeneral', { message: escapeHtml(friendState.error) })}</p>`;
        return;
    }

    if (!document.getElementById('friend-results')) {
        page.innerHTML = `
            <section class="section-block">
                <div class="section-header"><h3><i class="ph-fill ph-map-pin"></i> <span>${window.t('friends.findTitle')}</span></h3></div>
                <div class="search-box mon-search">
                    <i class="ph-bold ph-magnifying-glass"></i>
                    <input type="search" id="friend-town" list="friend-town-list" autocomplete="off" placeholder="${window.t('friends.townPlaceholder')}" value="${escapeHtml(readText(TOWN_KEY))}">
                    <datalist id="friend-town-list"></datalist>
                </div>
                <div id="friend-results"></div>
            </section>
            <section class="section-block">
                <div class="section-header"><h3><i class="ph-fill ph-identification-card"></i> <span>${window.t('friends.mineTitle')}</span></h3></div>
                <div id="my-code"></div>
            </section>`;

        const townInput = document.getElementById('friend-town');
        townInput.addEventListener('input', () => {
            writeText(TOWN_KEY, townInput.value.trim());
            friendState.spot = '';
            renderFriendResults();
        });

    }

    // Copy buttons and town chips (event delegation, wired once so redraws keep working)
    if (!page.dataset.wired) {
        page.dataset.wired = '1';
        page.addEventListener('click', (e) => {
            const spotChip = e.target.closest('.spot-chip');
            if (spotChip) {
                friendState.spot = spotChip.dataset.spot;
                renderFriendResults();
                return;
            }
            const chip = e.target.closest('.town-chip');
            if (chip) {
                friendState.spot = '';
                const townInput = document.getElementById('friend-town');
                townInput.value = chip.dataset.town;
                writeText(TOWN_KEY, chip.dataset.town);
                renderFriendResults();
                return;
            }
            const copy = e.target.closest('[data-code], [data-copy]');
            if (copy) {
                const text = copy.dataset.code || copy.dataset.copy;
                navigator.clipboard?.writeText(text).then(() => {
                    const icon = copy.querySelector('i');
                    if (icon) {
                        icon.className = 'ph-bold ph-check';
                        setTimeout(() => { icon.className = 'ph-bold ph-copy'; }, 1500);
                    }
                });
            }
        });
    }

    renderFriendResults();
    renderMyCode();
}

document.addEventListener('DOMContentLoaded', async () => {
    if (!document.getElementById('friends-view')) return;
    await loadFriendCodes();
    renderFriendsPage();
});

document.addEventListener('languagechange', () => {
    const page = document.getElementById('friends-view');
    if (!page) return;
    page.innerHTML = '';      // rebuild with the new language
    renderFriendsPage();
});
