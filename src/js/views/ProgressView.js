// views/ProgressView.js - Progress Tab View Component
// Extracted from renderers/dashboard.js

import { Store } from '../store.js';
import { Stealth } from '../stealth.js';
import { i18n } from '../services/i18nService.js';

/**
 * Progress View Class
 * Renders the progress tab with weight history, volume stats, and measurements
 */
export class ProgressView {
    /**
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} dependencies.store - Store instance
     * @param {Object} dependencies.config - Configuration object
     * @param {Object} dependencies.theme - Theme constants
     * @param {Object} dependencies.utils - Utility functions
     * @param {Object} dependencies.stealth - Stealth mode handler (optional)
     */
    constructor(dependencies = {}) {
        this.store = dependencies.store;
        this.config = dependencies.config;
        this.theme = dependencies.theme;
        this.utils = dependencies.utils;
        this.stealth = dependencies.stealth;
    }

    /**
     * Render the progress view
     * @returns {Promise<string>} HTML string
     */
    async render() {
        const hist = await this.store.getHistory();
        const statsData = await this.store.getStats();
        const volStats = await this.store.getVolumeStats();
        const weeklySummary = await this.store.getWeeklySummary();
        const sleepStats = await this.store.getSleepStats();
        const waterStats = await this.store.getWaterStats();

        const stats = statsData.current || {};
        const measureHistory = statsData.history || [];

        return this._template({
            hist,
            stats,
            volStats,
            weeklySummary,
            sleepStats,
            waterStats
        });
    }

    /**
     * Generate HTML template
     * @private
     */
    _template(data) {
        const { hist, stats, volStats, weeklySummary, sleepStats, waterStats } = data;
        const actionAttrs = this.utils.actionAttrs;
        const cardClass = this.theme?.card || 'bg-gray-900 border border-gray-800 rounded-xl p-4';
        const inputClass = this.theme?.input || 'bg-gray-800 border border-gray-700 rounded-lg p-2 text-white';
        const isSanitized = this.stealth?.active || false;

        // Weight history chart
        const { weightBars, dateLabels } = this._renderWeightChart(hist);

        // Volume chart
        const volumeChart = this._renderVolumeChart(volStats);

        // Measurement inputs
        const measurementInputs = this._renderMeasurementInputs(stats, inputClass);

        // Summary grid
        const summaryGridClass = isSanitized ? 'flex flex-wrap justify-center gap-3' : 'grid grid-cols-3 md:grid-cols-6 gap-3';

        return `
            <div class="space-y-6 animate-slide-up">
                <!-- SUMMARY ROW -->
                <div class="${summaryGridClass}">
                    <div class="${cardClass} text-center py-3 ${isSanitized ? 'w-32 md:w-40' : ''}">
                        <div class="text-[9px] text-gray-500 font-bold">${i18n.t('db.renderers.progress.current')}</div>
                        <div class="text-xl font-bold text-white mt-1">${this.store.state.weight} <span class="text-[10px] text-neon-green">kg</span></div>
                    </div>
                    <div class="${cardClass} text-center py-3 border-neon-green/30 ${isSanitized ? 'w-32 md:w-40' : ''}">
                        <div class="text-[9px] text-neon-green font-bold">${i18n.t('db.renderers.progress.today')}</div>
                        <div class="text-xl font-bold text-white mt-1">${Math.round(volStats.daily[this.utils.dateStr()] || 0)} <span class="text-[10px] text-gray-500">kg</span></div>
                    </div>
                    <div class="${cardClass} text-center py-3 border-neon-blue/30 ${isSanitized ? 'w-32 md:w-40' : ''}">
                        <div class="text-[9px] text-neon-blue font-bold">${i18n.t('db.renderers.progress.weekly')}</div>
                        <div class="text-xl font-bold text-white mt-1">${(volStats.weekly / 1000).toFixed(1)} <span class="text-[10px] text-gray-500">${i18n.t('db.renderers.progress.ton')}</span></div>
                    </div>
                    <div class="${cardClass} text-center py-3 border-accent-orange/30 ${isSanitized ? 'w-32 md:w-40' : ''}">
                        <div class="text-[9px] text-accent-orange font-bold">${i18n.t('db.renderers.progress.monthly')}</div>
                        <div class="text-xl font-bold text-white mt-1">${(volStats.monthly / 1000).toFixed(1)} <span class="text-[10px] text-gray-500">${i18n.t('db.renderers.progress.ton')}</span></div>
                    </div>
                    <div class="${cardClass} text-center py-3 ${isSanitized ? 'w-32 md:w-40' : ''}">
                        <div class="text-[9px] text-gray-500 font-bold">${i18n.t('db.renderers.progress.total_sets')}</div>
                        <div class="text-xl font-bold text-neon-blue mt-1">${volStats.totalSets}</div>
                    </div>
                    <div class="${cardClass} text-center py-3 sensitive-content">
                        <div class="text-[9px] text-gray-500 font-bold">${i18n.t('db.renderers.progress.goal')}</div>
                        <div class="text-xl font-bold text-neon-green mt-1">${this.config.TARGETS.GOAL} <span class="text-[10px]">kg</span></div>
                    </div>
                </div>

                <!-- SLEEP & WATER STATS -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div class="${cardClass} text-center py-3 border-purple-500/30">
                        <div class="text-[9px] text-purple-400 font-bold">😴 ${i18n.t('db.renderers.progress.weekly_sleep')}</div>
                        <div class="text-xl font-bold text-white mt-1">${sleepStats.weekAvg} <span class="text-[10px] text-gray-500">${i18n.t('db.renderers.progress.hours_day')}</span></div>
                    </div>
                    <div class="${cardClass} text-center py-3 border-purple-500/30">
                        <div class="text-[9px] text-purple-400 font-bold">😴 ${i18n.t('db.renderers.progress.monthly_sleep')}</div>
                        <div class="text-xl font-bold text-white mt-1">${sleepStats.monthAvg} <span class="text-[10px] text-gray-500">${i18n.t('db.renderers.progress.hours_day')}</span></div>
                    </div>
                    <div class="${cardClass} text-center py-3 border-neon-blue/30">
                        <div class="text-[9px] text-neon-blue font-bold">💧 ${i18n.t('db.renderers.progress.weekly_water')}</div>
                        <div class="text-xl font-bold text-white mt-1">${waterStats.weekTotal} <span class="text-[10px] text-gray-500">${i18n.t('db.renderers.progress.glasses')}</span></div>
                    </div>
                    <div class="${cardClass} text-center py-3 border-neon-blue/30">
                        <div class="text-[9px] text-neon-blue font-bold">💧 ${i18n.t('db.renderers.progress.monthly_water')}</div>
                        <div class="text-xl font-bold text-white mt-1">${waterStats.monthTotal} <span class="text-[10px] text-gray-500">${i18n.t('db.renderers.progress.glasses')}</span></div>
                    </div>
                </div>

                <!-- VOLUME ANALYSIS -->
                <div class="${cardClass}">
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <span class="text-neon-blue font-bold text-sm">${i18n.t('db.renderers.progress.training_volume')}</span>
                            <span class="text-[10px] text-gray-500 ml-2">${i18n.t('db.renderers.progress.last_7_days')}</span>
                        </div>
                        <div class="text-xs text-gray-500">${volStats.weekly > 0 ? i18n.t('db.renderers.progress.total_ton').replace('{val}', (volStats.weekly / 1000).toFixed(2)) : ''}</div>
                    </div>
                    <div class="flex items-end gap-1 h-28">${volumeChart}</div>
                </div>
                
                <!-- WEEKLY SUMMARY -->
                <div class="${cardClass}">
                    <div class="text-[10px] text-gray-500 font-bold tracking-widest mb-3">📅 ${i18n.t('db.renderers.progress.weekly_summary')}</div>
                    <div class="overflow-x-auto mt-4">
                        ${this._renderWeeklySummaryTable(weeklySummary)}
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- WEIGHT HISTORY -->
                    <div class="${cardClass} flex flex-col">
                        <span class="text-[10px] text-gray-500 font-bold mb-2">${i18n.t('db.renderers.progress.weight_history')}</span>
                        <div class="flex items-end gap-1 h-32 border-b border-gray-800">${weightBars}</div>
                        <div class="flex gap-1 mt-1">${dateLabels}</div>
                    </div>

                    <!-- MEASUREMENTS -->
                    <div class="${cardClass}">
                        <div class="flex justify-between mb-4 items-center">
                            <span class="text-[10px] text-gray-500 font-bold block">${i18n.t('db.renderers.progress.measurements')}</span>
                            <button ${actionAttrs('saveStats')} class="bg-neon-green/20 hover:bg-neon-green text-neon-green hover:text-black text-xs font-bold px-4 py-2 rounded-lg transition-all">
                                <i class="fas fa-save mr-1"></i>${i18n.t('db.renderers.progress.save')}
                            </button>
                        </div>
                        <div class="grid grid-cols-2 gap-3">${measurementInputs}</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render weight chart
     * @private
     */
    _renderWeightChart(hist) {
        const dates = Object.keys(hist)
            .filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date))
            .sort()
            .slice(-7);

        const months = i18n.t('db.renderers.progress.months').split(',');

        if (dates.length === 0) {
            return {
                weightBars: `<div class="text-gray-600 text-xs w-full text-center self-center flex flex-col items-center justify-center h-full"><i class="fas fa-weight text-3xl mb-2 opacity-30"></i><span>${i18n.t('db.renderers.progress.no_data')}</span></div>`,
                dateLabels: ''
            };
        }

        const weightBars = dates.map(d => {
            const safeWeight = this._toSafeNumber(hist[d], this.config.TARGETS.START, 20, 500);
            const h = ((safeWeight - this.config.TARGETS.START) / (this.config.TARGETS.GOAL - this.config.TARGETS.START)) * 70 + 15;
            return `<div class="flex-1 flex flex-col items-center"><div class="text-[9px] text-neon-green font-bold mb-1">${safeWeight}</div><div class="w-full bg-gray-800 hover:bg-neon-green/50 rounded-t transition-all" style="height:${h}%"></div></div>`;
        }).join('');

        const dateLabels = dates.map((d, i) => {
            const parts = d.split('-');
            const day = parts[2];
            const monthIdx = parseInt(parts[1]) - 1;
            const showMonth = (i === 0 || i === dates.length - 1);
            return `<div class="flex-1 text-center text-[8px] text-gray-500">${day}${showMonth ? ' ' + months[monthIdx] : ''}</div>`;
        }).join('');

        return { weightBars, dateLabels };
    }

    /**
     * Render volume chart
     * @private
     */
    _renderVolumeChart(volStats) {
        const volDates = Object.keys(volStats.daily).sort();

        if (volStats.weekly === 0) {
            return `<div class="text-gray-600 text-xs w-full text-center flex flex-col items-center justify-center h-full"><i class="fas fa-dumbbell text-3xl mb-2 opacity-30"></i><span>${i18n.t('db.renderers.progress.no_training_data')}</span></div>`;
        }

        const maxVol = Math.max(...Object.values(volStats.daily), 1);

        return volDates.map(d => {
            const val = volStats.daily[d] || 0;
            const h = (val / maxVol) * 80;
            const parts = d.split('-');
            const day = parts[2];
            return `<div class="flex-1 flex flex-col items-center group"><div class="text-[8px] text-neon-blue font-bold mb-1 opacity-0 group-hover:opacity-100 transition">${val > 0 ? Math.round(val) : ''}</div><div class="w-full bg-gray-800 hover:bg-neon-blue/60 rounded-t transition-all" style="height:${Math.max(5, h)}%"></div><div class="text-[8px] text-gray-500 mt-1">${day}</div></div>`;
        }).join('');
    }

    /**
     * Render measurement inputs
     * @private
     */
    _renderMeasurementInputs(stats, inputClass) {
        const labels = { chest: i18n.t('db.renderers.progress.chest'), arm: i18n.t('db.renderers.progress.arm'), waist: i18n.t('db.renderers.progress.waist'), leg: i18n.t('db.renderers.progress.leg') };

        return ['chest', 'arm', 'waist', 'leg'].map(k => `
            <div class="bg-surface-raised p-3 rounded-lg">
                <label class="text-[10px] text-gray-500 font-bold uppercase block mb-2">${labels[k]}</label>
                <input type="number" id="stat-${k}" value="${this._safeStatValue(stats[k])}" placeholder="cm" class="${inputClass} text-center text-lg font-bold">
            </div>
        `).join('');
    }

    /**
     * Render weekly summary table
     * @private
     */
    _renderWeeklySummaryTable(weeklySummary) {
        return `
            <table class="w-full text-sm">
                <thead>
                    <tr class="text-gray-500 text-xs border-b border-gray-800">
                        <th class="text-left py-2">${i18n.t('db.renderers.progress.week')}</th>
                        <th class="text-center py-2">${i18n.t('db.renderers.progress.avg_cal')}</th>
                        <th class="text-center py-2">${i18n.t('db.renderers.progress.training')}</th>
                        <th class="text-right py-2">${i18n.t('db.renderers.progress.weight_delta')}</th>
                    </tr>
                </thead>
                <tbody>
                    ${weeklySummary.map((w, i) => `
                        <tr class="border-b border-gray-800/50 ${i === 0 ? 'bg-gray-800/30' : ''}">
                            <td class="py-2 ${i === 0 ? 'text-neon-green font-bold' : 'text-gray-400'}">${i === 0 ? i18n.t('db.renderers.progress.this_week') : i === 1 ? i18n.t('db.renderers.progress.last_week') : `${w.week}. ${i18n.t('db.renderers.progress.weeks_ago')}`}</td>
                            <td class="text-center py-2 font-mono ${w.avgCal >= this.config.TARGETS.CAL ? 'text-neon-green' : w.avgCal > 0 ? 'text-accent-orange' : 'text-gray-600'}">${w.avgCal > 0 ? w.avgCal : '-'}</td>
                            <td class="text-center py-2">${w.workoutDays > 0 ? `<span class="text-neon-blue font-bold">${w.workoutDays}</span> ${i18n.t('db.renderers.progress.days')}` : '<span class="text-gray-600">-</span>'}</td>
                            <td class="text-right py-2 font-mono ${w.weightChange > 0 ? 'text-neon-green' : w.weightChange < 0 ? 'text-neon-red' : 'text-gray-500'}">${w.weightChange !== null ? (w.weightChange > 0 ? '+' : '') + w.weightChange + ' kg' : '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    /**
     * Safe stat value for display
     * @private
     */
    _safeStatValue(value) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? String(parsed) : '';
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
}

export default ProgressView;
