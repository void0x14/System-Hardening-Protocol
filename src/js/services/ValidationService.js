/**
 * Copyright (c) 2025-2026 void0x14
 */

// ValidationService.js - Data Validation and Sanitization
// Phase 5: Service Layer - Extracted from store.js

import { config } from '../config/index.js';

/**
 * ValidationService
 * Handles all data validation and sanitization operations
 * Zero external dependencies
 */
export class ValidationService {
    /**
     * @param {Object} options - Configuration options
     * @param {Object} [options.limits] - Validation limits from config
     * @param {Object} [options.exerciseIds] - Set of valid exercise IDs
     */
    constructor(options = {}) {
        this.limits = options.limits || config.validation;
        this.exerciseIds = options.exerciseIds || new Set();
    }

    /**
     * Set valid exercise IDs for validation
     * @param {Set<string>} ids - Set of valid exercise IDs
     */
    setExerciseIds(ids) {
        this.exerciseIds = ids;
    }

    // ===========================================
    // NUMBER VALIDATION
    // ===========================================

    /**
     * Convert value to safe number with bounds checking
     * @param {*} value - Value to convert
     * @param {number} [fallback=0] - Fallback value if invalid
     * @param {number} [min=0] - Minimum allowed value
     * @param {number} [max=MAX_SAFE_INTEGER] - Maximum allowed value
     * @returns {number} Safe number within bounds
     */
    toSafeNumber(value, fallback = 0, min = 0, max = Number.MAX_SAFE_INTEGER) {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) return fallback;
        return Math.min(max, Math.max(min, parsed));
    }

    // ===========================================
    // DATE VALIDATION
    // ===========================================

    /**
     * Check if value is ISO date format (YYYY-MM-DD)
     * @param {*} value - Value to check
     * @returns {boolean} True if valid ISO date format
     */
    isIsoDateKey(value) {
        return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
    }

    /**
     * Sanitize date string to ISO format
     * @param {*} value - Value to sanitize
     * @returns {string} Sanitized date string or empty string
     */
    sanitizeDateString(value) {
        if (typeof value !== 'string') return '';
        const trimmed = value.trim();
        return this.isIsoDateKey(trimmed) ? trimmed : '';
    }

    /**
     * Sanitize timestamp string
     * @param {*} value - Value to sanitize
     * @returns {string} Sanitized timestamp or empty string
     */
    sanitizeTimestampString(value) {
        if (typeof value !== 'string') return '';
        const trimmed = value.trim();
        return /^[0-9]{4}-[0-9]{2}-[0-9]{2}(?:[T ][0-9:.+\-Z]+)?$/.test(trimmed)
            ? trimmed.slice(0, 40)
            : '';
    }

    // ===========================================
    // WORKOUT VALIDATION
    // ===========================================

    /**
     * Sanitize workout log (array of task IDs)
     * @param {*} logData - Data to sanitize
     * @returns {string[]} Sanitized workout log
     */
    sanitizeWorkoutLog(logData) {
        if (!Array.isArray(logData)) return [];
        return logData
            .filter(id => typeof id === 'string' && (this.exerciseIds.size === 0 || this.exerciseIds.has(id)))
            .slice(0, 128);
    }

    /**
     * Sanitize a single workout set entry
     * @param {*} entry - Entry to sanitize
     * @returns {Object|null} Sanitized entry or null
     */
    sanitizeWorkoutSetEntry(entry) {
        if (!entry || typeof entry !== 'object') return null;
        return {
            weight: this.toSafeNumber(entry.weight, 0, 0, 1000),
            reps: this.toSafeNumber(entry.reps, 0, 0, 1000),
            duration: this.toSafeNumber(entry.duration, 0, 0, 86400),
            timestamp: this.sanitizeTimestampString(entry.timestamp) || new Date().toISOString(),
            completed: entry.completed === true
        };
    }

    /**
     * Sanitize workout data log (object with exercise IDs as keys)
     * @param {*} workoutData - Data to sanitize
     * @returns {Object} Sanitized workout data
     */
    sanitizeWorkoutDataLog(workoutData) {
        if (!workoutData || typeof workoutData !== 'object') return {};
        const out = {};

        for (const [taskId, entries] of Object.entries(workoutData)) {
            if (this.exerciseIds.size > 0 && !this.exerciseIds.has(taskId)) continue;
            if (!Array.isArray(entries)) continue;

            const safeEntries = entries
                .map(entry => this.sanitizeWorkoutSetEntry(entry))
                .filter(Boolean)
                .slice(0, 64);

            if (safeEntries.length > 0) {
                out[taskId] = safeEntries;
            }
        }

        return out;
    }

    // ===========================================
    // WEIGHT VALIDATION
    // ===========================================

    /**
     * Sanitize weight history object
     * @param {*} historyData - Data to sanitize
     * @returns {Object} Sanitized weight history
     */
    sanitizeWeightHistory(historyData) {
        if (!historyData || typeof historyData !== 'object') return {};
        const out = {};
        for (const [date, value] of Object.entries(historyData)) {
            if (!this.isIsoDateKey(date)) continue;
            const safeWeight = this.toSafeNumber(value, NaN, 20, 500);
            if (Number.isFinite(safeWeight)) out[date] = safeWeight;
        }
        return out;
    }

    // ===========================================
    // STREAK VALIDATION
    // ===========================================

    /**
     * Sanitize streak data
     * @param {*} streakData - Data to sanitize
     * @returns {Object} Sanitized streak data
     */
    sanitizeStreakData(streakData) {
        if (!streakData || typeof streakData !== 'object') {
            return { count: 0, lastDate: null };
        }
        const count = Math.trunc(this.toSafeNumber(streakData.count, 0, 0, 10000));
        const lastDate = this.sanitizeDateString(streakData.lastDate);
        return { count, lastDate: lastDate || null };
    }

    // ===========================================
    // DAILY PLAN VALIDATION
    // ===========================================

    /**
     * Sanitize a daily plan meal
     * @param {*} meal - Meal to sanitize
     * @returns {Object|null} Sanitized meal or null
     */
    sanitizeDailyPlanMeal(meal) {
        if (!meal || typeof meal !== 'object') return null;
        const text = typeof meal.text === 'string' ? meal.text.slice(0, 140) : '';
        const kcal = this.toSafeNumber(meal.kcal, 0, 0, 5000);
        if (!text && kcal === 0) return null;
        return { text, kcal };
    }

    /**
     * Sanitize daily plan data
     * @param {*} planData - Data to sanitize
     * @param {string} [fallbackDate] - Fallback date if invalid
     * @returns {Object} Sanitized daily plan
     */
    sanitizeDailyPlanData(planData, fallbackDate) {
        const today = fallbackDate || new Date().toISOString().split('T')[0];
        
        if (!planData || typeof planData !== 'object') {
            return { date: today, plan: {} };
        }

        const planSource = (planData.plan && typeof planData.plan === 'object') ? planData.plan : planData;
        const keys = ['breakfast', 'fuel', 'lunch', 'pre_workout', 'dinner', 'night'];
        const safePlan = {};

        keys.forEach(key => {
            const safeMeal = this.sanitizeDailyPlanMeal(planSource[key]);
            if (safeMeal) safePlan[key] = safeMeal;
        });

        const safeDate = this.sanitizeDateString(planData.date) || today;
        return { date: safeDate, plan: safePlan };
    }

    // ===========================================
    // CUSTOM FOOD VALIDATION
    // ===========================================

    /**
     * Sanitize custom food option
     * @param {*} option - Option to sanitize
     * @returns {Object|null} Sanitized option or null
     */
    sanitizeCustomFoodOption(option) {
        if (!option || typeof option !== 'object') return null;
        const label = typeof option.label === 'string' ? option.label.slice(0, 80) : '';
        const ratio = this.toSafeNumber(option.ratio, NaN, 0.01, 100);
        if (!label || !Number.isFinite(ratio)) return null;
        return { label, ratio };
    }

    /**
     * Sanitize custom food entry
     * @param {*} food - Food to sanitize
     * @returns {Object|null} Sanitized food or null
     */
    sanitizeCustomFood(food) {
        if (!food || typeof food !== 'object') return null;

        const type = food.type === 'portion' ? 'portion' : (food.type === 'piece' ? 'piece' : 'custom');
        const safeVals = {
            cal: this.toSafeNumber(food?.vals?.cal, 0, 0, 20000),
            prot: this.toSafeNumber(food?.vals?.prot, 0, 0, 1000),
            carb: this.toSafeNumber(food?.vals?.carb, 0, 0, 1000),
            fat: this.toSafeNumber(food?.vals?.fat, 0, 0, 1000)
        };

        const safeFood = {
            id: this.toSafeNumber(food.id, 0, 0, Number.MAX_SAFE_INTEGER),
            cat: typeof food.cat === 'string' ? food.cat.slice(0, 24) : 'CUSTOM',
            name: typeof food.name === 'string' ? food.name.slice(0, 120) : '',
            type,
            vals: safeVals
        };

        if (type === 'portion') {
            safeFood.options = Array.isArray(food.options)
                ? food.options.map(option => this.sanitizeCustomFoodOption(option)).filter(Boolean).slice(0, 8)
                : [];
            if (safeFood.options.length === 0) {
                safeFood.options = [{ label: '1 Porsiyon', ratio: 1 }];
            }
        } else if (type === 'piece') {
            safeFood.unitName = typeof food.unitName === 'string' ? food.unitName.slice(0, 24) : 'Adet';
        } else {
            safeFood.unit = typeof food.unit === 'string' ? food.unit.slice(0, 16) : 'custom';
        }

        return safeFood.name ? safeFood : null;
    }

    /**
     * Sanitize array of custom foods
     * @param {*} customFoods - Data to sanitize
     * @returns {Array} Sanitized custom foods array
     */
    sanitizeCustomFoods(customFoods) {
        if (!Array.isArray(customFoods)) return [];
        return customFoods
            .map(food => this.sanitizeCustomFood(food))
            .filter(Boolean)
            .slice(-300);
    }

    // ===========================================
    // EXERCISE HISTORY VALIDATION
    // ===========================================

    /**
     * Sanitize exercise history entry
     * @param {*} entry - Entry to sanitize
     * @returns {Object|null} Sanitized entry or null
     */
    sanitizeExerciseHistoryEntry(entry) {
        if (!entry || typeof entry !== 'object') return null;

        const safeWeight = this.toSafeNumber(entry.weight, NaN, 0, 1000);
        const safeReps = this.toSafeNumber(entry.reps, NaN, 0, 1000);
        const providedVolume = this.toSafeNumber(entry.volume, NaN, 0, 1000000);
        const computedVolume = (Number.isFinite(safeWeight) && Number.isFinite(safeReps))
            ? safeWeight * safeReps
            : NaN;
        const safeVolume = Number.isFinite(providedVolume) ? providedVolume : computedVolume;

        const out = {};
        if (Number.isFinite(safeWeight)) out.weight = safeWeight;
        if (Number.isFinite(safeReps)) out.reps = safeReps;
        if (Number.isFinite(safeVolume)) out.volume = safeVolume;

        const safeDate = this.sanitizeDateString(entry.date);
        if (safeDate) out.date = safeDate;

        const safeTimestamp = this.sanitizeTimestampString(entry.timestamp);
        if (safeTimestamp) out.timestamp = safeTimestamp;

        return Object.keys(out).length > 0 ? out : null;
    }

    /**
     * Sanitize exercise history data
     * @param {*} historyData - Data to sanitize
     * @returns {Object} Sanitized exercise history
     */
    sanitizeExerciseHistoryData(historyData) {
        if (!historyData || typeof historyData !== 'object') return {};

        const out = {};

        for (const [exerciseId, entries] of Object.entries(historyData)) {
            if (this.exerciseIds.size > 0 && !this.exerciseIds.has(exerciseId)) continue;
            if (!Array.isArray(entries)) continue;

            const safeEntries = entries
                .map(entry => this.sanitizeExerciseHistoryEntry(entry))
                .filter(Boolean)
                .slice(-100);

            if (safeEntries.length > 0) out[exerciseId] = safeEntries;
        }

        return out;
    }

    // ===========================================
    // MENTAL PROGRESS VALIDATION
    // ===========================================

    /**
     * Sanitize mental progress data
     * @param {*} mentalData - Data to sanitize
     * @returns {Object} Sanitized mental progress
     */
    sanitizeMentalProgressData(mentalData) {
        if (!mentalData || typeof mentalData !== 'object') {
            return { completedPhases: [], dailyPractice: {} };
        }

        const completedPhases = Array.isArray(mentalData.completedPhases)
            ? Array.from(new Set(
                mentalData.completedPhases
                    .map(phase => this.toSafeNumber(phase, NaN, 1, 8))
                    .filter(Number.isFinite)
                    .map(phase => Math.trunc(phase))
            ))
            : [];

        const dailyPractice = {};
        if (mentalData.dailyPractice && typeof mentalData.dailyPractice === 'object') {
            for (const [date, done] of Object.entries(mentalData.dailyPractice)) {
                if (!this.isIsoDateKey(date)) continue;
                dailyPractice[date] = done === true;
            }
        }

        const out = { completedPhases, dailyPractice };
        const lastPracticeDate = this.sanitizeDateString(mentalData.lastPracticeDate);
        if (lastPracticeDate) out.lastPracticeDate = lastPracticeDate;
        return out;
    }

    // ===========================================
    // MEAL VALIDATION
    // ===========================================

    /**
     * Sanitize meal entry
     * @param {*} entry - Entry to sanitize
     * @returns {Object|null} Sanitized entry or null
     */
    sanitizeMealEntry(entry) {
        if (!entry || typeof entry !== 'object') return null;

        return {
            name: typeof entry.name === 'string' ? entry.name.slice(0, 120) : '',
            amount: this.toSafeNumber(entry.amount, 0, 0, 10000),
            unit: typeof entry.unit === 'string' ? entry.unit.slice(0, 32) : 'custom',
            portionLabel: typeof entry.portionLabel === 'string' ? entry.portionLabel.slice(0, 80) : '',
            cal: this.toSafeNumber(entry.cal, 0, 0, 20000),
            prot: this.toSafeNumber(entry.prot, 0, 0, 1000),
            carb: this.toSafeNumber(entry.carb, 0, 0, 1000),
            fat: this.toSafeNumber(entry.fat, 0, 0, 1000)
        };
    }

    /**
     * Sanitize meal log array
     * @param {*} logData - Data to sanitize
     * @returns {Array} Sanitized meal log
     */
    sanitizeMealLog(logData) {
        if (!Array.isArray(logData)) return [];
        return logData
            .map(entry => this.sanitizeMealEntry(entry))
            .filter(Boolean);
    }

    // ===========================================
    // BODY MEASUREMENT VALIDATION
    // ===========================================

    /**
     * Sanitize measurement entry
     * @param {*} entry - Entry to sanitize
     * @returns {Object|null} Sanitized entry or null
     */
    sanitizeMeasureEntry(entry) {
        if (!entry || typeof entry !== 'object') return null;

        const chest = this.toSafeNumber(entry.chest, NaN, 0, 300);
        const arm = this.toSafeNumber(entry.arm, NaN, 0, 300);
        const waist = this.toSafeNumber(entry.waist, NaN, 0, 300);
        const leg = this.toSafeNumber(entry.leg, NaN, 0, 300);
        const out = {};

        if (Number.isFinite(chest)) out.chest = chest;
        if (Number.isFinite(arm)) out.arm = arm;
        if (Number.isFinite(waist)) out.waist = waist;
        if (Number.isFinite(leg)) out.leg = leg;
        const safeSavedAt = this.sanitizeDateString(entry.savedAt);
        const safeDate = this.sanitizeDateString(entry.date);
        if (safeSavedAt) out.savedAt = safeSavedAt;
        if (safeDate) out.date = safeDate;

        return out;
    }

    /**
     * Sanitize measurement data
     * @param {*} measureData - Data to sanitize
     * @returns {Object} Sanitized measurement data
     */
    sanitizeMeasureData(measureData) {
        if (!measureData || typeof measureData !== 'object') {
            return { current: {}, history: [] };
        }

        if (!measureData.current && !measureData.history) {
            return {
                current: this.sanitizeMeasureEntry(measureData) || {},
                history: []
            };
        }

        return {
            current: this.sanitizeMeasureEntry(measureData.current) || {},
            history: Array.isArray(measureData.history)
                ? measureData.history
                    .map(item => this.sanitizeMeasureEntry(item))
                    .filter(item => item && Object.keys(item).length > 0)
                    .slice(-30)
                : []
        };
    }

    // ===========================================
    // IMPORT DATA VALIDATION
    // ===========================================

    /**
     * Sanitize imported data
     * @param {*} importData - Data to sanitize
     * @param {Object} storageKeys - Storage key constants
     * @param {*} [defaultWeight] - Default weight value
     * @returns {Object} Sanitized import data
     */
    sanitizeImportedData(importData, storageKeys, defaultWeight = 45.0) {
        const safeData = { meta: importData.meta };
        const keys = storageKeys || {};

        for (const key in importData) {
            if (key === 'meta') continue;

            if (key.startsWith(keys.MEAL || 'monk_meal_')) {
                safeData[key] = this.sanitizeMealLog(importData[key]);
            } else if (key === (keys.MEASURE || 'monk_measure')) {
                safeData[key] = this.sanitizeMeasureData(importData[key]);
            } else if (key === (keys.WEIGHT || 'monk_weight')) {
                safeData[key] = this.toSafeNumber(importData[key], defaultWeight, 20, 500);
            } else if (key === (keys.WEIGHT_HISTORY || 'monk_weight_history')) {
                safeData[key] = this.sanitizeWeightHistory(importData[key]);
            } else if (key === (keys.CUSTOM_FOODS || 'monk_custom_foods')) {
                safeData[key] = this.sanitizeCustomFoods(importData[key]);
            } else if (key === (keys.DAILY_PLAN || 'monk_daily_plan')) {
                safeData[key] = this.sanitizeDailyPlanData(importData[key]);
            } else if (key === (keys.STREAK || 'monk_streak')) {
                safeData[key] = this.sanitizeStreakData(importData[key]);
            } else if (key === (keys.FUEL || 'monk_fuel_date')) {
                safeData[key] = this.sanitizeDateString(importData[key]) || null;
            } else if (key.startsWith(keys.WORKOUT || 'monk_workout_log_')) {
                safeData[key] = this.sanitizeWorkoutLog(importData[key]);
            } else if (key.startsWith(keys.WORKOUT_DATA || 'monk_workout_data_')) {
                safeData[key] = this.sanitizeWorkoutDataLog(importData[key]);
            } else if (key.startsWith(keys.SLEEP || 'monk_sleep_')) {
                safeData[key] = this.toSafeNumber(importData[key], 0, 0, 24);
            } else if (key.startsWith(keys.WATER || 'monk_water_')) {
                safeData[key] = this.toSafeNumber(importData[key], 0, 0, 50);
            } else if (key === (keys.EXERCISE_HISTORY || 'monk_exercise_history')) {
                safeData[key] = this.sanitizeExerciseHistoryData(importData[key]);
            } else if (key === (keys.MENTAL_PROGRESS || 'monk_mental_progress')) {
                safeData[key] = this.sanitizeMentalProgressData(importData[key]);
            } else if (key === (keys.BACKUP || 'monk_backup_date')) {
                safeData[key] = this.sanitizeDateString(importData[key]) || new Date().toISOString().split('T')[0];
            } else {
                safeData[key] = importData[key];
            }
        }

        return safeData;
    }
}

export default ValidationService;
