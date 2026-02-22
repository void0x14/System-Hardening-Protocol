/**
 * Copyright (c) 2025-2026 void0x14
 */

import { i18n } from '../services/i18nService.js';
// views/DashboardView.js - Main Dashboard View Component
// Extracted from renderers/dashboard.js

import { Store } from '../store.js';

/**
 * Dashboard View Class
 * Renders the main dashboard with system status, streak, and daily protocol
 */
export class DashboardView {
    /**
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} dependencies.store - Store instance
     * @param {Object} dependencies.config - Configuration object
     * @param {Object} dependencies.theme - Theme constants
     * @param {Object} dependencies.utils - Utility functions
     * @param {Object} dependencies.weeklyPlan - Weekly plan data
     */
    constructor(dependencies = {}) {
        this.store = dependencies.store;
        this.config = dependencies.config;
        this.theme = dependencies.theme;
        this.utils = dependencies.utils;
        this.weeklyPlan = dependencies.weeklyPlan;
    }

    /**
     * Render the dashboard view
     * @returns {Promise<string>} HTML string
     */
    async render() {
        const today = this.utils.dateStr();
        const state = this.store.state;

        // 1. DATA GATHERING
        const currentWeight = this._toSafeNumber(state.weight, this.config.TARGETS.START, 20, 500);
        const startWeight = this.config.TARGETS.START;
        const goalWeight = this.config.TARGETS.GOAL;
        const weightProgress = Math.min(100, Math.max(0, ((currentWeight - startWeight) / (goalWeight - startWeight)) * 100));

        const streak = await this.store.getStreak();
        const workoutData = await this.store.getWorkout(today);
        const mealsData = await this.store.getMeals(today);
        const sleepHours = await this.store.getSleep(today);
        const water = await this.store.getWater(today);
        const fuelDone = state.fuelDate === today;

        const safeStreak = Math.trunc(this._toSafeNumber(streak, 0, 0, 10000));
        const safeSleepHours = this._toSafeNumber(sleepHours, 0, 0, 24);
        const safeWater = Math.round(this._toSafeNumber(water, 0, 0, 50));

        const dayIdx = new Date().getDay();
        const dailyPlan = this.weeklyPlan[dayIdx];
        const totalTasks = dailyPlan ? dailyPlan.tasks.length : 0;
        const completedTasks = workoutData.length;

        const totalProtein = mealsData.reduce((sum, m) => sum + m.prot, 0);
        const totalCal = mealsData.reduce((sum, m) => sum + m.cal, 0);
        const targetProtein = this.config.TARGETS.PROT;
        const targetCal = this.config.TARGETS.CAL;

        const isTrainingDone = totalTasks > 0 && completedTasks >= totalTasks;
        const isProteinDone = totalProtein >= targetProtein;
        const isSleepDone = safeSleepHours >= 7;

        const heatmapHTML = await this._getHeatmapHTML();

        // 2. RENDER HTML
        return this._template({
            currentWeight,
            goalWeight,
            weightProgress,
            safeStreak,
            heatmapHTML,
            isTrainingDone,
            completedTasks,
            totalTasks,
            isProteinDone,
            totalProtein,
            targetProtein,
            isSleepDone,
            safeSleepHours,
            safeWater,
            fuelDone,
            totalCal,
            targetCal
        });
    }

    /**
     * Generate heatmap HTML for last 28 days
     * @private
     */
    async _getHeatmapHTML() {
        let html = '';
        const today = new Date();
        
        for (let i = 27; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = this._formatDate(d);

            const workout = await this.store.getWorkout(dateStr);
            const dayOfWeek = d.getDay();
            const dayPlan = this.weeklyPlan[dayOfWeek];
            const totalDayTasks = dayPlan ? dayPlan.tasks.length : 1;
            
            let level = 0;
            if (workout.length > 0) {
                const percent = workout.length / totalDayTasks;
                if (percent >= 0.75) level = 3;
                else if (percent >= 0.5) level = 2;
                else level = 1;
            }

            const isFuture = d > new Date();
            const colorClass = isFuture ? 'opacity-0' : level === 0 ? 'opacity-50' : `active-${level}`;

            html += `<div class="heatmap-cell ${colorClass}" title="${dateStr}"></div>`;
        }
        return html;
    }

    /**
     * Format date to YYYY-MM-DD
     * @private
     */
    _formatDate(date) {
        const dy = date.getFullYear();
        const dm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${dy}-${dm}-${dd}`;
    }

    /**
     * Safe number conversion
     * @private
     */
    _toSafeNumber(value, fallback = 0, min = 0, max = Number.MAX_SAFE_INTEGER) {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) return fallback;
        return Math.min(max, Math.max(min, parsed));
    }

    /**
     * Generate HTML template
     * @private
     */
    _template(data) {
        const {
            currentWeight, goalWeight, weightProgress,
            safeStreak, heatmapHTML,
            isTrainingDone, completedTasks, totalTasks,
            isProteinDone, totalProtein, targetProtein,
            isSleepDone, safeSleepHours,
            safeWater, fuelDone, totalCal, targetCal
        } = data;

        const cardClass = this.theme?.card || 'bg-gray-900 border border-gray-800 rounded-xl p-4';
        const labelClass = this.theme?.label || 'text-[10px] text-gray-500 font-bold tracking-widest mb-3';
        const actionAttrs = this.utils.actionAttrs;

        return `
            <div class="animate-slide-up space-y-6">
                <!-- TOP ROW: SYSTEM INTEGRITY & STREAK -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    <!-- 1. SYSTEM INTEGRITY (Circular Progress) -->
                    <div class="${cardClass} relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
                        <div class="absolute inset-0 bg-gradient-to-b from-neon-green/5 to-transparent"></div>
                        <div class="${labelClass} z-10 w-full text-center">${i18n.t("dashboard.system_integrity")}</div>

                        <div class="relative z-10">
                            <svg viewBox="0 0 36 36" class="circular-chart w-48 h-48">
                                <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#1a1a22" />
                                <path class="circle" stroke="${weightProgress >= 100 ? '#00ff41' : '#00f3ff'}" stroke-dasharray="${weightProgress}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <div class="absolute inset-0 flex flex-col items-center justify-center">
                                <div class="text-4xl font-black text-white font-mono tracking-tighter">${currentWeight}<span class="text-lg text-gray-500">kg</span></div>
                                <div class="text-[10px] text-neon-blue mt-1 font-mono">${i18n.t("dashboard.goal")} ${goalWeight}</div>
                            </div>
                        </div>

                        <button ${actionAttrs('openWeightModal')} class="mt-6 z-10 text-[10px] border border-gray-700 hover:border-neon-green text-gray-400 hover:text-white px-3 py-1 rounded transition-colors uppercase tracking-wider">
                            [ UPDATE SENSOR ]
                        </button>
                    </div>

                    <!-- 2. UPTIME HISTORY (Streak + Heatmap) -->
                    <div class="${cardClass} flex flex-col justify-between min-h-[200px]">
                        <div>
                            <div class="${labelClass}">${i18n.t("dashboard.uptime_streak")}</div>
                            <div class="flex items-baseline gap-2 mb-4">
                                <div class="text-5xl font-header font-black ${safeStreak > 0 ? 'text-neon-green' : 'text-gray-500'} leading-none">${safeStreak}</div>
                                <div class="text-xs text-text-muted uppercase tracking-wider">${i18n.t("dashboard.days")}</div>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <div class="flex justify-between items-end">
                                <div class="text-[9px] text-gray-500 font-bold">${i18n.t("dashboard.last_28_days")}</div>
                                <div class="text-[9px] text-neon-green font-bold">${i18n.t("dashboard.consistency")}</div>
                            </div>
                            <div class="heatmap-grid bg-black/20 p-2 rounded border border-gray-800">
                                ${heatmapHTML}
                            </div>
                        </div>
                    </div>

                    <!-- 3. DAILY PROTOCOL STATUS -->
                    <div class="${cardClass}">
                        <div class="${labelClass}">${i18n.t("dashboard.daily_protocol")}</div>
                        <div class="space-y-4 mt-2">
                            <!-- Training -->
                            <div class="p-3 bg-surface-raised rounded-lg border-l-2 ${isTrainingDone ? 'border-neon-green' : 'border-neon-red'}">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-xs font-bold text-gray-300">${i18n.t("dashboard.training")}</span>
                                    ${isTrainingDone ? '<i class="fas fa-check text-neon-green"></i>' : '<i class="fas fa-times text-neon-red"></i>'}
                                </div>
                                <div class="text-[10px] text-gray-500 font-mono">${completedTasks}/${totalTasks} ${i18n.t("dashboard.tasks")}</div>
                            </div>

                            <!-- Nutrition -->
                            <div class="p-3 bg-surface-raised rounded-lg border-l-2 ${isProteinDone ? 'border-neon-green' : 'border-accent-orange'}">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-xs font-bold text-gray-300">${i18n.t("dashboard.protein")}</span>
                                    ${isProteinDone ? '<i class="fas fa-check text-neon-green"></i>' : '<span class="text-accent-orange text-[10px] font-bold">${i18n.t("dashboard.missing")}</span>'}
                                </div>
                                <div class="text-[10px] text-gray-500 font-mono">${Math.round(totalProtein)} / ${targetProtein}g</div>
                            </div>

                            <!-- Sleep -->
                            <div class="p-3 bg-surface-raised rounded-lg border-l-2 ${isSleepDone ? 'border-neon-green' : 'border-gray-600'} cursor-pointer hover:bg-surface-hover transition-all" ${actionAttrs('openSleepModal')}>
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-xs font-bold text-gray-300">${i18n.t("dashboard.sleep")}</span>
                                    <span class="text-[10px] font-mono ${isSleepDone ? 'text-neon-green' : 'text-gray-500'}">${safeSleepHours} ${i18n.t("dashboard.hours")}</span>
                                </div>
                                <div class="text-[9px] text-gray-600">${i18n.t("dashboard.click_to_save")}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- MIDDLE ROW: RESTORED TRACKERS (Water & Fuel) -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- HYDRATION MONITOR -->
                    <div class="${cardClass}">
                        <div class="flex justify-between items-start mb-4">
                            <div class="${labelClass}">${i18n.t("dashboard.hydration_level")}</div>
                            <i class="fas fa-tint text-neon-blue"></i>
                        </div>
                        <div class="flex items-end justify-between">
                            <div>
                                <div class="text-4xl font-bold ${safeWater >= this.config.TARGETS.WATER ? 'text-neon-blue' : 'text-white'}">
                                    ${safeWater} <span class="text-lg text-gray-500">/ ${this.config.TARGETS.WATER}</span>
                                </div>
                                <div class="w-32 bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                                    <div class="h-full bg-neon-blue transition-all" style="width: ${Math.min(100, (safeWater / this.config.TARGETS.WATER) * 100)}%"></div>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <button ${actionAttrs('addWater', [-1])} class="w-10 h-10 rounded border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white transition flex items-center justify-center font-bold text-lg">-</button>
                                <button ${actionAttrs('addWater', [1])} class="w-10 h-10 rounded bg-neon-blue/20 hover:bg-neon-blue text-neon-blue hover:text-black transition flex items-center justify-center font-bold text-lg">+</button>
                            </div>
                        </div>
                    </div>

                    <!-- FUEL & ENERGY -->
                    <div class="${cardClass} ${!fuelDone ? 'border-neon-red/30' : ''}">
                        <div class="flex justify-between items-start mb-4">
                            <div class="${labelClass}">FUEL & ENERGY</div>
                            <i class="fas fa-gas-pump ${!fuelDone ? 'text-neon-red animate-pulse' : 'text-neon-green'}"></i>
                        </div>

                        <!-- Calorie Tracker -->
                        <div class="mb-4">
                            <div class="flex justify-between items-end mb-1">
                                <span class="text-xs text-gray-400 font-bold">${i18n.t("dashboard.energy_level")}</span>
                                <span class="text-white font-bold text-sm font-mono">${totalCal} / ${targetCal} kcal</span>
                            </div>
                            <div class="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                <div class="h-full ${totalCal >= targetCal ? 'bg-neon-green' : 'bg-accent-orange'} transition-all" style="width: ${Math.min(100, (totalCal / targetCal) * 100)}%"></div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-xl font-bold text-white">${i18n.t("dashboard.gainer_shake")}</div>
                                <div class="text-[10px] text-gray-500 mt-1">${i18n.t("dashboard.gainer_ingredients")}</div>
                            </div>
                            <button ${actionAttrs('injectFuel')} class="px-4 py-2 rounded-lg font-bold text-xs uppercase transition-all tracking-wider ${fuelDone ? 'bg-neon-green text-black' : 'bg-neon-red text-white hover:bg-red-600'}">
                                ${fuelDone ? i18n.t('dashboard.injected') : i18n.t('dashboard.inject_now')}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- BOTTOM: SYSTEM CHECK -->
                <div class="grid grid-cols-1">
                    <button ${actionAttrs('completeDailyMission')} class="${cardClass} group hover:border-neon-green/50 flex items-center justify-center p-4 cursor-pointer transition-all hover:bg-neon-green/5">
                        <i class="fas fa-check-circle text-2xl text-gray-600 group-hover:text-neon-green transition-colors mr-4"></i>
                        <div class="text-center">
                            <div class="text-white font-bold text-sm tracking-widest">${i18n.t("dashboard.system_check")}</div>
                            <div class="text-[10px] text-gray-500 font-mono">${i18n.t("dashboard.all_tasks_done")}</div>
                        </div>
                    </button>
                </div>
            </div>
        `;
    }
}

export default DashboardView;
