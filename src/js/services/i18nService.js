/**
 * Copyright (c) 2025-2026 void0x14
 */

/**
 * i18nService - Native Zero-Dependency Localization Engine
 * Parses deep keys e.g t('app.title') using native JS reduce without package.json.
 * Uses async fetch, localStorage, and browser detection.
 */
class I18nService {
    constructor() {
        this.locales = {};
        this.currentLocale = 'tr';
        this.isReady = false;

        // Only register event listener in browser environment
        if (typeof document !== 'undefined') {
            document.addEventListener('languageChanged', (e) => {
                this.setLocale(e.detail.lang);
            });
        }
    }

    async init() {
        let sysLang = localStorage.getItem('app_lang');
        if (!sysLang) {
            sysLang = navigator.language.split('-')[0];
        }
        this.currentLocale = (sysLang === 'en' || sysLang === 'tr') ? sysLang : 'tr';

        await this.loadLocale(this.currentLocale);
        this.isReady = true;
        this.updateDOM();
        return this;
    }

    async loadLocale(lang) {
        if (this.locales[lang]) return;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(`./src/js/locales/${lang}.json?v=${Date.now()}`, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error(`HTTP ${response.status} for ${lang}`);
            this.locales[lang] = await response.json();
        } catch (error) {
            console.error(`[i18n] Failed to load locale "${lang}":`, error.message);
            this.locales[lang] = {};
        }
    }

    async setLocale(lang) {
        if (lang === this.currentLocale) return;
        const targetLang = (lang === 'en' || lang === 'tr') ? lang : 'tr';
        await this.loadLocale(targetLang);
        this.currentLocale = targetLang;
        
        // Only update browser storage in browser environment
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('app_lang', targetLang);
        }
        
        // Only call updateDOM and dispatch events in browser environment
        if (typeof document !== 'undefined') {
            this.updateDOM();
            document.dispatchEvent(new CustomEvent('i18nReady', { detail: { lang: targetLang } }));
        }
    }

    t(key, params = {}) {
        if (!key || typeof key !== 'string') return '';

        // Before init or missing locale, return the key as-is
        if (!this.isReady || !this.locales[this.currentLocale]) return key;

        const keys = key.split('.');
        let value = keys.reduce(
            (obj, current) => (obj && obj[current] !== undefined) ? obj[current] : null,
            this.locales[this.currentLocale]
        );

        if (value === null || value === undefined) return key;
        if (typeof value !== 'string') return key;

        return value.replace(/\{(\w+)\}/g, (_, k) => params[k] !== undefined ? params[k] : `{${k}}`);
    }

    updateDOM() {
        if (!this.isReady || typeof document === 'undefined') return;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translated = this.t(key);
            if (translated === key) return; // Don't replace if no translation found
            if (el.tagName === 'INPUT') {
                el.placeholder = translated;
            } else {
                el.innerHTML = translated;
            }
        });
    }
}

export const i18n = new I18nService();
