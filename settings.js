// Settings: language and colour theme.
// Loaded in <head> so the saved theme and language apply before the page shows.

const THEMES = [
    { id: 'midnight', bg: '#0f172a', accent: '#818cf8', accent2: '#c084fc' },
    { id: 'ocean', bg: '#071a2b', accent: '#38bdf8', accent2: '#2dd4bf' },
    { id: 'forest', bg: '#0b1a14', accent: '#4ade80', accent2: '#a3e635' },
    { id: 'sunset', bg: '#1c1017', accent: '#fb923c', accent2: '#f472b6' },
    { id: 'light', bg: '#f5f6fb', accent: '#6366f1', accent2: '#a855f7' }
];

const LANGUAGES = [
    { id: 'en', label: 'English' },
    { id: 'nl', label: 'Nederlands' }
];

const translations = {
    en: {
        'hero.title': "Don't miss the next <span class=\"text-gradient\">Big Catch</span>",
        'hero.subtitle': 'Your ultimate tracker for Pokémon GO events.',
        'search.placeholder': 'Search events or Pokémon...',
        'filter.all': 'All Event Types',
        'filter.community-day': 'Community Day',
        'filter.raid-hour': 'Raid Hour',
        'filter.raid-battles': 'Raid Battles',
        'filter.pokemon-spotlight-hour': 'Spotlight Hour',
        'filter.pokestop-showcase': 'Showcases',
        'filter.max-mondays': 'Max Mondays',
        'filter.event': 'General Events',
        'section.week': 'This Week',
        'section.live': 'Live Now',
        'section.upcoming': 'Coming Soon',
        'loading.week': 'Loading this week...',
        'loading.active': 'Loading active events...',
        'loading.upcoming': 'Loading upcoming events...',
        'empty.active': 'No matching active events right now.',
        'empty.upcoming': 'No matching upcoming events found.',
        'empty.week': 'Nothing new starts this week.',
        'error.load': 'Oops! Could not load events. Please try again later.',
        'card.endsIn': 'Ends in {time}',
        'card.activeNow': 'Active Now',
        'card.viewDetails': 'View Details',
        'card.startsIn': 'Starts in {time} (at {clock})',
        'card.save': 'Save',
        'card.saved': 'Saved',
        'week.today': 'Today',
        'week.tomorrow': 'Tomorrow',
        'week.live': 'Live',
        'week.ended': 'Ended',
        'time.d': 'd',
        'time.h': 'h',
        'time.m': 'm',
        'modal.about': 'About {name}',
        'modal.addToCalendar': 'Add to Calendar',
        'modal.whatIs': 'What is a {name}?',
        'modal.guide': 'Guide',
        'modal.generalInfo': 'General Info',
        'modal.alwaysActive': 'Always active',
        'modal.typicalBonuses': 'Typical Bonuses:',
        'modal.shiny': 'Can be shiny',
        'auth.title': 'Trainer Login',
        'auth.subtitle': 'Sign in to sync your calendar',
        'auth.email': 'Email address',
        'auth.password': 'Password (min. 6 characters)',
        'auth.login': 'Login',
        'auth.create': 'Create Account',
        'auth.loginSignup': 'Login / Sign Up',
        'auth.myCalendar': 'My Calendar',
        'auth.logout': 'Logout ({name})',
        'auth.admin': 'Admin',
        'auth.bothFields': 'Please enter both email and password.',
        'auth.loginFailed': 'Login failed: {message}',
        'auth.passwordShort': 'Password must be at least 6 characters.',
        'auth.signupFailed': 'Sign up failed: {message}',
        'auth.checkEmail': 'Account created! Check your email to confirm it, then log in.',
        'auth.saveFailed': 'Could not update your calendar: {message}',
        'calendar.title': 'My <span class="text-gradient">Saved Events</span>',
        'calendar.welcome': 'Welcome back!',
        'calendar.welcomeName': 'Welcome back, {name}!',
        'calendar.loading': 'Loading your schedule...',
        'calendar.loginRequired': 'Login Required',
        'calendar.loginText': 'Please log in to view your personal calendar.',
        'calendar.goToLogin': 'Go to Login',
        'calendar.noAccounts': "Accounts aren't available yet. Check back soon!",
        'calendar.back': 'Back to events',
        'calendar.empty': 'No events saved yet. Go explore!',
        'calendar.remove': 'Remove from Calendar',
        'menu.home': 'Home',
        'menu.calendar': 'Calendar',
        'menu.raids': 'Raids',
        'menu.pokemon': 'Pokémon',
        'menu.guide': 'Guide',
        'page.calendar.title': 'Event <span class="text-gradient">Calendar</span>',
        'page.calendar.subtitle': 'Every event on the day it starts. Plan your month ahead.',
        'page.raids.title': 'Raid <span class="text-gradient">Bosses</span>',
        'page.raids.subtitle': 'Who you can fight in raids right now and soon.',
        'page.pokemon.title': 'Find a <span class="text-gradient">Pokémon</span>',
        'page.pokemon.subtitle': 'See which events a Pokémon shows up in.',
        'page.pokemon.placeholder': 'Type a Pokémon, for example Pawniard',
        'page.guide.title': 'Event <span class="text-gradient">Guide</span>',
        'page.guide.subtitle': 'What each type of event is, and how to get the most out of it.',
        'calendar.more': '+{count} more',
        'calendar.prev': 'Previous month',
        'calendar.next': 'Next month',
        'calendar.emptyMonth': 'No events in this month yet.',
        'raids.live': 'Raiding Now',
        'raids.upcoming': 'Coming Up',
        'raids.days': 'Raid Days',
        'raids.soon': 'Soon',
        'raids.starts': 'Starts {date}, {time}',
        'raids.raidHour': 'Raid Hour: {date}, {time}',
        'raids.noneLive': 'No raid bosses right now.',
        'raids.noneUpcoming': 'No upcoming raids announced yet.',
        'pokemon.notInEvents': '{name} isn\'t in any event right now.',
        'pokemon.noMatch': 'No Pokémon found for "{query}".',
        'pokemon.empty': 'No Pokémon in upcoming events yet.',
        'pokemon.countAll': '{count} Pokémon in current and upcoming events',
        'pokemon.countResults': '{count} found',
        'guide.tips': 'Tips',
        'guide.next': 'Next up',
        'guide.now': 'Happening now',
        'menu.friends': 'Friends',
        'page.friends.title': 'Find new <span class="text-gradient">Trainers</span>',
        'page.friends.subtitle': 'Share your friend code with other players, and add theirs.',
        'friends.findTitle': 'Trainers looking for friends',
        'friends.mineTitle': 'Your friend code',
        'friends.countryPlaceholder': 'Choose your country',
        'friends.found': '{count} trainers, newest first',
        'friends.foundOne': '1 trainer',
        'friends.noneYet': 'No friend codes yet. Be the first and add yours below!',
        'friends.howToAdd': 'Tap a code to copy it, then in Pokémon GO go to Friends → Add Friend and paste it.',
        'friends.copy': 'Copy code',
        'friends.anonymous': 'Trainer',
        'friends.you': 'you',
        'friends.yourCode': 'Your code is listed',
        'friends.expires': 'visible for {days} more days',
        'friends.renew': 'Keep listed',
        'friends.remove': 'Remove',
        'friends.renewed': 'Done! Your code stays listed for another {days} days.',
        'friends.confirmRemove': 'Remove {code} from the list?',
        'friends.wrongKey': "That key doesn't match this code, so nothing was removed.",
        'friends.keyTitle': 'Your secret key',
        'friends.keyText': 'This browser remembers the key. Save it somewhere if you want to remove your code from another device.',
        'friends.keyPlaceholder': 'Secret key',
        'friends.removeWithKey': 'Remove a code with your secret key',
        'friends.expired': 'Your code is no longer listed. Add it again below.',
        'friends.codeLabel': 'Friend code (12 digits)',
        'friends.countryLabel': 'Country',
        'friends.teamLabel': 'Team (optional)',
        'friends.teamNone': 'Not telling',
        'friends.team.mystic': 'Mystic',
        'friends.team.valor': 'Valor',
        'friends.team.instinct': 'Instinct',
        'friends.privacy': 'Only your code, country and team are shown. Your code disappears after {days} days unless you keep it listed, and you can remove it any time.',
        'friends.submit': 'Add my code',
        'friends.errorCode': 'A friend code has exactly 12 digits.',
        'friends.errorCountry': 'Choose your country.',
        'friends.errorTaken': 'This code is already on the list.',
        'friends.errorGeneral': 'Something went wrong: {message}',
        'friends.demoTitle': 'Test version.',
        'friends.demoText': 'Everything you add here stays in this browser only. Nobody else sees it, and the trainers shown are made up.',
        'friends.demoReset': 'Start over',
        'friends.demoResetConfirm': 'Clear the test version and start over with the example trainers?',
        'friends.soonTitle': 'Coming soon',
        'friends.soonText': 'Soon you can share your friend code here with other players.',
        'nav.home': 'Home',
        'footer': 'Built for Trainers, by Trainers.',
        'settings.title': 'Settings',
        'settings.open': 'Settings',
        'settings.language': 'Language',
        'settings.theme': 'Theme',
        'theme.midnight': 'Midnight',
        'theme.ocean': 'Ocean',
        'theme.forest': 'Forest',
        'theme.sunset': 'Sunset',
        'theme.light': 'Light'
    },
    nl: {
        'hero.title': 'Mis nooit meer een <span class="text-gradient">grote vangst</span>',
        'hero.subtitle': 'Al je Pokémon GO-evenementen op één plek.',
        'search.placeholder': 'Zoek evenementen of Pokémon...',
        'filter.all': 'Alle soorten',
        'filter.community-day': 'Community Day',
        'filter.raid-hour': 'Raid Hour',
        'filter.raid-battles': 'Raids',
        'filter.pokemon-spotlight-hour': 'Spotlight Hour',
        'filter.pokestop-showcase': 'Showcases',
        'filter.max-mondays': 'Max Mondays',
        'filter.event': 'Overige evenementen',
        'section.week': 'Deze week',
        'section.live': 'Nu bezig',
        'section.upcoming': 'Binnenkort',
        'loading.week': 'Deze week laden...',
        'loading.active': 'Lopende evenementen laden...',
        'loading.upcoming': 'Komende evenementen laden...',
        'empty.active': 'Er loopt nu niets dat hierbij past.',
        'empty.upcoming': 'Geen komende evenementen gevonden.',
        'empty.week': 'Deze week begint er niets nieuws.',
        'error.load': 'Oeps! De evenementen konden niet laden. Probeer het later opnieuw.',
        'card.endsIn': 'Eindigt over {time}',
        'card.activeNow': 'Nu bezig',
        'card.viewDetails': 'Bekijk details',
        'card.startsIn': 'Begint over {time} (om {clock})',
        'card.save': 'Bewaren',
        'card.saved': 'Bewaard',
        'week.today': 'Vandaag',
        'week.tomorrow': 'Morgen',
        'week.live': 'Bezig',
        'week.ended': 'Voorbij',
        'time.d': 'd',
        'time.h': 'u',
        'time.m': 'm',
        'modal.about': 'Over {name}',
        'modal.addToCalendar': 'Zet in agenda',
        'modal.whatIs': 'Wat is een {name}?',
        'modal.guide': 'Uitleg',
        'modal.generalInfo': 'Algemene info',
        'modal.alwaysActive': 'Altijd geldig',
        'modal.typicalBonuses': 'Gebruikelijke bonussen:',
        'modal.shiny': 'Kan shiny zijn',
        'auth.title': 'Inloggen',
        'auth.subtitle': 'Log in om je agenda overal te zien',
        'auth.email': 'E-mailadres',
        'auth.password': 'Wachtwoord (minimaal 6 tekens)',
        'auth.login': 'Inloggen',
        'auth.create': 'Account maken',
        'auth.loginSignup': 'Inloggen / Aanmelden',
        'auth.myCalendar': 'Mijn agenda',
        'auth.logout': 'Uitloggen ({name})',
        'auth.admin': 'Beheer',
        'auth.bothFields': 'Vul je e-mailadres en wachtwoord in.',
        'auth.loginFailed': 'Inloggen mislukt: {message}',
        'auth.passwordShort': 'Je wachtwoord moet minstens 6 tekens hebben.',
        'auth.signupFailed': 'Aanmelden mislukt: {message}',
        'auth.checkEmail': 'Account gemaakt! Bevestig het via de mail die je hebt gekregen en log daarna in.',
        'auth.saveFailed': 'Je agenda kon niet worden bijgewerkt: {message}',
        'calendar.title': 'Mijn <span class="text-gradient">bewaarde evenementen</span>',
        'calendar.welcome': 'Welkom terug!',
        'calendar.welcomeName': 'Welkom terug, {name}!',
        'calendar.loading': 'Je agenda laden...',
        'calendar.loginRequired': 'Inloggen nodig',
        'calendar.loginText': 'Log in om je eigen agenda te zien.',
        'calendar.goToLogin': 'Naar inloggen',
        'calendar.noAccounts': 'Accounts zijn er nog niet. Kom binnenkort terug!',
        'calendar.back': 'Terug naar evenementen',
        'calendar.empty': 'Je hebt nog niets bewaard. Ga op ontdekking!',
        'calendar.remove': 'Uit agenda halen',
        'menu.home': 'Home',
        'menu.calendar': 'Kalender',
        'menu.raids': 'Raids',
        'menu.pokemon': 'Pokémon',
        'menu.guide': 'Uitleg',
        'page.calendar.title': 'Evenementen<span class="text-gradient">kalender</span>',
        'page.calendar.subtitle': 'Elk evenement op de dag dat het begint. Zo plan je je maand vooruit.',
        'page.raids.title': '<span class="text-gradient">Raidbazen</span>',
        'page.raids.subtitle': 'Wie je nu en binnenkort in raids kunt verslaan.',
        'page.pokemon.title': 'Zoek een <span class="text-gradient">Pokémon</span>',
        'page.pokemon.subtitle': 'Zie in welke evenementen een Pokémon voorkomt.',
        'page.pokemon.placeholder': 'Typ een Pokémon, bijvoorbeeld Pawniard',
        'page.guide.title': '<span class="text-gradient">Uitleg</span> per evenement',
        'page.guide.subtitle': 'Wat elk soort evenement is, en hoe je er het meeste uithaalt.',
        'calendar.more': '+{count} meer',
        'calendar.prev': 'Vorige maand',
        'calendar.next': 'Volgende maand',
        'calendar.emptyMonth': 'Nog geen evenementen in deze maand.',
        'raids.live': 'Nu te raiden',
        'raids.upcoming': 'Binnenkort',
        'raids.days': 'Raid Days',
        'raids.soon': 'Binnenkort',
        'raids.starts': 'Begint {date}, {time}',
        'raids.raidHour': 'Raid Hour: {date}, {time}',
        'raids.noneLive': 'Er zijn nu geen raidbazen.',
        'raids.noneUpcoming': 'Er zijn nog geen nieuwe raids aangekondigd.',
        'pokemon.notInEvents': '{name} komt nu in geen enkel evenement voor.',
        'pokemon.noMatch': 'Geen Pokémon gevonden voor "{query}".',
        'pokemon.empty': 'Nog geen Pokémon in komende evenementen.',
        'pokemon.countAll': '{count} Pokémon in lopende en komende evenementen',
        'pokemon.countResults': '{count} gevonden',
        'guide.tips': 'Tips',
        'guide.next': 'Hierna',
        'guide.now': 'Nu bezig',
        'menu.friends': 'Vrienden',
        'page.friends.title': 'Vind nieuwe <span class="text-gradient">trainers</span>',
        'page.friends.subtitle': 'Deel je vriendschapscode met andere spelers, en voeg die van hen toe.',
        'friends.findTitle': 'Trainers die vrienden zoeken',
        'friends.mineTitle': 'Jouw vriendschapscode',
        'friends.countryPlaceholder': 'Kies je land',
        'friends.found': '{count} trainers, nieuwste eerst',
        'friends.foundOne': '1 trainer',
        'friends.noneYet': 'Nog geen vriendschapscodes. Wees de eerste en zet die van jou hieronder!',
        'friends.howToAdd': 'Tik op een code om hem te kopiëren. Ga in Pokémon GO naar Vrienden → Vriend toevoegen en plak hem daar.',
        'friends.copy': 'Code kopiëren',
        'friends.anonymous': 'Trainer',
        'friends.you': 'jij',
        'friends.yourCode': 'Je code staat op de lijst',
        'friends.expires': 'nog {days} dagen zichtbaar',
        'friends.renew': 'Verlengen',
        'friends.remove': 'Verwijderen',
        'friends.renewed': 'Gelukt! Je code blijft nog {days} dagen staan.',
        'friends.confirmRemove': '{code} van de lijst halen?',
        'friends.wrongKey': 'Die sleutel hoort niet bij deze code, dus er is niets verwijderd.',
        'friends.keyTitle': 'Je geheime sleutel',
        'friends.keyText': 'Deze browser onthoudt de sleutel. Bewaar hem ergens als je je code ook vanaf een ander apparaat wilt kunnen verwijderen.',
        'friends.keyPlaceholder': 'Geheime sleutel',
        'friends.removeWithKey': 'Een code verwijderen met je geheime sleutel',
        'friends.expired': 'Je code staat niet meer op de lijst. Zet hem hieronder opnieuw neer.',
        'friends.codeLabel': 'Vriendschapscode (12 cijfers)',
        'friends.countryLabel': 'Land',
        'friends.teamLabel': 'Team (mag leeg)',
        'friends.teamNone': 'Zeg ik liever niet',
        'friends.team.mystic': 'Mystic',
        'friends.team.valor': 'Valor',
        'friends.team.instinct': 'Instinct',
        'friends.privacy': 'Alleen je code, land en team zijn zichtbaar. Je code verdwijnt na {days} dagen als je hem niet verlengt, en je kunt hem altijd zelf weghalen.',
        'friends.submit': 'Zet mijn code erop',
        'friends.errorCode': 'Een vriendschapscode heeft precies 12 cijfers.',
        'friends.errorCountry': 'Kies je land.',
        'friends.errorTaken': 'Deze code staat al op de lijst.',
        'friends.errorGeneral': 'Er ging iets mis: {message}',
        'friends.demoTitle': 'Proefversie.',
        'friends.demoText': 'Alles wat je hier doet, blijft alleen in deze browser. Niemand anders ziet het, en de trainers die je ziet zijn verzonnen.',
        'friends.demoReset': 'Opnieuw beginnen',
        'friends.demoResetConfirm': 'De proefversie leegmaken en opnieuw beginnen met de voorbeeldtrainers?',
        'friends.soonTitle': 'Binnenkort beschikbaar',
        'friends.soonText': 'Binnenkort kun je hier je vriendschapscode delen met andere spelers.',
        'nav.home': 'Home',
        'footer': 'Gemaakt voor trainers, door trainers.',
        'settings.title': 'Instellingen',
        'settings.open': 'Instellingen',
        'settings.language': 'Taal',
        'settings.theme': 'Thema',
        'theme.midnight': 'Middernacht',
        'theme.ocean': 'Oceaan',
        'theme.forest': 'Bos',
        'theme.sunset': 'Zonsondergang',
        'theme.light': 'Licht'
    }
};

function readSetting(key, fallback) {
    try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}

function writeSetting(key, value) {
    try { localStorage.setItem(key, value); } catch { /* private mode: setting lasts until reload */ }
}

const defaultLang = (navigator.language || 'en').toLowerCase().startsWith('nl') ? 'nl' : 'en';
window.siteSettings = {
    lang: readSetting('pogo_lang', defaultLang),
    theme: readSetting('pogo_theme', 'midnight')
};
if (!translations[window.siteSettings.lang]) window.siteSettings.lang = 'en';
if (!THEMES.some(th => th.id === window.siteSettings.theme)) window.siteSettings.theme = 'midnight';

// Translate a key, filling in {placeholders}
window.t = function (key, vars = {}) {
    const dict = translations[window.siteSettings.lang] || translations.en;
    const text = dict[key] ?? translations.en[key] ?? key;
    return text.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '');
}

// Locale for dates and times: Dutch uses a 24-hour clock
window.dateLocale = () => window.siteSettings.lang === 'nl' ? 'nl-NL' : 'en-US';
window.timeOptions = () => window.siteSettings.lang === 'nl'
    ? { hour: '2-digit', minute: '2-digit', hour12: false }
    : { hour: 'numeric', minute: '2-digit' };

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    const bg = THEMES.find(th => th.id === theme)?.bg;
    if (meta && bg) meta.content = bg;
}

// Fill in every element marked with data-i18n (text), data-i18n-html (with markup) or data-i18n-placeholder
function translatePage() {
    document.documentElement.lang = window.siteSettings.lang;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = window.t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = window.t(el.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = window.t(el.dataset.i18nPlaceholder); });
}

applyTheme(window.siteSettings.theme);

function setLanguage(lang) {
    window.siteSettings.lang = lang;
    writeSetting('pogo_lang', lang);
    translatePage();
    renderSettingsPanel();
    // Let the page redraw what it built in JavaScript (cards, lists, header)
    document.dispatchEvent(new CustomEvent('languagechange'));
}

function setTheme(theme) {
    window.siteSettings.theme = theme;
    writeSetting('pogo_theme', theme);
    applyTheme(theme);
    renderSettingsPanel();
}

function renderSettingsPanel() {
    const body = document.getElementById('settings-body');
    if (!body) return;
    const { lang, theme } = window.siteSettings;

    document.getElementById('settings-title').textContent = window.t('settings.title');
    body.innerHTML = `
        <div class="settings-group">
            <span class="settings-label">${window.t('settings.language')}</span>
            <div class="settings-options">
                ${LANGUAGES.map(l => `
                    <button type="button" class="settings-choice${l.id === lang ? ' is-active' : ''}" data-lang="${l.id}" aria-pressed="${l.id === lang}">${l.label}</button>
                `).join('')}
            </div>
        </div>
        <div class="settings-group">
            <span class="settings-label">${window.t('settings.theme')}</span>
            <div class="settings-themes">
                ${THEMES.map(th => `
                    <button type="button" class="theme-swatch${th.id === theme ? ' is-active' : ''}" data-theme-choice="${th.id}" aria-pressed="${th.id === theme}">
                        <span class="swatch-preview" style="background: ${th.bg};">
                            <span style="background: ${th.accent};"></span>
                            <span style="background: ${th.accent2};"></span>
                        </span>
                        <span class="swatch-name">${window.t('theme.' + th.id)}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    body.querySelectorAll('[data-lang]').forEach(btn => btn.onclick = () => setLanguage(btn.dataset.lang));
    body.querySelectorAll('[data-theme-choice]').forEach(btn => btn.onclick = () => setTheme(btn.dataset.themeChoice));
}

function openSettings() {
    const modal = document.getElementById('settings-modal');
    renderSettingsPanel();
    modal.classList.remove('hidden');
    void modal.offsetWidth;
    modal.classList.add('visible');
}

function closeSettings() {
    const modal = document.getElementById('settings-modal');
    modal.classList.remove('visible');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

// The site menu, the same on every page
const MENU = [
    { href: 'index.html', icon: 'ph-house', key: 'menu.home' },
    { href: 'month.html', icon: 'ph-calendar', key: 'menu.calendar' },
    { href: 'raids.html', icon: 'ph-sword', key: 'menu.raids' },
    { href: 'pokemon.html', icon: 'ph-magnifying-glass', key: 'menu.pokemon' },
    { href: 'friends.html', icon: 'ph-users-three', key: 'menu.friends' },
    { href: 'guide.html', icon: 'ph-book-open', key: 'menu.guide' }
];

function buildMenu() {
    const header = document.querySelector('.main-header');
    if (!header || header.querySelector('.site-menu')) return;

    const page = location.pathname.split('/').pop() || 'index.html';
    const menu = document.createElement('nav');
    menu.className = 'site-menu';
    menu.setAttribute('aria-label', 'Menu');
    menu.innerHTML = MENU.map(item => `
        <a href="${item.href}" class="site-menu-link${item.href === page ? ' is-active' : ''}"${item.href === page ? ' aria-current="page"' : ''}>
            <i class="ph-bold ${item.icon}"></i><span data-i18n="${item.key}">${window.t(item.key)}</span>
        </a>`).join('');

    const logo = header.querySelector('.logo-container');
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.onclick = () => { window.location.href = 'index.html'; };
        logo.after(menu);
    } else {
        header.prepend(menu);
    }
}

// Add the menu and gear button to the header and the settings window to the page
document.addEventListener('DOMContentLoaded', () => {
    buildMenu();
    translatePage();

    const nav = document.querySelector('.main-header nav:not(.site-menu)');
    if (nav) {
        const btn = document.createElement('button');
        btn.className = 'nav-btn settings-btn';
        btn.id = 'settings-btn';
        btn.type = 'button';
        btn.title = window.t('settings.open');
        btn.setAttribute('aria-label', window.t('settings.open'));
        btn.innerHTML = '<i class="ph-bold ph-gear-six"></i>';
        btn.onclick = openSettings;
        nav.appendChild(btn);
        document.addEventListener('languagechange', () => {
            btn.title = window.t('settings.open');
            btn.setAttribute('aria-label', window.t('settings.open'));
        });
    }

    const modal = document.createElement('div');
    modal.id = 'settings-modal';
    modal.className = 'modal-overlay hidden';
    modal.innerHTML = `
        <div class="modal-content settings-content" role="dialog" aria-labelledby="settings-title">
            <button class="close-modal" type="button" aria-label="Close"><i class="ph-bold ph-x"></i></button>
            <h2 id="settings-title" class="settings-title"></h2>
            <div id="settings-body"></div>
        </div>`;
    modal.querySelector('.close-modal').onclick = closeSettings;
    modal.onclick = (e) => { if (e.target === modal) closeSettings(); };
    document.body.appendChild(modal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('visible')) closeSettings();
    });
});
