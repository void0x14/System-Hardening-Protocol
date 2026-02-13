// stealth.js - Sanitize Mode for Privacy Protection
// Hides sensitive content while keeping app fully functional

const Stealth = {
    active: false,

    origTitle: null, // Will be set dynamically using CONFIG.VERSION
    safeTitle: 'Fitness Tracker',

    // Sensitive tags to sanitize
    sensitiveTags: ['Cinsel Güç', 'Pelvis', 'Libido'],

    init() {
        // Initialize original title with VERSION
        this.origTitle = `SYSTEM HARDENING PROTOCOL | v${typeof CONFIG !== 'undefined' ? CONFIG.VERSION : '8.3.1'}`;
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+H - Türk klavyesi için uygun
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'h') {
                e.preventDefault();
                this.toggle();
            }
        });
        if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
            console.log('[Stealth] Initialized. Press Ctrl+Shift+H to toggle sanitize mode.');
        }
    },

    toggle() {
        this.active ? this.deactivate() : this.activate();
    },

    activate() {
        this.active = true;
        document.body.classList.add('sanitize-mode');
        document.title = this.safeTitle;

        // Header değiştir
        this.updateHeader(true);

        // Tabları yeniden render et (Mental tab gizli)
        UI.renderTabs();

        // Şu anki view'ı yeniden render et
        const currentTab = Store.state.activeTab;
        if (currentTab === 'mental') {
            Actions.switchTab('dashboard');
        } else {
            Actions.switchTab(currentTab);
        }

        if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
            console.log('[Stealth] Sanitize mode ACTIVATED');
        }
    },

    deactivate() {
        this.active = false;
        document.body.classList.remove('sanitize-mode');
        document.title = this.origTitle;

        // Header geri al
        this.updateHeader(false);

        // Tabları normal render et
        UI.renderTabs();

        // View'ı yeniden render et
        Actions.switchTab(Store.state.activeTab);

        if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
            console.log('[Stealth] Sanitize mode DEACTIVATED');
        }
    },

    updateHeader(sanitized) {
        const header = document.querySelector('nav h1');
        if (header) {
            if (sanitized) {
                header.innerHTML = `FT <span class="text-sm text-text-muted">v${typeof CONFIG !== 'undefined' ? CONFIG.VERSION.split('.').slice(0, 2).join('.') : '8.3'}</span>`;
            } else {
                header.innerHTML = `PROTOCOL <span class="text-sm text-text-muted">v${typeof CONFIG !== 'undefined' ? CONFIG.VERSION : '8.3.1'}</span>`;
            }
        }

        // Biohazard ikonunu değiştir
        const icon = document.querySelector('nav .fa-biohazard, nav .fa-chart-line');
        if (icon) {
            if (sanitized) {
                icon.classList.remove('fa-biohazard');
                icon.classList.add('fa-chart-line');
            } else {
                icon.classList.remove('fa-chart-line');
                icon.classList.add('fa-biohazard');
            }
        }

        // Subtitle değiştir
        const subtitle = document.querySelector('nav .tracking-\\[0\\.2em\\]');
        if (subtitle) {
            subtitle.textContent = sanitized ? 'PERSONAL TRACKER' : 'SYSTEM ONLINE';
        }
    },

    // Egzersiz tag'larını filtrele (sanitize modda hassas olanları gizle)
    filterTags(tags) {
        if (!this.active) return tags;
        return tags.filter(t => !this.sensitiveTags.includes(t));
    },

    // Epic overlay'i engelle (sanitize modda)
    shouldShowOverlay() {
        return !this.active;
    }
};

if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
    console.log('[Stealth] Module loaded');
}

