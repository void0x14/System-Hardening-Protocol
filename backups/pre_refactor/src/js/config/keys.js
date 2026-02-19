// keys.js - Storage Key Constants
// Extracted from config.js for Phase 2: Configuration Extraction

/**
 * localStorage key constants for System Hardening app.
 * All keys use 'monk_' prefix for namespace isolation.
 * 
 * @module config/keys
 */

/**
 * Storage keys for localStorage operations.
 * Keys ending with '_' are prefixes for date-based entries.
 * 
 * @constant {Object}
 * @property {string} WEIGHT - Current weight value
 * @property {string} FUEL - Gainer shake fuel date
 * @property {string} WORKOUT - Workout log prefix (append date)
 * @property {string} WORKOUT_DATA - Workout set data prefix (append date)
 * @property {string} MEAL - Meal log prefix (append date)
 * @property {string} MEASURE - Body measurements
 * @property {string} WEIGHT_HISTORY - Weight history object (date -> weight)
 * @property {string} CUSTOM_FOODS - User-defined custom foods
 * @property {string} DAILY_PLAN - Daily meal plan
 * @property {string} STREAK - Streak counter data
 * @property {string} BACKUP - Last backup date
 * @property {string} SLEEP - Sleep log prefix (append date)
 * @property {string} WATER - Water intake prefix (append date)
 * @property {string} EXERCISE_HISTORY - Exercise history for PR tracking
 * @property {string} MENTAL_PROGRESS - Mental phase progress
 */
export const KEYS = {
    // Single value keys
    WEIGHT: 'monk_weight',
    FUEL: 'monk_fuel_date',
    MEASURE: 'monk_body_stats',
    WEIGHT_HISTORY: 'monk_weight_history',
    CUSTOM_FOODS: 'monk_custom_foods',
    DAILY_PLAN: 'monk_daily_plan',
    STREAK: 'monk_streak_data',
    BACKUP: 'monk_last_backup_date',
    EXERCISE_HISTORY: 'monk_exercise_history',
    MENTAL_PROGRESS: 'monk_mental_progress',
    
    // Date-prefixed keys (append date string YYYY-MM-DD)
    WORKOUT: 'monk_workout_log_',
    WORKOUT_DATA: 'monk_workout_data_',
    MEAL: 'monk_meal_log_',
    SLEEP: 'monk_sleep_log_',
    WATER: 'monk_water_'
};

/**
 * Check if a key is a date-prefixed key (ends with '_').
 * These keys require appending a date string for actual storage.
 * 
 * @param {string} key - The key to check
 * @returns {boolean} True if key requires date suffix
 * 
 * @example
 * isDatePrefixedKey(KEYS.WORKOUT) // true
 * isDatePrefixedKey(KEYS.WEIGHT)  // false
 */
export function isDatePrefixedKey(key) {
    return key.endsWith('_');
}

/**
 * Create a full storage key by combining prefix with date.
 * 
 * @param {string} prefix - The key prefix (must end with '_')
 * @param {string} date - Date string in YYYY-MM-DD format
 * @returns {string} Full storage key
 * 
 * @example
 * createDatedKey(KEYS.WORKOUT, '2026-02-14')
 * // Returns: 'monk_workout_log_2026-02-14'
 */
export function createDatedKey(prefix, date) {
    if (!isDatePrefixedKey(prefix)) {
        console.warn(`[Config] Key "${prefix}" is not a date-prefixed key`);
    }
    return `${prefix}${date}`;
}

/**
 * Get all key values as an array.
 * Useful for iteration and backup operations.
 * 
 * @returns {string[]} Array of all key values
 */
export function getAllKeys() {
    return Object.values(KEYS);
}

export default KEYS;
