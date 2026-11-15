// Event Data State
let events = [];
let filteredEvents = [];

// Event Type Definitions, per language
const eventDefinitions = {
    "community-day": {
        name: "Community Day",
        desc: "A monthly event featuring a specific Pokémon with high shiny rates and an exclusive move.",
        bonus: "Bonuses often include 3x XP, Stardust, or 1/4 Hatch Distance."
    },
    "raid-hour": {
        name: "Raid Hour",
        desc: "Every Wednesday evening (6:00 PM - 7:00 PM), 5-star Raids appear on most Gyms.",
        bonus: "Perfect for shiny hunting legendaries with local groups."
    },
    "pokemon-spotlight-hour": {
        name: "Spotlight Hour",
        desc: "Every Tuesday evening (6:00 PM - 7:00 PM), one Pokémon appears everywhere.",
        bonus: "Includes a special bonus like 2x Catch Candy or Transfer Candy."
    },
    "pokestop-showcase": {
        name: "PokéStop Showcase",
        desc: "Enter your biggest or smallest Pokémon at PokéStops to win rewards.",
        bonus: "Usually focused on Pokémon featured in the current event."
    },
    "raid-battles": {
        name: "Raid Battles",
        desc: "Special Pokémon appearing temporarily in Gyms.",
        bonus: "Earn rare Pokémon and items like Rare Candy or TMs."
    },
    "event": {
        name: "Event",
        desc: "A standard in-game event with varying themes and spawns.",
        bonus: "Themed spawns, eggs, and specific Field Research tasks."
    },
    "season": {
        name: "Season",
        desc: "A 3-month long period with specific spawns and consistent bonuses.",
        bonus: "Affects spawns, eggs, and GBL rewards."
    },
    "max-mondays": {
        name: "Max Monday",
        desc: "Every Monday evening focusing on Dynamax Pokémon at Power Spots.",
        bonus: "Earn extra Max Particles and catch powerful Pokémon."
    },
    "max-battles": {
        name: "Max Battles",
        desc: "Events centered around Dynamax Pokémon and Power Spots.",
        bonus: "Increased Max Particles and special Dynamax encounters."
    },
    "go-pass": {
        name: "GO Pass",
        desc: "Ticketed monthly bonuses and Timed Research.",
        bonus: "Daily content and extra rewards for ticket holders."
    },
    "go-battle-league": {
        name: "GO Battle League",
        desc: "Competitive PvP updates, cups, and battle weekends.",
        bonus: "4x Stardust from win rewards and increased battle sets."
    },
    "raid-day": {
        name: "Raid Day",
        desc: "A focused event usually lasting 3 hours with raid-exclusive Pokémon.",
        bonus: "Receive up to 5 additional free Raid Passes."
    },
    "team-go-rocket": {
        name: "Team GO Rocket",
        desc: "Increased Team GO Rocket activity and innovation.",
        bonus: "Remove Frustration from Shadow Pokémon with TMs."
    },
    "pokemon-go-tour": {
        name: "Pokémon GO Tour",
        desc: "A major celebration featuring Pokémon from a specific region.",
        bonus: "Shiny debuts, special research, and regional exclusives."
    },
    "research": {
        name: "Special Research",
        desc: "New Special or Timed Research lines released.",
        bonus: "Compelling stories and unique encounter rewards."
    },
    "timed-research": {
        name: "Timed Research",
        desc: "A research story you have to finish before a deadline.",
        bonus: "Claim all rewards before the research expires."
    },
    "wild-area": {
        name: "Wild Area",
        desc: "A large in-person event where special Pokémon appear in a specific area.",
        bonus: "Global players often get spawns and bonuses alongside it."
    },
    "default": {
        name: "Event",
        desc: "Information about this Pokémon GO event.",
        bonus: "Stay tuned for more in-game details!"
    }
};

const eventDefinitionsNl = {
    "community-day": { name: "Community Day", desc: "Een maandelijks evenement rond één Pokémon, met een grote kans op een shiny en een exclusieve aanval.", bonus: "Vaak met 3× XP, extra Stardust of eieren die op een kwart van de afstand uitkomen." },
    "raid-hour": { name: "Raid Hour", desc: "Elke woensdagavond (18:00 - 19:00) verschijnen er 5-sterrenraids bij de meeste Gyms.", bonus: "Ideaal om met een groep uit de buurt op legendarische shiny's te jagen." },
    "pokemon-spotlight-hour": { name: "Spotlight Hour", desc: "Elke dinsdagavond (18:00 - 19:00) verschijnt één Pokémon overal.", bonus: "Met een extra bonus, zoals 2× Catch Candy of Transfer Candy." },
    "pokestop-showcase": { name: "PokéStop Showcase", desc: "Laat je grootste of kleinste Pokémon zien bij een PokéStop en win beloningen.", bonus: "Meestal gericht op Pokémon uit het lopende evenement." },
    "raid-battles": { name: "Raids", desc: "Bijzondere Pokémon die een tijdje in Gyms verschijnen.", bonus: "Verdien zeldzame Pokémon en items zoals Rare Candy en TM's." },
    "event": { name: "Evenement", desc: "Een gewoon evenement in de game, met wisselende thema's en Pokémon.", bonus: "Thema-spawns, eieren en speciale Field Research-taken." },
    "season": { name: "Seizoen", desc: "Een periode van drie maanden met eigen spawns en vaste bonussen.", bonus: "Bepaalt spawns, eieren en de beloningen in GO Battle League." },
    "max-mondays": { name: "Max Monday", desc: "Elke maandagavond draait het om Dynamax-Pokémon bij Power Spots.", bonus: "Verdien extra Max Particles en vang sterke Pokémon." },
    "max-battles": { name: "Max Battles", desc: "Evenementen rond Dynamax-Pokémon en Power Spots.", bonus: "Meer Max Particles en speciale Dynamax-ontmoetingen." },
    "go-pass": { name: "GO Pass", desc: "Maandelijkse bonussen en Timed Research met een ticket.", bonus: "Dagelijkse taken en extra beloningen voor wie een ticket heeft." },
    "go-battle-league": { name: "GO Battle League", desc: "Nieuws voor competitief PvP: cups en battle-weekenden.", bonus: "4× Stardust bij winstbeloningen en meer battle-sets." },
    "raid-day": { name: "Raid Day", desc: "Een evenement van meestal drie uur met Pokémon die je alleen in raids vindt.", bonus: "Je krijgt tot vijf extra gratis Raid Passes." },
    "team-go-rocket": { name: "Team GO Rocket", desc: "Team GO Rocket is extra actief.", bonus: "Haal Frustration weg bij je Shadow-Pokémon met een TM." },
    "pokemon-go-tour": { name: "Pokémon GO Tour", desc: "Een groot feest rond de Pokémon uit één regio.", bonus: "Nieuwe shiny's, speciaal onderzoek en regionale Pokémon." },
    "research": { name: "Special Research", desc: "Nieuwe Special of Timed Research.", bonus: "Verhalen met unieke ontmoetingen als beloning." },
    "timed-research": { name: "Timed Research", desc: "Een onderzoek dat je vóór een deadline moet afronden.", bonus: "Haal alle beloningen op voordat het onderzoek verloopt." },
    "wild-area": { name: "Wild Area", desc: "Een groot evenement op locatie, waar bijzondere Pokémon in één gebied verschijnen.", bonus: "Spelers over de hele wereld krijgen er vaak spawns en bonussen bij." },
    "default": { name: "Evenement", desc: "Informatie over dit Pokémon GO-evenement.", bonus: "Houd de game in de gaten voor meer details!" }
};

function isDutch() {
    return window.siteSettings?.lang === 'nl';
}

// The type's name, description and tip in the chosen language
function getDef(type) {
    const defs = isDutch() ? eventDefinitionsNl : eventDefinitions;
    return defs[type] || defs['default'];
}

// Icon per event type, used on cards that have no picture of their own
const eventIcons = {
    "community-day": "ph-users-three",
    "raid-hour": "ph-sword",
    "raid-battles": "ph-sword",
    "raid-day": "ph-sword",
    "pokemon-spotlight-hour": "ph-flashlight",
    "pokestop-showcase": "ph-medal",
    "max-mondays": "ph-lightning",
    "max-battles": "ph-lightning",
    "season": "ph-leaf",
    "go-battle-league": "ph-trophy",
    "go-pass": "ph-ticket",
    "research": "ph-scroll",
    "timed-research": "ph-scroll",
    "team-go-rocket": "ph-skull",
    "pokemon-go-tour": "ph-globe-hemisphere-west",
    "wild-area": "ph-tree-evergreen",
    "event": "ph-sparkle"
};

// --- Helpers ---

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function locale() {
    return window.dateLocale ? window.dateLocale() : 'en-US';
}

function clockTime(d) {
    return d.toLocaleTimeString(locale(), window.timeOptions ? window.timeOptions() : { hour: 'numeric', minute: '2-digit' });
}

function longDate(d) {
    return d.toLocaleDateString(locale(), { month: 'long', day: 'numeric' });
}

function weekdayDate(d) {
    return d.toLocaleDateString(locale(), { weekday: 'long', month: 'long', day: 'numeric' });
}

// --- Pokémon pictures ---
// Pictures come from PokeAPI's open sprite collection; data/pokemon.json maps names to Pokédex numbers.

let pokedex = {};

async function loadPokedex() {
    try {
        const response = await fetch('data/pokemon.json');
        if (response.ok) pokedex = await response.json();
    } catch (err) {
        console.warn("Pokémon pictures unavailable:", err);
    }
}

// "Mega Banette" → "banette", "Deoxys (Attack)" → "deoxys", "Mr. Mime" → "mr-mime"
function pokemonKey(name) {
    return String(name)
        .replace(/\(.*?\)/g, '')
        .trim()
        .replace(/^(Mega|Shadow|Dynamax|Gigantamax|Primal|Galarian|Alolan|Hisuian|Paldean)\s+/i, '')
        .trim()
        .toLowerCase()
        .replace(/♀/g, '-f').replace(/♂/g, '-m')
        .replace(/\.\s+/g, '-').replace(/[.']/g, '')
        .replace(/é/g, 'e')
        .replace(/\s+/g, '-');
}

function pokemonImageUrl(name) {
    const id = pokedex[pokemonKey(name)];
    return id ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png` : null;
}

// The Pokémon that belong to an event: its own list, the bosses of a Raid Hour, or the Max Monday Pokémon
function featuredPokemon(event) {
    if (event.pokemon.length) return event.pokemon;
    if (event.eventType === 'raid-hour') {
        const raid = findRaidForRaidHour(event);
        if (raid) return raid.pokemon;
    }
    if (event.eventType === 'max-mondays') {
        const match = event.name.match(/Dynamax (.+?) during Max Monday/i);
        if (match) return [{ name: match[1], shiny: false }];
    }
    return [];
}

// Pokémon with a picture, without showing the same picture twice (Deoxys forms share one)
function pokemonWithPictures(event, max) {
    const seen = new Set();
    const result = [];
    for (const p of featuredPokemon(event)) {
        const url = pokemonImageUrl(p.name);
        if (!url || seen.has(url)) continue;
        seen.add(url);
        result.push({ ...p, url });
        if (result.length >= max) break;
    }
    return result;
}

function pokemonImg(p, className = '') {
    return `<img src="${escapeHtml(p.url)}" alt="${escapeHtml(p.name)}" title="${escapeHtml(p.name)}" loading="lazy" ${className ? `class="${className}"` : ''} onerror="this.remove()">`;
}

// The card picture: the event's own image, its Pokémon on a coloured panel, or a type icon
function eventImageHtml(event) {
    const icon = eventIcons[event.eventType] || 'ph-calendar-star';
    const mons = pokemonWithPictures(event, 3);
    const inner = mons.length
        ? `<div class="card-pokemon">${mons.map(p => pokemonImg(p)).join('')}</div>`
        : `<i class="ph-fill ${icon}"></i>`;
    const placeholder = `<div class="event-card-image event-card-placeholder placeholder-${escapeHtml(event.eventType)}">${inner}</div>`;
    if (!event.image) return placeholder;
    return `<img src="${escapeHtml(event.image)}" class="event-card-image" alt="" onerror="this.outerHTML = this.dataset.fallback" data-fallback="${escapeHtml(placeholder)}">`;
}

// Small round picture for the week list
function avatarHtml(event) {
    const [first] = pokemonWithPictures(event, 1);
    const icon = eventIcons[event.eventType] || 'ph-calendar-star';
    return `<span class="week-avatar">${first ? pokemonImg(first) : `<i class="ph-fill ${icon}"></i>`}</span>`;
}

// --- Supabase: session and saved events ---

window.getSession = async function () {
    if (!window.supabaseClient) return null;
    try {
        const { data } = await window.supabaseClient.auth.getSession();
        return data.session;
    } catch (err) {
        console.warn("Could not read session:", err);
        return null;
    }
}

let savedEventIds = new Set();

// Saved events live in Supabase so they follow you to every device.
// Saves that were only kept in this browser (older version of the site) are moved over once.
async function loadSavedEvents() {
    savedEventIds = new Set();
    const session = await window.getSession();
    if (!session) return;

    const legacyKey = `pogo_saved_${session.user.id}`;
    let legacy = [];
    try { legacy = JSON.parse(localStorage.getItem(legacyKey)) || []; } catch { legacy = []; }
    if (legacy.length) {
        const rows = legacy.map(id => ({ user_id: session.user.id, event_id: String(id).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }));
        const { error } = await window.supabaseClient.from('saved_events').upsert(rows, { onConflict: 'user_id,event_id', ignoreDuplicates: true });
        if (!error) {
            try { localStorage.removeItem(legacyKey); } catch { /* ignore */ }
        }
    }

    const { data, error } = await window.supabaseClient.from('saved_events').select('event_id');
    if (error) {
        console.error("Could not load saved events:", error.message);
        return;
    }
    savedEventIds = new Set(data.map(row => row.event_id));
}

// --- Loading events ---

// Events come from our own database; if that isn't set up or reachable, from our own list in data/events.json
async function fetchEventRows() {
    if (window.supabaseClient) {
        try {
            const { data, error } = await window.supabaseClient.from('events').select('*').order('starts_at');
            if (error) throw error;
            if (data.length) {
                return data.map(r => ({
                    id: r.id, name: r.name, type: r.type, start: r.starts_at, end: r.ends_at,
                    pokemon: r.pokemon || [], bonuses: r.bonuses || [], promoCodes: r.promo_codes || [],
                    description: r.description, image: r.image_url
                }));
            }
        } catch (err) {
            console.warn("Using the local events list instead of the database:", err.message || err);
        }
    }
    const response = await fetch('data/events.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Could not load events list (${response.status})`);
    return response.json();
}

async function loadEvents() {
    try {
        const rows = await fetchEventRows();

        events = rows.map(r => ({
            ...r,
            eventID: r.id,
            eventType: r.type,
            pokemon: r.pokemon || [],
            bonuses: r.bonuses || [],
            promoCodes: r.promoCodes || [],
            start: new Date(r.start),
            end: new Date(r.end)
        })).filter(e => !isNaN(e.start) && !isNaN(e.end));

        filteredEvents = [...events];
        await window.renderEvents();
    } catch (error) {
        console.error("Error loading events:", error);
        const container = document.getElementById('active-events-container');
        if (container) container.innerHTML = `<p class="subtitle">${window.t('error.load')}</p>`;
    }
}

// Search and Filter Logic
async function applyFilters() {
    const searchTerm = document.getElementById('event-search').value.toLowerCase();
    const filterType = document.getElementById('event-filter').value;

    filteredEvents = events.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchTerm) ||
            event.eventType.toLowerCase().includes(searchTerm) ||
            featuredPokemon(event).some(p => p.name.toLowerCase().includes(searchTerm));
        const matchesType = filterType === 'all' || event.eventType === filterType;

        return matchesSearch && matchesType;
    });

    await window.renderEvents();
}

function saveButtonHtml(event) {
    const isSaved = savedEventIds.has(event.eventID);
    const icon = isSaved ? 'ph-fill ph-star' : 'ph-bold ph-star';
    return `<button class="icon-btn" onclick="event.stopPropagation(); window.toggleSaveEvent('${escapeHtml(event.eventID)}')" title="${window.t(isSaved ? 'card.saved' : 'card.save')}"><i class="${icon}" style="${isSaved ? 'color: var(--accent-primary);' : ''}"></i></button>`;
}

function typeBadgeHtml(event) {
    return `<span class="event-type clickable-badge" onclick="event.stopPropagation(); window.openTypeModal('${escapeHtml(event.eventType)}')">${escapeHtml(getDef(event.eventType).name)} <i class="ph-bold ph-question"></i></span>`;
}

window.renderEvents = async function () {
    const activeEventsContainer = document.getElementById('active-events-container');
    const upcomingEventsContainer = document.getElementById('upcoming-events-container');
    const now = new Date();

    if (!activeEventsContainer || !upcomingEventsContainer) return;

    const sortedEvents = filteredEvents.sort((a, b) => a.start - b.start);
    const weekEnd = addDays(startOfDay(now), 7);
    const activeEventsTotal = sortedEvents.filter(e => e.start <= now && e.end > now);
    const upcomingEventsTotal = sortedEvents.filter(e => e.start >= weekEnd);

    renderWeek(sortedEvents, now);

    // Render Active
    activeEventsContainer.innerHTML = '';
    if (activeEventsTotal.length === 0) {
        activeEventsContainer.innerHTML = `<p class="subtitle" style="padding: 1rem;">${window.t('empty.active')}</p>`;
    } else {
        activeEventsTotal.forEach(event => {
            const card = document.createElement('div');
            card.className = `event-card type-${event.eventType}`;

            card.innerHTML = `
                ${eventImageHtml(event)}
                <div class="event-card-body">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        ${typeBadgeHtml(event)}
                        ${saveButtonHtml(event)}
                    </div>
                    <h4 class="event-title">${escapeHtml(event.name)}</h4>
                    <div class="event-time">
                        <i class="ph-bold ph-clock"></i>
                        <span>${window.t('card.endsIn', { time: window.getTimeRemaining(now, event.end) })}</span>
                    </div>
                    <div class="countdown-badge">${window.t('card.activeNow')}</div>
                    <button class="action-btn" onclick="window.openModal('${escapeHtml(event.eventID)}')">${window.t('card.viewDetails')}</button>
                </div>
            `;
            activeEventsContainer.appendChild(card);
        });
    }

    // Render Upcoming (after this week; this week has its own block)
    upcomingEventsContainer.innerHTML = '';
    if (upcomingEventsTotal.length === 0) {
        upcomingEventsContainer.innerHTML = `<p class="subtitle">${window.t('empty.upcoming')}</p>`;
    } else {
        upcomingEventsTotal.forEach(event => {
            const item = document.createElement('div');
            item.className = 'list-item';

            const month = event.start.toLocaleString(locale(), { month: 'short' });
            const day = event.start.getDate();
            const mons = pokemonWithPictures(event, 3);

            item.innerHTML = `
                <div class="list-date-box">
                    <span class="list-month">${month}</span>
                    <span class="list-day">${day}</span>
                </div>
                <div class="list-content">
                    <div style="display:flex; justify-content: space-between;">
                        ${typeBadgeHtml(event)}
                        ${saveButtonHtml(event)}
                    </div>
                    <h4 style="font-size: 1.1rem; margin-bottom: 0.2rem; margin-top: 0.3rem;">${escapeHtml(event.name)}</h4>
                    <span style="color: var(--text-secondary); font-size: 0.85rem;">${window.t('card.startsIn', { time: window.getTimeRemaining(now, event.start), clock: clockTime(event.start) })}</span>
                </div>
                ${mons.length ? `<div class="list-pokemon">${mons.map(p => pokemonImg(p)).join('')}</div>` : ''}
                <button class="list-action-btn" onclick="window.openModal('${escapeHtml(event.eventID)}')"><i class="ph-bold ph-caret-right"></i></button>
            `;
            upcomingEventsContainer.appendChild(item);
        });
    }
}

// "This Week": everything that starts today or in the next six days, grouped per day
function renderWeek(sortedEvents, now) {
    const container = document.getElementById('week-events-container');
    if (!container) return;

    const today = startOfDay(now);
    const weekEnd = addDays(today, 7);
    const weekEvents = sortedEvents.filter(e => e.start >= today && e.start < weekEnd);

    if (weekEvents.length === 0) {
        container.innerHTML = `<p class="subtitle">${window.t('empty.week')}</p>`;
        return;
    }

    const groups = new Map();
    weekEvents.forEach(e => {
        const key = startOfDay(e.start).getTime();
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(e);
    });

    container.innerHTML = [...groups.entries()].map(([key, list]) => {
        const day = new Date(Number(key));
        const diff = Math.round((day - today) / 86400000);
        const weekday = day.toLocaleDateString(locale(), { weekday: 'long' });
        const label = diff === 0 ? window.t('week.today') : diff === 1 ? window.t('week.tomorrow') : weekday.charAt(0).toUpperCase() + weekday.slice(1);
        const date = day.toLocaleDateString(locale(), { month: 'short', day: 'numeric' });

        const rows = list.map(e => {
            const live = e.start <= now && e.end > now;
            const ended = e.end <= now;
            const status = live ? `<span class="week-live">${window.t('week.live')}</span>` : ended ? `<span class="week-ended">${window.t('week.ended')}</span>` : '';
            return `
                <div class="week-item${ended ? ' is-ended' : ''}" onclick="window.openModal('${escapeHtml(e.eventID)}')">
                    <span class="week-time">${clockTime(e.start)}</span>
                    ${avatarHtml(e)}
                    <div class="week-info">
                        <span class="week-name">${escapeHtml(e.name)} ${status}</span>
                        <span class="week-type">${escapeHtml(getDef(e.eventType).name)}</span>
                    </div>
                    ${saveButtonHtml(e)}
                </div>`;
        }).join('');

        return `
            <div class="week-day">
                <div class="week-day-label">${label} <span>${date}</span></div>
                ${rows}
            </div>`;
    }).join('');
}

window.getTimeRemaining = function (start, end) {
    const total = Date.parse(end) - Date.parse(start);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const d = window.t('time.d'), h = window.t('time.h'), m = window.t('time.m');

    if (days > 0) return `${days}${d} ${hours}${h}`;
    if (hours > 0) return `${hours}${h} ${minutes}${m}`;
    return `${minutes}${m}`;
}

// --- Event descriptions ---
// Our own wording, in English and Dutch, built from the facts in our own events list.

function formatDuration(ms) {
    const nl = isDutch();
    const hours = Math.round(ms / (1000 * 60 * 60));
    if (hours < 1) return nl ? `${Math.round(ms / 60000)} minuten` : `${Math.round(ms / 60000)} minutes`;
    if (hours < 48) return nl ? `${hours} uur` : (hours === 1 ? '1 hour' : `${hours} hours`);
    const days = Math.round(hours / 24);
    if (days >= 14) return nl ? `${Math.round(days / 7)} weken` : `${Math.round(days / 7)} weeks`;
    return nl ? `${days} dagen` : `${days} days`;
}

// "A", "A and B", "A, B and C" (or "en" in Dutch)
function joinNames(names) {
    if (names.length <= 1) return names.join('');
    return `${names.slice(0, -1).join(', ')} ${isDutch() ? 'en' : 'and'} ${names[names.length - 1]}`;
}

function shinyNote(list) {
    const nl = isDutch();
    const shiny = list.filter(p => p.shiny).map(p => p.name);
    if (shiny.length === 0) return '';
    if (shiny.length === list.length) {
        if (list.length === 1) return nl ? ' Hij kan shiny zijn.' : ' It can be shiny.';
        if (list.length === 2) return nl ? ' Allebei kunnen ze shiny zijn.' : ' Both can be shiny.';
        return nl ? ' Ze kunnen allemaal shiny zijn.' : ' All of them can be shiny.';
    }
    return nl ? ` ${joinNames(shiny)} ${shiny.length === 1 ? 'kan' : 'kunnen'} shiny zijn.` : ` ${joinNames(shiny)} can be shiny.`;
}

// The raid event that is running during a Raid Hour, so the hour can name its bosses.
// Only a raid whose boss is named in the Raid Hour's title counts, so overlapping raids don't get mixed up.
function findRaidForRaidHour(event) {
    const title = event.name.toLowerCase();
    return events.find(e =>
        e.eventType === 'raid-battles' && e.pokemon.length &&
        e.start <= event.start && e.end >= event.end &&
        e.pokemon.some(p => title.includes(p.name.split(' ')[0].toLowerCase()))
    );
}

// One or two plain sentences about this specific event.
// An event's own description (set in the admin page) always wins.
function buildEventSummary(event, def) {
    if (event.description) return event.description;

    const nl = isDutch();
    const duration = formatDuration(event.end - event.start);
    const mons = event.pokemon;
    const names = joinNames(mons.map(p => p.name));
    const one = mons.length === 1;

    if (mons.length && event.eventType === 'raid-battles') {
        return nl
            ? `Versla ${names} in raids bij Gyms, ${duration} lang.${shinyNote(mons)}`
            : `Fight ${names} in raids at Gyms for ${duration}.${shinyNote(mons)}`;
    }
    if (mons.length && event.eventType === 'pokemon-spotlight-hour') {
        const bonus = event.bonuses.length ? (nl ? ` Bonus tijdens het uur: ${event.bonuses[0]}.` : ` Bonus during the hour: ${event.bonuses[0]}.`) : '';
        return nl
            ? `${names} ${one ? 'verschijnt' : 'verschijnen'} ${duration} lang veel vaker in het wild.${bonus}${shinyNote(mons)}`
            : `${names} ${one ? 'appears' : 'appear'} much more often in the wild for ${duration}.${bonus}${shinyNote(mons)}`;
    }
    if (mons.length && event.eventType === 'community-day') {
        const bonuses = event.bonuses.length ? (nl ? `, met bonussen zoals ${joinNames(event.bonuses.slice(0, 3))}` : `, with bonuses like ${joinNames(event.bonuses.slice(0, 3))}`) : '';
        return nl
            ? `${names} ${one ? 'is' : 'zijn'} ${duration} lang overal te vinden${bonuses}. De kans op een shiny is groter, dus dit is hét moment om er een te vangen.`
            : `${names} ${one ? 'spawns' : 'spawn'} everywhere for ${duration}${bonuses}. Shiny odds are boosted, so this is the best time to hunt for one.`;
    }
    if (event.promoCodes.length) {
        return nl
            ? `Gebruik de code ${event.promoCodes.join(' of ')} om dit onderzoek vrij te spelen, en rond het af vóór ${longDate(event.end)}.`
            : `Redeem the code ${event.promoCodes.join(' or ')} to unlock this research, then finish it before ${longDate(event.end)}.`;
    }
    return nl ? buildTypeSummaryNl(event, def, duration) : buildTypeSummary(event, def, duration);
}

function rangeText(event) {
    const sameDay = event.start.toDateString() === event.end.toDateString();
    if (isDutch()) {
        return sameDay
            ? { sameDay, text: `${longDate(event.start)}, van ${clockTime(event.start)} tot ${clockTime(event.end)}` }
            : { sameDay, text: `${longDate(event.start)} tot ${longDate(event.end)}` };
    }
    return sameDay
        ? { sameDay, text: `${longDate(event.start)}, ${clockTime(event.start)} to ${clockTime(event.end)}` }
        : { sameDay, text: `${longDate(event.start)} to ${longDate(event.end)}` };
}

// Our own summary per event type, for events without Pokémon or codes (English).
function buildTypeSummary(event, def, duration) {
    const name = event.name;
    const { sameDay, text: range } = rangeText(event);

    switch (event.eventType) {
        case 'season':
            return `${name} is the current season and runs until ${longDate(event.end)}. All season long you'll see a different mix of wild Pokémon, new Eggs and fresh GO Battle League rewards, so it pays to check what changed early on.`;
        case 'go-pass':
            return `${name} is active until ${longDate(event.end)}. Play a little every day to climb the reward tiers; whatever you haven't claimed when the month resets is gone.`;
        case 'timed-research':
            return `${name} has a hard deadline: ${longDate(event.end)} at ${clockTime(event.end)}. Claim every reward before then, because unfinished Timed Research disappears.`;
        case 'go-battle-league': {
            const leagues = name.split('|')[0].trim();
            return `The GO Battle League lineup from ${range}: ${leagues}. Build your teams for these leagues before the rotation starts.`;
        }
        case 'wild-area':
            return `${name} runs from ${range}. Even if you're not attending in person, you can usually join in with special spawns and research at home.`;
        case 'max-mondays': {
            const match = name.match(/Dynamax (.+?) during Max Monday/i);
            if (match) return `${match[1]} is the featured Dynamax Pokémon at Power Spots on ${weekdayDate(event.start)}, from ${clockTime(event.start)} to ${clockTime(event.end)}. Team up with friends to take it down.`;
            return `The featured Dynamax Pokémon for this Max Monday hasn't been announced yet. It takes place on ${longDate(event.start)} from ${clockTime(event.start)} to ${clockTime(event.end)}.`;
        }
        case 'max-battles':
            return `${name} brings Max Battles to Power Spots for ${duration}. Stock up on Max Particles beforehand so you can join as many battles as possible.`;
        case 'raid-hour': {
            const raid = findRaidForRaidHour(event);
            const when = `on ${weekdayDate(event.start)} from ${clockTime(event.start)} to ${clockTime(event.end)}`;
            if (raid) {
                const bosses = raid.pokemon;
                return `For one hour ${when}, ${joinNames(bosses.map(b => b.name))} ${bosses.length === 1 ? 'appears' : 'appear'} in raids at almost every Gym.${shinyNote(bosses)}`;
            }
            return `For one hour ${when}, almost every Gym hosts a raid. Ideal for chaining raids with a local group.`;
        }
        case 'raid-day':
            return `${name} lasts ${duration} on ${longDate(event.start)}. Expect extra free Raid Passes and a lot of raids in a short time, so clear your schedule.`;
        case 'community-day':
            return `The featured Pokémon for ${name} hasn't been announced yet. It's on ${longDate(event.start)} from ${clockTime(event.start)} to ${clockTime(event.end)}; save the date.`;
        case 'pokemon-go-tour': {
            const place = name.split(' - ')[1];
            return place
                ? `The ${place.replace(/\s*\d{4}$/, '')} edition of ${name.split(' - ')[0]}, from ${range}. Tours are the biggest events of the year, with debuts and regional Pokémon.`
                : `${name} runs from ${range}. Tours are the biggest events of the year, with debuts and regional Pokémon.`;
        }
        case 'pokemon-spotlight-hour':
            return `A Spotlight Hour on ${longDate(event.start)} from ${clockTime(event.start)} to ${clockTime(event.end)}. The featured Pokémon will be announced closer to the date.`;
        case 'event': {
            if (/^Minior Showers/i.test(name)) {
                return `A meteor shower brings Minior to the wild, ${sameDay ? 'on' : 'from'} ${range}. Each Minior hides a core in one of seven colours, so catch a few to complete the set.`;
            }
            return `${name} runs for ${duration}, ${sameDay ? 'on' : 'from'} ${range}. Keep an eye out for themed spawns and event research while it lasts.`;
        }
        default:
            return `${name} runs for ${duration}, ${sameDay ? 'on' : 'from'} ${range}. ${def.desc}`;
    }
}

// Our own summary per event type, for events without Pokémon or codes (Dutch).
function buildTypeSummaryNl(event, def, duration) {
    const name = event.name;
    const { sameDay, text: range } = rangeText(event);

    switch (event.eventType) {
        case 'season':
            return `${name} is het huidige seizoen en loopt tot ${longDate(event.end)}. Het hele seizoen zie je andere Pokémon in het wild, nieuwe eieren en nieuwe beloningen in GO Battle League. Kijk dus vroeg wat er is veranderd.`;
        case 'go-pass':
            return `${name} loopt tot ${longDate(event.end)}. Speel elke dag een beetje om de beloningen vrij te spelen; wat je niet hebt opgehaald als de maand voorbij is, ben je kwijt.`;
        case 'timed-research':
            return `${name} heeft een harde deadline: ${longDate(event.end)} om ${clockTime(event.end)}. Haal alle beloningen op voor die tijd, want onafgemaakte Timed Research verdwijnt.`;
        case 'go-battle-league': {
            const leagues = name.split('|')[0].trim();
            return `De GO Battle League van ${range}: ${leagues}. Stel je teams voor deze leagues samen voordat de ronde begint.`;
        }
        case 'wild-area':
            return `${name} loopt van ${range}. Ook als je er niet zelf bij bent, kun je thuis vaak meedoen met speciale spawns en onderzoek.`;
        case 'max-mondays': {
            const match = name.match(/Dynamax (.+?) during Max Monday/i);
            if (match) return `${match[1]} is de Dynamax-Pokémon bij Power Spots op ${weekdayDate(event.start)}, van ${clockTime(event.start)} tot ${clockTime(event.end)}. Versla hem samen met vrienden.`;
            return `De Dynamax-Pokémon voor deze Max Monday is nog niet bekend. Hij is op ${longDate(event.start)} van ${clockTime(event.start)} tot ${clockTime(event.end)}.`;
        }
        case 'max-battles':
            return `${name} brengt ${duration} lang Max Battles naar Power Spots. Verzamel vooraf Max Particles, zodat je aan zoveel mogelijk gevechten kunt meedoen.`;
        case 'raid-hour': {
            const raid = findRaidForRaidHour(event);
            const when = `op ${weekdayDate(event.start)} van ${clockTime(event.start)} tot ${clockTime(event.end)}`;
            if (raid) {
                const bosses = raid.pokemon;
                return `Een uur lang, ${when}, ${bosses.length === 1 ? 'verschijnt' : 'verschijnen'} ${joinNames(bosses.map(b => b.name))} in raids bij bijna elke Gym.${shinyNote(bosses)}`;
            }
            return `Een uur lang, ${when}, is er bij bijna elke Gym een raid. Ideaal om met een groep uit de buurt de ene raid na de andere te doen.`;
        }
        case 'raid-day':
            return `${name} duurt ${duration}, op ${longDate(event.start)}. Reken op extra gratis Raid Passes en heel veel raids in korte tijd, dus houd je agenda vrij.`;
        case 'community-day':
            return `De Pokémon voor ${name} is nog niet bekend. Hij is op ${longDate(event.start)} van ${clockTime(event.start)} tot ${clockTime(event.end)}; zet het alvast in je agenda.`;
        case 'pokemon-go-tour': {
            const place = name.split(' - ')[1];
            return place
                ? `De editie in ${place.replace(/\s*\d{4}$/, '')} van ${name.split(' - ')[0]}, van ${range}. Tours zijn de grootste evenementen van het jaar, met nieuwe en regionale Pokémon.`
                : `${name} loopt van ${range}. Tours zijn de grootste evenementen van het jaar, met nieuwe en regionale Pokémon.`;
        }
        case 'pokemon-spotlight-hour':
            return `Een Spotlight Hour op ${longDate(event.start)} van ${clockTime(event.start)} tot ${clockTime(event.end)}. Welke Pokémon het wordt, hoor je kort van tevoren.`;
        case 'event': {
            if (/^Minior Showers/i.test(name)) {
                return `Een meteorenregen brengt Minior naar het wild, ${sameDay ? 'op' : 'van'} ${range}. Elke Minior verbergt een kern in een van zeven kleuren, dus vang er een paar om ze allemaal te hebben.`;
            }
            return `${name} duurt ${duration}, ${sameDay ? 'op' : 'van'} ${range}. Let op thema-spawns en speciaal onderzoek zolang het loopt.`;
        }
        default:
            return `${name} duurt ${duration}, ${sameDay ? 'op' : 'van'} ${range}. ${def.desc}`;
    }
}

// Modal Logic
window.openModal = function (eventID) {
    const event = events.find(e => e.eventID === eventID);
    if (!event) return;

    const modal = document.getElementById('event-modal');
    if (!modal) return;
    const modalTitle = document.getElementById('modal-title');
    const modalType = document.getElementById('modal-type');
    const modalDate = document.getElementById('modal-date');
    const modalTime = document.getElementById('modal-time');
    const modalDesc = document.getElementById('modal-desc');
    const modalExtra = document.getElementById('modal-extra');

    modal.dataset.eventId = eventID;
    modal.classList.remove('hidden');
    void modal.offsetWidth;
    modal.classList.add('visible');

    const def = getDef(event.eventType);
    modalTitle.textContent = event.name;
    modalType.textContent = def.name;
    modalType.onclick = () => window.openTypeModal(event.eventType);
    modalType.style.cursor = "pointer";

    const dateOpts = { month: 'long', day: 'numeric', year: 'numeric' };
    const startStr = event.start.toLocaleDateString(locale(), dateOpts);
    const endStr = event.end.toLocaleDateString(locale(), dateOpts);
    modalDate.textContent = (startStr === endStr) ? startStr : `${startStr} - ${endStr}`;
    modalTime.textContent = `${clockTime(event.start)} - ${clockTime(event.end)}`;

    const summary = buildEventSummary(event, def);
    modalDesc.textContent = summary;

    const mons = pokemonWithPictures(event, 6);
    const pokemonRow = mons.length
        ? `<div class="modal-pokemon">${mons.map(p => `
            <figure>${pokemonImg(p)}<figcaption>${escapeHtml(p.name.replace(/\s*\(.*?\)/, ''))}${p.shiny ? ` <span title="${window.t('modal.shiny')}">✨</span>` : ''}</figcaption></figure>`).join('')}</div>`
        : '';

    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${event.start.toISOString().replace(/-|:|\.\d\d\d/g, "")}/${event.end.toISOString().replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent(summary)}&location=Everywhere&sf=true&output=xml`;

    modalExtra.innerHTML = `
        ${pokemonRow}
        <div class="modal-about" style="margin-top: 1.5rem; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 12px;">
            <strong style="color: var(--accent-primary); display: block; margin-bottom: 0.5rem; font-size: 0.9rem;">${escapeHtml(window.t('modal.about', { name: def.name }).toUpperCase())}</strong>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem;">${escapeHtml(def.desc)}</p>
            <p style="font-size: 0.85rem; color: var(--text-primary);">💡 ${escapeHtml(def.bonus)}</p>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
            <a href="${calendarUrl}" target="_blank" class="action-btn" style="flex: 1; background: var(--card-bg); border: 1px solid var(--card-border); color: var(--text-primary); text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <i class="ph-bold ph-calendar-plus"></i> ${window.t('modal.addToCalendar')}
            </a>
        </div>
    `;
}

window.openTypeModal = function (type) {
    const modal = document.getElementById('event-modal');
    if (!modal) return;
    const modalTitle = document.getElementById('modal-title');
    const modalType = document.getElementById('modal-type');
    const modalDate = document.getElementById('modal-date');
    const modalTime = document.getElementById('modal-time');
    const modalDesc = document.getElementById('modal-desc');
    const modalExtra = document.getElementById('modal-extra');

    delete modal.dataset.eventId;
    modal.dataset.type = type;
    modal.classList.remove('hidden');
    void modal.offsetWidth;
    modal.classList.add('visible');

    const def = getDef(type);

    modalTitle.textContent = window.t('modal.whatIs', { name: def.name });
    modalType.textContent = window.t('modal.guide');
    modalType.onclick = null;
    modalType.style.cursor = "default";

    modalDate.textContent = window.t('modal.generalInfo');
    modalTime.textContent = window.t('modal.alwaysActive');

    modalDesc.textContent = def.desc;
    modalExtra.innerHTML = `
        <div style="margin-top: 1rem;">
             <p style="font-size: 1rem; color: var(--text-primary);">💡 <strong>${window.t('modal.typicalBonuses')}</strong> ${escapeHtml(def.bonus)}</p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', async () => {
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modal = document.getElementById('event-modal');
    const searchInput = document.getElementById('event-search');
    const filterSelect = document.getElementById('event-filter');

    const closeModal = () => {
        modal.classList.remove('visible');
        setTimeout(() => modal.classList.add('hidden'), 300);
    };

    if (closeModalBtn && modal) closeModalBtn.onclick = closeModal;
    if (modal) {
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (filterSelect) filterSelect.addEventListener('change', applyFilters);

    await Promise.all([loadPokedex(), loadSavedEvents()]);
    await loadEvents();
    // If on calendar page, render saved events after loading
    if (document.getElementById('saved-events-container')) {
        window.renderSavedEvents();
    }
    setInterval(window.renderEvents, 60000);
});

// Redraw everything built in JavaScript when the language changes in Settings
document.addEventListener('languagechange', () => {
    window.renderEvents();
    window.checkAuthStatus();
    if (document.getElementById('saved-events-container')) window.renderSavedEvents();

    const modal = document.getElementById('event-modal');
    if (modal && modal.classList.contains('visible')) {
        if (modal.dataset.eventId) window.openModal(modal.dataset.eventId);
        else if (modal.dataset.type) window.openTypeModal(modal.dataset.type);
    }
});


// --- AUTHENTICATION & CALENDAR LOGIC (SUPABASE) ---

// Check login status on load
window.checkAuthStatus = async function () {
    const authSection = document.getElementById('auth-section');
    if (!authSection) return;

    // Without a Supabase project there are no accounts, so no login button either
    if (!window.supabaseClient) {
        authSection.innerHTML = '';
        return;
    }

    const session = await window.getSession();

    if (session) {
        const displayName = escapeHtml(session.user.email.split('@')[0]);
        let isAdmin = false;
        try {
            const { data } = await window.supabaseClient.rpc('is_admin');
            isAdmin = data === true;
        } catch { isAdmin = false; }

        authSection.innerHTML = `
            ${isAdmin ? `<button class="nav-btn" onclick="window.location.href='admin.html'" style="margin-right: 10px;">${window.t('auth.admin')}</button>` : ''}
            <button class="nav-btn" onclick="window.location.href='calendar.html'" style="margin-right: 10px;">${window.t('auth.myCalendar')}</button>
            <button class="nav-btn primary" onclick="window.handleLogout()">${window.t('auth.logout', { name: displayName })}</button>
        `;
    } else {
        authSection.innerHTML = `
            <button class="nav-btn primary" onclick="window.openAuthModal()">${window.t('auth.loginSignup')}</button>
        `;
    }
}

// Login Handler (Supabase)
window.handleLogin = async function (e) {
    if (e) e.preventDefault();
    if (!window.supabaseClient) return;
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        alert(window.t('auth.bothFields'));
        return;
    }

    try {
        const { error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
        if (error) {
            alert(window.t('auth.loginFailed', { message: error.message }));
        } else {
            window.location.reload();
        }
    } catch (err) {
        console.error("Login exception:", err);
        alert(window.t('auth.loginFailed', { message: err.message }));
    }
}

// Sign Up Handler (Supabase)
window.handleSignUp = async function () {
    if (!window.supabaseClient) return;
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        alert(window.t('auth.bothFields'));
        return;
    }

    if (password.length < 6) {
        alert(window.t('auth.passwordShort'));
        return;
    }

    const { data, error } = await window.supabaseClient.auth.signUp({ email, password });

    if (error) {
        alert(window.t('auth.signupFailed', { message: error.message }));
    } else if (data.session) {
        window.location.reload();
    } else {
        alert(window.t('auth.checkEmail'));
    }
}

// Logout Handler (Supabase)
window.handleLogout = async function () {
    if (window.supabaseClient) await window.supabaseClient.auth.signOut();
    window.location.href = 'index.html';
}

// Auth Modal
window.openAuthModal = function () {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('hidden');
        void modal.offsetWidth;
        modal.classList.add('visible');
    } else {
        window.location.href = 'index.html';
    }
}

// Toggle Save Event: stored in Supabase so it syncs across devices
window.toggleSaveEvent = async function (eventID) {
    const session = await window.getSession();

    if (!session) {
        window.openAuthModal();
        return;
    }

    const wasSaved = savedEventIds.has(eventID);
    // Update the screen right away, then store it
    if (wasSaved) savedEventIds.delete(eventID); else savedEventIds.add(eventID);
    rerenderAfterSave();

    const table = window.supabaseClient.from('saved_events');
    const { error } = wasSaved
        ? await table.delete().eq('event_id', eventID)
        : await table.insert({ user_id: session.user.id, event_id: eventID });

    if (error) {
        // Put it back the way it was
        if (wasSaved) savedEventIds.add(eventID); else savedEventIds.delete(eventID);
        rerenderAfterSave();
        alert(window.t('auth.saveFailed', { message: error.message }));
    }
}

function rerenderAfterSave() {
    window.renderEvents();
    if (document.getElementById('saved-events-container')) {
        window.renderSavedEvents();
    }
}

// Render Saved Events (for calendar.html)
window.renderSavedEvents = async function () {
    const container = document.getElementById('saved-events-container');
    if (!container) return; // Not on calendar page

    const session = await window.getSession();
    if (!session) return;

    const savedEventsData = events.filter(e => savedEventIds.has(e.eventID));

    container.innerHTML = '';

    if (savedEventsData.length === 0) {
        container.innerHTML = `<p class="subtitle">${window.t('calendar.empty')}</p>`;
        return;
    }

    savedEventsData.sort((a, b) => a.start - b.start).forEach(event => {
        const def = getDef(event.eventType);
        const card = document.createElement('div');
        card.className = `event-card type-${event.eventType}`;

        const month = event.start.toLocaleString(locale(), { month: 'short' });
        const day = event.start.getDate();

        card.innerHTML = `
            ${eventImageHtml(event)}
            <div class="event-card-body">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <span class="event-type" style="margin-bottom:0;">${escapeHtml(def.name)}</span>
                    <div class="list-date-box" style="transform: scale(0.8); transform-origin: top right; margin: 0;">
                        <span class="list-month">${month}</span>
                        <span class="list-day">${day}</span>
                    </div>
                </div>
                <h4 class="event-title" style="margin-bottom: 0.5rem;">${escapeHtml(event.name)}</h4>
                <div class="event-time" style="margin-bottom: 1rem;">
                    <i class="ph-bold ph-clock"></i>
                    <span>${clockTime(event.start)}</span>
                </div>
                <button class="action-btn remove-btn" onclick="window.toggleSaveEvent('${escapeHtml(event.eventID)}')">${window.t('calendar.remove')}</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Initial Run
document.addEventListener('DOMContentLoaded', () => {
    window.checkAuthStatus();

    const closeAuthBtn = document.getElementById('close-auth-btn');
    const authModal = document.getElementById('auth-modal');

    if (closeAuthBtn && authModal) {
        closeAuthBtn.onclick = () => {
            authModal.classList.remove('visible');
            setTimeout(() => authModal.classList.add('hidden'), 300);
        };

        authModal.onclick = (e) => {
            if (e.target === authModal) {
                authModal.classList.remove('visible');
                setTimeout(() => authModal.classList.add('hidden'), 300);
            }
        };
    }
});
