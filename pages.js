// The extra pages: Calendar (month view), Raids, Pokémon search and Guide.
// Each page has a container with its own id; this file draws whichever one is on the page.
// Uses events, helpers and openModal from script.js, and t() from settings.js.

// --- Tips per event type (shown on the Guide page) ---

const eventTips = {
    en: {
        "community-day": [
            "Clear your Pokémon storage the day before so you don't run out of space mid-event.",
            "Pop an Incense at the start: it lasts the full event and keeps spawns coming while you walk.",
            "Evolve the featured Pokémon before the event ends, or you'll miss the exclusive move.",
            "Use the boosted trading to swap your extra shinies with friends for lucky chances."
        ],
        "raid-hour": [
            "Agree on a route with your local group beforehand; an hour goes fast.",
            "Save up Raid Passes during the week so you can do more than one raid.",
            "Bring a team that counters the boss, and heal your Pokémon before you start."
        ],
        "pokemon-spotlight-hour": [
            "Stay near a cluster of PokéStops so you can keep restocking Poké Balls.",
            "Use a Lure or Incense to see even more of the featured Pokémon.",
            "Save a Pinap Berry for the shiny you'll hopefully run into."
        ],
        "pokestop-showcase": [
            "Check which Pokémon is wanted, then go looking for an XXL or XXS one.",
            "Enter early: you can always swap in a better Pokémon later."
        ],
        "raid-battles": [
            "Look up the boss's weaknesses and set up a counter team in advance.",
            "Use Remote Raid Passes if there's no group near you.",
            "Throw Golden Razz Berries on the catch screen; raid bosses love to run away."
        ],
        "event": [
            "Check the spawns and Field Research early, so you know what's worth chasing.",
            "Spin PokéStops as you walk: event tasks often lead to the rarest encounters."
        ],
        "season": [
            "Look at the new Egg pool and decide which Eggs to hatch first.",
            "Check your GO Battle League teams: seasons often change the leagues and rewards.",
            "Note which Pokémon only appear this season, so you don't miss them."
        ],
        "max-mondays": [
            "Collect Max Particles from Power Spots over the weekend.",
            "Invite friends: Max Battles are much easier with a full team of four."
        ],
        "max-battles": [
            "Power up a few Dynamax Pokémon so they can actually deal damage.",
            "Max Particles fill up quickly; walk past Power Spots first to collect more."
        ],
        "go-pass": [
            "Log in daily: the daily tasks add up to most of the reward tiers.",
            "Claim rewards as soon as you unlock them; they don't wait forever."
        ],
        "go-battle-league": [
            "Build your teams for these leagues before the rotation starts, not on day one.",
            "Play your sets on bonus days for extra rewards."
        ],
        "raid-day": [
            "Charge your phone and bring a power bank: it's a lot of raids in a short time.",
            "Claim the free Raid Passes from spinning Gyms during the event.",
            "Plan a route past as many Gyms as possible."
        ],
        "team-go-rocket": [
            "Save Charged TMs to remove Frustration from your best Shadow Pokémon.",
            "Use Rocket Radars to find the leaders and Giovanni."
        ],
        "pokemon-go-tour": [
            "Check which region's Pokémon are featured and clear storage space.",
            "Save up Poké Balls and Berries in the days before."
        ],
        "research": [
            "Claim the research as soon as it unlocks so you don't run out of time."
        ],
        "timed-research": [
            "Finish each step and claim every reward before the deadline; unclaimed rewards disappear."
        ],
        "wild-area": [
            "Even from home there's often something extra: check your research tab and spawns."
        ]
    },
    nl: {
        "community-day": [
            "Maak de dag ervoor ruimte in je Pokémon-opslag, zodat die halverwege niet vol raakt.",
            "Start meteen een Incense: die werkt het hele evenement en blijft Pokémon lokken terwijl je loopt.",
            "Evolueer de Pokémon van de dag voordat het evenement afloopt, anders mis je de exclusieve aanval.",
            "Gebruik de goedkopere trades om je extra shiny's met vrienden te ruilen, met kans op een lucky."
        ],
        "raid-hour": [
            "Spreek vooraf een route af met je groep; een uur is zo voorbij.",
            "Spaar door de week Raid Passes, zodat je meer dan één raid kunt doen.",
            "Neem een team mee dat sterk is tegen de baas, en genees je Pokémon voordat je begint."
        ],
        "pokemon-spotlight-hour": [
            "Blijf in de buurt van een paar PokéStops, zodat je steeds Poké Balls kunt aanvullen.",
            "Gebruik een Lure of Incense om nog meer van de Pokémon van het uur te zien.",
            "Bewaar een Pinap Berry voor de shiny die je hopelijk tegenkomt."
        ],
        "pokestop-showcase": [
            "Kijk welke Pokémon gevraagd wordt en ga op zoek naar een XXL- of XXS-exemplaar.",
            "Doe vroeg mee: je kunt later altijd een betere Pokémon inzetten."
        ],
        "raid-battles": [
            "Zoek op waar de baas zwak tegen is en stel vooraf een team samen.",
            "Gebruik Remote Raid Passes als er geen groep bij jou in de buurt is.",
            "Gooi een Golden Razz Berry bij het vangen; raidbazen ontsnappen graag."
        ],
        "event": [
            "Kijk vroeg naar de spawns en Field Research, zodat je weet waar je op moet letten.",
            "Draai PokéStops terwijl je loopt: evenementtaken leiden vaak naar de zeldzaamste ontmoetingen."
        ],
        "season": [
            "Bekijk de nieuwe eieren en bepaal welke je als eerste uitbroedt.",
            "Check je GO Battle League-teams: een nieuw seizoen verandert vaak de leagues en beloningen.",
            "Onthoud welke Pokémon alleen dit seizoen verschijnen, zodat je ze niet mist."
        ],
        "max-mondays": [
            "Verzamel in het weekend Max Particles bij Power Spots.",
            "Nodig vrienden uit: Max Battles zijn veel makkelijker met een volledig team van vier."
        ],
        "max-battles": [
            "Maak een paar Dynamax-Pokémon sterker, zodat ze echt schade doen.",
            "Max Particles raken snel op; loop eerst langs Power Spots om er meer te verzamelen."
        ],
        "go-pass": [
            "Log elke dag in: de dagelijkse taken leveren de meeste beloningen op.",
            "Haal beloningen meteen op zodra je ze vrijspeelt; ze blijven niet eeuwig staan."
        ],
        "go-battle-league": [
            "Stel je teams samen voordat de ronde begint, niet op de eerste dag.",
            "Speel je sets op bonusdagen voor extra beloningen."
        ],
        "raid-day": [
            "Laad je telefoon op en neem een powerbank mee: het zijn veel raids in korte tijd.",
            "Haal de gratis Raid Passes op door tijdens het evenement Gyms te draaien.",
            "Plan een route langs zoveel mogelijk Gyms."
        ],
        "team-go-rocket": [
            "Spaar Charged TM's om Frustration weg te halen bij je beste Shadow-Pokémon.",
            "Gebruik Rocket Radars om de leiders en Giovanni te vinden."
        ],
        "pokemon-go-tour": [
            "Kijk welke regio aan de beurt is en maak ruimte in je opslag.",
            "Spaar de dagen ervoor Poké Balls en Berries."
        ],
        "research": [
            "Speel het onderzoek vrij zodra het kan, zodat je niet in tijdnood komt."
        ],
        "timed-research": [
            "Rond elke stap af en haal alle beloningen op vóór de deadline; wat je laat liggen verdwijnt."
        ],
        "wild-area": [
            "Ook thuis is er vaak iets extra's: kijk in je onderzoekstab en let op de spawns."
        ]
    }
};

function tipsFor(type) {
    const lang = window.siteSettings?.lang === 'nl' ? 'nl' : 'en';
    return eventTips[lang][type] || [];
}

function upcoming(list) {
    const now = new Date();
    return list.filter(e => e.end > now).sort((a, b) => a.start - b.start);
}

function shortDate(d) {
    return d.toLocaleDateString(locale(), { weekday: 'short', month: 'short', day: 'numeric' });
}

function artHtml(event, max, className = '') {
    const mons = pokemonWithPictures(event, max);
    const icon = eventIcons[event.eventType] || 'ph-calendar-star';
    const inner = mons.length ? mons.map(p => pokemonImg(p)).join('') : `<i class="ph-fill ${icon}"></i>`;
    return `<div class="event-card-placeholder placeholder-${escapeHtml(event.eventType)} ${className}">${inner}</div>`;
}

// ── Calendar: a month grid with every event on the day it starts ─────────

const monthState = { year: new Date().getFullYear(), month: new Date().getMonth() };

function renderMonth() {
    const root = document.getElementById('month-view');
    if (!root) return;

    const { year, month } = monthState;
    const first = new Date(year, month, 1);
    const title = first.toLocaleDateString(locale(), { month: 'long', year: 'numeric' });
    const today = startOfDay(new Date()).getTime();

    // Weeks start on Monday
    const offset = (first.getDay() + 6) % 7;
    const gridStart = addDays(first, -offset);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cellCount = Math.ceil((offset + daysInMonth) / 7) * 7;

    const weekdayNames = Array.from({ length: 7 }, (_, i) =>
        addDays(new Date(2024, 0, 1), i).toLocaleDateString(locale(), { weekday: 'short' }));

    const cells = Array.from({ length: cellCount }, (_, i) => {
        const day = addDays(gridStart, i);
        const inMonth = day.getMonth() === month;
        const dayEvents = events
            .filter(e => startOfDay(e.start).getTime() === day.getTime())
            .sort((a, b) => a.start - b.start);
        const isToday = day.getTime() === today;

        const chips = dayEvents.map((e, idx) => {
            const [first] = pokemonWithPictures(e, 1);
            const icon = eventIcons[e.eventType] || 'ph-calendar-star';
            return `
                <button type="button" class="cal-chip chip-${escapeHtml(e.eventType)}${idx >= 3 ? ' is-extra' : ''}" onclick="window.openModal('${escapeHtml(e.eventID)}')" title="${escapeHtml(e.name)}">
                    ${first ? pokemonImg(first) : `<i class="ph-fill ${icon}"></i>`}
                    <span class="cal-chip-time">${clockTime(e.start)}</span>
                    <span class="cal-chip-name">${escapeHtml(e.name)}</span>
                </button>`;
        }).join('');
        const more = dayEvents.length > 3
            ? `<button type="button" class="cal-more" onclick="this.closest('.cal-day').classList.toggle('is-open')">${window.t('calendar.more', { count: dayEvents.length - 3 })}</button>`
            : '';
        const weekday = day.toLocaleDateString(locale(), { weekday: 'long' });

        return `
            <div class="cal-day${inMonth ? '' : ' is-outside'}${isToday ? ' is-today' : ''}${dayEvents.length ? '' : ' is-empty'}">
                <div class="cal-day-number"><span class="cal-day-name">${weekday}</span> ${day.getDate()}</div>
                ${chips}${more}
            </div>`;
    }).join('');

    const monthEvents = events.filter(e => e.start.getFullYear() === year && e.start.getMonth() === month);

    root.innerHTML = `
        <div class="cal-toolbar">
            <button type="button" class="nav-btn" id="cal-prev" aria-label="${window.t('calendar.prev')}"><i class="ph-bold ph-caret-left"></i></button>
            <h3 class="cal-title">${title.charAt(0).toUpperCase() + title.slice(1)}</h3>
            <button type="button" class="nav-btn" id="cal-next" aria-label="${window.t('calendar.next')}"><i class="ph-bold ph-caret-right"></i></button>
            <button type="button" class="nav-btn" id="cal-today">${window.t('week.today')}</button>
        </div>
        ${monthEvents.length ? '' : `<p class="subtitle cal-empty">${window.t('calendar.emptyMonth')}</p>`}
        <div class="cal-grid">
            ${weekdayNames.map(n => `<div class="cal-weekday">${n}</div>`).join('')}
            ${cells}
        </div>`;

    document.getElementById('cal-prev').onclick = () => shiftMonth(-1);
    document.getElementById('cal-next').onclick = () => shiftMonth(1);
    document.getElementById('cal-today').onclick = () => {
        const now = new Date();
        monthState.year = now.getFullYear();
        monthState.month = now.getMonth();
        renderMonth();
    };
}

function shiftMonth(delta) {
    const d = new Date(monthState.year, monthState.month + delta, 1);
    monthState.year = d.getFullYear();
    monthState.month = d.getMonth();
    renderMonth();
}

// ── Raids: all raid bosses now and soon ─────────────────────────────────

function raidHoursFor(raid) {
    return events.filter(e => e.eventType === 'raid-hour' && findRaidForRaidHour(e) === raid && e.end > new Date());
}

function raidCard(raid) {
    const now = new Date();
    const live = raid.start <= now;
    const bosses = raid.pokemon.map(p => `
        <span class="raid-boss">${escapeHtml(p.name)}${p.shiny ? ` <span title="${window.t('modal.shiny')}">✨</span>` : ''}</span>`).join('');
    const hours = raidHoursFor(raid).map(h => `
        <button type="button" class="raid-hour-link" onclick="window.openModal('${escapeHtml(h.eventID)}')">
            <i class="ph-bold ph-clock"></i> ${window.t('raids.raidHour', { date: shortDate(h.start), time: clockTime(h.start) })}
        </button>`).join('');
    const when = live
        ? window.t('card.endsIn', { time: window.getTimeRemaining(now, raid.end) })
        : window.t('raids.starts', { date: shortDate(raid.start), time: clockTime(raid.start) });

    return `
        <div class="event-card raid-card type-raid-battles" onclick="window.openModal('${escapeHtml(raid.eventID)}')">
            ${artHtml(raid, 4, 'raid-art')}
            <div class="event-card-body">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <span class="event-type">${live ? window.t('card.activeNow') : window.t('raids.soon')}</span>
                    ${saveButtonHtml(raid)}
                </div>
                <h4 class="event-title raid-title">${escapeHtml(raid.name)}</h4>
                <div class="raid-bosses">${bosses}</div>
                <div class="event-time"><i class="ph-bold ph-calendar-blank"></i><span>${when}</span></div>
                ${hours ? `<div class="raid-hours" onclick="event.stopPropagation()">${hours}</div>` : ''}
            </div>
        </div>`;
}

function renderRaids() {
    const root = document.getElementById('raids-view');
    if (!root) return;
    const now = new Date();

    const raids = upcoming(events.filter(e => e.eventType === 'raid-battles' && e.pokemon.length));
    const live = raids.filter(e => e.start <= now);
    const soon = raids.filter(e => e.start > now);
    const raidDays = upcoming(events.filter(e => e.eventType === 'raid-day'));

    const section = (titleKey, icon, body) => `
        <section class="section-block">
            <div class="section-header"><h3><i class="ph-fill ${icon}"></i> ${window.t(titleKey)}</h3></div>
            ${body}
        </section>`;

    root.innerHTML = [
        section('raids.live', 'ph-broadcast', live.length
            ? `<div class="cards-grid">${live.map(raidCard).join('')}</div>`
            : `<p class="subtitle">${window.t('raids.noneLive')}</p>`),
        section('raids.upcoming', 'ph-clock-countdown', soon.length
            ? `<div class="cards-grid">${soon.map(raidCard).join('')}</div>`
            : `<p class="subtitle">${window.t('raids.noneUpcoming')}</p>`),
        raidDays.length ? section('raids.days', 'ph-calendar-star', `
            <div class="week-tiles">${raidDays.map(e => `
                <div class="week-tile" onclick="window.openModal('${escapeHtml(e.eventID)}')">
                    ${artHtml(e, 2, 'week-tile-art')}
                    <div class="week-tile-body">
                        <div class="week-tile-top"><span class="week-time">${shortDate(e.start)}</span>${saveButtonHtml(e)}</div>
                        <span class="week-name">${escapeHtml(e.name)}</span>
                        <span class="week-type">${clockTime(e.start)} - ${clockTime(e.end)}</span>
                    </div>
                </div>`).join('')}
            </div>`) : ''
    ].join('');
}

// ── Pokémon search: which events does a Pokémon appear in? ──────────────

function displayName(name) {
    return String(name).replace(/\s*\(.*?\)/g, '').trim();
}

function pokemonIndex() {
    const index = new Map();
    upcoming(events).forEach(e => {
        featuredPokemon(e).forEach(p => {
            const name = displayName(p.name);
            if (!index.has(name)) index.set(name, { name, url: pokemonImageUrl(p.name), shiny: false, events: [] });
            const entry = index.get(name);
            entry.shiny = entry.shiny || p.shiny;
            if (!entry.events.includes(e)) entry.events.push(e);
        });
    });
    return [...index.values()].sort((a, b) => a.events[0].start - b.events[0].start);
}

function renderPokemonSearch() {
    const root = document.getElementById('pokemon-results');
    const input = document.getElementById('pokemon-search');
    if (!root || !input) return;

    const query = input.value.trim().toLowerCase();
    const all = pokemonIndex();
    const matches = query ? all.filter(p => p.name.toLowerCase().includes(query)) : all;
    const now = new Date();

    let html = '';
    if (matches.length) {
        html = `<div class="mon-grid">${matches.map(p => `
            <div class="mon-card">
                <div class="mon-art">${p.url ? `<img src="${escapeHtml(p.url)}" alt="" loading="lazy" onerror="this.remove()">` : '<i class="ph-fill ph-question"></i>'}</div>
                <h4 class="mon-name">${escapeHtml(p.name)}${p.shiny ? ` <span title="${window.t('modal.shiny')}">✨</span>` : ''}</h4>
                <ul class="mon-events">${p.events.map(e => `
                    <li><button type="button" onclick="window.openModal('${escapeHtml(e.eventID)}')">
                        <span class="mon-event-name">${escapeHtml(e.name)}</span>
                        <span class="mon-event-date">${e.start <= now ? window.t('card.activeNow') : shortDate(e.start)}</span>
                    </button></li>`).join('')}
                </ul>
            </div>`).join('')}</div>`;
    }

    // A Pokémon that exists but isn't in any event right now
    if (query && !matches.length) {
        const key = Object.keys(pokedex).find(k => k.replace(/-/g, ' ') === query.replace(/-/g, ' '))
            || Object.keys(pokedex).find(k => k.startsWith(query.replace(/\s+/g, '-')));
        if (key) {
            const name = key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            html = `
                <div class="mon-none">
                    <img src="${escapeHtml(pokemonImageUrl(key))}" alt="" onerror="this.remove()">
                    <p>${window.t('pokemon.notInEvents', { name: escapeHtml(name) })}</p>
                </div>`;
        } else {
            html = `<p class="subtitle">${window.t('pokemon.noMatch', { query: escapeHtml(input.value.trim()) })}</p>`;
        }
    }
    if (!query && !matches.length) html = `<p class="subtitle">${window.t('pokemon.empty')}</p>`;

    document.getElementById('pokemon-count').textContent = query
        ? window.t('pokemon.countResults', { count: matches.length })
        : window.t('pokemon.countAll', { count: matches.length });
    root.innerHTML = html;
}

// ── Guide: what each type of event is, with tips ────────────────────────

const GUIDE_ORDER = [
    'community-day', 'pokemon-spotlight-hour', 'raid-hour', 'raid-battles', 'raid-day',
    'max-mondays', 'max-battles', 'go-battle-league', 'season', 'go-pass', 'research',
    'timed-research', 'pokemon-go-tour', 'wild-area', 'event', 'team-go-rocket', 'pokestop-showcase'
];

function renderGuide() {
    const root = document.getElementById('guide-view');
    if (!root) return;

    const jump = GUIDE_ORDER.map(type => `
        <a class="guide-jump" href="#guide-${type}"><i class="ph-fill ${eventIcons[type] || 'ph-calendar-star'}"></i>${escapeHtml(getDef(type).name)}</a>`).join('');

    const cards = GUIDE_ORDER.map(type => {
        const def = getDef(type);
        const tips = tipsFor(type);
        const next = upcoming(events.filter(e => e.eventType === type))[0];
        const now = new Date();
        return `
            <article class="guide-card" id="guide-${type}">
                <div class="guide-art event-card-placeholder placeholder-${type}"><i class="ph-fill ${eventIcons[type] || 'ph-calendar-star'}"></i></div>
                <div class="guide-body">
                    <h3>${escapeHtml(def.name)}</h3>
                    <p class="guide-desc">${escapeHtml(def.desc)}</p>
                    <p class="guide-bonus">💡 ${escapeHtml(def.bonus)}</p>
                    ${tips.length ? `
                        <h4 class="guide-subtitle">${window.t('guide.tips')}</h4>
                        <ul class="guide-tips">${tips.map(tip => `<li>${escapeHtml(tip)}</li>`).join('')}</ul>` : ''}
                    ${next ? `
                        <button type="button" class="guide-next" onclick="window.openModal('${escapeHtml(next.eventID)}')">
                            <i class="ph-bold ph-arrow-right"></i>
                            <span>${next.start <= now ? window.t('guide.now') : window.t('guide.next')}: <strong>${escapeHtml(next.name)}</strong>${next.start > now ? ` · ${shortDate(next.start)}` : ''}</span>
                        </button>` : ''}
                </div>
            </article>`;
    }).join('');

    root.innerHTML = `<nav class="guide-jumps">${jump}</nav><div class="guide-list">${cards}</div>`;
}

// ── Wiring ──────────────────────────────────────────────────────────────

function renderPages() {
    renderMonth();
    renderRaids();
    renderPokemonSearch();
    renderGuide();
}

document.addEventListener('eventsloaded', () => {
    renderPages();
    const input = document.getElementById('pokemon-search');
    if (input) {
        const params = new URLSearchParams(location.search);
        if (params.get('q')) input.value = params.get('q');
        input.addEventListener('input', renderPokemonSearch);
        renderPokemonSearch();
    }
    // Jump to a guide section when the page was opened with #guide-…
    if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
});

document.addEventListener('languagechange', renderPages);
