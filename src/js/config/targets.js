// targets.js - Nutrition and Fitness Targets
// Extracted from config.js for Phase 2: Configuration Extraction

/**
 * Nutrition and fitness target constants for System Hardening app.
 * Personal goals and milestone definitions.
 * 
 * @module config/targets
 */
import { i18n } from '../services/i18nService.js';


/**
 * Weight targets (kg).
 * START is the initial/baseline weight, GOAL is the target weight.
 * 
 * @constant {Object}
 * @property {number} START - Starting weight (45.0 kg)
 * @property {number} GOAL - Target weight (60.0 kg)
 * @property {string} UNIT - Unit of measurement
 */
export const WEIGHT_TARGETS = {
    START: 45.0,
    GOAL: 60.0,
    UNIT: 'kg'
};

/**
 * Daily calorie target (kcal).
 * 
 * @constant {Object}
 * @property {number} TARGET - Daily calorie target (3000 kcal)
 * @property {string} UNIT - Unit of measurement
 */
export const CALORIE_TARGETS = {
    TARGET: 3000,
    UNIT: 'kcal'
};

/**
 * Daily macro nutrient targets (grams).
 * Based on high-protein bulking diet.
 * 
 * @constant {Object}
 * @property {number} PROTEIN - Daily protein target (225g)
 * @property {number} CARBS - Daily carbohydrate target (375g)
 * @property {number} FAT - Daily fat target (67g)
 * @property {string} UNIT - Unit of measurement
 */
export const MACRO_TARGETS = {
    PROTEIN: 225,
    CARBS: 375,
    FAT: 67,
    UNIT: 'g'
};

/**
 * Daily water intake target (glasses).
 * 
 * @constant {Object}
 * @property {number} TARGET - Daily water target (8 glasses)
 * @property {string} UNIT - Unit description
 */
export const WATER_TARGETS = {
    TARGET: 8,
    UNIT: 'glasses'
};

/**
 * Daily sleep target (hours).
 * 
 * @constant {Object}
 * @property {number} TARGET - Daily sleep target (7.5 hours)
 * @property {string} UNIT - Unit of measurement
 */
export const SLEEP_TARGETS = {
    TARGET: 7.5,
    UNIT: 'hours'
};

/**
 * Weight milestone definitions.
 * Initialized with placeholder values, populated by initMilestones() after i18n.init().
 */
export let MILESTONES = [];

/**
 * Populates MILESTONES with translated titles. Must be called after i18n.init().
 */
export function initMilestones() {
    MILESTONES = [
        { weight: 48, title: i18n.t('db.milestones.start'), icon: "🌱" },
        { weight: 50, title: i18n.t('db.milestones.half_hundred'), icon: "⚡" },
        { weight: 55, title: i18n.t('db.milestones.half_way'), icon: "🔥" },
        { weight: 60, title: i18n.t('db.milestones.target'), icon: "🏆" }
    ];
    // Update TARGETS reference too
    TARGETS.MILESTONES = MILESTONES;
}

/**
 * Combined targets object for easy access.
 * 
 * @constant {Object}
 */
export const TARGETS = {
    WEIGHT: WEIGHT_TARGETS,
    CALORIES: CALORIE_TARGETS,
    MACROS: MACRO_TARGETS,
    WATER: WATER_TARGETS,
    SLEEP: SLEEP_TARGETS,
    MILESTONES: MILESTONES
};

/**
 * Get the next milestone for a given weight.
 * 
 * @param {number} currentWeight - Current weight in kg
 * @returns {Object|null} Next milestone object or null if all completed
 * 
 * @example
 * getNextMilestone(46) // Returns { weight: 48, title: "Başlangıç +3kg", icon: "🌱" }
 * getNextMilestone(62) // Returns null (goal reached)
 */
export function getNextMilestone(currentWeight) {
    for (const milestone of MILESTONES) {
        if (currentWeight < milestone.weight) {
            return milestone;
        }
    }
    return MILESTONES[MILESTONES.length - 1];
}

/**
 * Get all completed milestones for a given weight.
 * 
 * @param {number} currentWeight - Current weight in kg
 * @returns {Object[]} Array of completed milestone objects
 * 
 * @example
 * getCompletedMilestones(52) // Returns first 2 milestones
 */
export function getCompletedMilestones(currentWeight) {
    return MILESTONES.filter(m => currentWeight >= m.weight);
}

/**
 * Calculate progress percentage to goal.
 * 
 * @param {number} currentWeight - Current weight in kg
 * @returns {number} Progress percentage (0-100)
 * 
 * @example
 * getProgressPercentage(52.5) // Returns 50 (halfway to goal)
 */
export function getProgressPercentage(currentWeight) {
    const { START, GOAL } = WEIGHT_TARGETS;
    const totalGain = GOAL - START;
    const currentGain = currentWeight - START;
    return Math.min(100, Math.max(0, Math.round((currentGain / totalGain) * 100)));
}

/**
 * Calculate remaining weight to goal.
 * 
 * @param {number} currentWeight - Current weight in kg
 * @returns {number} Remaining kg to goal
 */
export function getRemainingToGoal(currentWeight) {
    return Math.max(0, WEIGHT_TARGETS.GOAL - currentWeight);
}

export default TARGETS;
