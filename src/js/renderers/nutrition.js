(function(window) {
    'use strict';

    if (typeof window.Renderers === 'undefined') {
        window.Renderers = {};
    }

    Renderers.nutrition = async function() {
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
            <button onclick="Actions.quickAddMeal(${f.id})"
                class="flex flex-col items-center gap-1 p-3 bg-gray-900 hover:bg-neon-green/20 rounded-lg transition-all group">
                <i class="fas ${f.icon} text-lg text-gray-500 group-hover:text-neon-green"></i>
                <span class="text-[10px] text-gray-500 group-hover:text-white">${f.name}</span>
            </button>
        `).join('');

        // Daily plan
        const plan = Store.state.dailyPlan || {};
        let totalPlanCal = 0;
        ['breakfast', 'fuel', 'lunch', 'pre_workout', 'dinner', 'night'].forEach(k => {
            if (plan[k]) totalPlanCal += plan[k].kcal;
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
                        <button onclick="Actions.openMealModal()" class="${THEME.btn} w-full">
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
                        <button onclick="Actions.rerollPlan()" class="text-xs text-neon-blue hover:text-white font-bold">
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
                                    <div class="text-sm text-white font-bold">${meal ? meal.text : '...'}</div>
                                </div>
                                ${meal ? `<span class="text-[10px] text-neon-green">${meal.kcal} kcal</span>` : ''}
                            </div>`;
        }).join('')}
                    </div>
                </div>
            </div>
        </div>`;
    }
})(window);
