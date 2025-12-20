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
            <!-- Set Number Badge (Compact) -->
            <div class="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg ${isSetDone ? 'bg-neon-green text-black' : 'bg-gray-700 text-white'} font-black text-lg md:text-xl flex items-center justify-center">
                ${idx + 1}
            </div>
            
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
            <button onclick="Actions.saveSet('${tid}', ${idx}, true)" 
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
            <!-- Set Number Badge (Compact) -->
            <div class="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg ${isSetDone ? 'bg-neon-green text-black' : 'bg-gray-700 text-white'} font-black text-lg md:text-xl flex items-center justify-center">
                ${idx + 1}
            </div>
            
            <!-- Input -->
            <div class="flex-1">
                <input type="number" placeholder="SANİYE" value="${log.duration || ''}" id="d-${tid}-${idx}" 
                    class="w-full bg-gray-900 text-white rounded-lg p-2 md:p-3 text-center text-lg md:text-xl font-bold border-2 ${isSetDone ? 'border-neon-green text-neon-green' : 'border-gray-600 focus:border-neon-blue'} outline-none transition-all">
            </div>
            
            <!-- Save Button -->
            <button onclick="Actions.saveTimedSet('${tid}', ${idx})" 
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

console.log('[Components] UI component factory loaded');
