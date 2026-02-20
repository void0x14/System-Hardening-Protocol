// components/MealCard.js - Meal Card Component
// Extracted from components.js for reusability

import { i18n } from '../services/i18nService.js';

/**
 * Meal Card Component Factory
 * Enhanced meal card with macro breakdown
 * 
 * @param {Object} meal - Meal object
 * @param {string} meal.name - Meal name
 * @param {number} meal.cal - Calories
 * @param {number} meal.prot - Protein grams
 * @param {number} meal.carb - Carbs grams
 * @param {number} meal.fat - Fat grams
 * @param {string} [meal.portionLabel] - Optional portion label
 * @param {number} idx - Index for delete action
 * @param {Object} [utils] - Utility functions
 * @param {Function} [utils.escapeHtml] - HTML escape function
 * @param {Function} [utils.actionAttrs] - Action attributes generator
 * @returns {string} HTML string for the meal card
 * 
 * @example
 * MealCard({ name: 'Chicken Breast', cal: 250, prot: 40, carb: 0, fat: 5 }, 0)
 */
export function MealCard(meal, idx, utils = {}) {
    const escapeHtml = utils.escapeHtml || defaultEscapeHtml;
    const actionAttrs = utils.actionAttrs || defaultActionAttrs;

    const safeName = escapeHtml(meal.name || 'Unknown Meal');
    const safePortionLabel = meal.portionLabel ? escapeHtml(meal.portionLabel) : '';
    const safeCal = Number(meal.cal) || 0;
    const safeProt = Number(meal.prot) || 0;
    const safeCarb = Number(meal.carb) || 0;
    const safeFat = Number(meal.fat) || 0;

    return `
        <div class="meal-item flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-gray-900/80 p-3 rounded-lg mb-2 border border-gray-800 group hover:border-gray-700 transition-all">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center text-neon-green">
                    <i class="fas fa-utensils"></i>
                </div>
                <div>
                    <div class="text-white font-bold text-sm">${safeName}</div>
                    <div class="flex gap-2 text-[10px] text-gray-500 mt-0.5">
                        ${safePortionLabel ? `<span>${safePortionLabel}</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <div class="flex gap-3 text-[10px]">
                    <span class="text-neon-blue"><b>${safeProt}</b>P</span>
                    <span class="text-accent-orange"><b>${safeCarb}</b>C</span>
                    <span class="text-yellow-400"><b>${safeFat}</b>F</span>
                </div>
                <span class="text-neon-green font-bold text-sm">${safeCal} kcal</span>
                <button ${actionAttrs('deleteMeal', [idx])} class="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-2" title="${i18n.t('ui.nutrition.delete')}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `;
}

/**
 * Meal Card Compact Variant
 * Smaller version for sidebar or limited space
 * 
 * @param {Object} meal - Meal object
 * @param {number} idx - Index for delete action
 * @param {Object} [utils] - Utility functions
 * @returns {string} HTML string
 */
export function MealCardCompact(meal, idx, utils = {}) {
    const escapeHtml = utils.escapeHtml || defaultEscapeHtml;
    const actionAttrs = utils.actionAttrs || defaultActionAttrs;

    const safeName = escapeHtml(meal.name || 'Unknown Meal');
    const safeCal = Number(meal.cal) || 0;

    return `
        <div class="flex justify-between items-center p-2 bg-gray-900/50 rounded group hover:bg-gray-800/50 transition">
            <div class="flex items-center gap-2">
                <i class="fas fa-utensils text-neon-green text-xs"></i>
                <span class="text-sm text-white">${safeName}</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-xs text-neon-green font-bold">${safeCal} kcal</span>
                <button ${actionAttrs('deleteMeal', [idx])} class="text-red-500 opacity-0 group-hover:opacity-100 transition text-xs">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
}

/**
 * Empty Meal List Placeholder
 * @returns {string} HTML string for empty state
 */
export function EmptyMealList() {
    return `
        <div class="text-center text-gray-600 py-8 border-2 border-dashed border-gray-800 rounded-xl">
            <i class="fas fa-utensils text-3xl mb-3 text-gray-700"></i>
            <div class="font-bold">${i18n.t('ui.nutrition.empty_fuel')}</div>
            <span class="text-[10px] text-neon-red">${i18n.t('ui.nutrition.system_weak')}</span>
        </div>
    `;
}

/**
 * Default HTML escape function
 * @private
 */
function defaultEscapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Default action attributes generator
 * @private
 */
function defaultActionAttrs(action, params) {
    // This should be replaced with actual implementation
    return `data-action="${action}" data-params='${JSON.stringify(params)}'`;
}

export default MealCard;
