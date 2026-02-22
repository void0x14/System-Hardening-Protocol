// app.js - Application Bootstrap / Init
// Native ESM Migration with Top-Level Await

import { CONFIG } from './config/index.js';
import { initAllDB } from './config/db.js';
import { initMilestones } from './config/targets.js';
import { Store } from './store.js';
import { UI } from './ui.js';
import { Stealth } from './stealth.js';
import { Actions } from './actions.js';
import { i18n } from './services/i18nService.js';

if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
    console.log("SYSTEM BOOT...");
}

// 1. Init i18n first so translations are ready
await i18n.init();

// 2. Populate DB data with translated strings (must be AFTER i18n.init)
initAllDB();
initMilestones();

// 3. Init store and UI
await Store.init();
await UI.init();

// v8.1.0: Stealth/Sanitize Mode
if (typeof Stealth !== 'undefined') Stealth.init();

// --- v8.3.1 Security Hardening: Centralized Event Delegation ---
const delegateAction = async (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;

    const expectedEvent = actionEl.dataset.event || 'click';
    if (expectedEvent !== e.type) return;

    if (actionEl.dataset.stopPropagation === 'true') {
        e.stopPropagation();
    }

    let params = [];
    if (actionEl.dataset.params) {
        try {
            params = JSON.parse(actionEl.dataset.params);
        } catch {
            params = [];
        }
    }

    if (actionEl.dataset.passElement === 'true') {
        params.unshift(actionEl);
    }

    const action = actionEl.dataset.action;
    if (typeof Actions[action] !== 'function') return;

    if (e.type === 'click') {
        e.preventDefault();
    }
    await Actions[action](...params);
};

document.addEventListener('click', delegateAction);
document.addEventListener('change', delegateAction);
document.addEventListener('input', delegateAction);

const modal = document.getElementById('universal-modal');
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) UI.modal.close();
    });
}

// Auto Backup Reminder
const backupStatus = await Store.checkBackupStatus();
if (backupStatus !== 'OK') {
    setTimeout(() => {
        const msg = backupStatus === 'NEVER'
            ? i18n.t('ui.toast.backup_never')
            : i18n.t('ui.toast.backup_overdue');
        const type = backupStatus === 'NEVER' ? "warning" : "error";
        UI.showToast(msg, type);
    }, 3000);
}

if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
    console.log(`[App] v${CONFIG.VERSION} initialized via Native ESM`);
}

