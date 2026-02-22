// index.js - ConfigService and Module Exports
// Phase 2: Configuration Extraction - Unified Config Access

/**
 * ConfigService - Unified configuration access for System Hardening app.
 * Provides centralized access to all configuration modules.
 * 
 * @module config
 * @example
 * import { config } from '../config/index.js';
 * const weightKey = config.getKey('WEIGHT');
 * const calorieTarget = config.getTarget('CALORIES');
 */

import { KEYS, isDatePrefixedKey, createDatedKey, getAllKeys } from './keys.js';
import { TARGETS, MILESTONES, initMilestones, getNextMilestone, getCompletedMilestones, getProgressPercentage, getRemainingToGoal } from './targets.js';
import { VALIDATION_LIMITS, clampToRange, isValidIsoDate, isValidTimestamp } from './validation.js';
import { THEME, getClasses, getButtonVariant, COLORS, ANIMATION_DURATIONS, Z_INDEX, BREAKPOINTS, SPACING, BORDER_RADIUS } from './theme.js';

/**
 * Application version string.
 * @constant {string}
 */
const VERSION = '9.0.0';

/**
 * Debug mode flag.
 * Set to true for development debug logs.
 * @constant {boolean}
 */
const DEBUG_MODE = false;

/**
 * ConfigService class for unified configuration access.
 * Implements singleton pattern through the exported `config` instance.
 * 
 * @class ConfigService
 * @example
 * // Get storage key
 * const key = config.getKey('WEIGHT'); // 'monk_weight'
 * 
 * // Get calorie target
 * const calTarget = config.getTarget('CALORIES'); // 3000
 * 
 * // Get validation limit
 * const maxWeight = config.getLimit('WEIGHT', 'MAX'); // 500
 */
export class ConfigService {
    /**
     * Create a ConfigService instance.
     * Initializes all configuration modules.
     */
    constructor() {
        /** @type {Object} Storage keys */
        this.keys = KEYS;

        /** @type {Object} Nutrition/fitness targets */
        this.targets = TARGETS;

        /** @type {Object} Validation limits */
        this.limits = VALIDATION_LIMITS;

        /** @type {Object} UI theme constants */
        this.theme = THEME;

        /** @type {string} Application version */
        this.version = VERSION;

        /** @type {boolean} Debug mode flag */
        this.debugMode = DEBUG_MODE;
    }

    /**
     * Get application version.
     * @returns {string} Version string (e.g., '8.3.1')
     */
    getVersion() {
        return this.version;
    }

    /**
     * Get a storage key by name.
     * @param {string} name - Key name (e.g., 'WEIGHT', 'WORKOUT')
     * @returns {string|undefined} Storage key value or undefined if not found
     * 
     * @example
     * config.getKey('WEIGHT') // Returns 'monk_weight'
     * config.getKey('WORKOUT') // Returns 'monk_workout_log_'
     */
    getKey(name) {
        return this.keys[name];
    }

    /**
     * Get a target value by category and name.
     * @param {string} category - Target category ('WEIGHT', 'CALORIES', 'MACROS', 'WATER', 'SLEEP')
     * @param {string} [name] - Target name within category (optional for simple targets)
     * @returns {number|Object|undefined} Target value or undefined if not found
     * 
     * @example
     * config.getTarget('CALORIES') // Returns { TARGET: 3000, UNIT: 'kcal' }
     * config.getTarget('WEIGHT', 'GOAL') // Returns 60
     */
    getTarget(category, name) {
        const target = this.targets[category];
        if (!target) return undefined;
        if (name) return target[name];
        return target;
    }

    /**
     * Get a validation limit by category and name.
     * @param {string} category - Limit category ('WEIGHT', 'CALORIES', 'SLEEP', etc.)
     * @param {string} name - Limit name ('MIN', 'MAX', 'UNIT', etc.)
     * @returns {number|string|undefined} Limit value or undefined if not found
     * 
     * @example
     * config.getLimit('WEIGHT', 'MAX') // Returns 500
     * config.getLimit('SLEEP', 'LOW_THRESHOLD') // Returns 6
     */
    getLimit(category, name) {
        const limit = this.limits[category];
        if (!limit) return undefined;
        return limit[name];
    }

    /**
     * Get theme CSS classes for a component.
     * @param {string} component - Component name ('card', 'btn', 'input', 'label')
     * @returns {string} CSS class string
     */
    getThemeClasses(component) {
        return getClasses(component);
    }

    /**
     * Get a color value by name.
     * @param {string} name - Color name ('PRIMARY', 'BACKGROUND', 'TEXT', etc.)
     * @returns {string|undefined} Hex color value or undefined if not found
     */
    getColor(name) {
        return COLORS[name];
    }

    /**
     * Get animation duration by name.
     * @param {string} name - Duration name ('FAST', 'NORMAL', 'SLOW', 'EPIC')
     * @returns {number|undefined} Duration in milliseconds or undefined if not found
     */
    getAnimationDuration(name) {
        return ANIMATION_DURATIONS[name];
    }

    /**
     * Get z-index value by layer name.
     * @param {string} name - Layer name ('BASE', 'MODAL', 'OVERLAY', 'TOAST')
     * @returns {number|undefined} Z-index value or undefined if not found
     */
    getZIndex(name) {
        return Z_INDEX[name];
    }

    /**
     * Get breakpoint value by name.
     * @param {string} name - Breakpoint name ('SM', 'MD', 'LG', 'XL', 'XXL')
     * @returns {number|undefined} Breakpoint in pixels or undefined if not found
     */
    getBreakpoint(name) {
        return BREAKPOINTS[name];
    }

    /**
     * Check if a key requires a date suffix.
     * @param {string} key - Storage key to check
     * @returns {boolean} True if key ends with '_' (date-prefixed)
     */
    isDatePrefixedKey(key) {
        return isDatePrefixedKey(key);
    }

    /**
     * Create a full storage key with date suffix.
     * @param {string} prefix - Key prefix (e.g., KEYS.WORKOUT)
     * @param {string} date - Date string (YYYY-MM-DD format)
     * @returns {string} Full storage key
     */
    createDatedKey(prefix, date) {
        return createDatedKey(prefix, date);
    }

    /**
     * Get the next milestone for a given weight.
     * @param {number} currentWeight - Current weight in kg
     * @returns {Object} Next milestone object
     */
    getNextMilestone(currentWeight) {
        return getNextMilestone(currentWeight);
    }

    /**
     * Get all completed milestones for a given weight.
     * @param {number} currentWeight - Current weight in kg
     * @returns {Object[]} Array of completed milestones
     */
    getCompletedMilestones(currentWeight) {
        return getCompletedMilestones(currentWeight);
    }

    /**
     * Calculate progress percentage to goal.
     * @param {number} currentWeight - Current weight in kg
     * @returns {number} Progress percentage (0-100)
     */
    getProgressPercentage(currentWeight) {
        return getProgressPercentage(currentWeight);
    }

    /**
     * Validate and clamp a number to a range.
     * @param {number} value - Value to validate
     * @param {number} min - Minimum allowed value
     * @param {number} max - Maximum allowed value
     * @param {number} [fallback=0] - Fallback value if invalid
     * @returns {number} Validated number within bounds
     */
    clampToRange(value, min, max, fallback = 0) {
        return clampToRange(value, min, max, fallback);
    }

    /**
     * Check if a string is a valid ISO date (YYYY-MM-DD).
     * @param {string} value - Value to check
     * @returns {boolean} True if valid ISO date format
     */
    isValidIsoDate(value) {
        return isValidIsoDate(value);
    }

    /**
     * Check if a string is a valid timestamp.
     * @param {string} value - Value to check
     * @returns {boolean} True if valid timestamp format
     */
    isValidTimestamp(value) {
        return isValidTimestamp(value);
    }

    /**
     * Get all storage keys as an array.
     * @returns {string[]} Array of all key values
     */
    getAllKeys() {
        return getAllKeys();
    }

    /**
     * Log debug message if debug mode is enabled.
     * @param {string} message - Debug message
     * @param {...any} args - Additional arguments to log
     */
    debug(message, ...args) {
        if (this.debugMode) {
            console.log(`[Config] ${message}`, ...args);
        }
    }
}

/**
 * Singleton instance of ConfigService.
 * Use this for all configuration access throughout the application.
 * 
 * @constant {ConfigService}
 * @example
 * import { config } from '../config/index.js';
 * console.log(config.getVersion()); // '9.0.0'
 */
export const config = new ConfigService();

// Re-export all modules for direct access
export { KEYS, isDatePrefixedKey, createDatedKey, getAllKeys };
export { TARGETS, MILESTONES, initMilestones, getNextMilestone, getCompletedMilestones, getProgressPercentage, getRemainingToGoal };
export { VALIDATION_LIMITS, clampToRange, isValidIsoDate, isValidTimestamp };
export { THEME, getClasses, getButtonVariant, COLORS, ANIMATION_DURATIONS, Z_INDEX, BREAKPOINTS, SPACING, BORDER_RADIUS };

// Default export is the config singleton
export default config;

// Restore backwards compatibility for files destructing { CONFIG }
export const CONFIG = {
    VERSION: '9.0.0',
    DEBUG_MODE: false,
    KEYS,
    TARGETS: {
        ...TARGETS,
        START: TARGETS.WEIGHT.START,
        GOAL: TARGETS.WEIGHT.GOAL,
        WATER: TARGETS.WATER.TARGET,
        CAL: TARGETS.CALORIES.TARGET,
        PROT: TARGETS.MACROS.PROTEIN,
        CARB: TARGETS.MACROS.CARBS,
        FAT: TARGETS.MACROS.FAT
    },
    MILESTONES: [
        { weight: 48, title: "Başlangıç +3kg", icon: "🌱" },
        { weight: 50, title: "Yarım Yüzlük", icon: "⚡" },
        { weight: 55, title: "Yarı Yol", icon: "🔥" },
        { weight: 60, title: "HEDEF", icon: "🏆" }
    ]
};
