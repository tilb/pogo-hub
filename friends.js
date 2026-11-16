// Friends page: find Pokémon GO friend codes from players in your country, and list your own.
// No account needed: adding a code returns a secret key that this browser keeps, so you can
// renew or remove the code later. Uses escapeHtml from script.js and t() from settings.js.

const FRIEND_DAYS = 7;            // codes disappear this long after they were added or renewed
const MY_CODE_KEY = new URLSearchParams(location.search).has('demo') ? 'pogo_friend_code_demo' : 'pogo_friend_code';
const COUNTRY_KEY = 'pogo_country';

// Countries to choose from (ISO two-letter codes). Names come from the browser in the site's language.
const COUNTRY_CODES = ('AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ ' +
    'CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR ' +
    'GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IQ IR IS IT JE JM JO JP ' +
    'KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT ' +
    'MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW ' +
    'SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG US ' +
    'UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW').split(' ');

const friendState = { codes: [], loaded: false, error: null };

// ── Demo mode (friends.html?demo=1) ─────────────────────────────────────
// A stand-in database that lives only in this browser, so the page can be tried
// before Supabase is connected. It follows the same rules as supabase/friend_codes.sql.

const DEMO_KEY = 'pogo_demo_friend_codes';
const isDemo = new URLSearchParams(location.search).has('demo');

function demoSeed() {
    const daysAgo = d => new Date(Date.now() - d * 86400000).toISOString();
    const row = (code, country, team, age) => ({
        id: code, code, country, team, created_at: daysAgo(age), secret: 'demo-' + code
    });
    return [
        row('000011112222', 'NL', 'mystic', 1),
        row('000033334444', 'NL', 'instinct', 3),
        row('000055556666', 'NL', 'valor', 2),
        row('000077778888', 'NL', 'mystic', 5),
        row('000099990000', 'NL', null, 0),
        row('000012123434', 'BE', 'valor', 4),
        row('000056567878', 'BE', 'instinct', 6),
        row('000090901212', 'DE', 'mystic', 2),
        row('000034345656', 'US', 'instinct', 1),
        row('000078789090', 'US', 'valor', 3)
    ];
}

function demoRows() {
    let rows = readJson(DEMO_KEY);
    if (!Array.isArray(rows)) {
        rows = demoSeed();
        writeJson(DEMO_KEY, rows);
    }
    return rows;
}

function demoLive(row) {
    return new Date(row.created_at).getTime() > Date.now() - FRIEND_DAYS * 86400000;
}

const demoClient = {
    from() {
        return {
            select: () => ({
                order: () => ({
                    limit: async () => ({
                        // Like the real database: only live rows, never the secret
                        data: demoRows().filter(demoLive)
                            .sort((a, b) => b.created_at.localeCompare(a.created_at))
                            .map(({ secret, ...visible }) => visible),
                        error: null
                    })
                })
            })
        };
    },
    async rpc(name, args) {
        const rows = demoRows();
        const fail = message => ({ data: null, error: { message } });

        if (name === 'add_friend_code') {
            const code = digitsOnly(args.p_code);
            const country = String(args.p_country || '').trim().toUpperCase();
            if (!/^\d{12}$/.test(code)) return fail('invalid_code');
            if (!/^[A-Z]{2}$/.test(country)) return fail('invalid_country');

            const fields = { country, team: args.p_team || null, created_at: new Date().toISOString() };
            const existing = rows.find(r => r.code === code);
            if (existing) {
                if (args.p_secret && args.p_secret === existing.secret) {
                    Object.assign(existing, fields);
                    writeJson(DEMO_KEY, rows);
                    return { data: existing.secret, error: null };
                }
                if (demoLive(existing)) return fail('already_listed');
                rows.splice(rows.indexOf(existing), 1);
            }
            const secret = Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, '0')).join('');
            rows.push({ id: code, code, secret, ...fields });
            writeJson(DEMO_KEY, rows);
            return { data: secret, error: null };
        }

        if (name === 'remove_friend_code') {
            const code = digitsOnly(args.p_code);
            const index = rows.findIndex(r => r.code === code && r.secret === args.p_secret);
            if (index < 0) return { data: false, error: null };
            rows.splice(index, 1);
            writeJson(DEMO_KEY, rows);
            return { data: true, error: null };
        }
        return fail('unknown_function');
    }
};

// The database the Friends page uses: the stand-in in demo mode, otherwise Supabase
function friendDb() {
    if (isDemo) return demoClient;
    return window.siteFeatures?.friendCodes === false ? null : window.supabaseClient;
}

function resetDemo() {
    writeJson(DEMO_KEY, null);
    writeJson(MY_CODE_KEY, null);
    const page = document.getElementById('friends-view');
    if (page) page.innerHTML = '';
    refreshFriends();
}

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

function countryName(code) {
    try {
        return new Intl.DisplayNames([window.dateLocale()], { type: 'region' }).of(code) || code;
    } catch {
        return code;
    }
}

// "NL" → 🇳🇱 (some computers, like Windows, show the two letters instead)
function countryFlag(code) {
    return /^[A-Z]{2}$/.test(code || '') ? String.fromCodePoint(...[...code].map(ch => 0x1F1A5 + ch.charCodeAt(0))) : '';
}

function countryLabel(code) {
    return `${countryFlag(code)} ${countryName(code)}`.trim();
}

// The country remembered in this browser, otherwise a guess from the browser's language ("nl-NL" → NL)
function defaultCountry() {
    const saved = readText(COUNTRY_KEY);
    if (COUNTRY_CODES.includes(saved)) return saved;
    for (const lang of navigator.languages || [navigator.language]) {
        const region = String(lang || '').split('-')[1]?.toUpperCase();
        if (COUNTRY_CODES.includes(region)) return region;
    }
    return '';
}

// Options for a country dropdown, sorted by name in the site's language
function countryOptions(selected) {
    return COUNTRY_CODES
        .map(code => ({ code, name: countryName(code) }))
        .sort((a, b) => a.name.localeCompare(b.name, window.dateLocale()))
        .map(c => `<option value="${c.code}"${c.code === selected ? ' selected' : ''}>${escapeHtml(`${countryFlag(c.code)} ${c.name}`)}</option>`)
        .join('');
}

function daysLeft(createdAt) {
    const expires = new Date(createdAt).getTime() + FRIEND_DAYS * 86400000;
    return Math.max(0, Math.ceil((expires - Date.now()) / 86400000));
}

function friendError(error) {
    const message = String(error?.message || error || '');
    if (message.includes('already_listed')) return window.t('friends.errorTaken');
    if (message.includes('invalid_code')) return window.t('friends.errorCode');
    if (message.includes('invalid_country')) return window.t('friends.errorCountry');
    return window.t('friends.errorGeneral', { message });
}

async function loadFriendCodes() {
    if (!friendDb()) return;
    const { data, error } = await friendDb()
        .from('friend_codes')
        .select('id, code, country, team, created_at')
        .order('created_at', { ascending: false })
        .limit(2000);
    friendState.loaded = true;
    friendState.error = error ? error.message : null;
    friendState.codes = data || [];
}

// ── Finding codes ───────────────────────────────────────────────────────
// Everyone in one list, newest first. Gifts and remote raids work worldwide,
// so there's no filter; the flag on each card shows where someone plays.

function codeCard(c) {
    const mine = readJson(MY_CODE_KEY)?.code === c.code;
    const team = c.team ? `<span class="team-dot team-${escapeHtml(c.team)}"></span>` : '';
    return `
        <div class="friend-card${mine ? ' is-mine' : ''}">
            <div class="friend-top">
                ${team}
                <span class="friend-name">${c.team ? window.t('friends.team.' + c.team) : window.t('friends.anonymous')}${mine ? ` <span class="friend-you">${window.t('friends.you')}</span>` : ''}</span>
            </div>
            <button type="button" class="friend-code" data-code="${escapeHtml(c.code)}" title="${window.t('friends.copy')}">
                <code>${formatCode(c.code)}</code><i class="ph-bold ph-copy"></i>
            </button>
            <span class="friend-meta">${escapeHtml(countryLabel(c.country))}</span>
        </div>`;
}

function renderFriendResults() {
    const root = document.getElementById('friend-results');
    if (!root) return;

    const codes = friendState.codes;
    root.innerHTML = codes.length
        ? `<p class="friend-hint">${window.t(codes.length === 1 ? 'friends.foundOne' : 'friends.found', { count: codes.length })}</p>
           <div class="friend-grid">${codes.map(codeCard).join('')}</div>
           <p class="friend-note"><i class="ph-bold ph-info"></i> ${window.t('friends.howToAdd')}</p>`
        : `<p class="subtitle">${window.t('friends.noneYet')}</p>`;
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
                    <span class="friend-meta">${escapeHtml(countryLabel(listed.country))} · ${window.t('friends.expires', { days: daysLeft(listed.created_at) })}</span>
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
        document.getElementById('renew-code').onclick = () => submitCode({ ...mine, country: listed.country, team: listed.team }, true);
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
                <span>${window.t('friends.countryLabel')}</span>
                <select id="f-country" required>
                    <option value="">${window.t('friends.countryPlaceholder')}</option>
                    ${countryOptions(COUNTRY_CODES.includes(draft.country) ? draft.country : defaultCountry())}
                </select>
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

    document.getElementById('code-form').onsubmit = (e) => {
        e.preventDefault();
        const code = digitsOnly(codeInput.value);
        if (code.length !== 12) {
            alert(window.t('friends.errorCode'));
            return;
        }
        submitCode({
            code,
            country: document.getElementById('f-country').value,
            team: document.getElementById('f-team').value,
            secret: mine?.code === code ? mine.secret : null
        }, false);
    };

    document.getElementById('key-form').onsubmit = (e) => {
        e.preventDefault();
        removeCode(digitsOnly(document.getElementById('k-code').value), document.getElementById('k-secret').value.trim());
    };
}

async function submitCode(entry, renewing) {
    if (!entry.country) {
        alert(window.t('friends.errorCountry'));
        return;
    }
    const { data, error } = await friendDb().rpc('add_friend_code', {
        p_code: entry.code,
        p_country: entry.country,
        p_team: entry.team || null,
        p_secret: entry.secret || null
    });
    if (error) {
        alert(friendError(error));
        return;
    }
    writeJson(MY_CODE_KEY, { code: entry.code, secret: data, country: entry.country, team: entry.team || '' });
    writeText(COUNTRY_KEY, entry.country);
    await refreshFriends();
    if (renewing) alert(window.t('friends.renewed', { days: FRIEND_DAYS }));
}

async function removeCode(code, secret) {
    if (!confirm(window.t('friends.confirmRemove', { code: formatCode(code) }))) return;
    const { data, error } = await friendDb().rpc('remove_friend_code', { p_code: code, p_secret: secret });
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

    if (!friendDb()) {
        page.innerHTML = `
            <div class="auth-check-msg friend-soon">
                <h2><i class="ph-duotone ph-users-three"></i> ${window.t('friends.soonTitle')}</h2>
                <p>${window.t('friends.soonText')}</p>
            </div>`;
        return;
    }
    if (isDemo && !document.getElementById('demo-banner')) {
        const banner = document.createElement('div');
        banner.id = 'demo-banner';
        banner.className = 'demo-banner';
        page.before(banner);
    }
    const banner = document.getElementById('demo-banner');
    if (banner) {
        banner.innerHTML = `
            <i class="ph-fill ph-flask"></i>
            <span><strong>${window.t('friends.demoTitle')}</strong> ${window.t('friends.demoText')}</span>
            <button type="button" class="nav-btn" id="demo-reset"><i class="ph-bold ph-arrow-counter-clockwise"></i> ${window.t('friends.demoReset')}</button>`;
        document.getElementById('demo-reset').onclick = () => {
            if (confirm(window.t('friends.demoResetConfirm'))) resetDemo();
        };
    }

    if (friendState.error) {
        page.innerHTML = `<p class="subtitle">${window.t('friends.errorGeneral', { message: escapeHtml(friendState.error) })}</p>`;
        return;
    }

    if (!document.getElementById('friend-results')) {
        page.innerHTML = `
            <section class="section-block">
                <div class="section-header"><h3><i class="ph-fill ph-globe-hemisphere-west"></i> <span>${window.t('friends.findTitle')}</span></h3></div>
                <div id="friend-results"></div>
            </section>
            <section class="section-block">
                <div class="section-header"><h3><i class="ph-fill ph-identification-card"></i> <span>${window.t('friends.mineTitle')}</span></h3></div>
                <div id="my-code"></div>
            </section>`;
    }

    // Copy buttons (event delegation, wired once so redraws keep working)
    if (!page.dataset.wired) {
        page.dataset.wired = '1';
        page.addEventListener('click', (e) => {
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
