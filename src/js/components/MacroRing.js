/**
 * Copyright (c) 2025-2026 void0x14
 */

// components/MacroRing.js - Macro Nutrient Ring Component
// Extracted from components.js for reusability

import { i18n } from '../services/i18nService.js';

/**
 * Macro Ring Component Factory
 * SVG-based circular progress for nutrition tracking
 * 
 * @param {string} label - Label text (e.g., "KALORİ", "PROTEİN")
 * @param {number} current - Current value
 * @param {number} target - Target value
 * @param {string} unit - Unit display (e.g., "kcal", "g")
 * @param {string} color - Hex color for ring (e.g., "#00ff41")
 * @param {string} [size='80'] - Ring size in pixels
 * @returns {string} HTML string for the macro ring
 * 
 * @example
 * // Calorie ring
 * MacroRing('KALORİ', 2500, 3000, '', '#00ff41', '90')
 * 
 * @example
 * // Protein ring
 * MacroRing('PROTEİN', 180, 225, 'g', '#00f3ff', '70')
 */
export function MacroRing(label, current, target, unit, color, size = '80') {
    const safeCurrent = Math.max(0, Number(current) || 0);
    const safeTarget = Math.max(1, Number(target) || 1); // Prevent division by zero
    const percent = Math.min(100, (safeCurrent / safeTarget) * 100);

    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    const isOver = safeCurrent > safeTarget;
    const displayColor = isOver ? '#00ff41' : color;

    return `
        <div class="flex flex-col items-center">
            <div class="relative" style="width: ${size}px; height: ${size}px;">
                <svg class="macro-ring-svg" width="${size}" height="${size}" viewBox="0 0 80 80">
                    <!-- Background circle -->
                    <circle cx="40" cy="40" r="${radius}" fill="none" stroke="#1a1a22" stroke-width="6"/>
                    <!-- Progress circle -->
                    <circle cx="40" cy="40" r="${radius}" fill="none" stroke="${displayColor}" stroke-width="6"
                        stroke-linecap="round"
                        stroke-dasharray="${circumference}"
                        stroke-dashoffset="${offset}"
                        class="macro-ring-progress"
                        style="transform: rotate(-90deg); transform-origin: center;"/>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-lg font-black text-white">${safeCurrent}</span>
                </div>
            </div>
            <div class="text-center mt-1">
                <div class="text-[10px] font-bold" style="color: ${displayColor}">${label}</div>
                <div class="text-[9px] text-gray-500">/${safeTarget}${unit}</div>
            </div>
        </div>
    `;
}

/**
 * Create multiple macro rings for a nutrition summary
 * 
 * @param {Object} macros - Macro nutrient values
 * @param {number} macros.calories - Current calories
 * @param {number} macros.protein - Current protein
 * @param {number} macros.carbs - Current carbs
 * @param {number} macros.fat - Current fat
 * @param {Object} targets - Target values
 * @param {number} targets.calories - Calorie target
 * @param {number} targets.protein - Protein target
 * @param {number} targets.carbs - Carbs target
 * @param {number} targets.fat - Fat target
 * @returns {string} HTML string with all macro rings
 */
export function MacroRings(macros, targets) {
    const { calories, protein, carbs, fat } = macros;
    const { calories: calTarget, protein: protTarget, carbs: carbTarget, fat: fatTarget } = targets;

    return `
        <div class="flex justify-around items-center py-4">
            ${MacroRing(i18n.t('ui.nutrition.macros.calories'), calories, calTarget, '', '#00ff41', '90')}
            ${MacroRing(i18n.t('ui.nutrition.macros.protein'), protein, protTarget, 'g', '#00f3ff', '70')}
            ${MacroRing(i18n.t('ui.nutrition.macros.carbs'), carbs, carbTarget, 'g', '#ff6b35', '70')}
            ${MacroRing(i18n.t('ui.nutrition.macros.fat'), fat, fatTarget, 'g', '#ffed4a', '70')}
        </div>
    `;
}

export default MacroRing;
