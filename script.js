// Event Data State
let events = [];
let filteredEvents = [];

// Event Type Definitions (English)
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

// The card picture: the event's own image if it has one, otherwise a coloured panel with an icon
function eventImageHtml(event) {
    const icon = eventIcons[event.eventType] || 'ph-calendar-star';
    const placeholder = `<div class="event-card-image event-card-placeholder placeholder-${escapeHtml(event.eventType)}"><i class="ph-fill ${icon}"></i></div>`;
    if (!event.image) return placeholder;
    return `<img src="${escapeHtml(event.image)}" class="event-card-image" alt="" onerror="this.outerHTML = this.dataset.fallback" data-fallback="${escapeHtml(placeholder)}">`;
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
        if (container) container.innerHTML = '<p class="subtitle">Oops! Could not load events. Please try again later.</p>';
    }
}

// Search and Filter Logic
async function applyFilters() {
    const searchTerm = document.getElementById('event-search').value.toLowerCase();
    const filterType = document.getElementById('event-filter').value;

    filteredEvents = events.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchTerm) ||
            event.eventType.toLowerCase().includes(searchTerm) ||
            event.pokemon.some(p => p.name.toLowerCase().includes(searchTerm));
        const matchesType = filterType === 'all' || event.eventType === filterType;

        return matchesSearch && matchesType;
    });

    await window.renderEvents();
}

function saveButtonHtml(event) {
    const isSaved = savedEventIds.has(event.eventID);
    const icon = isSaved ? 'ph-fill ph-star' : 'ph-bold ph-star';
    return `<button class="icon-btn" onclick="event.stopPropagation(); window.toggleSaveEvent('${escapeHtml(event.eventID)}')" title="${isSaved ? 'Saved' : 'Save'}"><i class="${icon}" style="${isSaved ? 'color: var(--accent-primary);' : ''}"></i></button>`;
}

function typeBadgeHtml(event) {
    const def = eventDefinitions[event.eventType] || eventDefinitions['default'];
    return `<span class="event-type clickable-badge" onclick="window.openTypeModal('${escapeHtml(event.eventType)}')">${escapeHtml(def.name)} <i class="ph-bold ph-question"></i></span>`;
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
        activeEventsContainer.innerHTML = '<p class="subtitle" style="padding: 1rem;">No matching active events right now.</p>';
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
                        <span>Ends in ${window.getTimeRemaining(now, event.end)}</span>
                    </div>
                    <div class="countdown-badge">Active Now</div>
                    <button class="action-btn" onclick="window.openModal('${escapeHtml(event.eventID)}')">View Details</button>
                </div>
            `;
            activeEventsContainer.appendChild(card);
        });
    }

    // Render Upcoming (after this week; this week has its own block)
    upcomingEventsContainer.innerHTML = '';
    if (upcomingEventsTotal.length === 0) {
        upcomingEventsContainer.innerHTML = '<p class="subtitle">No matching upcoming events found.</p>';
    } else {
        upcomingEventsTotal.forEach(event => {
            const item = document.createElement('div');
            item.className = 'list-item';

            const month = event.start.toLocaleString('en-US', { month: 'short' });
            const day = event.start.getDate();
            const time = event.start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

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
                    <span style="color: var(--text-secondary); font-size: 0.85rem;">Starts in ${window.getTimeRemaining(now, event.start)} (at ${time})</span>
                </div>
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
        container.innerHTML = '<p class="subtitle">Nothing new starts this week.</p>';
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
        const label = diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : day.toLocaleDateString('en-US', { weekday: 'long' });
        const date = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const rows = list.map(e => {
            const live = e.start <= now && e.end > now;
            const ended = e.end <= now;
            const time = e.start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            const status = live ? '<span class="week-live">Live</span>' : ended ? '<span class="week-ended">Ended</span>' : '';
            return `
                <div class="week-item${ended ? ' is-ended' : ''}" onclick="window.openModal('${escapeHtml(e.eventID)}')">
                    <span class="week-time">${time}</span>
                    <div class="week-info">
                        <span class="week-name">${escapeHtml(e.name)} ${status}</span>
                        <span class="week-type">${escapeHtml((eventDefinitions[e.eventType] || eventDefinitions['default']).name)}</span>
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

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

// --- Event descriptions ---
// Our own wording, built from the facts in our own events list.

function formatDuration(ms) {
    const hours = Math.round(ms / (1000 * 60 * 60));
    if (hours < 1) return `${Math.round(ms / 60000)} minutes`;
    if (hours < 48) return hours === 1 ? '1 hour' : `${hours} hours`;
    const days = Math.round(hours / 24);
    return days >= 14 ? `${Math.round(days / 7)} weeks` : `${days} days`;
}

// "A", "A and B", "A, B and C"
function joinNames(names) {
    if (names.length <= 1) return names.join('');
    return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

function shinyNote(list) {
    const shiny = list.filter(p => p.shiny).map(p => p.name);
    if (shiny.length === 0) return '';
    if (shiny.length === list.length) return list.length === 1 ? ' It can be shiny.' : (list.length === 2 ? ' Both can be shiny.' : ' All of them can be shiny.');
    return ` ${joinNames(shiny)} can be shiny.`;
}

function longDate(d) {
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

function clockTime(d) {
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// One or two plain sentences about this specific event.
// An event's own description (set in the admin page) always wins.
function buildEventSummary(event, def) {
    if (event.description) return event.description;

    const duration = formatDuration(event.end - event.start);
    const mons = event.pokemon;
    const names = joinNames(mons.map(p => p.name));

    if (mons.length && event.eventType === 'raid-battles') {
        return `Fight ${names} in raids at Gyms for ${duration}.${shinyNote(mons)}`;
    }
    if (mons.length && event.eventType === 'pokemon-spotlight-hour') {
        const bonus = event.bonuses.length ? ` Bonus during the hour: ${event.bonuses[0]}.` : '';
        return `${names} ${mons.length === 1 ? 'appears' : 'appear'} much more often in the wild for ${duration}.${bonus}${shinyNote(mons)}`;
    }
    if (mons.length && event.eventType === 'community-day') {
        const bonuses = event.bonuses.length ? `, with bonuses like ${joinNames(event.bonuses.slice(0, 3))}` : '';
        return `${names} ${mons.length === 1 ? 'spawns' : 'spawn'} everywhere for ${duration}${bonuses}. Shiny odds are boosted, so this is the best time to hunt for one.`;
    }
    if (event.promoCodes.length) {
        return `Redeem the code ${event.promoCodes.join(' or ')} to unlock this research, then finish it before ${longDate(event.end)}.`;
    }
    return buildTypeSummary(event, def, duration);
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

// Our own summary per event type, for events without Pokémon or codes.
function buildTypeSummary(event, def, duration) {
    const name = event.name;
    const sameDay = event.start.toDateString() === event.end.toDateString();
    const range = sameDay
        ? `${longDate(event.start)}, ${clockTime(event.start)} to ${clockTime(event.end)}`
        : `${longDate(event.start)} to ${longDate(event.end)}`;
    const weekday = d => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

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
            if (match) return `${match[1]} is the featured Dynamax Pokémon at Power Spots on ${weekday(event.start)}, from ${clockTime(event.start)} to ${clockTime(event.end)}. Team up with friends to take it down.`;
            return `The featured Dynamax Pokémon for this Max Monday hasn't been announced yet. It takes place on ${longDate(event.start)} from ${clockTime(event.start)} to ${clockTime(event.end)}.`;
        }
        case 'max-battles':
            return `${name} brings Max Battles to Power Spots for ${duration}. Stock up on Max Particles beforehand so you can join as many battles as possible.`;
        case 'raid-hour': {
            const raid = findRaidForRaidHour(event);
            const when = `on ${weekday(event.start)} from ${clockTime(event.start)} to ${clockTime(event.end)}`;
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

    modal.classList.remove('hidden');
    void modal.offsetWidth;
    modal.classList.add('visible');

    const def = eventDefinitions[event.eventType] || eventDefinitions['default'];
    modalTitle.textContent = event.name;
    modalType.textContent = def.name;
    modalType.onclick = () => window.openTypeModal(event.eventType);
    modalType.style.cursor = "pointer";

    const startStr = event.start.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const endStr = event.end.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    modalDate.textContent = (startStr === endStr) ? startStr : `${startStr} - ${endStr}`;

    const startTime = event.start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const endTime = event.end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    modalTime.textContent = `${startTime} - ${endTime}`;

    const summary = buildEventSummary(event, def);
    modalDesc.textContent = summary;

    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${event.start.toISOString().replace(/-|:|\.\d\d\d/g, "")}/${event.end.toISOString().replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent(summary)}&location=Everywhere&sf=true&output=xml`;

    modalExtra.innerHTML = `
        <div style="margin-top: 1.5rem; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 12px;">
            <strong style="color: var(--accent-primary); display: block; margin-bottom: 0.5rem; font-size: 0.9rem;">ABOUT ${escapeHtml(def.name.toUpperCase())}</strong>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem;">${escapeHtml(def.desc)}</p>
            <p style="font-size: 0.85rem; color: #fff;">💡 ${escapeHtml(def.bonus)}</p>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
            <a href="${calendarUrl}" target="_blank" class="action-btn" style="flex: 1; background: var(--card-bg); border: 1px solid var(--border-color); text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <i class="ph-bold ph-calendar-plus"></i> Add to Calendar
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

    modal.classList.remove('hidden');
    void modal.offsetWidth;
    modal.classList.add('visible');

    const def = eventDefinitions[type] || eventDefinitions['default'];

    modalTitle.textContent = `What is a ${def.name}?`;
    modalType.textContent = "GUIDE";
    modalType.onclick = null;
    modalType.style.cursor = "default";

    modalDate.textContent = "General Info";
    modalTime.textContent = "Always active";

    modalDesc.textContent = def.desc;
    modalExtra.innerHTML = `
        <div style="margin-top: 1rem;">
             <p style="font-size: 1rem; color: #fff;">💡 <strong>Typical Bonuses:</strong> ${escapeHtml(def.bonus)}</p>
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

    await loadSavedEvents();
    await loadEvents();
    // If on calendar page, render saved events after loading
    if (document.getElementById('saved-events-container')) {
        window.renderSavedEvents();
    }
    setInterval(window.renderEvents, 60000);
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
            ${isAdmin ? `<button class="nav-btn" onclick="window.location.href='admin.html'" style="margin-right: 10px;">Admin</button>` : ''}
            <button class="nav-btn" onclick="window.location.href='calendar.html'" style="margin-right: 10px;">My Calendar</button>
            <button class="nav-btn primary" onclick="window.handleLogout()">Logout (${displayName})</button>
        `;
    } else {
        authSection.innerHTML = `
            <button class="nav-btn primary" onclick="window.openAuthModal()">Login / Sign Up</button>
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
        alert("Please enter both email and password.");
        return;
    }

    try {
        const { error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
        if (error) {
            alert("Login failed: " + error.message);
        } else {
            window.location.reload();
        }
    } catch (err) {
        console.error("Login exception:", err);
        alert("Login error: " + err.message);
    }
}

// Sign Up Handler (Supabase)
window.handleSignUp = async function () {
    if (!window.supabaseClient) return;
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    const { data, error } = await window.supabaseClient.auth.signUp({ email, password });

    if (error) {
        alert("Sign up failed: " + error.message);
    } else if (data.session) {
        window.location.reload();
    } else {
        alert("Account created! Check your email to confirm it, then log in.");
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
        alert("Could not update your calendar: " + error.message);
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
        container.innerHTML = '<p class="subtitle">No events saved yet. Go explore!</p>';
        return;
    }

    savedEventsData.sort((a, b) => a.start - b.start).forEach(event => {
        const def = eventDefinitions[event.eventType] || eventDefinitions['default'];
        const card = document.createElement('div');
        card.className = `event-card type-${event.eventType}`;

        const month = event.start.toLocaleString('en-US', { month: 'short' });
        const day = event.start.getDate();
        const startTime = event.start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

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
                    <span>${startTime}</span>
                </div>
                <button class="action-btn remove-btn" onclick="window.toggleSaveEvent('${escapeHtml(event.eventID)}')">Remove from Calendar</button>
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
