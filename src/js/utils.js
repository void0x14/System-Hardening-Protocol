// utils.js - Utility Functions and Storage Adapter
// Extracted from original index.html lines 1202-1316

// Global scope assignment
const Utils = window.Utils = {
    /**
     * Bugünün tarihini YYYY-MM-DD formatında döndürür.
     * @returns {string} Tarih string'i (örn: "2025-12-12")
     */
    dateStr: () => new Date().toLocaleDateString('tr-TR').split('.').reverse().join('-'),

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
        const validPrefixes = Object.values(CONFIG.KEYS).map(k => k.replace(/_$/, ''));
        const validData = {};
        const skipped = [];
        for (const key in data) {
            if (key === 'meta') {
                validData[key] = data[key];
            } else if (validPrefixes.some(p => key.startsWith(p))) {
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

console.log('[Utils] Utility functions loaded');
