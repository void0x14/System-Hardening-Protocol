(function(window) {
    'use strict';

    if (typeof window.Renderers === 'undefined') {
        window.Renderers = {};
    }

    Renderers.training = async function() {
        const day = new Date().getDay();
        const plan = WEEKLY_PLAN[day];
        const done = await Store.getWorkout(Utils.dateStr());
        const workoutData = await Store.getWorkoutData(Utils.dateStr());
        const btnClass = "bg-gray-800 hover:bg-neon-blue hover:text-black text-neon-blue border border-neon-blue font-bold py-3 px-6 rounded transition w-full mb-6 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,243,255,0.2)]";

        return `<div class="animate-slide-up">
            <div class="flex justify-between items-end mb-6 border-b border-gray-800 pb-4">
                <div><h2 class="text-3xl font-header font-bold text-white">${plan.name}</h2><div class="text-neon-green tracking-widest text-xs mt-1">${plan.title}</div></div>
                <div class="text-xl font-mono text-white">0${day}</div>
            </div>
            <button onclick="Actions.openWarmup()" class="${btnClass}"><i class="fas fa-fire animate-pulse"></i> SYSTEM BOOT (ISINMA)</button>
            <div class="space-y-4">
                ${plan.tasks.map(tid => {
            const ex = DB.EXERCISES[tid];
            if (!ex) return '';
            const isDone = done.includes(tid);
            const logs = workoutData[tid] || [];

            const trackingType = ex.trackingType || 'weighted';
            const targetSets = ex.sets || 3;
            const intensityHints = ex.intensityHints || [];

            let setsHtml = '';
            let completedSets = 0;

            if (trackingType === 'weighted') {
                for (let i = 0; i < targetSets; i++) {
                    const log = logs[i] || {};
                    const isSetDone = !!log.completed;
                    if (isSetDone) completedSets++;
                    setsHtml += Components.weightedSetRow(tid, i, log, isSetDone, intensityHints[i] || '');
                }
            } else if (trackingType === 'timed') {
                for (let i = 0; i < targetSets; i++) {
                    const log = logs[i] || {};
                    const isSetDone = !!log.completed;
                    if (isSetDone) completedSets++;
                    setsHtml += Components.timedSetRow(tid, i, log, isSetDone);
                }
            } else {
                completedSets = isDone ? 1 : 0;
                setsHtml = Components.simpleTaskBtn(tid, isDone);
            }

            const totalForProgress = (trackingType === 'duration' || trackingType === 'activity' || trackingType === 'task') ? 1 : targetSets;
            const progressPercent = totalForProgress > 0 ? Math.round((completedSets / totalForProgress) * 100) : 0;

            const typeLabel = trackingType === 'weighted' ? `${targetSets} Set` :
                trackingType === 'timed' ? `${targetSets} Set` :
                    trackingType === 'duration' ? 'Süre' :
                        trackingType === 'activity' ? 'Aktivite' : 'Görev';

            return `
                        <div class="bg-gray-900 border-2 ${isDone ? 'border-neon-green shadow-[0_0_15px_rgba(0,255,65,0.15)]' : 'border-gray-700'} rounded-xl overflow-hidden transition-all">
                            <div class="p-4 cursor-pointer hover:bg-gray-800/50 flex justify-between items-center" onclick="Actions.toggleExerciseBody('${tid}')">
                                <div class="flex items-center gap-3">
                                    <div class="w-3 h-3 rounded-full ${isDone ? 'bg-neon-green shadow-[0_0_8px_rgba(0,255,65,0.5)]' : 'bg-gray-600'} transition-all"></div>
                                    <div>
                                        <div class="font-bold text-white text-base">${ex.title}</div>
                                        <div class="text-xs text-gray-500 mt-0.5">
                                            <span class="${progressPercent === 100 ? 'text-neon-green' : progressPercent > 0 ? 'text-neon-blue' : ''}">%${progressPercent}</span> |
                                            ${typeLabel} | ${(typeof Stealth !== 'undefined' && Stealth.active ? Stealth.filterTags(ex.tags) : ex.tags).join(', ')}
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
                                    <button onclick="event.stopPropagation(); Actions.showExercise('${tid}')" class="flex-shrink-0 w-12 h-12 rounded-xl bg-neon-blue/10 hover:bg-neon-blue/30 border-2 border-neon-blue/50 text-neon-blue flex items-center justify-center transition-all hover:scale-105" title="Detaylı Bilgi & PR">
                                        <i class="fas fa-info-circle text-lg"></i>
                                    </button>
                                </div>
                                <div class="space-y-3">
                                    ${setsHtml}
                                </div>
                            </div>
                        </div>`;
        }).join('')}
            </div>
        </div>`;
    }
})(window);
