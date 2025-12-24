// Event Data
const events = [
    // --- DEC 2025 ---
    {
        id: 1,
        title: "Event: Well Armed",
        type: "Event",
        start: new Date("2025-12-11T10:00:00"),
        end: new Date("2025-12-16T20:00:00"),
        description: "Global challenges and the debut of Clobbopus and Grapploct! Boosted shiny odds for Dynamax Hitmonchan & Hitmonlee.",
    },
    {
        id: 2,
        title: "Season of Precious Paths",
        type: "Season",
        start: new Date("2025-12-02T10:00:00"),
        end: new Date("2026-03-03T10:00:00"),
        description: "The season of connection. Bonuses for trading and gifting continue for three months.",
    },
    {
        id: 3,
        title: "Max Battle: Gigantamax Snorlax",
        type: "Max Battle",
        start: new Date("2025-12-14T00:00:00"),
        end: new Date("2025-12-14T23:59:59"),
        description: "Gigantamax Snorlax appears in Max Battles.",
    },
    {
        id: 4,
        title: "Raid Hour: Reshiram",
        type: "Raid Hour",
        start: new Date("2025-12-17T18:00:00"),
        end: new Date("2025-12-17T19:00:00"),
        description: "Reshiram raids appearing frequently in all gyms.",
    },
    {
        id: 5,
        title: "Winter Holiday Part 1",
        type: "Event",
        start: new Date("2025-12-18T10:00:00"),
        end: new Date("2025-12-24T10:00:00"),
        description: "Costumed Charjabug and Sudowoodo debut! Ice-types everywhere.",
    },
    {
        id: 6,
        title: "Celestial Research Day",
        type: "Research Day",
        start: new Date("2025-12-20T14:00:00"),
        end: new Date("2025-12-20T17:00:00"),
        description: "Feature on Lunatone and Solrock with boosted Shiny odds.",
    },
    {
        id: 7,
        title: "Winter Holiday Part 2",
        type: "Event",
        start: new Date("2025-12-24T10:00:00"),
        end: new Date("2025-12-29T20:00:00"),
        description: "Debuts for Rolycoly, Carkol, and Coalossal. Increased Shiny Stantler odds.",
    },
    {
        id: 8,
        title: "New Year's Event 2026",
        type: "Event",
        start: new Date("2025-12-31T20:00:00"),
        end: new Date("2026-01-04T20:00:00"),
        description: "Celebrate arrival of 2026! Fireworks in the sky and festive costumed Pokémon.",
    },

    // --- JAN 2026 ---
    {
        id: 9,
        title: "Community Day Classic: Piplup",
        type: "Community Day",
        start: new Date("2026-01-04T14:00:00"),
        end: new Date("2026-01-04T17:00:00"),
        description: "Piplup is back! Evolve Prinplup to get an Empoleon with Hydro Cannon. 1/4 Hatch Distance bonus.",
    },
    {
        id: 10,
        title: "Raid Day: Unknown",
        type: "Raid Day",
        start: new Date("2026-01-10T14:00:00"),
        end: new Date("2026-01-10T17:00:00"),
        description: "A special Raid Day event. Featured Pokémon to be announced.",
    },
    {
        id: 11,
        title: "Community Day: Grookey",
        type: "Community Day",
        start: new Date("2026-01-18T14:00:00"),
        end: new Date("2026-01-18T17:00:00"),
        description: "Grookey shines for the first time! Evolve to get Frenzy Plant. 3x Catch Stardust.",
    },
    {
        id: 12,
        title: "Shadow Raid Day",
        type: "Raid Day",
        start: new Date("2026-01-24T06:00:00"),
        end: new Date("2026-01-24T22:00:00"),
        description: "A takeover of Shadow Raids. Team GO Rocket is up to something...",
    },

    // --- FEB 2026 ---
    {
        id: 13,
        title: "Max Battle Weekend",
        type: "Max Battle",
        start: new Date("2026-01-31T06:00:00"),
        end: new Date("2026-02-01T22:00:00"),
        description: "A weekend dedicated to Dynamax battles.",
    },
    {
        id: 14,
        title: "Community Day: Feb",
        type: "Community Day",
        start: new Date("2026-02-01T14:00:00"),
        end: new Date("2026-02-01T17:00:00"),
        description: "February's Community Day. Featured Pokémon coming soon.",
    },
    {
        id: 15,
        title: "GO Tour: Kalos (Global)",
        type: "Major Event",
        start: new Date("2026-02-28T10:00:00"),
        end: new Date("2026-03-01T18:00:00"),
        description: "The biggest event of the year! Explore the Kalos region, catch shiny legendaries, and Mega Evolve everything.",
    }
];

// Event Type Glossary
const eventDefinitions = {
    "Community Day": {
        desc: "A 3-hour monthly event featuring a specific Pokémon with high shiny rates.",
        bonus: "Bonuses often include 3x XP, Stardust, or 1/4 Egg Distance. Evolving gives a special move."
    },
    "Raid Hour": {
        desc: "A 1-hour event every Wednesday (6-7 PM) where 5-star Raids appear on all Gyms.",
        bonus: "Great for shiny hunting legendaries and getting Rare Candy."
    },
    "Spotlight Hour": {
        desc: "A 1-hour event every Tuesday (6-7 PM) featuring one Pokémon spawning everywhere.",
        bonus: "Includes a special bonus like 2x Catch Candy, Transfer Candy, or XP."
    },
    "Research Day": {
        desc: "An event focused on completing Field Research tasks from PokéStops.",
        bonus: "Featured Pokémon from tasks have boosted shiny rates. Often usually lasts 3 hours."
    },
    "Max Battle": {
        desc: "Events focused on Dynamax and Gigantamax battles at Power Spots.",
        bonus: "Max Particles are easier to earn and specific Max Pokémon appear."
    },
    "Event": {
        desc: "A standard in-game event usually lasting a few days to a week.",
        bonus: "Themed spawns, special eggs, raids, and timed research."
    },
    "Season": {
        desc: "A 3-month long period with specific spawns and consistent bonuses.",
        bonus: "Affects GBL rewards, egg pools, and seasonal spawns."
    },
    "Raid Day": {
        desc: "A 3-hour event focused on Raids. You usually get up to 5 free Raid Passes.",
        bonus: "Shiny odds are significantly boosted (usually 1/10)."
    },
    "Major Event": {
        desc: "Large scale events like GO Fest or GO Tour.",
        bonus: "Ticketed or free global gameplay with massive rewards and rare spawns."
    }
};

// Make functions global to ensure inline onclick works
window.renderEvents = function () {
    console.log("Rendering events...");
    const activeEventsContainer = document.getElementById('active-events-container');
    const upcomingEventsContainer = document.getElementById('upcoming-events-container');
    const now = new Date();

    if (!activeEventsContainer || !upcomingEventsContainer) return;

    // Sort events by start time
    const sortedEvents = events.sort((a, b) => a.start - b.start);

    // Filter logic
    const activeEvents = sortedEvents.filter(e => e.start <= now && e.end > now);
    const upcomingEvents = sortedEvents.filter(e => e.start > now);

    // Render Active
    activeEventsContainer.innerHTML = '';
    if (activeEvents.length === 0) {
        activeEventsContainer.innerHTML = '<p class="subtitle" style="padding: 1rem;">No active major events right now. Check back soon!</p>';
    } else {
        activeEvents.forEach(event => {
            const card = document.createElement('div');
            card.className = 'event-card';

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <span class="event-type clickable-badge" onclick="window.openTypeModal('${event.type}')" title="What is a ${event.type}?">${event.type} <i class="ph-bold ph-question"></i></span>
                </div>
                <h4 class="event-title">${event.title}</h4>
                <div class="event-time">
                    <i class="ph-bold ph-clock"></i>
                    <span>Ends in ${window.getTimeRemaining(now, event.end)}</span>
                </div>
                <div class="countdown-badge">Active Now</div>
                <button class="action-btn" onclick="window.openModal(${event.id})">View Details</button>
            `;
            activeEventsContainer.appendChild(card);
        });
    }

    // Render Upcoming
    upcomingEventsContainer.innerHTML = '';
    if (upcomingEvents.length === 0) {
        upcomingEventsContainer.innerHTML = '<p class="subtitle">No upcoming events found.</p>';
    } else {
        upcomingEvents.forEach(event => {
            const item = document.createElement('div');
            item.className = 'list-item';

            const month = event.start.toLocaleString('default', { month: 'short' });
            const day = event.start.getDate();
            const time = event.start.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' });

            item.innerHTML = `
                <div class="list-date-box">
                    <span class="list-month">${month}</span>
                    <span class="list-day">${day}</span>
                </div>
                <div class="list-content">
                    <span class="event-type clickable-badge" onclick="window.openTypeModal('${event.type}')" title="Info about ${event.type}">${event.type} <i class="ph-bold ph-question"></i></span>
                    <h4 style="font-size: 1.1rem; margin-bottom: 0.2rem; margin-top: 0.3rem;">${event.title}</h4>
                    <span style="color: var(--text-secondary); font-size: 0.85rem;">Starts at ${time}</span>
                </div>
                <button class="list-action-btn" onclick="window.openModal(${event.id})" title="View Details"><i class="ph-bold ph-caret-right"></i></button>
            `;
            upcomingEventsContainer.appendChild(item);
        });
    }
}

window.getTimeRemaining = function (start, end) {
    const total = Date.parse(end) - Date.parse(start);
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

// Modal Logic
window.openModal = function (id) {
    console.log("Opening modal for id:", id);
    const event = events.find(e => e.id === id);
    if (!event) return;

    const modal = document.getElementById('event-modal');
    // Elements
    const modalTitle = document.getElementById('modal-title');
    const modalType = document.getElementById('modal-type');
    const modalDate = document.getElementById('modal-date');
    const modalTime = document.getElementById('modal-time');
    const modalDesc = document.getElementById('modal-desc');
    const modalExtra = document.getElementById('modal-extra');

    modal.classList.remove('hidden');
    void modal.offsetWidth; // force reflow
    modal.classList.add('visible');

    modalTitle.textContent = event.title;
    modalType.textContent = event.type;
    modalType.onclick = () => window.openTypeModal(event.type);
    modalType.style.cursor = "pointer";

    const startStr = event.start.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
    const endStr = event.end.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
    modalDate.textContent = (startStr === endStr) ? startStr : `${startStr} - ${endStr}`;

    const startTime = event.start.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' });
    const endTime = event.end.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' });
    modalTime.textContent = `${startTime} - ${endTime}`;

    modalDesc.textContent = event.description;

    // Add Glossary snippet
    const def = eventDefinitions[event.type] || eventDefinitions['Event'];
    modalExtra.innerHTML = `
        <div style="margin-top: 1.5rem; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 12px;">
            <strong style="color: var(--accent-primary); display: block; margin-bottom: 0.5rem; font-size: 0.9rem;">ABOUT ${event.type.toUpperCase()}</strong>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem;">${def.desc}</p>
            <p style="font-size: 0.85rem; color: #fff;">💡 ${def.bonus}</p>
        </div>
    `;
}

window.openTypeModal = function (type) {
    console.log("Opening type modal for:", type);
    const modal = document.getElementById('event-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalType = document.getElementById('modal-type');
    const modalDate = document.getElementById('modal-date');
    const modalTime = document.getElementById('modal-time');
    const modalDesc = document.getElementById('modal-desc');
    const modalExtra = document.getElementById('modal-extra');

    modal.classList.remove('hidden');
    void modal.offsetWidth;
    modal.classList.add('visible');

    const def = eventDefinitions[type] || eventDefinitions['Event'];

    modalTitle.textContent = `What is a ${type}?`;
    modalType.textContent = "GUIDE";
    modalType.onclick = null;
    modalType.style.cursor = "default";

    modalDate.textContent = "General Info";
    modalTime.textContent = "Always active"; // Placeholder

    modalDesc.textContent = def.desc;
    modalExtra.innerHTML = `
        <div style="margin-top: 1rem;">
             <p style="font-size: 1rem; color: #fff;">💡 <strong>Typical Bonuses:</strong> ${def.bonus}</p>
        </div>
    `;
}

// Setup Event Listeners on Load
document.addEventListener('DOMContentLoaded', () => {
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modal = document.getElementById('event-modal');

    if (closeModalBtn) {
        closeModalBtn.onclick = () => {
            modal.classList.remove('visible');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        };
    }

    if (modal) {
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('visible');
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 300);
            }
        }
    }

    // Start
    window.renderEvents();
    setInterval(window.renderEvents, 60000);
});
