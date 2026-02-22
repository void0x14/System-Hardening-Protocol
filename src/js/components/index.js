/**
 * Copyright (c) 2025-2026 void0x14
 */

// components/index.js - UI Components Module
// Re-exports all UI components for easy importing

// Card components
import { UI } from '../ui.js';
import { THEME } from '../config/theme.js';
// BUG-006 FIX: Use static import instead of require()
import { MacroRing as MacroRingComponent } from './MacroRing.js';

export { Card, StatCard, StatMini } from './Card.js';

// Progress components
export { ProgressBar, ProgressRow, CircularProgress } from './ProgressBar.js';

// Nutrition components
export { MacroRing, MacroRings } from './MacroRing.js';
export { MealCard, MealCardCompact, EmptyMealList } from './MealCard.js';

// Modal components
export { Modal, AlertModal, modal, alertModal, createModalHTML } from './Modal.js';

// Toast components
export { Toast, toast, showToast, createToastContainerHTML } from './Toast.js';

// Exercise set components
export {
    WeightedSetRow,
    TimedSetRow,
    SimpleTaskBtn,
    AddSetButton,
    safeNumberInputValue
} from './SetRow.js';

/**
 * Create Components Factory Object
 * For backward compatibility with existing code
 * 
 * @param {Object} utils - Utility functions
 * @param {Function} utils.escapeHtml - HTML escape function
 * @param {Function} utils.actionAttrs - Action attributes generator
 * @returns {Object} Components factory object
 */
export function createComponents(utils = {}) {
    const { escapeHtml, actionAttrs } = utils;

    return {
        card: (label, content, accent = '', extra = '') => {
            const cardClass = typeof THEME !== 'undefined' ? THEME.card : 'bg-gray-900 border border-gray-800 rounded-xl p-4';
            const labelClass = typeof THEME !== 'undefined' ? THEME.label : 'text-[10px] text-gray-500 font-bold tracking-widest mb-3';
            return `
                <div class="${cardClass} ${accent} ${extra}">
                    <div class="${labelClass}">${label}</div>
                    ${content}
                </div>
            `;
        },

        progressBar: (percent, color = 'neon-green', height = 'h-2') => {
            const safePercent = Math.min(100, Math.max(0, percent));
            return `
                <div class="w-full bg-surface-raised ${height} rounded-full overflow-hidden">
                    <div class="${height} bg-${color} rounded-full transition-all" style="width: ${safePercent}%"></div>
                </div>
            `;
        },

        macroRing: (label, current, target, unit, color, size = '80') => {
            // BUG-006 FIX: Use imported component instead of require()
            return MacroRingComponent(label, current, target, unit, color, size);
        },

        mealCard: (meal, idx) => {
            return MealCard(meal, idx, { escapeHtml, actionAttrs });
        },

        weightedSetRow: (tid, idx, log, isSetDone, hint = '') => {
            return WeightedSetRow(tid, idx, log, isSetDone, hint, { actionAttrs });
        },

        timedSetRow: (tid, idx, log, isSetDone) => {
            return TimedSetRow(tid, idx, log, isSetDone, { actionAttrs });
        },

        simpleTaskBtn: (tid, isDone) => {
            return SimpleTaskBtn(tid, isDone, { actionAttrs });
        },

        statCard: (label, value, unit = '', color = 'white', accent = '') => {
            return StatCard(label, value, unit, color, accent);
        },

        statMini: (label, value, unit = '', labelColor = 'gray-500', valueColor = 'white') => {
            return StatMini(label, value, unit, labelColor, valueColor);
        },

        badge: (text, type = 'default') => {
            const styles = {
                success: 'text-neon-green bg-neon-green/10 border-neon-green/30',
                warning: 'text-accent-orange bg-accent-orange/10 border-accent-orange/30',
                error: 'text-neon-red bg-neon-red/10 border-neon-red/30',
                info: 'text-neon-blue bg-neon-blue/10 border-neon-blue/30',
                default: 'text-gray-400 bg-gray-800 border-gray-700'
            };
            return `<span class="text-[10px] font-bold px-2 py-1 rounded border ${styles[type] || styles.default}">${text}</span>`;
        },

        btn: (text, action, params = [], type = 'primary', icon = '', extra = '') => {
            const styles = {
                primary: 'bg-neon-green/20 hover:bg-neon-green text-neon-green hover:text-black',
                secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-300',
                danger: 'bg-neon-red/20 hover:bg-neon-red text-neon-red hover:text-white',
                ghost: 'bg-transparent hover:bg-gray-800 text-gray-400',
                blue: 'bg-neon-blue/20 hover:bg-neon-blue text-neon-blue hover:text-black'
            };
            const iconHtml = icon ? `<i class="fas ${icon} mr-2"></i>` : '';
            return `<button ${actionAttrs(action, params)} class="${styles[type] || styles.primary} px-4 py-2 rounded-lg font-bold text-sm transition-all ${extra}">${iconHtml}${text}</button>`;
        },

        iconBtn: (icon, action, params = [], type = 'primary', size = 'w-12 h-12') => {
            const styles = {
                primary: 'bg-neon-green/20 hover:bg-neon-green text-neon-green hover:text-black',
                secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-400',
                success: 'bg-neon-green text-black',
                danger: 'bg-neon-red/20 hover:bg-neon-red text-neon-red hover:text-white'
            };
            return `<button ${actionAttrs(action, params)} class="${styles[type] || styles.primary} ${size} rounded-xl flex items-center justify-center text-lg transition-all">
                <i class="fas ${icon}"></i>
            </button>`;
        },

        statusDot: (active) => {
            return `<div class="w-3 h-3 rounded-full ${active ? 'bg-neon-green shadow-[0_0_8px_rgba(0,255,65,0.5)]' : 'bg-gray-600'} transition-all"></div>`;
        },

        progressRow: (label, value, percent, color = 'neon-green') => {
            return `
                <div>
                    <div class="flex justify-between text-sm mb-2">
                        <span class="text-text-muted">${label}</span>
                        <span class="text-${color} font-bold">${value}</span>
                    </div>
                    ${this.progressBar(percent, color)}
                </div>
            `;
        }
    };
}

export default {
    Card,
    StatCard,
    StatMini,
    ProgressBar,
    ProgressRow,
    CircularProgress,
    MacroRing,
    MacroRings,
    MealCard,
    MealCardCompact,
    EmptyMealList,
    Modal,
    AlertModal,
    Toast,
    WeightedSetRow,
    TimedSetRow,
    SimpleTaskBtn,
    AddSetButton,
    createComponents
};
