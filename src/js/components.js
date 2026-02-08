// components.js - Reusable UI Component Factory Functions
// Extracted from original index.html lines 672-872

// Global scope assignment
const Components = window.Components = {
    /**
     * Standard card wrapper with optional accent border
     * @param {string} label - Card header label (emoji + text)
     * @param {string} content - Inner HTML content
     * @param {string} [accent=''] - Extra classes
     * @param {string} [extra=''] - Additional wrapper classes
     */
    card: (label, content, accent = '', extra = '') => `
        <div class="${THEME.card} ${accent} ${extra}">
            <div class="${THEME.label}">${label}</div>
            ${content}
        </div>`,

    /**
     * Progress bar component
     * @param {number} percent - Progress percentage (0-100)
     * @param {string} [color='neon-green'] - Tailwind color class
     * @param {string} [height='h-2'] - Height class
     */
    progressBar: (percent, color = 'neon-green', height = 'h-2') => `
        <div class="w-full bg-surface-raised ${height} rounded-full overflow-hidden">
            <div class="${height} bg-${color} rounded-full transition-all" style="width: ${Math.min(100, percent)}%"></div>
        </div>`,

    /**
     * Macro ring - circular progress for nutrition (SVG-based)
     * @param {string} label - Label text (e.g., "CAL", "PROT")
     * @param {number} current - Current value
     * @param {number} target - Target value
     * @param {string} unit - Unit display (e.g., "kcal", "g")
     * @param {string} color - Hex color for ring
     * @param {string} [size='80'] - Ring size in pixels
     */
    macroRing: (label, current, target, unit, color, size = '80') => {
        const percent = Math.min(100, (current / target) * 100);
        const radius = 35;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percent / 100) * circumference;
        const isOver = current > target;
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
                    <span class="text-lg font-black text-white">${current}</span>
                </div>
            </div>
            <div class="text-center mt-1">
                <div class="text-[10px] font-bold" style="color: ${displayColor}">${label}</div>
                <div class="text-[9px] text-gray-500">/${target}${unit}</div>
            </div>
        </div>`;
    },

    /**
     * Enhanced meal card with macro breakdown
     * @param {Object} meal - Meal object with name, cal, prot, carb, fat
     * @param {number} idx - Index for delete action
     */
    mealCard: (meal, idx) => `
        <div class="meal-item flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-gray-900/80 p-3 rounded-lg mb-2 border border-gray-800 group hover:border-gray-700 transition-all">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center text-neon-green">
                    <i class="fas fa-utensils"></i>
                </div>
                <div>
                    <div class="text-white font-bold text-sm">${Utils.escapeHtml(meal.name)}</div>
                    <div class="flex gap-2 text-[10px] text-gray-500 mt-0.5">
                        ${meal.portionLabel ? `<span>${meal.portionLabel}</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <div class="flex gap-3 text-[10px]">
                    <span class="text-neon-blue"><b>${meal.prot || 0}</b>P</span>
                    <span class="text-accent-orange"><b>${meal.carb || 0}</b>C</span>
                    <span class="text-yellow-400"><b>${meal.fat || 0}</b>F</span>
                </div>
                <span class="text-neon-green font-bold text-sm">${meal.cal} kcal</span>
                <button onclick="Actions.deleteMeal(${idx})" class="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-2" title="Sil">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>`,

    /**
     * Labeled progress row (label + value + bar)
     * @param {string} label - Left label text
     * @param {string} value - Right value display
     * @param {number} percent - Progress percentage
     * @param {string} [color='neon-green'] - Bar color
     */
    progressRow: (label, value, percent, color = 'neon-green') => `
        <div>
            <div class="flex justify-between text-sm mb-2">
                <span class="text-text-muted">${label}</span>
                <span class="text-${color} font-bold">${value}</span>
            </div>
            ${Components.progressBar(percent, color)}
        </div>`,

    /**
     * Stat display card (centered value with label)
     */
    statCard: (label, value, unit = '', color = 'white', accent = '') => `
        <div class="${THEME.card} text-center py-3 ${accent}">
            <div class="text-[9px] text-gray-500 font-bold">${label}</div>
            <div class="text-xl font-bold text-${color} mt-1">${value} ${unit ? `<span class="text-[10px] text-gray-500">${unit}</span>` : ''}</div>
        </div>`,

    /**
     * Mini stat card for grids (no card wrapper)
     */
    statMini: (label, value, unit = '', labelColor = 'gray-500', valueColor = 'white') => `
        <div class="text-center py-3">
            <div class="text-[9px] text-${labelColor} font-bold">${label}</div>
            <div class="text-xl font-bold text-${valueColor} mt-1">${value} ${unit ? `<span class="text-[10px] text-gray-500">${unit}</span>` : ''}</div>
        </div>`,

    /**
     * Badge/tag component
     * @param {string} text - Badge text
     * @param {string} [type='default'] - 'success', 'warning', 'error', 'info', 'default'
     */
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

    /**
     * Button component
     * @param {string} text - Button text
     * @param {string} onclick - onclick handler
     * @param {string} [type='primary'] - 'primary', 'secondary', 'danger', 'ghost'
     * @param {string} [icon=''] - FontAwesome icon class
     * @param {string} [extra=''] - Additional classes
     */
    btn: (text, onclick, type = 'primary', icon = '', extra = '') => {
        const styles = {
            primary: 'bg-neon-green/20 hover:bg-neon-green text-neon-green hover:text-black',
            secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-300',
            danger: 'bg-neon-red/20 hover:bg-neon-red text-neon-red hover:text-white',
            ghost: 'bg-transparent hover:bg-gray-800 text-gray-400',
            blue: 'bg-neon-blue/20 hover:bg-neon-blue text-neon-blue hover:text-black'
        };
        const iconHtml = icon ? `<i class="fas ${icon} mr-2"></i>` : '';
        return `<button onclick="${onclick}" class="${styles[type] || styles.primary} px-4 py-2 rounded-lg font-bold text-sm transition-all ${extra}">${iconHtml}${text}</button>`;
    },

    /**
     * Icon button (square)
     */
    iconBtn: (icon, onclick, type = 'primary', size = 'w-12 h-12') => {
        const styles = {
            primary: 'bg-neon-green/20 hover:bg-neon-green text-neon-green hover:text-black',
            secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-400',
            success: 'bg-neon-green text-black',
            danger: 'bg-neon-red/20 hover:bg-neon-red text-neon-red hover:text-white'
        };
        return `<button onclick="${onclick}" class="${styles[type] || styles.primary} ${size} rounded-xl flex items-center justify-center text-lg transition-all">
            <i class="fas ${icon}"></i>
        </button>`;
    },

    /**
     * Set input row for weighted exercises - REDESIGNED v8.1.1
     * Features: Compact inline layout, larger inputs, KAYDET button
     */
    weightedSetRow: (tid, idx, log, isSetDone, hint = '') => `
        <div class="set-row ${isSetDone ? 'set-complete-animation' : ''} flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-xl ${isSetDone ? 'bg-gradient-to-r from-neon-green/20 to-neon-green/5 border-2 border-neon-green' : 'bg-gray-800/70 border-2 border-gray-700 hover:border-gray-600'} transition-all duration-300">
            <!-- Set Number Badge (Interactive Delete v8.3.0) -->
            <button onclick="Actions.removeSet('${tid}', ${idx})" 
                class="group flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg ${isSetDone ? 'bg-neon-green text-black hover:bg-red-900/80' : 'bg-gray-700 text-white hover:bg-red-900/80'} font-black text-lg md:text-xl flex items-center justify-center relative transition-all duration-200 hover:border-2 hover:border-red-500/50"
                title="Set Sil">
                <span class="group-hover:opacity-20 transition-opacity duration-200">${idx + 1}</span>
                <i class="fas fa-times absolute inset-0 flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></i>
            </button>
            
            <!-- Inputs Row -->
            <div class="flex-1 flex items-center gap-2">
                <div class="flex-1">
                    <input type="number" placeholder="KG" value="${log.weight || ''}" id="w-${tid}-${idx}" 
                        class="w-full bg-gray-900 text-white rounded-lg p-2 md:p-3 text-center text-lg md:text-xl font-bold border-2 ${isSetDone ? 'border-neon-green text-neon-green' : 'border-gray-600 focus:border-neon-blue'} outline-none transition-all" 
                        onchange="Actions.saveSet('${tid}', ${idx}, false)">
                </div>
                <span class="text-gray-500 text-xl font-bold">×</span>
                <div class="flex-1">
                    <input type="number" placeholder="REP" value="${log.reps || ''}" id="r-${tid}-${idx}" 
                        class="w-full bg-gray-900 text-white rounded-lg p-2 md:p-3 text-center text-lg md:text-xl font-bold border-2 ${isSetDone ? 'border-neon-green text-neon-green' : 'border-gray-600 focus:border-neon-blue'} outline-none transition-all" 
                        onchange="Actions.saveSet('${tid}', ${idx}, false)">
                </div>
            </div>
            
            <!-- Save Button -->
            <button onclick="Actions.saveSet('${tid}', ${idx}, true, event)" 
                class="flex-shrink-0 px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-sm md:text-base ${isSetDone ? 'bg-neon-green text-black' : 'bg-gray-700 text-white hover:bg-neon-green hover:text-black'} transition-all">
                <i class="fas ${isSetDone ? 'fa-check' : 'fa-save'}"></i>
                <span class="hidden sm:inline">${isSetDone ? 'TAMAM' : 'KAYDET'}</span>
            </button>
        </div>`,

    /**
     * Set input row for timed exercises - REDESIGNED v8.1.1
     * Features: Compact inline layout
     */
    timedSetRow: (tid, idx, log, isSetDone) => `
        <div class="set-row ${isSetDone ? 'set-complete-animation' : ''} flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-xl ${isSetDone ? 'bg-gradient-to-r from-neon-green/20 to-neon-green/5 border-2 border-neon-green' : 'bg-gray-800/70 border-2 border-gray-700 hover:border-gray-600'} transition-all duration-300">
            <!-- Set Number Badge (Interactive Delete v8.3.0) -->
            <button onclick="Actions.removeSet('${tid}', ${idx})" 
                class="group flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg ${isSetDone ? 'bg-neon-green text-black hover:bg-red-900/80' : 'bg-gray-700 text-white hover:bg-red-900/80'} font-black text-lg md:text-xl flex items-center justify-center relative transition-all duration-200 hover:border-2 hover:border-red-500/50"
                title="Set Sil">
                <span class="group-hover:opacity-20 transition-opacity duration-200">${idx + 1}</span>
                <i class="fas fa-times absolute inset-0 flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></i>
            </button>
            
            <!-- Input -->
            <div class="flex-1">
                <input type="number" placeholder="SANİYE" value="${log.duration || ''}" id="d-${tid}-${idx}" 
                    class="w-full bg-gray-900 text-white rounded-lg p-2 md:p-3 text-center text-lg md:text-xl font-bold border-2 ${isSetDone ? 'border-neon-green text-neon-green' : 'border-gray-600 focus:border-neon-blue'} outline-none transition-all">
            </div>
            
            <!-- Save Button -->
            <button onclick="Actions.saveTimedSet('${tid}', ${idx}, event)" 
                class="flex-shrink-0 px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-sm md:text-base ${isSetDone ? 'bg-neon-green text-black' : 'bg-gray-700 text-white hover:bg-neon-green hover:text-black'} transition-all">
                <i class="fas ${isSetDone ? 'fa-check' : 'fa-stopwatch'}"></i>
                <span class="hidden sm:inline">${isSetDone ? 'TAMAM' : 'KAYDET'}</span>
            </button>
        </div>`,

    /**
     * Simple task toggle button
     */
    simpleTaskBtn: (tid, isDone) => `
        <button onclick="Actions.toggleSimpleTask('${tid}')" 
            class="w-full py-4 rounded-xl font-bold text-lg transition-all ${isDone ? 'bg-neon-green text-black shadow-[0_0_20px_rgba(0,255,65,0.3)]' : 'bg-gray-700 text-gray-400 hover:bg-neon-green/20 hover:text-neon-green border-2 border-gray-600'}">
            <i class="fas ${isDone ? 'fa-check-circle' : 'fa-circle'} mr-2"></i>
            ${isDone ? 'TAMAMLANDI ✓' : 'TAMAMLA'}
        </button>`,

    /**
     * Status indicator dot
     */
    statusDot: (active) => `
        <div class="w-3 h-3 rounded-full ${active ? 'bg-neon-green shadow-[0_0_8px_rgba(0,255,65,0.5)]' : 'bg-gray-600'} transition-all"></div>`
};

if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
    console.log('[Components] UI component factory loaded');
}

