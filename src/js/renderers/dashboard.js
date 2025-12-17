(function(window) {
    'use strict';

    if (typeof window.Renderers === 'undefined') {
        window.Renderers = {};
    }

    function protocolItem(title, value, progress, icon, isDone) {
        const colorClass = isDone ? 'text-neon-green' : 'text-gray-500';
        const bgClass = isDone ? 'bg-neon-green' : 'bg-gray-700';
        return `
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gray-900/50 flex items-center justify-center ${colorClass}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="flex-1">
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-bold text-white">${title}</span>
                        <span class="text-xs font-mono ${colorClass}">${value}</span>
                    </div>
                    <div class="w-full bg-gray-800 h-1 mt-1 rounded-full overflow-hidden">
                        <div class="h-full ${bgClass} transition-all" style="width: ${progress}%"></div>
                    </div>
                </div>
            </div>
        `;
    }

    Renderers.dashboard = async function() {
        const today = Utils.dateStr();
        const currentWeight = Store.state.weight;
        const startWeight = CONFIG.TARGETS.START;
        const goalWeight = CONFIG.TARGETS.GOAL;
        const weightProgress = Math.min(100, Math.max(0, ((currentWeight - startWeight) / (goalWeight - startWeight)) * 100));

        const workoutData = await Store.getWorkout(today);
        const mealsData = await Store.getMeals(today);
        const sleepHours = await Store.getSleep(today);

        const dayIdx = new Date().getDay();
        const dailyPlan = WEEKLY_PLAN[dayIdx];
        const totalTasks = dailyPlan ? dailyPlan.tasks.length : 0;
        const completedTasks = workoutData.length;

        const totalProtein = mealsData.reduce((sum, m) => sum + m.prot, 0);
        const totalCal = mealsData.reduce((sum, m) => sum + m.cal, 0);
        const targetProtein = CONFIG.TARGETS.PROT;
        const targetCal = CONFIG.TARGETS.CAL;

        const remainingCal = Math.max(0, targetCal - totalCal);
        const remainingProt = Math.max(0, Math.round(targetProtein - totalProtein));

        const isTrainingDone = totalTasks > 0 && completedTasks >= totalTasks;
        const isNutritionDone = totalCal >= targetCal;
        const isSleepDone = sleepHours >= 7;

        const trainingProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        const nutritionProgress = targetCal > 0 ? (Math.min(totalCal, targetCal) / targetCal) * 100 : 0;
        const sleepProgress = (Math.min(sleepHours, 7) / 7) * 100;

        return `
        <div class="animate-slide-up space-y-4 p-4" id="dashboard-content">
            <div class="flex justify-between items-center px-2">
                <h1 class="text-lg font-bold text-white font-header tracking-widest">SISTEM RAPORU</h1>
                <button onclick="App.renderTab('dashboard')" class="text-gray-500 hover:text-white transition">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </div>

            <div class="bg-surface-card rounded-lg flex flex-col items-center justify-center p-6 border border-gray-800">
                <div class="relative">
                    <svg viewBox="0 0 36 36" class="circular-chart w-40 h-40">
                        <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#1a1a22" stroke-width="2.5" />
                        <path class="circle" stroke="${weightProgress >= 100 ? '#00ff41' : '#00f3ff'}" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="${weightProgress}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                        <div class="text-4xl font-black text-white font-mono tracking-tighter">${currentWeight}<span class="text-base text-gray-500">kg</span></div>
                        <div class="text-[10px] text-neon-blue mt-1 font-mono">HEDEF: ${goalWeight}KG</div>
                    </div>
                </div>
                <button onclick="Actions.openWeightModal()" class="mt-4 text-xs border border-gray-700 hover:border-neon-green text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-colors uppercase tracking-wider">
                    GÜNCELLE
                </button>
            </div>

            <div class="bg-surface-card rounded-lg p-4 border border-gray-800">
                <h2 class="text-xs font-bold text-gray-500 mb-3 tracking-widest px-2">GÜNLÜK PROTOKOL</h2>
                <div class="space-y-3">
                    ${protocolItem('ANTRENMAN', `${completedTasks}/${totalTasks} GÖREV`, trainingProgress, 'fa-dumbbell', isTrainingDone)}
                    ${protocolItem('BESLENME', `${Math.round(totalCal)}/${targetCal} KCAL`, nutritionProgress, 'fa-utensils', isNutritionDone)}
                    ${protocolItem('UYKU', `${sleepHours} SAAT`, sleepProgress, 'fa-bed', isSleepDone)}
                </div>
            </div>

            <div class="bg-surface-card rounded-lg p-4 border border-gray-800">
                <h2 class="text-xs font-bold text-gray-500 mb-4 tracking-widest px-2">KALAN</h2>
                <div class="flex justify-around">
                    <div class="text-center">
                        <div class="text-3xl font-bold font-mono text-accent-orange">${remainingCal}</div>
                        <div class="text-[10px] text-gray-500 mt-1">KCAL</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold font-mono text-neon-blue">${remainingProt}</div>
                        <div class="text-[10px] text-gray-500 mt-1">PROTEİN</div>
                    </div>
                </div>
            </div>
            
            <div class="bg-surface-card rounded-lg p-4 border border-gray-800">
                 <h2 class="text-xs font-bold text-gray-500 mb-3 tracking-widest px-2">HIZLI EYLEMLER</h2>
                <div class="grid grid-cols-3 gap-3">
                    <button onclick="Actions.addWater(1)" class="bg-gray-800 rounded-lg flex flex-col items-center justify-center p-3 space-y-2 hover:bg-gray-700 transition">
                        <i class="fas fa-tint text-2xl text-neon-blue"></i>
                        <span class="text-xs font-bold text-gray-300">SU İÇ</span>
                    </button>
                    <button onclick="Actions.openMealModal()" class="bg-gray-800 rounded-lg flex flex-col items-center justify-center p-3 space-y-2 hover:bg-gray-700 transition">
                        <i class="fas fa-gas-pump text-2xl text-accent-orange"></i>
                        <span class="text-xs font-bold text-gray-300">YAKIT İKMALİ</span>
                    </button>
                    <button onclick="Actions.completeDailyMission()" class="bg-gray-800 rounded-lg flex flex-col items-center justify-center p-3 space-y-2 hover:bg-gray-700 transition">
                        <i class="fas fa-check-circle text-2xl text-neon-green"></i>
                        <span class="text-xs font-bold text-gray-300">GÜNÜ BİTİR</span>
                    </button>
                </div>
            </div>
        </div>
        `;
    };
})(window);
