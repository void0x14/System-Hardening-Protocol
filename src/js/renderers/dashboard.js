// renderers/dashboard.js - Main Renderers Namespace
// Contains: dashboard, training, nutrition, progress, anatomy, mental
// Extracted from original index.html lines 2257-2993

// Using window. for global scope access
const toSafeNumber = (value, fallback = 0, min = 0, max = Number.MAX_SAFE_INTEGER) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(max, Math.max(min, parsed));
};

const toSafeText = (value, maxLength = 160) => {
    if (value === null || value === undefined) return '';
    return Utils.escapeHtml(String(value).slice(0, maxLength));
};

const isIsoDateKey = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const Renderers = window.Renderers = {
    async dashboard() {
        const today = Utils.dateStr();

        // 1. DATA GATHERING
        const currentWeight = toSafeNumber(Store.state.weight, CONFIG.TARGETS.START, 20, 500);
        const startWeight = CONFIG.TARGETS.START;
        const goalWeight = CONFIG.TARGETS.GOAL;
        const weightProgress = Math.min(100, Math.max(0, ((currentWeight - startWeight) / (goalWeight - startWeight)) * 100));

        const streak = await Store.getStreak();
        const workoutData = await Store.getWorkout(today);
        const mealsData = await Store.getMeals(today);
        const sleepHours = await Store.getSleep(today);
        const water = await Store.getWater(today);
        const fuelDone = Store.state.fuelDate === today;

        const safeStreak = Math.trunc(toSafeNumber(streak, 0, 0, 10000));
        const safeSleepHours = toSafeNumber(sleepHours, 0, 0, 24);
        const safeWater = Math.round(toSafeNumber(water, 0, 0, 50));

        const dayIdx = new Date().getDay();
        const dailyPlan = WEEKLY_PLAN[dayIdx];
        const totalTasks = dailyPlan ? dailyPlan.tasks.length : 0;
        const completedTasks = workoutData.length;

        const totalProtein = mealsData.reduce((sum, m) => sum + m.prot, 0);
        const totalCal = mealsData.reduce((sum, m) => sum + m.cal, 0);
        const targetProtein = CONFIG.TARGETS.PROT;
        const targetCal = CONFIG.TARGETS.CAL;

        const isTrainingDone = totalTasks > 0 && completedTasks >= totalTasks;
        const isProteinDone = totalProtein >= targetProtein;
        const isSleepDone = safeSleepHours >= 7;

        const heatmapHTML = await this.getHeatmapHTML();

        // 2. RENDER HTML (Hybrid Card Architecture)
        return `
            <div class="animate-slide-up space-y-6">
                <!-- TOP ROW: SYSTEM INTEGRITY & STREAK -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    <!-- 1. SYSTEM INTEGRITY (Circular Progress) -->
                    <div class="${THEME.card} relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
                        <div class="absolute inset-0 bg-gradient-to-b from-neon-green/5 to-transparent"></div>
                        <div class="${THEME.label} z-10 w-full text-center">SYSTEM INTEGRITY</div>

                        <div class="relative z-10">
                            <svg viewBox="0 0 36 36" class="circular-chart w-48 h-48">
                                <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#1a1a22" />
                                <path class="circle" stroke="${weightProgress >= 100 ? '#00ff41' : '#00f3ff'}" stroke-dasharray="${weightProgress}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <div class="absolute inset-0 flex flex-col items-center justify-center">
                                <div class="text-4xl font-black text-white font-mono tracking-tighter">${currentWeight}<span class="text-lg text-gray-500">kg</span></div>
                                <div class="text-[10px] text-neon-blue mt-1 font-mono">GOAL: ${goalWeight}</div>
                            </div>
                        </div>

                        <button ${Utils.actionAttrs('openWeightModal')} class="mt-6 z-10 text-[10px] border border-gray-700 hover:border-neon-green text-gray-400 hover:text-white px-3 py-1 rounded transition-colors uppercase tracking-wider">
                            [ UPDATE SENSOR ]
                        </button>
                    </div>

                    <!-- 2. UPTIME HISTORY (Streak + Heatmap) -->
                    <div class="${THEME.card} flex flex-col justify-between min-h-[200px]">
                        <div>
                            <div class="${THEME.label}">UPTIME STREAK</div>
                            <div class="flex items-baseline gap-2 mb-4">
                                <div class="text-5xl font-header font-black ${safeStreak > 0 ? 'text-neon-green' : 'text-gray-500'} leading-none">${safeStreak}</div>
                                <div class="text-xs text-text-muted uppercase tracking-wider">GÜN</div>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <div class="flex justify-between items-end">
                                <div class="text-[9px] text-gray-500 font-bold">SON 28 GÜN</div>
                                <div class="text-[9px] text-neon-green font-bold">CONSISTENCY</div>
                            </div>
                            <div class="heatmap-grid bg-black/20 p-2 rounded border border-gray-800">
                                ${heatmapHTML}
                            </div>
                        </div>
                    </div>

                    <!-- 3. DAILY PROTOCOL STATUS -->
                    <div class="${THEME.card}">
                        <div class="${THEME.label}">DAILY PROTOCOL</div>
                        <div class="space-y-4 mt-2">
                            <!-- Training -->
                            <div class="p-3 bg-surface-raised rounded-lg border-l-2 ${isTrainingDone ? 'border-neon-green' : 'border-neon-red'}">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-xs font-bold text-gray-300">ANTRENMAN</span>
                                    ${isTrainingDone ? '<i class="fas fa-check text-neon-green"></i>' : '<i class="fas fa-times text-neon-red"></i>'}
                                </div>
                                <div class="text-[10px] text-gray-500 font-mono">${completedTasks}/${totalTasks} Görev</div>
                            </div>

                            <!-- Nutrition -->
                            <div class="p-3 bg-surface-raised rounded-lg border-l-2 ${isProteinDone ? 'border-neon-green' : 'border-accent-orange'}">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-xs font-bold text-gray-300">PROTEİN</span>
                                    ${isProteinDone ? '<i class="fas fa-check text-neon-green"></i>' : '<span class="text-accent-orange text-[10px] font-bold">EKSİK</span>'}
                                </div>
                                <div class="text-[10px] text-gray-500 font-mono">${Math.round(totalProtein)} / ${targetProtein}g</div>
                            </div>

                            <!-- Sleep -->
                            <div class="p-3 bg-surface-raised rounded-lg border-l-2 ${isSleepDone ? 'border-neon-green' : 'border-gray-600'} cursor-pointer hover:bg-surface-hover transition-all" ${Utils.actionAttrs('openSleepModal')}>
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-xs font-bold text-gray-300">UYKU</span>
                                    <span class="text-[10px] font-mono ${isSleepDone ? 'text-neon-green' : 'text-gray-500'}">${safeSleepHours} Saat</span>
                                </div>
                                <div class="text-[9px] text-gray-600">Kaydetmek icin tikla</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- MIDDLE ROW: RESTORED TRACKERS (Water & Fuel) -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- HYDRATION MONITOR -->
                    <div class="${THEME.card}">
                        <div class="flex justify-between items-start mb-4">
                            <div class="${THEME.label}">HYDRATION LEVEL</div>
                            <i class="fas fa-tint text-neon-blue"></i>
                        </div>
                        <div class="flex items-end justify-between">
                            <div>
                                <div class="text-4xl font-bold ${safeWater >= CONFIG.TARGETS.WATER ? 'text-neon-blue' : 'text-white'}">
                                    ${safeWater} <span class="text-lg text-gray-500">/ ${CONFIG.TARGETS.WATER}</span>
                                </div>
                                <div class="w-32 bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                                    <div class="h-full bg-neon-blue transition-all" style="width: ${Math.min(100, (safeWater / CONFIG.TARGETS.WATER) * 100)}%"></div>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <button ${Utils.actionAttrs('addWater', [-1])} class="w-10 h-10 rounded border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white transition flex items-center justify-center font-bold text-lg">-</button>
                                <button ${Utils.actionAttrs('addWater', [1])} class="w-10 h-10 rounded bg-neon-blue/20 hover:bg-neon-blue text-neon-blue hover:text-black transition flex items-center justify-center font-bold text-lg">+</button>
                            </div>
                        </div>
                    </div>

                    <!-- FUEL & ENERGY -->
                    <div class="${THEME.card} ${!fuelDone ? 'border-neon-red/30' : ''}">
                        <div class="flex justify-between items-start mb-4">
                            <div class="${THEME.label}">FUEL & ENERGY</div>
                            <i class="fas fa-gas-pump ${!fuelDone ? 'text-neon-red animate-pulse' : 'text-neon-green'}"></i>
                        </div>

                        <!-- Calorie Tracker -->
                        <div class="mb-4">
                            <div class="flex justify-between items-end mb-1">
                                <span class="text-xs text-gray-400 font-bold">ENERGY LEVEL</span>
                                <span class="text-white font-bold text-sm font-mono">${totalCal} / ${targetCal} kcal</span>
                            </div>
                            <div class="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                <div class="h-full ${totalCal >= targetCal ? 'bg-neon-green' : 'bg-accent-orange'} transition-all" style="width: ${Math.min(100, (totalCal / targetCal) * 100)}%"></div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-xl font-bold text-white">GAINER SHAKE</div>
                                <div class="text-[10px] text-gray-500 mt-1">Süt + Yulaf + Fıstık + Muz</div>
                            </div>
                            <button ${Utils.actionAttrs('injectFuel')} class="px-4 py-2 rounded-lg font-bold text-xs uppercase transition-all tracking-wider ${fuelDone ? 'bg-neon-green text-black' : 'bg-neon-red text-white hover:bg-red-600'}">
                                ${fuelDone ? 'INJECTED' : 'INJECT NOW'}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- BOTTOM: SYSTEM CHECK -->
                <div class="grid grid-cols-1">
                    <button ${Utils.actionAttrs('completeDailyMission')} class="${THEME.card} group hover:border-neon-green/50 flex items-center justify-center p-4 cursor-pointer transition-all hover:bg-neon-green/5">
                        <i class="fas fa-check-circle text-2xl text-gray-600 group-hover:text-neon-green transition-colors mr-4"></i>
                        <div class="text-center">
                            <div class="text-white font-bold text-sm tracking-widest">SYSTEM CHECK: COMPLETE DAY</div>
                            <div class="text-[10px] text-gray-500 font-mono">ALL TASKS DONE</div>
                        </div>
                    </button>
                </div>
            </div>
        `;
    },

    async getHeatmapHTML() {
        let html = '';
        const today = new Date();
        // 28 days (4 rows of 7)
        for (let i = 27; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dy = d.getFullYear();
            const dm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const dateStr = `${dy}-${dm}-${dd}`;

            const workout = await Store.getWorkout(dateStr);

            // Calculate level based on task completion (0-3 scale)
            const dayOfWeek = d.getDay();
            const dayPlan = WEEKLY_PLAN[dayOfWeek];
            const totalDayTasks = dayPlan ? dayPlan.tasks.length : 1;
            let level = 0;
            if (workout.length > 0) {
                const percent = workout.length / totalDayTasks;
                if (percent >= 0.75) level = 3;
                else if (percent >= 0.5) level = 2;
                else level = 1;
            }

            // Checking if date is future
            const isFuture = d > new Date();
            const colorClass = isFuture ? 'opacity-0' : level === 0 ? 'opacity-50' : `active-${level}`;

            html += `<div class="heatmap-cell ${colorClass}" title="${dateStr}"></div>`;
        }
        return html;
    },

    async training() {
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
            <button ${Utils.actionAttrs('openWarmup')} class="${btnClass}"><i class="fas fa-fire animate-pulse"></i> SYSTEM BOOT (ISINMA)</button>
            <div class="space-y-4">
                ${plan.tasks.map(tid => {
            const ex = DB.EXERCISES[tid];
            if (!ex) return '';
            const isDone = done.includes(tid);
            const logs = workoutData[tid] || [];

            const trackingType = ex.trackingType || 'weighted';
            const defaultSets = ex.sets || 3;
            // v8.3.0: Dynamic set count - use logs length if exists, else defaults
            const targetSets = logs.length > 0 ? logs.length : defaultSets;
            const intensityHints = ex.intensityHints || [];

            let setsHtml = '';
            let completedSets = 0;
            let addSetBtn = ''; // Add Set button HTML

            if (trackingType === 'weighted') {
                for (let i = 0; i < targetSets; i++) {
                    const log = logs[i] || {};
                    const isSetDone = !!log.completed;
                    if (isSetDone) completedSets++;
                    setsHtml += Components.weightedSetRow(tid, i, log, isSetDone, intensityHints[i] || '');
                }
                // Add Set button for weighted exercises
                addSetBtn = `<button ${Utils.actionAttrs('addSet', [tid])}
                    class="w-full mt-3 py-3 rounded-xl border-2 border-dashed border-gray-700 bg-gray-800/30 text-gray-400 hover:border-neon-blue hover:text-neon-blue hover:bg-neon-blue/10 transition-all font-bold text-sm flex items-center justify-center gap-2">
                    <i class="fas fa-plus"></i> SET EKLE
                </button>`;
            } else if (trackingType === 'timed') {
                for (let i = 0; i < targetSets; i++) {
                    const log = logs[i] || {};
                    const isSetDone = !!log.completed;
                    if (isSetDone) completedSets++;
                    setsHtml += Components.timedSetRow(tid, i, log, isSetDone);
                }
                // Add Set button for timed exercises
                addSetBtn = `<button ${Utils.actionAttrs('addSet', [tid])}
                    class="w-full mt-3 py-3 rounded-xl border-2 border-dashed border-gray-700 bg-gray-800/30 text-gray-400 hover:border-neon-blue hover:text-neon-blue hover:bg-neon-blue/10 transition-all font-bold text-sm flex items-center justify-center gap-2">
                    <i class="fas fa-plus"></i> SET EKLE
                </button>`;
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
                            <div class="p-4 cursor-pointer hover:bg-gray-800/50 flex justify-between items-center" ${Utils.actionAttrs('toggleExerciseBody', [tid])}>
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
                                    <button ${Utils.actionAttrs('showExercise', [tid], { stopPropagation: true })} class="flex-shrink-0 w-12 h-12 rounded-xl bg-neon-blue/10 hover:bg-neon-blue/30 border-2 border-neon-blue/50 text-neon-blue flex items-center justify-center transition-all hover:scale-105" title="Detaylı Bilgi & PR">
                                        <i class="fas fa-info-circle text-lg"></i>
                                    </button>
                                </div>
                                <div class="space-y-3">
                                    ${setsHtml}
                                    ${addSetBtn}
                                </div>
                            </div>
                        </div>`;
        }).join('')}
            </div>
        </div>`;
    },

    async nutrition() {
        const meals = await Store.getMeals(Utils.dateStr());
        let t = { c: 0, p: 0, carb: 0, f: 0 };

        // Calculate totals and build meal list using new component
        const list = meals.map((m, idx) => {
            t.c += m.cal; t.p += m.prot; t.carb += m.carb; t.f += m.fat;
            return Components.mealCard(m, idx);
        }).join('') || `
            <div class="text-center text-gray-600 py-8 border-2 border-dashed border-gray-800 rounded-xl">
                <i class="fas fa-utensils text-3xl mb-3 text-gray-700"></i>
                <div class="font-bold">HENÜZ YAKIT GİRİLMEDİ</div>
                <span class="text-[10px] text-neon-red">SİSTEM ZAYIFLIYOR!</span>
            </div>`;

        // Status feedback
        const targetCal = CONFIG.TARGETS.CAL;
        const calPercent = Math.round((t.c / targetCal) * 100);

        let statusBox = "";
        if (t.c < targetCal * 0.5) {
            statusBox = `<div class="p-3 border-2 border-red-600 bg-red-900/20 rounded-lg text-center">
                <div class="text-red-500 font-bold"><i class="fas fa-skull mr-2"></i>KRİTİK: ${100 - calPercent}% eksik</div>
            </div>`;
        } else if (t.c < targetCal) {
            statusBox = `<div class="p-3 border-2 border-yellow-600 bg-yellow-900/20 rounded-lg text-center">
                <div class="text-yellow-500 font-bold"><i class="fas fa-exclamation-triangle mr-2"></i>${targetCal - t.c} kcal daha lazım</div>
            </div>`;
        } else {
            statusBox = `<div class="p-3 border-2 border-neon-green bg-green-900/20 rounded-lg text-center">
                <div class="text-neon-green font-bold"><i class="fas fa-check-circle mr-2"></i>HEDEF TAMAMLANDI</div>
            </div>`;
        }

        // Quick add buttons (most common foods)
        const quickFoods = [
            { icon: 'fa-egg', name: 'Yumurta', id: 5 },
            { icon: 'fa-drumstick-bite', name: 'Tavuk', id: 1 },
            { icon: 'fa-bowl-rice', name: 'Pilav', id: 20 },
            { icon: 'fa-bread-slice', name: 'Ekmek', id: 24 }
        ];
        const quickAddHtml = quickFoods.map(f => `
            <button ${Utils.actionAttrs('quickAddMeal', [f.id])}
                class="flex flex-col items-center gap-1 p-3 bg-gray-900 hover:bg-neon-green/20 rounded-lg transition-all group">
                <i class="fas ${f.icon} text-lg text-gray-500 group-hover:text-neon-green"></i>
                <span class="text-[10px] text-gray-500 group-hover:text-white">${f.name}</span>
            </button>
        `).join('');

        // Daily plan
        const plan = Store.state.dailyPlan || {};
        let totalPlanCal = 0;
        ['breakfast', 'fuel', 'lunch', 'pre_workout', 'dinner', 'night'].forEach(k => {
            if (plan[k]) totalPlanCal += toSafeNumber(plan[k].kcal, 0, 0, 5000);
        });

        return `
        <div class="animate-slide-up space-y-6">
            <!-- Macro Rings Row -->
            <div class="${THEME.card}">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-[10px] text-gray-500 font-bold">GÜNLÜK MAKS TAKIP</span>
                    <span class="text-[10px] text-gray-500">${Utils.dateStr()}</span>
                </div>
                <div class="flex justify-around items-center py-4">
                    ${Components.macroRing('KALORİ', t.c, targetCal, '', '#00ff41', '90')}
                    ${Components.macroRing('PROTEİN', t.p, CONFIG.TARGETS.PROT, 'g', '#00f3ff', '70')}
                    ${Components.macroRing('KARB', t.carb, CONFIG.TARGETS.CARB, 'g', '#ff6b35', '70')}
                    ${Components.macroRing('YAĞ', t.f, CONFIG.TARGETS.FAT, 'g', '#ffed4a', '70')}
                </div>
                ${statusBox}
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Left Column: Quick Add + Meal List -->
                <div class="space-y-4">
                    <!-- Quick Add Section -->
                    <div class="${THEME.card}">
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-[10px] text-gray-500 font-bold">⚡ HIZLI EKLE</span>
                        </div>
                        <div class="grid grid-cols-4 gap-2 mb-4">
                            ${quickAddHtml}
                        </div>
                        <button ${Utils.actionAttrs('openMealModal')} class="${THEME.btn} w-full">
                            <i class="fas fa-plus mr-2"></i>ÖĞÜN EKLE
                        </button>
                    </div>

                    <!-- Meal List -->
                    <div class="${THEME.card}">
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-[10px] text-gray-500 font-bold">BUGÜNKÜ YAKITLAR (${meals.length})</span>
                            <span class="text-neon-green font-bold text-sm">${t.c} kcal</span>
                        </div>
                        <div class="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2">
                            ${list}
                        </div>
                    </div>
                </div>

                <!-- Right Column: Daily Plan -->
                <div class="${THEME.card}">
                    <div class="flex justify-between mb-4 items-center">
                        <span class="text-[10px] text-gray-500 font-bold">📋 GÜNLÜK PLAN (${totalPlanCal} kcal)</span>
                        <button ${Utils.actionAttrs('rerollPlan')} class="text-xs text-neon-blue hover:text-white font-bold">
                            <i class="fas fa-sync-alt mr-1"></i>YENİLE
                        </button>
                    </div>
                    <div class="space-y-3">
                        ${['breakfast', 'fuel', 'lunch', 'pre_workout', 'dinner', 'night'].map(k => {
            const times = { breakfast: '08:00', fuel: '11:00', lunch: '14:00', pre_workout: '17:00', dinner: '19:00', night: '23:00' };
            const icons = { breakfast: 'fa-sun', fuel: 'fa-bolt', lunch: 'fa-utensils', pre_workout: 'fa-dumbbell', dinner: 'fa-moon', night: 'fa-bed' };
            const labels = { breakfast: 'Kahvaltı', fuel: 'Ara Öğün', lunch: 'Öğle', pre_workout: 'Antrenman Öncesi', dinner: 'Akşam', night: 'Gece' };
            const meal = plan[k];
            return `
                            <div class="flex items-center gap-3 p-2 rounded-lg ${meal ? 'bg-gray-900/50' : 'bg-gray-900/20 opacity-50'}">
                                <div class="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                                    <i class="fas ${icons[k]} text-xs text-gray-500"></i>
                                </div>
                                <div class="flex-1">
                                    <div class="text-[10px] text-gray-500">${times[k]} - ${labels[k]}</div>
                                    <div class="text-sm text-white font-bold">${meal ? toSafeText(meal.text, 120) : '...'}</div>
                                </div>
                                ${meal ? `<span class="text-[10px] text-neon-green">${toSafeNumber(meal.kcal, 0, 0, 5000)} kcal</span>` : ''}
                            </div>`;
        }).join('')}
                    </div>
                </div>
            </div>
        </div>`;
    },

    async progress() {
        const hist = await Store.getHistory();
        const statsData = await Store.getStats();
        const volStats = await Store.getVolumeStats();
        const stats = statsData.current || {};
        const measureHistory = statsData.history || [];
        const dates = Object.keys(hist).filter(date => isIsoDateKey(date)).sort().slice(-7);
        const volDates = Object.keys(volStats.daily).sort();
        const weeklySummary = await Store.getWeeklySummary();
        const sleepStats = await Store.getSleepStats();
        const waterStats = await Store.getWaterStats();
        const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

        let weightBars = '', dateLabels = '', weightHistoryTable = '';

        if (dates.length > 0) {
            weightBars = dates.map(d => {
                const safeWeight = toSafeNumber(hist[d], CONFIG.TARGETS.START, 20, 500);
                const h = ((safeWeight - CONFIG.TARGETS.START) / (CONFIG.TARGETS.GOAL - CONFIG.TARGETS.START)) * 70 + 15;
                return `<div class="flex-1 flex flex-col items-center"><div class="text-[9px] text-neon-green font-bold mb-1">${safeWeight}</div><div class="w-full bg-gray-800 hover:bg-neon-green/50 rounded-t transition-all" style="height:${h}%"></div></div>`;
            }).join('');

            dateLabels = dates.map((d, i) => {
                const parts = d.split('-');
                const day = parts[2];
                const monthIdx = parseInt(parts[1]) - 1;
                const showMonth = (i === 0 || i === dates.length - 1);
                return `<div class="flex-1 text-center text-[8px] text-gray-500">${day}${showMonth ? ' ' + months[monthIdx] : ''}</div>`;
            }).join('');
        } else {
            weightBars = '<div class="text-gray-600 text-xs w-full text-center self-center flex flex-col items-center justify-center h-full"><i class="fas fa-weight text-3xl mb-2 opacity-30"></i><span>Veri yok</span></div>';
        }

        let volumeChart = '';
        if (volStats.weekly > 0) {
            const maxVol = Math.max(...Object.values(volStats.daily), 1);
            volumeChart = volDates.map(d => {
                const val = volStats.daily[d] || 0;
                const h = (val / maxVol) * 80;
                const parts = d.split('-');
                const day = parts[2];
                return `<div class="flex-1 flex flex-col items-center group"><div class="text-[8px] text-neon-blue font-bold mb-1 opacity-0 group-hover:opacity-100 transition">${val > 0 ? Math.round(val) : ''}</div><div class="w-full bg-gray-800 hover:bg-neon-blue/60 rounded-t transition-all" style="height:${Math.max(5, h)}%"></div><div class="text-[8px] text-gray-500 mt-1">${day}</div></div>`;
            }).join('');
        } else {
            volumeChart = '<div class="text-gray-600 text-xs w-full text-center flex flex-col items-center justify-center h-full"><i class="fas fa-dumbbell text-3xl mb-2 opacity-30"></i><span>Henüz antrenman verisi yok</span></div>';
        }

        const labels = { chest: 'GÖĞÜS', arm: 'KOL', waist: 'BEL', leg: 'BACAK' };
        const safeStatValue = (value) => {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? String(parsed) : '';
        };
        const measurementInputs = ['chest', 'arm', 'waist', 'leg'].map(k => `
            <div class="bg-surface-raised p-3 rounded-lg">
                <label class="text-[10px] text-gray-500 font-bold uppercase block mb-2">${labels[k]}</label>
                <input type="number" id="stat-${k}" value="${safeStatValue(stats[k])}" placeholder="cm" class="${THEME.input} text-center text-lg font-bold">
            </div>
        `).join('');

        const isSanitized = typeof Stealth !== 'undefined' && Stealth.active;
        const summaryGridClass = isSanitized ? 'flex flex-wrap justify-center gap-3' : 'grid grid-cols-3 md:grid-cols-6 gap-3';

        return `
            <div class="space-y-6 animate-slide-up">
            <!-- SUMMARY ROW -->
            <div class="${summaryGridClass}">
                <div class="${THEME.card} text-center py-3 ${isSanitized ? 'w-32 md:w-40' : ''}"><div class="text-[9px] text-gray-500 font-bold">MEVCUT</div><div class="text-xl font-bold text-white mt-1">${Store.state.weight} <span class="text-[10px] text-neon-green">kg</span></div></div>
                <div class="${THEME.card} text-center py-3 border-neon-green/30 ${isSanitized ? 'w-32 md:w-40' : ''}"><div class="text-[9px] text-neon-green font-bold">BUGÜN</div><div class="text-xl font-bold text-white mt-1">${Math.round(volStats.daily[Utils.dateStr()] || 0)} <span class="text-[10px] text-gray-500">kg</span></div></div>
                <div class="${THEME.card} text-center py-3 border-neon-blue/30 ${isSanitized ? 'w-32 md:w-40' : ''}"><div class="text-[9px] text-neon-blue font-bold">HAFTALIK</div><div class="text-xl font-bold text-white mt-1">${(volStats.weekly / 1000).toFixed(1)} <span class="text-[10px] text-gray-500">ton</span></div></div>
                <div class="${THEME.card} text-center py-3 border-accent-orange/30 ${isSanitized ? 'w-32 md:w-40' : ''}"><div class="text-[9px] text-accent-orange font-bold">AYLIK</div><div class="text-xl font-bold text-white mt-1">${(volStats.monthly / 1000).toFixed(1)} <span class="text-[10px] text-gray-500">ton</span></div></div>
                <div class="${THEME.card} text-center py-3 ${isSanitized ? 'w-32 md:w-40' : ''}"><div class="text-[9px] text-gray-500 font-bold">TOPLAM SET</div><div class="text-xl font-bold text-neon-blue mt-1">${volStats.totalSets}</div></div>
                <div class="${THEME.card} text-center py-3 sensitive-content"><div class="text-[9px] text-gray-500 font-bold">HEDEF</div><div class="text-xl font-bold text-neon-green mt-1">${CONFIG.TARGETS.GOAL} <span class="text-[10px]">kg</span></div></div>
            </div>

            <!-- SLEEP & WATER STATS -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="${THEME.card} text-center py-3 border-purple-500/30"><div class="text-[9px] text-purple-400 font-bold">😴 HAFTALIK UYKU</div><div class="text-xl font-bold text-white mt-1">${sleepStats.weekAvg} <span class="text-[10px] text-gray-500">saat/gün</span></div></div>
                <div class="${THEME.card} text-center py-3 border-purple-500/30"><div class="text-[9px] text-purple-400 font-bold">😴 AYLIK UYKU</div><div class="text-xl font-bold text-white mt-1">${sleepStats.monthAvg} <span class="text-[10px] text-gray-500">saat/gün</span></div></div>
                <div class="${THEME.card} text-center py-3 border-neon-blue/30"><div class="text-[9px] text-neon-blue font-bold">💧 HAFTALIK SU</div><div class="text-xl font-bold text-white mt-1">${waterStats.weekTotal} <span class="text-[10px] text-gray-500">bardak</span></div></div>
                <div class="${THEME.card} text-center py-3 border-neon-blue/30"><div class="text-[9px] text-neon-blue font-bold">💧 AYLIK SU</div><div class="text-xl font-bold text-white mt-1">${waterStats.monthTotal} <span class="text-[10px] text-gray-500">bardak</span></div></div>
            </div>

            <!-- VOLUME ANALYSIS -->
            <div class="${THEME.card}">
                <div class="flex justify-between items-center mb-4">
                    <div><span class="text-neon-blue font-bold text-sm">ANTRENMAN HACMİ</span><span class="text-[10px] text-gray-500 ml-2">Son 7 Gün</span></div>
                    <div class="text-xs text-gray-500">${volStats.weekly > 0 ? `Toplam: ${(volStats.weekly / 1000).toFixed(2)} ton` : ''}</div>
                </div>
                <div class="flex items-end gap-1 h-28">${volumeChart}</div>
            </div>
            
            <!-- WEEKLY SUMMARY -->
            <div class="${THEME.card}">
                <div class="${THEME.label}">📅 HAFTALIK ÖZET (Son 4 Hafta)</div>
                <div class="overflow-x-auto mt-4">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="text-gray-500 text-xs border-b border-gray-800">
                                <th class="text-left py-2">Hafta</th>
                                <th class="text-center py-2">Ort. Kalori</th>
                                <th class="text-center py-2">Antrenman</th>
                                <th class="text-right py-2">Kilo Δ</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${weeklySummary.map((w, i) => `
                                <tr class="border-b border-gray-800/50 ${i === 0 ? 'bg-gray-800/30' : ''}">
                                    <td class="py-2 ${i === 0 ? 'text-neon-green font-bold' : 'text-gray-400'}">${i === 0 ? 'Bu Hafta' : i === 1 ? 'Geçen Hafta' : `${w.week}. Hafta Önce`}</td>
                                    <td class="text-center py-2 font-mono ${w.avgCal >= CONFIG.TARGETS.CAL ? 'text-neon-green' : w.avgCal > 0 ? 'text-accent-orange' : 'text-gray-600'}">${w.avgCal > 0 ? w.avgCal : '-'}</td>
                                    <td class="text-center py-2">${w.workoutDays > 0 ? `<span class="text-neon-blue font-bold">${w.workoutDays}</span> gün` : '<span class="text-gray-600">-</span>'}</td>
                                    <td class="text-right py-2 font-mono ${w.weightChange > 0 ? 'text-neon-green' : w.weightChange < 0 ? 'text-neon-red' : 'text-gray-500'}">${w.weightChange !== null ? (w.weightChange > 0 ? '+' : '') + w.weightChange + ' kg' : '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- WEIGHT HISTORY -->
                <div class="${THEME.card} flex flex-col">
                    <span class="text-[10px] text-gray-500 font-bold mb-2">AĞIRLIK GEÇMİŞİ (Son 7 Gün)</span>
                    <div class="flex items-end gap-1 h-32 border-b border-gray-800">${weightBars}</div>
                    <div class="flex gap-1 mt-1">${dateLabels}</div>
                </div>

                <!-- MEASUREMENTS -->
                <div class="${THEME.card}">
                    <div class="flex justify-between mb-4 items-center">
                        <span class="text-[10px] text-gray-500 font-bold block">ÖLÇÜLER (CM)</span>
                        <button ${Utils.actionAttrs('saveStats')} class="bg-neon-green/20 hover:bg-neon-green text-neon-green hover:text-black text-xs font-bold px-4 py-2 rounded-lg transition-all">
                            <i class="fas fa-save mr-1"></i>KAYDET
                        </button>
                    </div>
                    <div class="grid grid-cols-2 gap-3">${measurementInputs}</div>
                </div>
            </div>
        </div>`;
    },

    async anatomy() {
        const view = UI.activeView;
        const isSanitized = typeof Stealth !== 'undefined' && Stealth.active;

        // Pelvik üçgeni sanitize modda gizle
        const pelvicPath = isSanitized ? '' : `<path d="M85,158 L115,158 L100,183 Z" fill="#ff003c" opacity="0.5" ${Utils.actionAttrs('selectMuscle', ['pelvic'])} class="cursor-pointer hover:opacity-100"></path>`;

        const paths = {
            front: `<path d="M60,50 Q100,70 140,50 L135,90 Q100,100 65,90 Z" class="muscle-path" ${Utils.actionAttrs('selectMuscle', ['chest'])}></path><rect x="80" y="95" width="40" height="55" rx="5" class="muscle-path" ${Utils.actionAttrs('selectMuscle', ['abs'])}></rect><path d="M65,160 L90,160 L85,240 L60,240 Z" class="muscle-path" ${Utils.actionAttrs('selectMuscle', ['quads'])}></path><path d="M110,160 L135,160 L140,240 L115,240 Z" class="muscle-path" ${Utils.actionAttrs('selectMuscle', ['quads'])}></path><ellipse cx="45" cy="70" rx="10" ry="20" class="muscle-path" ${Utils.actionAttrs('selectMuscle', ['biceps'])}></ellipse><ellipse cx="155" cy="70" rx="10" ry="20" class="muscle-path" ${Utils.actionAttrs('selectMuscle', ['biceps'])}></ellipse>${pelvicPath}`,
            back: `<path d="M70,40 L100,20 L130,40 L100,60 Z" class="muscle-path" ${Utils.actionAttrs('selectMuscle', ['traps'])}></path><path d="M60,60 L40,100 L100,125 L160,100 L140,60 L100,60 Z" class="muscle-path" ${Utils.actionAttrs('selectMuscle', ['lats'])}></path><rect x="85" y="128" width="30" height="22" class="muscle-path" ${Utils.actionAttrs('selectMuscle', ['lowerback'])}></rect><path d="M70,150 Q100,170 130,150 L130,190 Q100,210 70,190 Z" class="muscle-path" ${Utils.actionAttrs('selectMuscle', ['glutes'])}></path><rect x="75" y="200" width="20" height="60" class="muscle-path" ${Utils.actionAttrs('selectMuscle', ['hamstrings'])}></rect><rect x="105" y="200" width="20" height="60" class="muscle-path" ${Utils.actionAttrs('selectMuscle', ['hamstrings'])}></rect>`
        };

        // Sanitize modda pelvik seçiliyse temizle
        let selectedMuscle = Store.state.selectedMuscle;
        if (isSanitized && selectedMuscle === 'pelvic') {
            selectedMuscle = null;
            Store.state.selectedMuscle = null;
        }

        const sel = selectedMuscle ? DB.ANATOMY_DB[selectedMuscle] : null;

        // Hassas metinleri filtrele
        let displayFunction = sel ? sel.function : '';
        let displaySystem = sel ? sel.system : '';
        if (isSanitized && sel) {
            // Hassas kelimeleri kaldır
            const sensitiveWords = ['cinsel', 'Cinsel', 'boşalma', 'Boşalma', 'üreme', 'Üreme', 'piston'];
            sensitiveWords.forEach(word => {
                displayFunction = displayFunction.replace(new RegExp(word + '[^,\\.]*[,\\.]?\\s*', 'gi'), '');
            });
            displayFunction = displayFunction.replace(/,\s*$/, '.').replace(/\s+/g, ' ').trim();
            if (displaySystem.toLowerCase().includes('üreme')) displaySystem = 'Core Destek';
        }

        return `<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up h-full"><div class="${THEME.card} flex flex-col items-center justify-center anatomy-grid min-h-[400px] relative"><div class="absolute top-4 left-4 flex gap-2"><button ${Utils.actionAttrs('setAnatomyView', ['front'])} class="px-4 py-2 text-xs font-bold border ${view === 'front' ? 'border-neon-green text-neon-green bg-neon-green/10' : 'border-gray-700 text-gray-500 hover:border-gray-500'} rounded-lg transition-all">ÖN</button><button ${Utils.actionAttrs('setAnatomyView', ['back'])} class="px-4 py-2 text-xs font-bold border ${view === 'back' ? 'border-neon-green text-neon-green bg-neon-green/10' : 'border-gray-700 text-gray-500 hover:border-gray-500'} rounded-lg transition-all">ARKA</button></div><div class="relative w-64 h-96"><svg viewBox="0 0 200 300" class="w-full h-full drop-shadow-[0_0_15px_rgba(0,255,65,0.1)]"><path d="M100,20 L120,25 L130,40 L160,45 L150,100 L160,150 L140,280 L130,290 L100,250 L70,290 L60,280 L40,150 L50,100 L40,45 L70,40 L80,25 Z" fill="#111" stroke="#333" stroke-width="2"/>${paths[view]}</svg></div></div><div class="${THEME.card} relative overflow-hidden"><div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-green to-neon-blue"></div><div class="${THEME.label} text-neon-blue mb-6">DIAGNOSTIC PANEL</div>${sel ? `<div class="space-y-6"><div class="mb-6"><h2 class="text-3xl md:text-4xl font-header font-bold text-white mb-2">${sel.name}</h2><div class="text-sm text-gray-400 font-mono tracking-wide">// ${displaySystem}</div></div><div class="grid gap-4"><div class="bg-surface-raised p-4 rounded-lg border-l-4 border-neon-green"><div class="${THEME.label} mb-2">GÖREV</div><div class="text-base text-gray-200">${displayFunction || 'Güç ve stabilizasyon.'}</div></div><div class="bg-surface-raised p-4 rounded-lg border-l-4 border-accent-orange"><div class="${THEME.label} mb-2">HARDENING PROTOCOL</div><div class="text-lg text-accent-orange font-bold font-mono">${sel.action}</div></div><div class="bg-surface-raised p-4 rounded-lg border border-gray-700/50"><div class="flex justify-between items-center"><div><div class="${THEME.label} mb-1">RECOVERY TIME</div><div class="text-xl text-neon-blue font-bold">${sel.recovery}</div></div><i class="fas fa-clock text-neon-blue/30 text-3xl"></i></div></div></div></div>` : '<div class="h-full flex flex-col items-center justify-center text-gray-600"><i class="fas fa-fingerprint text-6xl mb-6 opacity-30"></i><p class="text-sm uppercase tracking-widest">Kas Seçimi Bekleniyor...</p></div>'}</div></div>`;
    },

    async mental() {
        const phaseIcons = ['🐆', '🎭', '🤖', '🔧', '⚡', '🎯', '🍀', '🔄'];
        const mentalData = await Utils.storage.get(CONFIG.KEYS.MENTAL_PROGRESS) || { completedPhases: [], dailyPractice: {}, lastPracticeDate: null };
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        const todayPhaseIndex = dayOfYear % 8;
        const todayPhase = MENTAL_PHASES[todayPhaseIndex];
        const completedCount = mentalData.completedPhases?.length || 0;
        const progressPercent = Math.round((completedCount / 8) * 100);
        const allPractices = MENTAL_PHASES.flatMap((p, idx) => p.practice.map(pr => ({ text: pr, phaseId: p.id, icon: phaseIcons[idx] })));
        const dailyPractice = allPractices[dayOfYear % allPractices.length];
        const practiceKey = Utils.dateStr();
        const isPracticeDone = mentalData.dailyPractice?.[practiceKey] === true;

        const phaseCards = MENTAL_PHASES.map((p, idx) => {
            const icon = phaseIcons[idx];
            const isCompleted = mentalData.completedPhases?.includes(p.id);
            const isToday = idx === todayPhaseIndex;

            return `
                <div class="group relative bg-gradient-to-br ${isToday ? 'from-purple-900/40 to-gray-900' : 'from-gray-900 to-gray-800'} 
                    border-2 ${isToday ? 'border-neon-purple shadow-[0_0_20px_rgba(168,85,247,0.2)]' : isCompleted ? 'border-neon-green/50' : 'border-gray-700'}
                    rounded-2xl p-5 transition-all hover:border-neon-purple/80 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] cursor-pointer"
                    ${Utils.actionAttrs('showPhase', [p.id])}>
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
                <div class="bg-gradient-to-r from-purple-900/30 via-gray-900 to-pink-900/30 rounded-2xl p-6 border border-purple-500/30 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
                    <div class="relative z-10">
                        <div class="text-[10px] text-purple-400 font-bold tracking-widest mb-3">
                            <i class="fas fa-star mr-1"></i>GÜNÜN FAZI
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="text-5xl">${phaseIcons[todayPhaseIndex]}</div>
                            <div>
                                <div class="text-xl font-bold text-white">${todayPhase.title}</div>
                                <div class="text-sm text-gray-400 mt-1">${todayPhase.desc}</div>
                            </div>
                        </div>
                        <button ${Utils.actionAttrs('showPhase', [todayPhase.id])}
                            class="mt-4 px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-lg text-purple-300 text-sm font-bold hover:bg-purple-600/40 transition">
                            <i class="fas fa-book-open mr-2"></i>Fazı İncele
                        </button>
                    </div>
                </div>
                
                <!-- Günlük Pratik -->
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
                        <button ${Utils.actionAttrs('completeDailyPractice')}
                            class="mt-4 w-full py-3 bg-neon-green/10 border-2 border-neon-green text-neon-green font-bold rounded-xl hover:bg-neon-green hover:text-black transition-all">
                            <i class="fas fa-check mr-2"></i>Bunu Yaptım!
                        </button>
                    ` : ''}
                </div>
                
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
};

if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG_MODE) {
    console.log('[Renderers] All tab renderers loaded');
}
