// components/Card.js - Card Container Component
// Extracted from components.js for reusability

import { THEME } from '../config/theme.js';

/**
 * Card Component Factory
 * Standard card wrapper with optional accent border
 * 
 * @param {string} label - Card header label (emoji + text)
 * @param {string} content - Inner HTML content
 * @param {string} [accent=''] - Extra classes for styling
 * @param {string} [extra=''] - Additional wrapper classes
 * @returns {string} HTML string for the card
 * 
 * @example
 * // Basic card
 * Card('📊 Stats', '<div>Content here</div>')
 * 
 * @example
 * // Card with accent
 * Card('🔥 Training', '<div>Workout info</div>', 'border-neon-green')
 */
export function Card(label, content, accent = '', extra = '') {
    // THEME.card and THEME.label are expected to be available globally
    // or injected via dependency
    const cardClass = typeof THEME !== 'undefined' ? THEME.card : 'bg-gray-900 border border-gray-800 rounded-xl p-4';
    const labelClass = typeof THEME !== 'undefined' ? THEME.label : 'text-[10px] text-gray-500 font-bold tracking-widest mb-3';
    
    return `
        <div class="${cardClass} ${accent} ${extra}">
            <div class="${labelClass}">${label}</div>
            ${content}
        </div>
    `;
}

/**
 * Stat Card Component
 * Centered value with label display
 * 
 * @param {string} label - Label text
 * @param {string|number} value - Value to display
 * @param {string} [unit=''] - Optional unit suffix
 * @param {string} [color='white'] - Text color class
 * @param {string} [accent=''] - Additional border/accent classes
 * @returns {string} HTML string
 */
export function StatCard(label, value, unit = '', color = 'white', accent = '') {
    const cardClass = typeof THEME !== 'undefined' ? THEME.card : 'bg-gray-900 border border-gray-800 rounded-xl p-4';
    
    return `
        <div class="${cardClass} text-center py-3 ${accent}">
            <div class="text-[9px] text-gray-500 font-bold">${label}</div>
            <div class="text-xl font-bold text-${color} mt-1">${value} ${unit ? `<span class="text-[10px] text-gray-500">${unit}</span>` : ''}</div>
        </div>
    `;
}

/**
 * Mini Stat Card Component
 * For grid layouts without card wrapper
 * 
 * @param {string} label - Label text
 * @param {string|number} value - Value to display
 * @param {string} [unit=''] - Optional unit suffix
 * @param {string} [labelColor='gray-500'] - Label color class
 * @param {string} [valueColor='white'] - Value color class
 * @returns {string} HTML string
 */
export function StatMini(label, value, unit = '', labelColor = 'gray-500', valueColor = 'white') {
    return `
        <div class="text-center py-3">
            <div class="text-[9px] text-${labelColor} font-bold">${label}</div>
            <div class="text-xl font-bold text-${valueColor} mt-1">${value} ${unit ? `<span class="text-[10px] text-gray-500">${unit}</span>` : ''}</div>
        </div>
    `;
}

export default Card;
