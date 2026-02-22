/**
 * Copyright (c) 2025-2026 void0x14
 */

// utils.js - Utility Functions and Storage Adapter
// Extracted from original index.html lines 1202-1316

// Global scope assignment
import { Actions } from './actions.js';
import { UI } from './ui.js';
import { CONFIG } from './config/index.js';
import { DB } from './config/db.js';

export const Utils = {
    /**
     * Bugünün tarihini YYYY-MM-DD formatında döndürür.
     * Client Local Time kullanır (kullanıcının timezone'una göre).
     * @returns {string} Tarih string'i (örn: "2025-12-12")
     */
    dateStr: () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    /**
     * v7.0.0: XSS önleme - HTML karakterlerini escape eder.
     * @param {string} str - Escape edilecek string
     * @returns {string} Güvenli HTML string
     */
    escapeHtml: (str) => {
        if (str === null || str === undefined) return '';
        const div = document.createElement('div');
        div.textContent = String(str);
        return div.innerHTML;
    },

    /**
     * YouTube video ID format doğrulaması.
     * @param {string} value - Kontrol edilecek video ID
     * @returns {boolean} ID formatı geçerliyse true
     */
    isValidYouTubeId: (value) => (
        typeof value === 'string' && /^[A-Za-z0-9_-]{6,20}$/.test(value)
    ),

    /**
     * data-params attribute için güvenli JSON string üretir.
     * @param {Array<any>} params - Action param listesi
     * @returns {string}
     */
    encodeActionParams: (params = []) => {
        try {
            return Utils.escapeHtml(JSON.stringify(Array.isArray(params) ? params : []));
        } catch {
            return '[]';
        }
    },

    /**
     * Delegated action attribute string üretir.
     * @param {string} action - Actions üzerindeki method adı
     * @param {Array<any>} params - Method param listesi
     * @param {Object} [opts]
     * @param {('click'|'change'|'input')} [opts.event='click']
     * @param {boolean} [opts.passElement=false] - true ise element ilk parametre olarak geçirilir
     * @param {boolean} [opts.stopPropagation=false] - true ise event propagation durdurulur
     * @returns {string}
     */
    actionAttrs: (action, params = [], opts = {}) => {
        const eventType = opts.event || 'click';
        const passElement = opts.passElement === true ? 'true' : 'false';
        const stopPropagation = opts.stopPropagation === true ? 'true' : 'false';
        const safeAction = typeof action === 'string' ? action : '';
        return `data-action="${safeAction}" data-event="${eventType}" data-params='${Utils.encodeActionParams(params)}' data-pass-element="${passElement}" data-stop-propagation="${stopPropagation}"`;
    },

    /**
     * Storage adapter - localStorage veya window.storage API kullanır.
     */
    storage: {
        /**
         * Storage'dan veri oku.
         * @async
         * @param {string} key - Okunacak key
         * @returns {Promise<any|null>} Değer veya null
         */
        async get(key) {
            try {
                if (typeof window.storage !== 'undefined') {
                    const res = await window.storage.get(key, false);
                    return res ? res.value : null;
                }
                return JSON.parse(localStorage.getItem(key));
            } catch (e) {
                console.error('Storage get error:', key, e);
                return null;
            }
        },

        /**
         * Storage'a veri yaz.
         * @async
         * @param {string} key - Yazılacak key
         * @param {any} val - Kaydedilecek değer (JSON serialize edilir)
         * @returns {Promise<boolean>} Başarılı ise true
         */
        async set(key, val) {
            try {
                if (typeof window.storage !== 'undefined') {
                    await window.storage.set(key, val, false);
                } else {
                    localStorage.setItem(key, JSON.stringify(val));
                }
                return true;
            } catch (e) {
                console.error('Storage set error:', key, e);
                if (e.name === 'QuotaExceededError') {
                    UI.showToast("Depolama dolu! Eski verileri temizleyin.", "error");
                } else {
                    UI.showToast("Kayıt Hatası!", "error");
                }
                return false;
            }
        }
    },

    /**
     * v7.0.0: JSON import validation - Bilinen key'leri kontrol eder.
     * @param {Object} data - Parse edilmiş JSON
     * @returns {Object} { valid: boolean, data: Object, skipped: string[] }
     */
    validateImportData: (data) => {
        if (!data || typeof data !== 'object') {
            return { valid: false, data: null, skipped: [], error: 'Geçersiz veri formatı' };
        }
        const keyRules = Object.values(CONFIG.KEYS);
        const validData = {};
        const skipped = [];
        for (const key in data) {
            if (key === 'meta') {
                validData[key] = data[key];
            } else if (keyRules.some(rule => rule.endsWith('_') ? key.startsWith(rule) : key === rule)) {
                if (data[key] !== null && data[key] !== undefined) {
                    validData[key] = data[key];
                }
            } else {
                skipped.push(key);
            }
        }
        return { valid: !!validData.meta, data: validData, skipped, error: validData.meta ? null : 'Meta bilgisi eksik' };
    },

    /**
     * Belirtilen kategoriden rastgele öğün önerisi döndürür.
     * @param {string} category - Öğün kategorisi
     * @returns {Object|null} Rastgele öğün objesi veya null
     */
    getRandomMeal(category) {
        const options = DB.MEAL_PLAN_DB[category];
        if (!options) return null;
        return options[Math.floor(Math.random() * options.length)];
    }
};

if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
    console.log('[Utils] Utility functions loaded');
}
