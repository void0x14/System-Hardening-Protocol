/**
 * Copyright (c) 2025-2026 void0x14
 */

// components/ProgressBar.js - Progress Bar Component
// Extracted from components.js for reusability

/**
 * Progress Bar Component Factory
 * Visual progress indicator with customizable color and height
 * 
 * @param {number} percent - Progress percentage (0-100)
 * @param {string} [color='neon-green'] - Tailwind color class
 * @param {string} [height='h-2'] - Height class
 * @returns {string} HTML string for the progress bar
 * 
 * @example
 * // Basic progress bar
 * ProgressBar(75)
 * 
 * @example
 * // Custom color and height
 * ProgressBar(50, 'neon-blue', 'h-4')
 */
export function ProgressBar(percent, color = 'neon-green', height = 'h-2') {
    const safePercent = Math.min(100, Math.max(0, percent));
    
    return `
        <div class="w-full bg-surface-raised ${height} rounded-full overflow-hidden">
            <div class="${height} bg-${color} rounded-full transition-all" style="width: ${safePercent}%"></div>
        </div>
    `;
}

/**
 * Progress Row Component
 * Labeled progress row with value display
 * 
 * @param {string} label - Left label text
 * @param {string} value - Right value display
 * @param {number} percent - Progress percentage
 * @param {string} [color='neon-green'] - Bar color
 * @returns {string} HTML string
 * 
 * @example
 * ProgressRow('Protein', '150g / 200g', 75, 'neon-blue')
 */
export function ProgressRow(label, value, percent, color = 'neon-green') {
    return `
        <div>
            <div class="flex justify-between text-sm mb-2">
                <span class="text-text-muted">${label}</span>
                <span class="text-${color} font-bold">${value}</span>
            </div>
            ${ProgressBar(percent, color)}
        </div>
    `;
}

/**
 * Circular Progress Component
 * SVG-based circular progress indicator
 * 
 * @param {number} percent - Progress percentage (0-100)
 * @param {string} [color='#00ff41'] - Hex color for the progress ring
 * @param {string} [size='192'] - Size in pixels (default 192px = w-48 h-48)
 * @returns {string} HTML string for circular progress
 * 
 * @example
 * // Weight progress circle
 * CircularProgress(65, '#00f3ff', '192')
 */
export function CircularProgress(percent, color = '#00ff41', size = '192') {
    const safePercent = Math.min(100, Math.max(0, percent));
    const isComplete = safePercent >= 100;
    const strokeColor = isComplete ? '#00ff41' : color;
    
    return `
        <svg viewBox="0 0 36 36" class="circular-chart w-48 h-48">
            <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#1a1a22" />
            <path class="circle" stroke="${strokeColor}" stroke-dasharray="${safePercent}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
    `;
}

export default ProgressBar;
