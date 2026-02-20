// views/MentalView.js - Mental Health Tab View Component
// Extracted from renderers/dashboard.js

import { Store } from '../store.js';

/**
 * Mental View Class
 * Renders the mental health tab with phases and daily practices
 */
export class MentalView {
    /**
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} dependencies.store - Store instance
     * @param {Object} dependencies.config - Configuration object
     * @param {Object} dependencies.theme - Theme constants
     * @param {Object} dependencies.utils - Utility functions
     * @param {Object} dependencies.mentalPhases - Mental phases database
     * @param {Object} dependencies.storage - Storage adapter
     */
    constructor(dependencies = {}) {
        this.store = dependencies.store;
        this.config = dependencies.config;
        this.theme = dependencies.theme;
        this.utils = dependencies.utils;
        this.mentalPhases = dependencies.mentalPhases;
        this.storage = dependencies.storage;
    }

    /**
     * Render the mental view
     * @returns {Promise<string>} HTML string
     */
    async render() {
        const phaseIcons = ['🐆', '🎭', '🤖', '🔧', '⚡', '🎯', '🍀', '🔄'];
        
        // Get mental progress data
        const mentalData = await this._getMentalData();
        
        // Calculate today's phase
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        const todayPhaseIndex = dayOfYear % 8;
        const todayPhase = this.mentalPhases[todayPhaseIndex];
        
        // Calculate progress
        const completedCount = mentalData.completedPhases?.length || 0;
        const progressPercent = Math.round((completedCount / 8) * 100);
        
        // Get daily practice
        const allPractices = this.mentalPhases.flatMap((p, idx) => 
            p.practice.map(pr => ({ text: pr, phaseId: p.id, icon: phaseIcons[idx] }))
        );
        const dailyPractice = allPractices[dayOfYear % allPractices.length];
        const practiceKey = this.utils.dateStr();
        const isPracticeDone = mentalData.dailyPractice?.[practiceKey] === true;

        return this._template({
            phaseIcons,
            mentalData,
            todayPhaseIndex,
            todayPhase,
            completedCount,
            progressPercent,
            dailyPractice,
            isPracticeDone
        });
    }

    /**
     * Get mental progress data from storage
     * @private
     */
    async _getMentalData() {
        try {
            const data = await this.storage.get(this.config.KEYS.MENTAL_PROGRESS);
            return data || { completedPhases: [], dailyPractice: {}, lastPracticeDate: null };
        } catch {
            return { completedPhases: [], dailyPractice: {}, lastPracticeDate: null };
        }
    }

    /**
     * Generate HTML template
     * @private
     */
    _template(data) {
        const { phaseIcons, mentalData, todayPhaseIndex, todayPhase, completedCount, progressPercent, dailyPractice, isPracticeDone } = data;
        const actionAttrs = this.utils.actionAttrs;
        const cardClass = this.theme?.card || 'bg-gray-900 border border-gray-800 rounded-xl p-4';

        // Render phase cards
        const phaseCards = this._renderPhaseCards(this.mentalPhases, phaseIcons, mentalData, todayPhaseIndex, actionAttrs);

        return `
            <div class="animate-slide-up space-y-6">
                <!-- Header -->
                <div class="flex items-center justify-between border-b border-gray-800 pb-4">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                            <i class="fas fa-brain text-white text-xl"></i>
                        </div>
                        <div>
                            <h2 class="font-header font-bold text-white text-xl">ZİHİNSEL SAVAŞ</h2>
                            <div class="text-xs text-gray-500">Mental Hardening Protokolü v8.0.0</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-bold ${progressPercent === 100 ? 'text-neon-green' : 'text-neon-purple'}">${progressPercent}%</div>
                        <div class="text-[10px] text-gray-500">${completedCount}/8 Faz</div>
                    </div>
                </div>
                
                <!-- Günün Fazı Spotlight -->
                ${this._renderTodayPhaseSpotlight(todayPhase, phaseIcons[todayPhaseIndex], actionAttrs)}
                
                <!-- Günlük Pratik -->
                ${this._renderDailyPractice(dailyPractice, isPracticeDone, actionAttrs)}
                
                <!-- Progress Bar -->
                <div class="bg-gray-800/50 rounded-full h-3 overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-500" 
                        style="width: ${progressPercent}%"></div>
                </div>
                
                <!-- Faz Kartları Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${phaseCards}
                </div>
            </div>
        `;
    }

    /**
     * Render today's phase spotlight
     * @private
     */
    _renderTodayPhaseSpotlight(todayPhase, icon, actionAttrs) {
        return `
            <div class="bg-gradient-to-r from-purple-900/30 via-gray-900 to-pink-900/30 rounded-2xl p-6 border border-purple-500/30 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div class="relative z-10">
                    <div class="text-[10px] text-purple-400 font-bold tracking-widest mb-3">
                        <i class="fas fa-star mr-1"></i>GÜNÜN FAZI
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="text-5xl">${icon}</div>
                        <div>
                            <div class="text-xl font-bold text-white">${todayPhase.title}</div>
                            <div class="text-sm text-gray-400 mt-1">${todayPhase.desc}</div>
                        </div>
                    </div>
                    <button ${actionAttrs('showPhase', [todayPhase.id])}
                        class="mt-4 px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-lg text-purple-300 text-sm font-bold hover:bg-purple-600/40 transition">
                        <i class="fas fa-book-open mr-2"></i>Fazı İncele
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Render daily practice section
     * @private
     */
    _renderDailyPractice(dailyPractice, isPracticeDone, actionAttrs) {
        return `
            <div class="bg-gray-900 rounded-xl p-5 border ${isPracticeDone ? 'border-neon-green' : 'border-gray-700'}">
                <div class="flex items-center justify-between mb-3">
                    <div class="text-[10px] text-gray-500 font-bold tracking-widest">
                        <i class="fas fa-bolt text-neon-yellow mr-1"></i>GÜNLÜK PRATİK
                    </div>
                    ${isPracticeDone ? '<span class="text-neon-green text-xs font-bold">✓ TAMAMLANDI</span>' : ''}
                </div>
                <div class="flex items-start gap-3">
                    <div class="text-2xl">${dailyPractice.icon}</div>
                    <div class="flex-1">
                        <div class="text-sm text-gray-300 leading-relaxed">${dailyPractice.text}</div>
                        <div class="text-[10px] text-gray-600 mt-2">Faz ${dailyPractice.phaseId}</div>
                    </div>
                </div>
                ${!isPracticeDone ? `
                    <button ${actionAttrs('completeDailyPractice')}
                        class="mt-4 w-full py-3 bg-neon-green/10 border-2 border-neon-green text-neon-green font-bold rounded-xl hover:bg-neon-green hover:text-black transition-all">
                        <i class="fas fa-check mr-2"></i>Bunu Yaptım!
                    </button>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render phase cards
     * @private
     */
    _renderPhaseCards(phases, phaseIcons, mentalData, todayPhaseIndex, actionAttrs) {
        return phases.map((p, idx) => {
            const icon = phaseIcons[idx];
            const isCompleted = mentalData.completedPhases?.includes(p.id);
            const isToday = idx === todayPhaseIndex;

            return `
                <div class="group relative bg-gradient-to-br ${isToday ? 'from-purple-900/40 to-gray-900' : 'from-gray-900 to-gray-800'} 
                    border-2 ${isToday ? 'border-neon-purple shadow-[0_0_20px_rgba(168,85,247,0.2)]' : isCompleted ? 'border-neon-green/50' : 'border-gray-700'}
                    rounded-2xl p-5 transition-all hover:border-neon-purple/80 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] cursor-pointer"
                    ${actionAttrs('showPhase', [p.id])}>
                    ${isToday ? '<div class="absolute -top-2 -right-2 bg-neon-purple text-black text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse">BUGÜN</div>' : ''}
                    ${isCompleted ? '<div class="absolute top-3 right-3 text-neon-green text-lg">✓</div>' : ''}
                    <div class="flex items-start gap-4">
                        <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 
                            flex items-center justify-center text-3xl ${isToday ? 'animate-pulse' : ''} 
                            group-hover:scale-110 transition-transform">
                            ${icon}
                        </div>
                        <div class="flex-1">
                            <div class="text-[10px] text-purple-400 font-mono mb-1">FAZ ${p.id}</div>
                            <div class="font-bold text-white text-base group-hover:text-purple-200 transition">${p.title.replace(/FAZ \d+: /, '')}</div>
                            <div class="text-xs text-gray-400 mt-2 leading-relaxed">${p.desc}</div>
                        </div>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-700/50 flex justify-between items-center">
                        <div class="text-[10px] text-gray-500">
                            <i class="fas fa-list-check mr-1"></i>${p.strategy.length} Strateji • ${p.practice.length} Pratik
                        </div>
                        <div class="text-neon-purple text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                            DETAY <i class="fas fa-arrow-right"></i>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

export default MentalView;
