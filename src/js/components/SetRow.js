/**
 * Copyright (c) 2025-2026 void0x14
 */

// components/SetRow.js - Exercise Set Row Components
// Extracted from components.js for reusability

import { i18n } from '../services/i18nService.js';

/**
 * Safe number input value formatter
 * @param {*} value - Value to format
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {string} Formatted value or empty string
 */
export function safeNumberInputValue(value, min = 0, max = 10000) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return '';
    return String(Math.min(max, Math.max(min, parsed)));
}

/**
 * Weighted Set Row Component
 * For exercises tracked by weight and reps
 * 
 * @param {string} tid - Task/exercise ID
 * @param {number} idx - Set index
 * @param {Object} log - Log data for this set
 * @param {number} [log.weight] - Weight used
 * @param {number} [log.reps] - Reps completed
 * @param {boolean} [log.completed] - Whether set is completed
 * @param {boolean} isSetDone - Whether this set is marked done
 * @param {string} [hint=''] - Intensity hint for this set
 * @param {Object} [utils] - Utility functions
 * @param {Function} [utils.actionAttrs] - Action attributes generator
 * @returns {string} HTML string for the set row
 */
export function WeightedSetRow(tid, idx, log = {}, isSetDone, hint = '', utils = {}) {
    const actionAttrs = utils.actionAttrs || defaultActionAttrs;
    const logData = log || {};

    return `
        <div class="set-row ${isSetDone ? 'set-complete-animation' : ''} flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-xl ${isSetDone ? 'bg-gradient-to-r from-neon-green/20 to-neon-green/5 border-2 border-neon-green' : 'bg-gray-800/70 border-2 border-gray-700 hover:border-gray-600'} transition-all duration-300">
            <!-- Set Number Badge (Interactive Delete v8.3.0) -->
            <button ${actionAttrs('removeSet', [tid, idx])}
                class="group flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg ${isSetDone ? 'bg-neon-green text-black hover:bg-red-900/80' : 'bg-gray-700 text-white hover:bg-red-900/80'} font-black text-lg md:text-xl flex items-center justify-center relative transition-all duration-200 hover:border-2 hover:border-red-500/50"
                title="${i18n.t('training.delete_set')}">
                <span class="group-hover:opacity-20 transition-opacity duration-200">${idx + 1}</span>
                <i class="fas fa-times absolute inset-0 flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></i>
            </button>
            
            <!-- Inputs Row -->
            <div class="flex-1 flex items-center gap-2">
                <div class="flex-1">
                    <input type="number" placeholder="KG" value="${safeNumberInputValue(logData.weight, 0, 1000)}" id="w-${tid}-${idx}"
                        ${actionAttrs('saveSet', [tid, idx, false], { event: 'change' })}
                        class="w-full bg-gray-900 text-white rounded-lg p-2 md:p-3 text-center text-lg md:text-xl font-bold border-2 ${isSetDone ? 'border-neon-green text-neon-green' : 'border-gray-600 focus:border-neon-blue'} outline-none transition-all" 
                        >
                </div>
                <span class="text-gray-500 text-xl font-bold">×</span>
                <div class="flex-1">
                    <input type="number" placeholder="REP" value="${safeNumberInputValue(logData.reps, 0, 500)}" id="r-${tid}-${idx}"
                        ${actionAttrs('saveSet', [tid, idx, false], { event: 'change' })}
                        class="w-full bg-gray-900 text-white rounded-lg p-2 md:p-3 text-center text-lg md:text-xl font-bold border-2 ${isSetDone ? 'border-neon-green text-neon-green' : 'border-gray-600 focus:border-neon-blue'} outline-none transition-all" 
                        >
                </div>
            </div>
            
            <!-- Save Button -->
            <button ${actionAttrs('saveSet', [tid, idx, true], { passElement: true })}
                class="flex-shrink-0 px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-sm md:text-base ${isSetDone ? 'bg-neon-green text-black' : 'bg-gray-700 text-white hover:bg-neon-green hover:text-black'} transition-all">
                <i class="fas ${isSetDone ? 'fa-check' : 'fa-save'}"></i>
                <span class="hidden sm:inline">${isSetDone ? i18n.t('training.ok') : i18n.t('training.save')}</span>
            </button>
        </div>
    `;
}

/**
 * Timed Set Row Component
 * For exercises tracked by duration (seconds)
 * 
 * @param {string} tid - Task/exercise ID
 * @param {number} idx - Set index
 * @param {Object} log - Log data for this set
 * @param {number} [log.duration] - Duration in seconds
 * @param {boolean} [log.completed] - Whether set is completed
 * @param {boolean} isSetDone - Whether this set is marked done
 * @param {Object} [utils] - Utility functions
 * @param {Function} [utils.actionAttrs] - Action attributes generator
 * @returns {string} HTML string for the timed set row
 */
export function TimedSetRow(tid, idx, log = {}, isSetDone, utils = {}) {
    const actionAttrs = utils.actionAttrs || defaultActionAttrs;
    const logData = log || {};

    return `
        <div class="set-row ${isSetDone ? 'set-complete-animation' : ''} flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-xl ${isSetDone ? 'bg-gradient-to-r from-neon-green/20 to-neon-green/5 border-2 border-neon-green' : 'bg-gray-800/70 border-2 border-gray-700 hover:border-gray-600'} transition-all duration-300">
            <!-- Set Number Badge (Interactive Delete v8.3.0) -->
            <button ${actionAttrs('removeSet', [tid, idx])}
                class="group flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg ${isSetDone ? 'bg-neon-green text-black hover:bg-red-900/80' : 'bg-gray-700 text-white hover:bg-red-900/80'} font-black text-lg md:text-xl flex items-center justify-center relative transition-all duration-200 hover:border-2 hover:border-red-500/50"
                title="${i18n.t('training.delete_set')}">
                <span class="group-hover:opacity-20 transition-opacity duration-200">${idx + 1}</span>
                <i class="fas fa-times absolute inset-0 flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></i>
            </button>
            
            <!-- Input -->
            <div class="flex-1">
                <input type="number" placeholder="${i18n.t('training.seconds')}" value="${safeNumberInputValue(logData.duration, 0, 7200)}" id="d-${tid}-${idx}" 
                    class="w-full bg-gray-900 text-white rounded-lg p-2 md:p-3 text-center text-lg md:text-xl font-bold border-2 ${isSetDone ? 'border-neon-green text-neon-green' : 'border-gray-600 focus:border-neon-blue'} outline-none transition-all">
            </div>
            
            <!-- Save Button -->
            <button ${actionAttrs('saveTimedSet', [tid, idx], { passElement: true })}
                class="flex-shrink-0 px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-sm md:text-base ${isSetDone ? 'bg-neon-green text-black' : 'bg-gray-700 text-white hover:bg-neon-green hover:text-black'} transition-all">
                <i class="fas ${isSetDone ? 'fa-check' : 'fa-stopwatch'}"></i>
                <span class="hidden sm:inline">${isSetDone ? i18n.t('training.ok') : i18n.t('training.save')}</span>
            </button>
        </div>
    `;
}

/**
 * Simple Task Button Component
 * For tasks that are just completed/not completed
 * 
 * @param {string} tid - Task ID
 * @param {boolean} isDone - Whether task is done
 * @param {Object} [utils] - Utility functions
 * @param {Function} [utils.actionAttrs] - Action attributes generator
 * @returns {string} HTML string for the task button
 */
export function SimpleTaskBtn(tid, isDone, utils = {}) {
    const actionAttrs = utils.actionAttrs || defaultActionAttrs;

    return `
        <button ${actionAttrs('toggleSimpleTask', [tid])}
            class="w-full py-4 rounded-xl font-bold text-lg transition-all ${isDone ? 'bg-neon-green text-black shadow-[0_0_20px_rgba(0,255,65,0.3)]' : 'bg-gray-700 text-gray-400 hover:bg-neon-green/20 hover:text-neon-green border-2 border-gray-600'}">
            <i class="fas ${isDone ? 'fa-check-circle' : 'fa-circle'} mr-2"></i>
            ${isDone ? i18n.t('training.completed_check') : i18n.t('training.complete')}
        </button>
    `;
}

/**
 * Add Set Button Component
 * Button to add a new set to an exercise
 * 
 * @param {string} tid - Task/exercise ID
 * @param {Object} [utils] - Utility functions
 * @param {Function} [utils.actionAttrs] - Action attributes generator
 * @returns {string} HTML string for the add set button
 */
export function AddSetButton(tid, utils = {}) {
    const actionAttrs = utils.actionAttrs || defaultActionAttrs;

    return `
        <button ${actionAttrs('addSet', [tid])}
            class="w-full mt-3 py-3 rounded-xl border-2 border-dashed border-gray-700 bg-gray-800/30 text-gray-400 hover:border-neon-blue hover:text-neon-blue hover:bg-neon-blue/10 transition-all font-bold text-sm flex items-center justify-center gap-2">
            <i class="fas fa-plus"></i> ${i18n.t('training.add_set')}
        </button>
    `;
}

/**
 * Default action attributes generator
 * @private
 */
function defaultActionAttrs(action, params, options = {}) {
    const eventAttr = options.event ? ` data-event="${options.event}"` : '';
    const passElementAttr = options.passElement ? ' data-pass-element="true"' : '';
    return `data-action="${action}" data-params='${JSON.stringify(params)}'${eventAttr}${passElementAttr}`;
}

export default {
    WeightedSetRow,
    TimedSetRow,
    SimpleTaskBtn,
    AddSetButton,
    safeNumberInputValue
};
