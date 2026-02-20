import { tr } from '../locales/tr.js';
import { en } from '../locales/en.js';

/**
 * i18nService - Native Zero-Dependency Localization Engine
 * Parses deep keys e.g t('app.title') using native JS reduce without package.json.
 */
class I18nService {
    constructor() {
        this.locales = { tr, en };
        // Detect native browser language or default to 'tr'
        const sysLang = navigator.language.split('-')[0];
        this.currentLocale = this.locales[sysLang] ? sysLang : 'tr';
    }

    setLocale(lang) {
        if (this.locales[lang]) {
            this.currentLocale = lang;
            this.updateDOM();
        }
    }

    t(key, params = {}) {
        const keys = key.split('.');
        let value = keys.reduce((obj, current) => (obj && obj[current] !== undefined) ? obj[current] : null, this.locales[this.currentLocale]);

        if (!value) return key;

        // Native interpolation
        return value.replace(/\{(\w+)\}/g, (_, k) => params[k] !== undefined ? params[k] : `{${k}}`);
    }

    updateDOM() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (el.tagName === 'INPUT' && el.type === 'placeholder') {
                el.placeholder = this.t(key);
            } else {
                el.innerHTML = this.t(key);
            }
        });
    }
}

export const i18n = new I18nService();
