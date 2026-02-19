// StatisticsService.js - Metrics and Analytics
// Phase 5: Service Layer - Extracted from store.js

import { config } from '../config/index.js';

/**
 * StatisticsService
 * Handles all statistics calculations and analytics
 * Zero external dependencies
 */
export class StatisticsService {
    /**
     * @param {Object} options - Configuration options
     * @param {Object} options.storage - Storage adapter
     * @param {Object} [options.keys] - Storage keys from config
     * @param {Object} [options.targets] - Nutrition targets from config
     * @param {Object} [options.weeklyPlan] - Weekly plan data
     */
    constructor(options) {
        this.storage = options.storage;
        this.keys = options.keys || config.keys;
        this.targets = options.targets || config.targets;
        this.weeklyPlan = options.weeklyPlan || {};
        this._cache = {};
    }

    /**
     * Clear cache
     * @param {string} [key] - Specific cache key, or all if omitted
     */
    clearCache(key) {
        if (key) delete this._cache[key];
        else this._cache = {};
    }

    // ===========================================
    // VOLUME STATISTICS
    // ===========================================

    /**
     * Get volume statistics for workouts
     * @async
     * @returns {Promise<Object>} Volume stats { weekly, monthly, daily, totalSets, weeklyDays }
     */
    async getVolumeStats() {
        const today = new Date();
        const stats = {
            weekly: 0,
            monthly: 0,
            daily: {},
            totalSets: 0,
            weeklyDays: 0
        };

        for (let i = 0; i < 30; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = this.formatDate(d);
            
            const data = await this.getWorkoutData(dateStr);
            let vol = 0;
            let sets = 0;
            
            Object.values(data).forEach(setArray => {
                setArray.forEach(s => {
                    if (s && s.completed) {
                        vol += ((s.weight || 0) * (s.reps || 0));
                        sets++;
                    }
                });
            });

            stats.monthly += vol;
            stats.totalSets += sets;

            if (i < 7) {
                stats.daily[dateStr] = vol;
                stats.weekly += vol;
                if (vol > 0) stats.weeklyDays++;
            }
        }
        
        return stats;
    }

    // ===========================================
    // TODAY PROGRESS
    // ===========================================

    /**
     * Get today's progress
     * @async
     * @returns {Promise<Object>} Progress data
     */
    async getTodayProgress() {
        const today = this.getDateStr();
        const day = new Date().getDay();
        const plan = this.weeklyPlan[day] || { tasks: [] };
        
        const workout = await this.getWorkout(today);
        const meals = await this.getMeals(today);

        const totalCal = meals.reduce((sum, m) => sum + (m.cal || 0), 0);
        const tasksDone = workout.length;
        const tasksTotal = plan.tasks.length;

        return {
            tasksDone,
            tasksTotal,
            tasksPercent: tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : 0,
            calories: totalCal,
            caloriesTarget: this.targets.CAL?.TARGET || 3000,
            caloriesPercent: Math.round((totalCal / (this.targets.CAL?.TARGET || 3000)) * 100)
        };
    }

    // ===========================================
    // SLEEP STATISTICS
    // ===========================================

    /**
     * Get sleep for a specific date
     * @async
     * @param {string} date - Date string
     * @returns {Promise<number>} Sleep hours
     */
    async getSleep(date) {
        return await this.storage.get(this.keys.SLEEP + date) || 0;
    }

    /**
     * Set sleep hours for today
     * @async
     * @param {number} hours - Sleep hours
     * @returns {Promise<boolean>} Success status
     */
    async setSleep(hours) {
        const date = this.getDateStr();
        await this.storage.set(this.keys.SLEEP + date, parseFloat(hours));
        this.clearCache('sleepStats');
        return true;
    }

    /**
     * Get sleep statistics
     * @async
     * @returns {Promise<Object>} Sleep stats
     */
    async getSleepStats() {
        const today = this.getDateStr();
        const todayVal = await this.getSleep(today);
        const history = [];
        let weekTotal = 0, weekDays = 0;
        let monthTotal = 0, monthDays = 0;

        for (let i = 0; i < 30; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const val = await this.getSleep(dateStr);
            
            if (val > 0) {
                if (i < 7) { weekTotal += val; weekDays++; }
                monthTotal += val;
                monthDays++;
            }
            if (i < 7) history.push({ date: dateStr, value: val });
        }

        return {
            today: todayVal,
            weekAvg: weekDays > 0 ? (weekTotal / weekDays).toFixed(1) : 0,
            monthAvg: monthDays > 0 ? (monthTotal / monthDays).toFixed(1) : 0,
            weekDays,
            monthDays,
            history: history.reverse()
        };
    }

    // ===========================================
    // WATER STATISTICS
    // ===========================================

    /**
     * Get water cups for a specific date
     * @async
     * @param {string} date - Date string
     * @returns {Promise<number>} Water cups
     */
    async getWater(date) {
        return await this.storage.get(this.keys.WATER + date) || 0;
    }

    /**
     * Add water cups for today
     * @async
     * @param {number} [cups=1] - Cups to add
     * @returns {Promise<number>} New total cups
     */
    async addWater(cups = 1) {
        const date = this.getDateStr();
        const current = await this.getWater(date);
        await this.storage.set(this.keys.WATER + date, current + cups);
        this.clearCache('waterStats');
        return current + cups;
    }

    /**
     * Get water statistics
     * @async
     * @returns {Promise<Object>} Water stats
     */
    async getWaterStats() {
        const today = this.getDateStr();
        const todayVal = await this.getWater(today);
        const history = [];
        let weekTotal = 0;
        let monthTotal = 0;

        for (let i = 0; i < 30; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const val = await this.getWater(dateStr);
            
            if (i < 7) {
                weekTotal += val;
                history.push({ date: dateStr, value: val });
            }
            monthTotal += val;
        }

        return {
            today: todayVal,
            weekTotal,
            monthTotal,
            weekAvg: (weekTotal / 7).toFixed(1),
            monthAvg: (monthTotal / 30).toFixed(1),
            history: history.reverse()
        };
    }

    // ===========================================
    // WEEKLY SUMMARY
    // ===========================================

    /**
     * Get weekly summary for the last 4 weeks
     * @async
     * @returns {Promise<Array>} Weekly summary data
     */
    async getWeeklySummary() {
        const weeks = [];
        const today = new Date();

        for (let w = 0; w < 4; w++) {
            let totalCal = 0, calDays = 0, workoutDays = 0;
            let startWeight = null, endWeight = null;

            for (let d = 0; d < 7; d++) {
                const date = new Date(today);
                date.setDate(date.getDate() - (w * 7 + d));
                const dateStr = this.formatDate(date);

                const meals = await this.getMeals(dateStr);
                if (meals.length > 0) {
                    totalCal += meals.reduce((sum, m) => sum + (m.cal || 0), 0);
                    calDays++;
                }

                const workout = await this.getWorkout(dateStr);
                if (workout.length > 0) workoutDays++;

                const hist = await this.getWeightHistory();
                if (hist[dateStr]) {
                    if (!endWeight) endWeight = hist[dateStr];
                    startWeight = hist[dateStr];
                }
            }

            weeks.push({
                week: w + 1,
                avgCal: calDays > 0 ? Math.round(totalCal / calDays) : 0,
                workoutDays,
                weightChange: (startWeight && endWeight) ? (endWeight - startWeight).toFixed(1) : null
            });
        }
        
        return weeks;
    }

    // ===========================================
    // MACRO CALCULATIONS
    // ===========================================

    /**
     * Calculate macro averages from meals
     * @param {Array} meals - Array of meal objects
     * @returns {Object} Macro averages { cal, prot, carb, fat }
     */
    calculateMacroAverages(meals) {
        if (!Array.isArray(meals) || meals.length === 0) {
            return { cal: 0, prot: 0, carb: 0, fat: 0 };
        }

        const totals = meals.reduce((acc, meal) => ({
            cal: acc.cal + (meal.cal || 0),
            prot: acc.prot + (meal.prot || 0),
            carb: acc.carb + (meal.carb || 0),
            fat: acc.fat + (meal.fat || 0)
        }), { cal: 0, prot: 0, carb: 0, fat: 0 });

        return {
            cal: Math.round(totals.cal / meals.length),
            prot: Math.round(totals.prot / meals.length),
            carb: Math.round(totals.carb / meals.length),
            fat: Math.round(totals.fat / meals.length)
        };
    }

    /**
     * Get daily nutrition summary
     * @async
     * @param {string} [date] - Date string, defaults to today
     * @returns {Promise<Object>} Nutrition summary
     */
    async getDailyNutrition(date) {
        const targetDate = date || this.getDateStr();
        const meals = await this.getMeals(targetDate);
        
        const totals = meals.reduce((acc, meal) => ({
            cal: acc.cal + (meal.cal || 0),
            prot: acc.prot + (meal.prot || 0),
            carb: acc.carb + (meal.carb || 0),
            fat: acc.fat + (meal.fat || 0)
        }), { cal: 0, prot: 0, carb: 0, fat: 0 });

        const targets = {
            cal: this.targets.CAL?.TARGET || 3000,
            prot: this.targets.PROTEIN?.TARGET || 225,
            carb: this.targets.CARBS?.TARGET || 375,
            fat: this.targets.FAT?.TARGET || 67
        };

        return {
            date: targetDate,
            totals,
            targets,
            percentages: {
                cal: targets.cal > 0 ? Math.round((totals.cal / targets.cal) * 100) : 0,
                prot: targets.prot > 0 ? Math.round((totals.prot / targets.prot) * 100) : 0,
                carb: targets.carb > 0 ? Math.round((totals.carb / targets.carb) * 100) : 0,
                fat: targets.fat > 0 ? Math.round((totals.fat / targets.fat) * 100) : 0
            },
            mealCount: meals.length
        };
    }

    // ===========================================
    // PROGRESS DATA
    // ===========================================

    /**
     * Get progress data for charts
     * @async
     * @param {number} [days=30] - Number of days to include
     * @returns {Promise<Object>} Progress data
     */
    async getProgressData(days = 30) {
        const weightHistory = await this.getWeightHistory();
        const dates = [];
        const weights = [];
        const calories = [];
        const workouts = [];

        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = this.formatDate(d);
            
            dates.push(dateStr);
            weights.push(weightHistory[dateStr] || null);
            
            const meals = await this.getMeals(dateStr);
            calories.push(meals.reduce((sum, m) => sum + (m.cal || 0), 0));
            
            const workout = await this.getWorkout(dateStr);
            workouts.push(workout.length);
        }

        return {
            dates,
            weights,
            calories,
            workouts,
            weightChange: this.calculateWeightChange(weights),
            avgCalories: this.calculateAverage(calories.filter(c => c > 0)),
            totalWorkouts: workouts.reduce((sum, w) => sum + w, 0)
        };
    }

    /**
     * Calculate weight change from array
     * @param {Array} weights - Array of weights
     * @returns {number|null} Weight change
     */
    calculateWeightChange(weights) {
        const validWeights = weights.filter(w => w !== null);
        if (validWeights.length < 2) return null;
        
        const first = validWeights[0];
        const last = validWeights[validWeights.length - 1];
        return (last - first).toFixed(1);
    }

    /**
     * Calculate average from array
     * @param {Array} values - Array of numbers
     * @returns {number} Average
     */
    calculateAverage(values) {
        if (values.length === 0) return 0;
        return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
    }

    // ===========================================
    // HELPER METHODS
    // ===========================================

    /**
     * Get workout data for a date
     * @async
     * @param {string} date - Date string
     * @returns {Promise<Object>} Workout data
     * @private
     */
    async getWorkoutData(date) {
        return await this.storage.get('monk_workout_data_' + date) || {};
    }

    /**
     * Get workout tasks for a date
     * @async
     * @param {string} date - Date string
     * @returns {Promise<Array>} Workout task IDs
     * @private
     */
    async getWorkout(date) {
        return await this.storage.get(this.keys.WORKOUT + date) || [];
    }

    /**
     * Get meals for a date
     * @async
     * @param {string} date - Date string
     * @returns {Promise<Array>} Meals array
     * @private
     */
    async getMeals(date) {
        return await this.storage.get(this.keys.MEAL + date) || [];
    }

    /**
     * Get weight history
     * @async
     * @returns {Promise<Object>} Weight history object
     * @private
     */
    async getWeightHistory() {
        return await this.storage.get(this.keys.WEIGHT_HISTORY) || {};
    }

    /**
     * Get current date string
     * @returns {string} Date string YYYY-MM-DD
     * @private
     */
    getDateStr() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Format date to YYYY-MM-DD
     * @param {Date} date - Date object
     * @returns {string} Formatted date string
     * @private
     */
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

export default StatisticsService;
