// Event Data State
let events = [];
let filteredEvents = [];

const API_URL = "https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/events.min.json";

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
    "default": {
        name: "Event",
        desc: "Information about this Pokémon GO event.",
        bonus: "Stay tuned for more in-game details!"
    }
};

async function loadEvents() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Transform data to include Date objects
        events = data.map(e => ({
            ...e,
            eventType: e.eventType.split(' ')[0],
            start: new Date(e.start),
            end: new Date(e.end)
        }));

        filteredEvents = [...events];
        await window.renderEvents();
    } catch (error) {
        console.error("Error loading events:", error);
        document.getElementById('active-events-container').innerHTML = '<p class="subtitle">Oops! Could not load events. Please try again later.</p>';
    }
}

// Search and Filter Logic
async function applyFilters() {
    const searchTerm = document.getElementById('event-search').value.toLowerCase();
    const filterType = document.getElementById('event-filter').value;

    filteredEvents = events.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchTerm) ||
            event.eventType.toLowerCase().includes(searchTerm);
        const matchesType = filterType === 'all' || event.eventType === filterType;

        return matchesSearch && matchesType;
    });

    await window.renderEvents();
}

window.renderEvents = async function () {
    const activeEventsContainer = document.getElementById('active-events-container');
    const upcomingEventsContainer = document.getElementById('upcoming-events-container');
    const now = new Date();

    if (!activeEventsContainer || !upcomingEventsContainer) return;

    // Get saved events from Supabase session
    let savedEvents = [];
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (session) {
        const storageKey = `pogo_saved_${session.user.id}`;
        savedEvents = JSON.parse(localStorage.getItem(storageKey)) || [];
    }

    const sortedEvents = filteredEvents.sort((a, b) => a.start - b.start);
    const activeEventsTotal = sortedEvents.filter(e => e.start <= now && e.end > now);
    const upcomingEventsTotal = sortedEvents.filter(e => e.start > now);

    // Render Active
    activeEventsContainer.innerHTML = '';
    if (activeEventsTotal.length === 0) {
        activeEventsContainer.innerHTML = '<p class="subtitle" style="padding: 1rem;">No matching active events right now.</p>';
    } else {
        activeEventsTotal.forEach(event => {
            const def = eventDefinitions[event.eventType] || eventDefinitions['default'];
            const card = document.createElement('div');
            card.className = `event-card type-${event.eventType}`;

            // Check if saved
            const isSaved = savedEvents.includes(event.eventID);
            const saveBtnIcon = isSaved ? 'ph-fill ph-star' : 'ph-bold ph-star';
            const saveBtnText = isSaved ? 'Saved' : 'Save';
            const saveBtnClass = isSaved ? 'action-btn saved' : 'action-btn secondary';

            card.innerHTML = `
                <img src="${event.image}" class="event-card-image" alt="${event.name}" onerror="this.src='https://cdn.leekduck.com/assets/img/events/events-default-img.jpg'">
                <div class="event-card-body">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <span class="event-type clickable-badge" onclick="window.openTypeModal('${event.eventType}')">${def.name} <i class="ph-bold ph-question"></i></span>
                        <button class="icon-btn" onclick="window.toggleSaveEvent('${event.eventID}')" title="${saveBtnText}"><i class="${saveBtnIcon}" style="${isSaved ? 'color: var(--accent-primary);' : ''}"></i></button>
                    </div>
                    <h4 class="event-title">${event.name}</h4>
                    <div class="event-time">
                        <i class="ph-bold ph-clock"></i>
                        <span>Ends in ${window.getTimeRemaining(now, event.end)}</span>
                    </div>
                    <div class="countdown-badge">Active Now</div>
                    <button class="action-btn" onclick="window.openModal('${event.eventID}')">View Details</button>
                </div>
            `;
            activeEventsContainer.appendChild(card);
        });
    }

    // Render Upcoming
    upcomingEventsContainer.innerHTML = '';
    if (upcomingEventsTotal.length === 0) {
        upcomingEventsContainer.innerHTML = '<p class="subtitle">No matching upcoming events found.</p>';
    } else {
        upcomingEventsTotal.forEach(event => {
            const def = eventDefinitions[event.eventType] || eventDefinitions['default'];
            const item = document.createElement('div');
            item.className = 'list-item';

            const month = event.start.toLocaleString('en-US', { month: 'short' });
            const day = event.start.getDate();
            const time = event.start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            // Check if saved
            const isSaved = savedEvents.includes(event.eventID);
            const saveBtnIcon = isSaved ? 'ph-fill ph-star' : 'ph-bold ph-star';

            item.innerHTML = `
                <div class="list-date-box">
                    <span class="list-month">${month}</span>
                    <span class="list-day">${day}</span>
                </div>
                <div class="list-content">
                    <div style="display:flex; justify-content: space-between;">
                        <span class="event-type clickable-badge" onclick="window.openTypeModal('${event.eventType}')">${def.name} <i class="ph-bold ph-question"></i></span>
                        <button class="icon-btn" onclick="window.toggleSaveEvent('${event.eventID}')"><i class="${saveBtnIcon}" style="${isSaved ? 'color: var(--accent-primary);' : ''}"></i></button>
                    </div>
                    <h4 style="font-size: 1.1rem; margin-bottom: 0.2rem; margin-top: 0.3rem;">${event.name}</h4>
                    <span style="color: var(--text-secondary); font-size: 0.85rem;">Starts in ${window.getTimeRemaining(now, event.start)} (at ${time})</span>
                </div>
                <button class="list-action-btn" onclick="window.openModal('${event.eventID}')"><i class="ph-bold ph-caret-right"></i></button>
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
window.openModal = function (eventID) {
    const event = events.find(e => e.eventID === eventID);
    if (!event) return;

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

    modalDesc.textContent = def.desc;

    // Add Glossary & Calendar button
    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${event.start.toISOString().replace(/-|:|\.\d\d\d/g, "")}/${event.end.toISOString().replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent(def.desc + " Source: LeekDuck")}&location=Everywhere&sf=true&output=xml`;

    modalExtra.innerHTML = `
        <div style="margin-top: 1.5rem; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 12px;">
            <strong style="color: var(--accent-primary); display: block; margin-bottom: 0.5rem; font-size: 0.9rem;">ABOUT ${def.name.toUpperCase()}</strong>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem;">${def.desc}</p>
            <p style="font-size: 0.85rem; color: #fff;">💡 ${def.bonus}</p>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
            <a href="${event.link}" target="_blank" class="action-btn" style="flex: 1; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <i class="ph-bold ph-arrow-square-out"></i> View Full Details
            </a>
            <a href="${calendarUrl}" target="_blank" class="action-btn" style="flex: 1; background: var(--card-bg); border: 1px solid var(--border-color); text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <i class="ph-bold ph-calendar-plus"></i> Add to Calendar
            </a>
        </div>
    `;
}

window.openTypeModal = function (type) {
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
             <p style="font-size: 1rem; color: #fff;">💡 <strong>Typical Bonuses:</strong> ${def.bonus}</p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modal = document.getElementById('event-modal');
    const searchInput = document.getElementById('event-search');
    const filterSelect = document.getElementById('event-filter');

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

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (filterSelect) filterSelect.addEventListener('change', applyFilters);

    loadEvents().then(() => {
        // If on calendar page, render saved events after loading
        if (window.location.pathname.includes('calendar.html')) {
            window.renderSavedEvents();
        }
    });
    setInterval(window.renderEvents, 60000);
});


// --- AUTHENTICATION & CALENDAR LOGIC (SUPABASE) ---

// Check login status on load
window.checkAuthStatus = async function () {
    const authSection = document.getElementById('auth-section');
    if (!authSection) return;

    const { data: { session } } = await window.supabaseClient.auth.getSession();

    if (session) {
        const userEmail = session.user.email;
        const displayName = userEmail.split('@')[0]; // Use part before @ as display name
        authSection.innerHTML = `
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
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    console.log("Attempting login for:", email);

    try {
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        console.log("Login response:", { data, error });

        if (error) {
            console.error("Login error:", error);
            alert("Login failed: " + error.message);
        } else {
            console.log("Login successful, reloading...");
            window.location.reload();
        }
    } catch (err) {
        console.error("Login exception:", err);
        alert("Login error: " + err.message);
    }
}

// Sign Up Handler (Supabase)
window.handleSignUp = async function () {
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

    const { data, error } = await window.supabaseClient.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        alert("Sign up failed: " + error.message);
    } else {
        alert("Account created! You can now log in.");
        window.location.reload();
    }
}

// Logout Handler (Supabase)
window.handleLogout = async function () {
    await window.supabaseClient.auth.signOut();
    localStorage.removeItem('pogo_user'); // Clean up old localStorage
    window.location.href = 'index.html';
}

// Auth Modal
window.openAuthModal = function () {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('hidden');
        void modal.offsetWidth;
        modal.classList.add('visible');
    }
}

// Toggle Save Event (using Supabase session + localStorage for saved events)
window.toggleSaveEvent = async function (eventID) {
    const { data: { session } } = await window.supabaseClient.auth.getSession();

    if (!session) {
        window.openAuthModal();
        return;
    }

    const userId = session.user.id;
    const storageKey = `pogo_saved_${userId}`;
    let savedEvents = JSON.parse(localStorage.getItem(storageKey)) || [];

    const index = savedEvents.indexOf(eventID);
    if (index === -1) {
        savedEvents.push(eventID);
    } else {
        savedEvents.splice(index, 1);
    }
    localStorage.setItem(storageKey, JSON.stringify(savedEvents));

    // Re-render to update button states
    window.renderEvents();
    if (window.location.pathname.includes('calendar.html')) {
        window.renderSavedEvents();
    }
}

// Render Saved Events (for calendar.html)
window.renderSavedEvents = async function () {
    const container = document.getElementById('saved-events-container');
    if (!container) return; // Not on calendar page

    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (!session) return;

    const userId = session.user.id;
    const storageKey = `pogo_saved_${userId}`;
    const savedEvents = JSON.parse(localStorage.getItem(storageKey)) || [];

    const savedEventsData = events.filter(e => savedEvents.includes(e.eventID));

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
            <img src="${event.image}" class="event-card-image" alt="${event.name}" onerror="this.src='https://cdn.leekduck.com/assets/img/events/events-default-img.jpg'">
            <div class="event-card-body">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <span class="event-type" style="margin-bottom:0;">${def.name}</span>
                    <div class="list-date-box" style="transform: scale(0.8); transform-origin: top right; margin: 0;">
                        <span class="list-month">${month}</span>
                        <span class="list-day">${day}</span>
                    </div>
                </div>
                <h4 class="event-title" style="margin-bottom: 0.5rem;">${event.name}</h4>
                <div class="event-time" style="margin-bottom: 1rem;">
                    <i class="ph-bold ph-clock"></i>
                    <span>${startTime}</span>
                </div>
                <button class="action-btn remove-btn" onclick="window.toggleSaveEvent('${event.eventID}')">Remove from Calendar</button>
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
    const authForm = document.getElementById('auth-form');

    if (authForm) {
        authForm.addEventListener('submit', window.handleLogin);
    }

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
