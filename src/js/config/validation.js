// validation.js - Input Validation Limits
// Extracted from store.js magic numbers for Phase 2: Configuration Extraction

/**
 * Validation limits and constraints for System Hardening app.
 * All magic numbers centralized for maintainability.
 * 
 * @module config/validation
 */

/**
 * Weight validation limits (kg).
 * Used for body weight input validation.
 * 
 * @constant {Object}
 * @property {number} MIN - Minimum allowed weight (20 kg)
 * @property {number} MAX - Maximum allowed weight (500 kg)
 * @property {string} UNIT - Unit of measurement
 */
export const WEIGHT_LIMITS = {
    MIN: 20,
    MAX: 500,
    UNIT: 'kg'
};

/**
 * Calorie validation limits (kcal).
 * Used for meal and daily calorie tracking.
 * 
 * @constant {Object}
 * @property {number} MIN - Minimum calories (0)
 * @property {number} MAX - Maximum calories per entry (20000)
 * @property {number} DAILY_MAX - Maximum daily calories (10000)
 * @property {number} MEAL_MAX - Maximum per-meal calories (5000)
 */
export const CALORIE_LIMITS = {
    MIN: 0,
    MAX: 20000,
    DAILY_MAX: 10000,
    MEAL_MAX: 5000
};

/**
 * Macro nutrient validation limits (grams).
 * 
 * @constant {Object}
 * @property {number} MIN - Minimum value (0)
 * @property {number} MAX - Maximum value (1000g)
 */
export const MACRO_LIMITS = {
    PROTEIN: { MIN: 0, MAX: 1000, UNIT: 'g' },
    CARBS: { MIN: 0, MAX: 1000, UNIT: 'g' },
    FAT: { MIN: 0, MAX: 1000, UNIT: 'g' }
};

/**
 * Sleep tracking limits (hours).
 * 
 * @constant {Object}
 * @property {number} MIN - Minimum sleep hours (0)
 * @property {number} MAX - Maximum sleep hours (24)
 * @property {number} LOW_THRESHOLD - Warning threshold (6 hours)
 */
export const SLEEP_LIMITS = {
    MIN: 0,
    MAX: 24,
    LOW_THRESHOLD: 6
};

/**
 * Water intake limits (glasses/cups).
 * 
 * @constant {Object}
 * @property {number} MIN - Minimum glasses (0)
 * @property {number} MAX - Maximum glasses per day (50)
 * @property {number} TARGET - Daily target (8 glasses)
 */
export const WATER_LIMITS = {
    MIN: 0,
    MAX: 50,
    TARGET: 8
};

/**
 * Exercise/set tracking limits.
 * 
 * @constant {Object}
 * @property {number} WEIGHT_MIN - Minimum weight (0 kg)
 * @property {number} WEIGHT_MAX - Maximum weight (1000 kg)
 * @property {number} REPS_MIN - Minimum reps (0)
 * @property {number} REPS_MAX - Maximum reps (1000)
 * @property {number} DURATION_MAX - Maximum duration (86400 seconds = 24 hours)
 * @property {number} VOLUME_MAX - Maximum volume (1000000 kg)
 */
export const EXERCISE_LIMITS = {
    WEIGHT_MIN: 0,
    WEIGHT_MAX: 1000,
    REPS_MIN: 0,
    REPS_MAX: 1000,
    DURATION_MAX: 86400, // 24 hours in seconds
    VOLUME_MAX: 1000000
};

/**
 * Body measurement limits (cm).
 * 
 * @constant {Object}
 * @property {number} MIN - Minimum measurement (0 cm)
 * @property {number} MAX - Maximum measurement (300 cm)
 */
export const MEASUREMENT_LIMITS = {
    MIN: 0,
    MAX: 300,
    UNIT: 'cm'
};

/**
 * Streak tracking limits.
 * 
 * @constant {Object}
 * @property {number} MIN - Minimum streak (0)
 * @property {number} MAX - Maximum streak (10000 days)
 */
export const STREAK_LIMITS = {
    MIN: 0,
    MAX: 10000
};

/**
 * Mental phase limits.
 * 
 * @constant {Object}
 * @property {number} MIN_PHASE - Minimum phase number (1)
 * @property {number} MAX_PHASE - Maximum phase number (8)
 */
export const MENTAL_LIMITS = {
    MIN_PHASE: 1,
    MAX_PHASE: 8
};

/**
 * Data storage limits.
 * Limits for array/object sizes in localStorage.
 * 
 * @constant {Object}
 * @property {number} HISTORY_ENTRIES - Max history entries per exercise (100)
 * @property {number} CUSTOM_FOODS - Max custom foods (300)
 * @property {number} WORKOUT_LOG - Max tasks in workout log (128)
 * @property {number} WORKOUT_SETS - Max sets per exercise (64)
 * @property {number} MEASURE_HISTORY - Max measurement history entries (30)
 * @property {number} DAILY_PLAN_OPTIONS - Max options per meal (8)
 * @property {number} TIMESTAMP_MAX_LENGTH - Max timestamp string length (40)
 * @property {number} NAME_MAX_LENGTH - Max name string length (120)
 * @property {number} LABEL_MAX_LENGTH - Max label string length (80)
 * @property {number} CATEGORY_MAX_LENGTH - Max category string length (24)
 */
export const STORAGE_LIMITS = {
    HISTORY_ENTRIES: 100,
    CUSTOM_FOODS: 300,
    WORKOUT_LOG: 128,
    WORKOUT_SETS: 64,
    MEASURE_HISTORY: 30,
    DAILY_PLAN_OPTIONS: 8,
    TIMESTAMP_MAX_LENGTH: 40,
    NAME_MAX_LENGTH: 120,
    LABEL_MAX_LENGTH: 80,
    CATEGORY_MAX_LENGTH: 24,
    UNIT_NAME_MAX_LENGTH: 24,
    UNIT_MAX_LENGTH: 16,
    PORTION_LABEL_MAX_LENGTH: 80,
    MEAL_TEXT_MAX_LENGTH: 140
};

/**
 * Weekly summary limits.
 * 
 * @constant {Object}
 * @property {number} WEEKS_TO_SHOW - Number of weeks in summary (4)
 * @property {number} DAYS_IN_WEEK - Days per week (7)
 * @property {number} DAYS_IN_MONTH - Days per month (30)
 */
export const SUMMARY_LIMITS = {
    WEEKS_TO_SHOW: 4,
    DAYS_IN_WEEK: 7,
    DAYS_IN_MONTH: 30
};

/**
 * Combined validation limits object for easy access.
 * 
 * @constant {Object}
 */
export const VALIDATION_LIMITS = {
    WEIGHT: WEIGHT_LIMITS,
    CALORIES: CALORIE_LIMITS,
    MACROS: MACRO_LIMITS,
    SLEEP: SLEEP_LIMITS,
    WATER: WATER_LIMITS,
    EXERCISE: EXERCISE_LIMITS,
    MEASUREMENT: MEASUREMENT_LIMITS,
    STREAK: STREAK_LIMITS,
    MENTAL: MENTAL_LIMITS,
    STORAGE: STORAGE_LIMITS,
    SUMMARY: SUMMARY_LIMITS
};

/**
 * Validate a number is within bounds.
 * 
 * @param {number} value - Value to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @param {number} [fallback=0] - Fallback value if invalid
 * @returns {number} Validated number within bounds
 * 
 * @example
 * clampToRange(150, 20, 500, 45) // Returns 150 (valid)
 * clampToRange(10, 20, 500, 45)  // Returns 20 (clamped to min)
 * clampToRange(NaN, 20, 500, 45) // Returns 45 (fallback)
 */
export function clampToRange(value, min, max, fallback = 0) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(max, Math.max(min, parsed));
}

/**
 * Check if a value is a valid ISO date string (YYYY-MM-DD).
 * 
 * @param {string} value - Value to check
 * @returns {boolean} True if valid ISO date format
 */
export function isValidIsoDate(value) {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/**
 * Check if a value is a valid timestamp string.
 * 
 * @param {string} value - Value to check
 * @returns {boolean} True if valid timestamp format
 */
export function isValidTimestamp(value) {
    return typeof value === 'string' && 
           /^[0-9]{4}-[0-9]{2}-[0-9]{2}(?:T[0-9:.+\-Z]+)?$/.test(value);
}

export default VALIDATION_LIMITS;
