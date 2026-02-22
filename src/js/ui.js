/**
 * Copyright (c) 2025-2026 void0x14
 */

// ui.js - User Interface Management
// Extracted from original index.html lines 1985-2236

// Global scope assignment
import { Store } from './store.js';
import { Actions } from './actions.js';
import { Stealth } from './stealth.js';
import { Utils } from './utils.js';
import { CONFIG } from './config/index.js';
import { THEME } from './config/theme.js';
import { i18n } from './services/i18nService.js';

export const UI = {
    activeView: 'front',

    async init() {
        this.renderTabs();
        this.startClock();
        await Actions.switchTab('dashboard');
        Actions.checkSystemAlerts();
    },

    renderTabs() {
        let tabs = [
            { id: 'dashboard', l: i18n.t('ui.tabs.dashboard'), i: 'fa-chart-line' },
            { id: 'training', l: i18n.t('ui.tabs.training'), i: 'fa-dumbbell' },
            { id: 'nutrition', l: i18n.t('ui.tabs.nutrition'), i: 'fa-utensils' },
            { id: 'progress', l: i18n.t('ui.tabs.progress'), i: 'fa-chart-bar' },
            { id: 'anatomy', l: i18n.t('ui.tabs.anatomy'), i: 'fa-dna' },
            { id: 'mental', l: i18n.t('ui.tabs.mental'), i: 'fa-brain' }
        ];
        // Sanitize modda Mental tab'ı gizle
        if (typeof Stealth !== 'undefined' && Stealth.active) {
            tabs = tabs.filter(t => t.id !== 'mental');
        }
        document.getElementById('nav-tabs').innerHTML = tabs.map(t =>
            `<button ${Utils.actionAttrs('switchTab', [t.id])} id="btn-${t.id}" class="tab-btn flex-none px-6 py-3 font-bold text-xs md:text-sm whitespace-nowrap text-gray-500 hover:text-white transition-colors border-b-2 border-transparent relative">
                <i class="fas ${t.i} mr-2"></i>${t.l}
                <div id="badge-${t.id}" class="notification-badge hidden"></div>
            </button>`
        ).join('');
    },

    updateTab(id) {
        document.querySelectorAll('.tab-btn').forEach(b => {
            b.classList.remove('active-tab', 'border-neon-green', 'text-neon-green', 'bg-gray-900/50');
            b.classList.add('text-gray-500', 'border-transparent');
        });
        document.getElementById(`btn-${id}`)?.classList.add('active-tab', 'border-neon-green', 'text-neon-green', 'bg-gray-900/50');
        document.getElementById(`btn-${id}`)?.classList.remove('text-gray-500', 'border-transparent');
    },

    /**
     * Toast bildirim göster.
     * @param {string} msg - Gösterilecek mesaj
     * @param {('success'|'error')} [type='success'] - Bildirim tipi
     */
    showToast(msg, type = 'success') {
        const c = document.getElementById('toast-container');
        const e = document.createElement('div');
        e.className = `toast mb-3 rounded shadow-lg bg-cyber-dark border-l-4 ${type === 'success' ? 'border-neon-green text-neon-green' : 'border-neon-red text-neon-red'} text-sm font-bold flex items-center gap-3`;
        e.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${Utils.escapeHtml(msg)}`;
        c.appendChild(e);
        setTimeout(() => e.remove(), 3000);
    },

    /**
     * Modal sistemi - ESC ve backdrop tıklama ile kapanır.
     */
    modal: {
        _escHandler: null,
        _openInternal(t, c, allowHtml) {
            document.getElementById('modal-title').innerText = t;
            const body = document.getElementById('modal-body');
            if (allowHtml) {
                body.innerHTML = String(c ?? '');
                UI.bindMediaFallbacks(body);
            } else {
                body.textContent = String(c ?? '');
            }
            document.getElementById('universal-modal').classList.add('active');
            this._escHandler = (e) => { if (e.key === 'Escape') UI.modal.close(); };
            document.addEventListener('keydown', this._escHandler);
        },
        open(t, c = '') {
            this._openInternal(t, c, false);
        },
        openHtml(t, c = '') {
            this._openInternal(t, c, true);
        },
        close() {
            document.getElementById('universal-modal').classList.remove('active');
            if (this._escHandler) {
                document.removeEventListener('keydown', this._escHandler);
                this._escHandler = null;
            }
        }
    },

    /**
     * Alert sistemi - Kırmızı temalı uyarı modalı.
     */
    alert: {
        show(msg) {
            document.getElementById('alert-message').textContent = String(msg ?? '');
            document.getElementById('alert-modal').classList.add('active');
        },
        showHtml(msg) {
            document.getElementById('alert-message').innerHTML = String(msg ?? '');
            document.getElementById('alert-modal').classList.add('active');
        },
        close() {
            document.getElementById('alert-modal').classList.remove('active');
        }
    },

    /**
     * Saat göstericisini başlat.
     */
    startClock() {
        const el = document.getElementById('clock-display');
        if (!el) return;
        setInterval(() => el.innerText = new Date().toLocaleTimeString('tr-TR'), 1000);
    },

    /**
     * Seçili yiyeceğe göre porsiyon inputları render et.
     */
    renderPortionInputs() {
        const select = document.getElementById('m-food');
        const container = document.getElementById('portion-container');
        if (!select || !container) return;
        if (!select.value) return;

        const foods = Store.getAllFoods();
        const selectedFood = foods[select.value];
        if (!selectedFood) return;

        if (selectedFood.type === 'portion') {
            let html = `<div class="grid grid-cols-1 gap-2 mt-1">`;
            selectedFood.options.forEach((opt, idx) => {
                html += `
                    <label class="cursor-pointer relative group">
                        <input type="radio" name="portion_opt" value="${idx}" class="peer sr-only portion-radio" ${idx === 1 ? 'checked' : ''}>
                        <div class="p-3 rounded border border-gray-600 bg-gray-900 text-gray-400 peer-checked:border-neon-green peer-checked:text-white peer-checked:bg-green-900/20 transition-all flex justify-between items-center gap-2 hover:border-gray-400">
                            <div class="flex items-center gap-3">
                                <div class="w-4 h-4 rounded-full border border-gray-500 radio-dot flex items-center justify-center"></div>
                                <span class="text-sm font-bold">${Utils.escapeHtml(opt.label)}</span>
                            </div>
                            <span class="text-xs text-gray-500 font-mono">~${Math.round(selectedFood.vals.cal * opt.ratio)} ${i18n.t('ui.nutrition.kcal')}</span>
                        </div>
                    </label>
                `;
            });
            html += `</div>`;
            container.innerHTML = `<label class="text-[10px] text-gray-500 font-bold block mb-2 tracking-widest">${i18n.t('ui.nutrition.portion_select')}</label>${html}`;
        } else {
            const unitName = selectedFood.unitName || 'Adet';
            container.innerHTML = `
                <label class="text-[10px] text-gray-500 font-bold block mb-1">${i18n.t('ui.nutrition.amount_label', { unitName: Utils.escapeHtml(unitName) })}</label>
                <input type="number" id="m-amount" class="${THEME.input}" value="1" placeholder="${i18n.t('ui.nutrition.how_many', { unitName: Utils.escapeHtml(unitName) })}">
            `;
        }
    },

    filterFoodList() {
        const search = document.getElementById('food-search').value.toLowerCase();
        const select = document.getElementById('m-food');
        const options = select.options;
        let firstVisibleIndex = -1;

        for (let i = 0; i < options.length; i++) {
            const txt = options[i].text.toLowerCase();
            if (txt.includes(search)) {
                options[i].style.display = "";
                if (firstVisibleIndex === -1) firstVisibleIndex = i;
            } else {
                options[i].style.display = "none";
            }
        }

        if (select.selectedIndex >= 0 && options[select.selectedIndex].style.display === "none") {
            if (firstVisibleIndex !== -1) {
                select.selectedIndex = firstVisibleIndex;
            }
        }

        this.renderPortionInputs();
    },

    bindMediaFallbacks(root) {
        if (!root) return;
        const images = root.querySelectorAll('img[data-fallback-src]');
        images.forEach(img => {
            if (img.dataset.fallbackBound === 'true') return;
            img.dataset.fallbackBound = 'true';
            img.addEventListener('error', () => {
                const fallbackSrc = img.dataset.fallbackSrc;
                if (!fallbackSrc || img.dataset.fallbackApplied === 'true') return;
                img.dataset.fallbackApplied = 'true';
                img.src = fallbackSrc;
            });
        });
    },

    /**
     * Epik tam ekran motivasyon overlay'i göster.
     * Sanitize modda overlay gösterilmez.
     */
    showEpicOverlay(emoji, text, sub, color = '#00ff41') {
        // Sanitize modda overlay gösterme
        if (typeof Stealth !== 'undefined' && Stealth.active) return;
        const safeEmoji = Utils.escapeHtml(typeof emoji === 'string' ? emoji.slice(0, 12) : '');
        const safeText = Utils.escapeHtml(typeof text === 'string' ? text.slice(0, 160) : '');
        const safeSub = Utils.escapeHtml(typeof sub === 'string' ? sub.slice(0, 220) : '');
        const safeColor = (typeof color === 'string' && /^#[0-9a-fA-F]{6}$/.test(color.trim()))
            ? color.trim()
            : '#00ff41';
        const overlay = document.createElement('div');
        overlay.id = 'epic-overlay-' + Date.now();
        overlay.innerHTML = `
            <div style="
                position: fixed;
                inset: 0;
                background: radial-gradient(ellipse at center, ${safeColor}15 0%, rgba(10,10,15,0.98) 70%);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                animation: overlayFadeIn 0.3s ease-out;
            ">
                <div style="
                    font-size: 120px;
                    animation: emojiPulse 0.5s ease-out;
                    text-shadow: 0 0 60px ${safeColor}80;
                ">${safeEmoji}</div>
                <div style="
                    font-family: 'Orbitron', sans-serif;
                    font-size: clamp(28px, 8vw, 64px);
                    font-weight: 900;
                    color: ${safeColor};
                    text-align: center;
                    margin-top: 20px;
                    text-shadow: 0 0 30px ${safeColor}80, 0 0 60px ${safeColor}50;
                    animation: textSlideUp 0.4s ease-out 0.1s both;
                    letter-spacing: 4px;
                ">${safeText}</div>
                <div style="
                    font-size: clamp(14px, 3vw, 20px);
                    color: #6b7280;
                    margin-top: 16px;
                    text-align: center;
                    animation: textSlideUp 0.4s ease-out 0.2s both;
                    max-width: 80%;
                ">${safeSub}</div>
                <div style="
                    margin-top: 40px;
                    width: 200px;
                    height: 4px;
                    background: #333;
                    border-radius: 4px;
                    overflow: hidden;
                    animation: textSlideUp 0.4s ease-out 0.3s both;
                ">
                    <div style="
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, ${safeColor}, #00f3ff);
                        animation: progressFill 1.5s ease-out forwards;
                        transform-origin: left;
                    "></div>
                </div>
            </div>
            <style>
                @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes emojiPulse { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }
                @keyframes textSlideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes progressFill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
                @keyframes overlayFadeOut { from { opacity: 1; } to { opacity: 0; } }
            </style>
        `;
        document.body.appendChild(overlay);
        setTimeout(() => {
            overlay.firstElementChild.style.animation = 'overlayFadeOut 0.3s ease-out forwards';
            setTimeout(() => overlay.remove(), 300);
        }, 2000);
    }
};

if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
    console.log('[UI] UI helpers loaded');
}
