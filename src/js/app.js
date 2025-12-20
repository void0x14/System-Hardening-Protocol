// app.js - Application Bootstrap / Init
// Extracted from original index.html lines 3976-4004

(async function () {
    console.log("SYSTEM BOOT...");
    await Store.init();
    await UI.init();

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
