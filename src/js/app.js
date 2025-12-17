// app.js - Application Bootstrap / Init
// Extracted from original index.html lines 3976-4004

// App Namespace
const App = {
    async init() {
        console.log("SYSTEM BOOT...");
        await Store.init();

        // Initial render
        await this.renderTab(Store.state.activeTab || 'dashboard');

        // v8.1.0: Stealth/Sanitize Mode
        if (typeof Stealth !== 'undefined') Stealth.init();

        // Auto Backup Reminder
        const backupStatus = await Store.checkBackupStatus();
        if (backupStatus !== 'OK') {
            setTimeout(() => {
                const msg = backupStatus === 'NEVER' ? "Verilerinizi yedeklemeniz önerilir." : "⚠️ Yedekleme zamanı geldi! (>7 Gün)";
                const type = backupStatus === 'NEVER' ? "warning" : "error";
                UI.showToast(msg, type);
            }, 3000);
        }
    },

    async renderTab(tabName, force = false) {
        if (!force && Store.state.activeTab === tabName) {
            console.log(`Tab ${tabName} is already active.`);
            return;
        }

        Store.state.activeTab = tabName;
        const view = document.getElementById('view-container');
        view.innerHTML = '<div class="flex justify-center items-center h-full"><i class="fas fa-spinner fa-spin text-4xl text-neon-green"></i></div>';

        // Update tab UI
        document.querySelectorAll('.tab-btn').forEach(btn => {
            const isDashboardButton = btn.id === 'tab-dashboard';
            const isActive = btn.id === `tab-${tabName}`;

            btn.classList.toggle('active-tab', isActive);

            if (!isDashboardButton) {
                btn.classList.toggle('text-neon-green', isActive);
                btn.classList.toggle('text-gray-500', !isActive);
            }
        });

        if (Renderers[tabName]) {
            view.innerHTML = await Renderers[tabName]();
        } else {
            view.innerHTML = `<p class="text-neon-red">Error: Renderer for ${tabName} not found.</p>`;
        }
    }
};

(async function () {
    await App.init();

    // --- v6.3.0: EVENT DELEGATION ---
    document.getElementById('view-container').addEventListener('click', async (e) => {
        const actionEl = e.target.closest('[data-action]');
        if (!actionEl) return;

        const action = actionEl.dataset.action;
        const params = actionEl.dataset.params ? JSON.parse(actionEl.dataset.params) : [];

        if (Actions[action]) {
            e.preventDefault();
            await Actions[action](...params);
        }
    });

    // Auto Backup Reminder
    const backupStatus = await Store.checkBackupStatus();
    if (backupStatus !== 'OK') {
        setTimeout(() => {
            const msg = backupStatus === 'NEVER' ? "Verilerinizi yedeklemeniz önerilir (Ayarlar)" : "⚠️ Yedekleme zamanı geldi! (>7 Gün)";
            const type = backupStatus === 'NEVER' ? "warning" : "error";
            UI.showToast(msg, type);
        }, 3000);
    }
})();

console.log('[App] v8.0.0 initialized');
