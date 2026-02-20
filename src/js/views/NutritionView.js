// views/NutritionView.js - Nutrition Tab View Component
// Extracted from renderers/dashboard.js

import { MacroRing } from '../components/MacroRing.js';
import { MealCard, EmptyMealList } from '../components/MealCard.js';

import { Store } from '../store.js';

/**
 * Nutrition View Class
 * Renders the nutrition tab with macro tracking and meal management
 */
export class NutritionView {
    /**
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} dependencies.store - Store instance
     * @param {Object} dependencies.config - Configuration object
     * @param {Object} dependencies.theme - Theme constants
     * @param {Object} dependencies.utils - Utility functions
     */
    constructor(dependencies = {}) {
        this.store = dependencies.store;
        this.config = dependencies.config;
        this.theme = dependencies.theme;
        this.utils = dependencies.utils;
    }

    /**
     * Render the nutrition view
     * @returns {Promise<string>} HTML string
     */
    async render() {
        const today = this.utils.dateStr();
        const meals = await this.store.getMeals(today);
        
        // Calculate totals
        const totals = { c: 0, p: 0, carb: 0, f: 0 };
        meals.forEach(m => {
            totals.c += m.cal || 0;
            totals.p += m.prot || 0;
            totals.carb += m.carb || 0;
            totals.f += m.fat || 0;
        });

        const targetCal = this.config.TARGETS.CAL;
        const targetProt = this.config.TARGETS.PROT;
        const targetCarb = this.config.TARGETS.CARB;
        const targetFat = this.config.TARGETS.FAT;

        return this._template({
            meals,
            totals,
            targetCal,
            targetProt,
            targetCarb,
            targetFat
        });
    }

    /**
     * Generate HTML template
     * @private
     */
    _template(data) {
        const { meals, totals, targetCal, targetProt, targetCarb, targetFat } = data;
        const actionAttrs = this.utils.actionAttrs;
        const escapeHtml = this.utils.escapeHtml;
        const cardClass = this.theme?.card || 'bg-gray-900 border border-gray-800 rounded-xl p-4';
        const btnClass = this.theme?.btn || 'bg-neon-green/20 hover:bg-neon-green text-neon-green hover:text-black px-4 py-2 rounded-lg font-bold text-sm transition-all';

        // Status box based on calorie progress
        const calPercent = Math.round((totals.c / targetCal) * 100);
        const statusBox = this._renderStatusBox(totals.c, targetCal, calPercent);

        // Quick add buttons
        const quickFoods = [
            { icon: 'fa-egg', name: 'Yumurta', id: 5 },
            { icon: 'fa-drumstick-bite', name: 'Tavuk', id: 1 },
            { icon: 'fa-bowl-rice', name: 'Pilav', id: 20 },
            { icon: 'fa-bread-slice', name: 'Ekmek', id: 24 }
        ];
        const quickAddHtml = this._renderQuickAddButtons(quickFoods, actionAttrs);

        // Meal list
        const mealListHtml = meals.length > 0 
            ? meals.map((m, idx) => MealCard(m, idx, { escapeHtml, actionAttrs })).join('')
            : EmptyMealList();

        // Daily plan
        const plan = this.store.state.dailyPlan || {};
        const planHtml = this._renderDailyPlan(plan, escapeHtml);

        return `
            <div class="animate-slide-up space-y-6">
                <!-- Macro Rings Row -->
                <div class="${cardClass}">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-[10px] text-gray-500 font-bold">GÜNLÜK MAKS TAKIP</span>
                        <span class="text-[10px] text-gray-500">${this.utils.dateStr()}</span>
                    </div>
                    <div class="flex justify-around items-center py-4">
                        ${MacroRing('KALORİ', totals.c, targetCal, '', '#00ff41', '90')}
                        ${MacroRing('PROTEİN', totals.p, targetProt, 'g', '#00f3ff', '70')}
                        ${MacroRing('KARB', totals.carb, targetCarb, 'g', '#ff6b35', '70')}
                        ${MacroRing('YAĞ', totals.f, targetFat, 'g', '#ffed4a', '70')}
                    </div>
                    ${statusBox}
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Left Column: Quick Add + Meal List -->
                    <div class="space-y-4">
                        <!-- Quick Add Section -->
                        <div class="${cardClass}">
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-[10px] text-gray-500 font-bold">⚡ HIZLI EKLE</span>
                            </div>
                            <div class="grid grid-cols-4 gap-2 mb-4">
                                ${quickAddHtml}
                            </div>
                            <button ${actionAttrs('openMealModal')} class="${btnClass} w-full">
                                <i class="fas fa-plus mr-2"></i>ÖĞÜN EKLE
                            </button>
                        </div>

                        <!-- Meal List -->
                        <div class="${cardClass}">
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-[10px] text-gray-500 font-bold">BUGÜNKÜ YAKITLAR (${meals.length})</span>
                                <span class="text-neon-green font-bold text-sm">${totals.c} kcal</span>
                            </div>
                            <div class="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2">
                                ${mealListHtml}
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Daily Plan -->
                    <div class="${cardClass}">
                        <div class="flex justify-between mb-4 items-center">
                            <span class="text-[10px] text-gray-500 font-bold">📋 GÜNLÜK PLAN (${this._calculatePlanCalories(plan)} kcal)</span>
                            <button ${actionAttrs('rerollPlan')} class="text-xs text-neon-blue hover:text-white font-bold">
                                <i class="fas fa-sync-alt mr-1"></i>YENİLE
                            </button>
                        </div>
                        ${planHtml}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render status box based on calorie progress
     * @private
     */
    _renderStatusBox(currentCal, targetCal, percent) {
        if (currentCal < targetCal * 0.5) {
            return `
                <div class="p-3 border-2 border-red-600 bg-red-900/20 rounded-lg text-center">
                    <div class="text-red-500 font-bold"><i class="fas fa-skull mr-2"></i>KRİTİK: ${100 - percent}% eksik</div>
                </div>
            `;
        } else if (currentCal < targetCal) {
            return `
                <div class="p-3 border-2 border-yellow-600 bg-yellow-900/20 rounded-lg text-center">
                    <div class="text-yellow-500 font-bold"><i class="fas fa-exclamation-triangle mr-2"></i>${targetCal - currentCal} kcal daha lazım</div>
                </div>
            `;
        } else {
            return `
                <div class="p-3 border-2 border-neon-green bg-green-900/20 rounded-lg text-center">
                    <div class="text-neon-green font-bold"><i class="fas fa-check-circle mr-2"></i>HEDEF TAMAMLANDI</div>
                </div>
            `;
        }
    }

    /**
     * Render quick add buttons
     * @private
     */
    _renderQuickAddButtons(quickFoods, actionAttrs) {
        return quickFoods.map(f => `
            <button ${actionAttrs('quickAddMeal', [f.id])}
                class="flex flex-col items-center gap-1 p-3 bg-gray-900 hover:bg-neon-green/20 rounded-lg transition-all group">
                <i class="fas ${f.icon} text-lg text-gray-500 group-hover:text-neon-green"></i>
                <span class="text-[10px] text-gray-500 group-hover:text-white">${f.name}</span>
            </button>
        `).join('');
    }

    /**
     * Render daily plan
     * @private
     */
    _renderDailyPlan(plan, escapeHtml) {
        const times = { 
            breakfast: '08:00', fuel: '11:00', lunch: '14:00', 
            pre_workout: '17:00', dinner: '19:00', night: '23:00' 
        };
        const icons = { 
            breakfast: 'fa-sun', fuel: 'fa-bolt', lunch: 'fa-utensils', 
            pre_workout: 'fa-dumbbell', dinner: 'fa-moon', night: 'fa-bed' 
        };
        const labels = { 
            breakfast: 'Kahvaltı', fuel: 'Ara Öğün', lunch: 'Öğle', 
            pre_workout: 'Antrenman Öncesi', dinner: 'Akşam', night: 'Gece' 
        };

        return ['breakfast', 'fuel', 'lunch', 'pre_workout', 'dinner', 'night'].map(k => {
            const meal = plan[k];
            return `
                <div class="flex items-center gap-3 p-2 rounded-lg ${meal ? 'bg-gray-900/50' : 'bg-gray-900/20 opacity-50'}">
                    <div class="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                        <i class="fas ${icons[k]} text-xs text-gray-500"></i>
                    </div>
                    <div class="flex-1">
                        <div class="text-[10px] text-gray-500">${times[k]} - ${labels[k]}</div>
                        <div class="text-sm text-white font-bold">${meal ? escapeHtml(meal.text?.slice(0, 120) || '') : '...'}</div>
                    </div>
                    ${meal ? `<span class="text-[10px] text-neon-green">${this._toSafeNumber(meal.kcal, 0, 0, 5000)} kcal</span>` : ''}
                </div>
            `;
        }).join('');
    }

    /**
     * Calculate total plan calories
     * @private
     */
    _calculatePlanCalories(plan) {
        let total = 0;
        ['breakfast', 'fuel', 'lunch', 'pre_workout', 'dinner', 'night'].forEach(k => {
            if (plan[k]) total += this._toSafeNumber(plan[k].kcal, 0, 0, 5000);
        });
        return total;
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

export default NutritionView;
