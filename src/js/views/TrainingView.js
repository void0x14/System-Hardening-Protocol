// views/TrainingView.js - Training Tab View Component
// Extracted from renderers/dashboard.js

import { WeightedSetRow, TimedSetRow, SimpleTaskBtn, AddSetButton } from '../components/SetRow.js';

import { Store } from '../store.js';
import { Stealth } from '../stealth.js';

/**
 * Training View Class
 * Renders the training/workout tab with exercise list and set tracking
 */
export class TrainingView {
    /**
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} dependencies.store - Store instance
     * @param {Object} dependencies.config - Configuration object
     * @param {Object} dependencies.theme - Theme constants
     * @param {Object} dependencies.utils - Utility functions
     * @param {Object} dependencies.weeklyPlan - Weekly plan data
     * @param {Object} dependencies.db - Exercise database
     * @param {Object} dependencies.stealth - Stealth mode handler (optional)
     */
    constructor(dependencies = {}) {
        this.store = dependencies.store;
        this.config = dependencies.config;
        this.theme = dependencies.theme;
        this.utils = dependencies.utils;
        this.weeklyPlan = dependencies.weeklyPlan;
        this.db = dependencies.db;
        this.stealth = dependencies.stealth;
    }

    /**
     * Render the training view
     * @returns {Promise<string>} HTML string
     */
    async render() {
        const day = new Date().getDay();
        const plan = this.weeklyPlan[day];
        const today = this.utils.dateStr();
        
        const done = await this.store.getWorkout(today);
        const workoutData = await this.store.getWorkoutData(today);
        
        const btnClass = "bg-gray-800 hover:bg-neon-blue hover:text-black text-neon-blue border border-neon-blue font-bold py-3 px-6 rounded transition w-full mb-6 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,243,255,0.2)]";

        return this._template({
            plan,
            day,
            done,
            workoutData,
            btnClass
        });
    }

    /**
     * Generate HTML template
     * @private
     */
    _template(data) {
        const { plan, day, done, workoutData, btnClass } = data;
        const actionAttrs = this.utils.actionAttrs;

        return `
            <div class="animate-slide-up">
                <div class="flex justify-between items-end mb-6 border-b border-gray-800 pb-4">
                    <div>
                        <h2 class="text-3xl font-header font-bold text-white">${plan.name}</h2>
                        <div class="text-neon-green tracking-widest text-xs mt-1">${plan.title}</div>
                    </div>
                    <div class="text-xl font-mono text-white">0${day}</div>
                </div>
                
                <button ${actionAttrs('openWarmup')} class="${btnClass}">
                    <i class="fas fa-fire animate-pulse"></i> SYSTEM BOOT (ISINMA)
                </button>
                
                <div class="space-y-4">
                    ${this._renderExercises(plan.tasks, done, workoutData, actionAttrs)}
                </div>
            </div>
        `;
    }

    /**
     * Render exercise list
     * @private
     */
    _renderExercises(tasks, done, workoutData, actionAttrs) {
        return tasks.map(tid => {
            const ex = this.db.EXERCISES[tid];
            if (!ex) return '';
            
            const isDone = done.includes(tid);
            const logs = workoutData[tid] || [];

            const trackingType = ex.trackingType || 'weighted';
            const defaultSets = ex.sets || 3;
            const targetSets = logs.length > 0 ? logs.length : defaultSets;
            const intensityHints = ex.intensityHints || [];

            const { setsHtml, completedSets, addSetBtn } = this._renderSets(
                tid, trackingType, logs, targetSets, intensityHints, actionAttrs
            );

            const totalForProgress = (trackingType === 'duration' || trackingType === 'activity' || trackingType === 'task') ? 1 : targetSets;
            const progressPercent = totalForProgress > 0 ? Math.round((completedSets / totalForProgress) * 100) : 0;

            const typeLabel = trackingType === 'weighted' ? `${targetSets} Set` :
                trackingType === 'timed' ? `${targetSets} Set` :
                    trackingType === 'duration' ? 'Süre' :
                        trackingType === 'activity' ? 'Aktivite' : 'Görev';

            const tags = this.stealth?.active ? this.stealth.filterTags(ex.tags) : ex.tags;

            return `
                <div class="bg-gray-900 border-2 ${isDone ? 'border-neon-green shadow-[0_0_15px_rgba(0,255,65,0.15)]' : 'border-gray-700'} rounded-xl overflow-hidden transition-all">
                    <div class="p-4 cursor-pointer hover:bg-gray-800/50 flex justify-between items-center" ${actionAttrs('toggleExerciseBody', [tid])}>
                        <div class="flex items-center gap-3">
                            <div class="w-3 h-3 rounded-full ${isDone ? 'bg-neon-green shadow-[0_0_8px_rgba(0,255,65,0.5)]' : 'bg-gray-600'} transition-all"></div>
                            <div>
                                <div class="font-bold text-white text-base">${ex.title}</div>
                                <div class="text-xs text-gray-500 mt-0.5">
                                    <span class="${progressPercent === 100 ? 'text-neon-green' : progressPercent > 0 ? 'text-neon-blue' : ''}">%${progressPercent}</span> | 
                                    ${typeLabel} | ${tags.join(', ')}
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            ${isDone ? '<span class="text-[10px] text-neon-green font-bold bg-neon-green/10 px-2 py-1 rounded">TAMAM</span>' : ''}
                            <i class="fas fa-chevron-down text-gray-500 transition-transform duration-300" id="icon-${tid}"></i>
                        </div>
                    </div>
                    <div id="body-${tid}" class="hidden bg-black/30 p-5 border-t border-gray-800">
                        <div class="flex justify-between items-start mb-5">
                            <div class="text-sm text-gray-300 p-4 bg-gray-800/70 rounded-xl border-l-4 border-neon-blue flex-1 mr-4 leading-relaxed">${ex.desc}</div>
                            <button ${actionAttrs('showExercise', [tid], { stopPropagation: true })} class="flex-shrink-0 w-12 h-12 rounded-xl bg-neon-blue/10 hover:bg-neon-blue/30 border-2 border-neon-blue/50 text-neon-blue flex items-center justify-center transition-all hover:scale-105" title="Detaylı Bilgi & PR">
                                <i class="fas fa-info-circle text-lg"></i>
                            </button>
                        </div>
                        <div class="space-y-3">
                            ${setsHtml}
                            ${addSetBtn}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Render sets for an exercise
     * @private
     */
    _renderSets(tid, trackingType, logs, targetSets, intensityHints, actionAttrs) {
        let setsHtml = '';
        let completedSets = 0;
        let addSetBtn = '';

        const utils = { actionAttrs: this.utils.actionAttrs };

        if (trackingType === 'weighted') {
            for (let i = 0; i < targetSets; i++) {
                const log = logs[i] || {};
                const isSetDone = !!log.completed;
                if (isSetDone) completedSets++;
                setsHtml += WeightedSetRow(tid, i, log, isSetDone, intensityHints[i] || '', utils);
            }
            addSetBtn = AddSetButton(tid, utils);
        } else if (trackingType === 'timed') {
            for (let i = 0; i < targetSets; i++) {
                const log = logs[i] || {};
                const isSetDone = !!log.completed;
                if (isSetDone) completedSets++;
                setsHtml += TimedSetRow(tid, i, log, isSetDone, utils);
            }
            addSetBtn = AddSetButton(tid, utils);
        } else {
            completedSets = logs[0]?.completed ? 1 : 0;
            setsHtml = SimpleTaskBtn(tid, completedSets > 0, utils);
        }

        return { setsHtml, completedSets, addSetBtn };
    }
}

export default TrainingView;
