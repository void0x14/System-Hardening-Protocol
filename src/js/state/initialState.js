/**
 * Copyright (c) 2025-2026 void0x14
 */

// initialState.js - Default State Values
// Extracted from store.js for centralized state management

import { UI } from '../ui.js';

/**
 * Initial state for the application
 * This represents the default state when the app starts fresh
 * 
 * @typedef {Object} AppState
 * @property {number} weight - Current weight in kg
 * @property {string|null} fuelDate - Last fuel/shake date (ISO date string)
 * @property {Array} customFoods - User-defined custom foods
 * @property {Object} meals - Meal log by date
 * @property {Object|null} dailyPlan - Current day's meal plan
 * @property {string|null} selectedMuscle - Currently selected muscle in anatomy view
 * @property {string} activeTab - Current active tab
 * @property {Object} workoutData - Workout set data by date
 * @property {Object} exerciseHistory - Exercise history for PR tracking
 * @property {Object} mentalProgress - Mental phase progress
 * @property {Object} bodyMeasurements - Body measurement history
 * @property {Object} streak - Streak data
 * @property {Object} sleepData - Sleep tracking data
 * @property {Object} waterData - Water intake data
 */

/**
 * Default initial state
 * All state properties should be defined here with their default values
 */
export const initialState = {
    // === User Data ===
    /** Current weight in kg (default: 45.0 kg - starting weight) */
    weight: 45.0,
    
    /** Last fuel/shake date (ISO date string or null) */
    fuelDate: null,
    
    /** User-defined custom foods */
    customFoods: [],
    
    /** Meal log organized by date (key: date string, value: meal array) */
    meals: {},
    
    /** Current day's meal plan */
    dailyPlan: null,
    
    // === UI State ===
    /** Currently selected muscle in anatomy view */
    selectedMuscle: null,
    
    /** Current active tab */
    activeTab: 'dashboard',
    
    // === Workout Data ===
    /** Workout set data organized by date */
    workoutData: {},
    
    /** Completed workout tasks by date */
    workoutTasks: {},
    
    /** Exercise history for PR tracking */
    exerciseHistory: {},
    
    // === Mental Progress ===
    /** Mental phase progress tracking */
    mentalProgress: {
        completedPhases: [],
        dailyPractice: {},
        lastPracticeDate: null
    },
    
    // === Body Measurements ===
    /** Body measurement history */
    bodyMeasurements: {
        current: {},
        history: []
    },
    
    // === Streak Data ===
    /** Streak tracking */
    streak: {
        count: 0,
        lastDate: null
    },
    
    // === Weight History ===
    /** Weight history organized by date */
    weightHistory: {},
    
    // === Sleep & Water ===
    /** Sleep tracking data by date */
    sleepData: {},
    
    /** Water intake data by date */
    waterData: {},
    
    // === App State ===
    /** Last backup date */
    lastBackup: null,
    
    /** App version when data was last saved */
    dataVersion: null
};

/**
 * Create a new state object with defaults merged with provided values
 * @param {Partial<typeof initialState>} overrides - Values to override defaults
 * @returns {typeof initialState} New state object
 * 
 * @example
 * const state = createInitialState({ weight: 50.0, activeTab: 'training' });
 */
export function createInitialState(overrides = {}) {
    return {
        ...initialState,
        ...overrides
    };
}

/**
 * Validate that a state object has all required properties
 * @param {Object} state - State to validate
 * @returns {{ valid: boolean, missing: string[] }} Validation result
 */
export function validateState(state) {
    const requiredKeys = Object.keys(initialState);
    const missing = requiredKeys.filter(key => !(key in state));
    
    return {
        valid: missing.length === 0,
        missing
    };
}

/**
 * Merge partial state updates with current state
 * Ensures all state properties exist even if not provided in updates
 * @param {Object} currentState - Current state
 * @param {Object} updates - Partial updates to apply
 * @returns {Object} New state with updates applied
 */
export function mergeState(currentState, updates) {
    return {
        ...currentState,
        ...updates
    };
}

/**
 * State property types for runtime validation
 */
export const stateTypes = {
    weight: 'number',
    fuelDate: ['string', 'null'],
    customFoods: 'array',
    meals: 'object',
    dailyPlan: ['object', 'null'],
    selectedMuscle: ['string', 'null'],
    activeTab: 'string',
    workoutData: 'object',
    workoutTasks: 'object',
    exerciseHistory: 'object',
    mentalProgress: 'object',
    bodyMeasurements: 'object',
    streak: 'object',
    weightHistory: 'object',
    sleepData: 'object',
    waterData: 'object',
    lastBackup: ['string', 'null'],
    dataVersion: ['string', 'null']
};

/**
 * Check if a value matches the expected type
 * @param {*} value - Value to check
 * @param {string|string[]} expectedType - Expected type(s)
 * @returns {boolean} True if type matches
 */
export function checkType(value, expectedType) {
    const types = Array.isArray(expectedType) ? expectedType : [expectedType];
    const actualType = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
    return types.includes(actualType);
}

export default initialState;
