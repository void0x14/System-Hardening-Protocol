// reducers.js - State Transformation Functions
// Handles all state changes through action dispatch

import { initialState } from './initialState.js';

import { Actions } from '../actions.js';
import { UI } from '../ui.js';

/**
 * Action type constants
 * All state changes should use these action types
 */
export const ActionTypes = {
    // === Weight Actions ===
    SET_WEIGHT: 'SET_WEIGHT',
    SAVE_WEIGHT: 'SAVE_WEIGHT',
    
    // === Fuel Actions ===
    SET_FUEL_DATE: 'SET_FUEL_DATE',
    
    // === Meal Actions ===
    ADD_MEAL: 'ADD_MEAL',
    DELETE_MEAL: 'DELETE_MEAL',
    SET_MEALS: 'SET_MEALS',
    
    // === Custom Food Actions ===
    ADD_CUSTOM_FOOD: 'ADD_CUSTOM_FOOD',
    REMOVE_CUSTOM_FOOD: 'REMOVE_CUSTOM_FOOD',
    SET_CUSTOM_FOODS: 'SET_CUSTOM_FOODS',
    
    // === Daily Plan Actions ===
    SET_DAILY_PLAN: 'SET_DAILY_PLAN',
    GENERATE_DAILY_PLAN: 'GENERATE_DAILY_PLAN',
    
    // === Workout Actions ===
    SET_WORKOUT_TASKS: 'SET_WORKOUT_TASKS',
    TOGGLE_TASK: 'TOGGLE_TASK',
    LOG_SET: 'LOG_SET',
    SET_WORKOUT_DATA: 'SET_WORKOUT_DATA',
    
    // === Exercise History Actions ===
    SAVE_EXERCISE_HISTORY: 'SAVE_EXERCISE_HISTORY',
    SET_EXERCISE_HISTORY: 'SET_EXERCISE_HISTORY',
    
    // === Mental Progress Actions ===
    UPDATE_MENTAL_PROGRESS: 'UPDATE_MENTAL_PROGRESS',
    COMPLETE_MENTAL_PHASE: 'COMPLETE_MENTAL_PHASE',
    RECORD_DAILY_PRACTICE: 'RECORD_DAILY_PRACTICE',
    
    // === Body Measurement Actions ===
    SAVE_BODY_MEASUREMENTS: 'SAVE_BODY_MEASUREMENTS',
    SET_BODY_MEASUREMENTS: 'SET_BODY_MEASUREMENTS',
    
    // === Streak Actions ===
    UPDATE_STREAK: 'UPDATE_STREAK',
    SET_STREAK: 'SET_STREAK',
    
    // === Sleep & Water Actions ===
    SET_SLEEP: 'SET_SLEEP',
    ADD_WATER: 'ADD_WATER',
    SET_WATER: 'SET_WATER',
    
    // === UI Actions ===
    SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
    SET_SELECTED_MUSCLE: 'SET_SELECTED_MUSCLE',
    
    // === Data Actions ===
    IMPORT_DATA: 'IMPORT_DATA',
    RESET_STATE: 'RESET_STATE',
    RESTORE_STATE: 'RESTORE_STATE',
    
    // === Backup Actions ===
    SET_LAST_BACKUP: 'SET_LAST_BACKUP'
};

/**
 * Create action creators for common actions
 */
export const actions = {
    setWeight: (weight) => ({ type: ActionTypes.SET_WEIGHT, payload: weight }),
    saveWeight: (weight, date) => ({ 
        type: ActionTypes.SAVE_WEIGHT, 
        payload: { weight, date } 
    }),
    setFuelDate: (date) => ({ type: ActionTypes.SET_FUEL_DATE, payload: date }),
    addMeal: (meal, date) => ({ 
        type: ActionTypes.ADD_MEAL, 
        payload: { meal, date } 
    }),
    deleteMeal: (index, date) => ({ 
        type: ActionTypes.DELETE_MEAL, 
        payload: { index, date } 
    }),
    addCustomFood: (food) => ({ type: ActionTypes.ADD_CUSTOM_FOOD, payload: food }),
    setDailyPlan: (plan) => ({ type: ActionTypes.SET_DAILY_PLAN, payload: plan }),
    toggleTask: (taskId, date) => ({ 
        type: ActionTypes.TOGGLE_TASK, 
        payload: { taskId, date } 
    }),
    logSet: (taskId, setIndex, weight, reps, date) => ({
        type: ActionTypes.LOG_SET,
        payload: { taskId, setIndex, weight, reps, date }
    }),
    setActiveTab: (tab) => ({ type: ActionTypes.SET_ACTIVE_TAB, payload: tab }),
    setSelectedMuscle: (muscle) => ({ 
        type: ActionTypes.SET_SELECTED_MUSCLE, 
        payload: muscle 
    }),
    setSleep: (hours, date) => ({ 
        type: ActionTypes.SET_SLEEP, 
        payload: { hours, date } 
    }),
    addWater: (cups, date) => ({ 
        type: ActionTypes.ADD_WATER, 
        payload: { cups, date } 
    }),
    updateStreak: (count, lastDate) => ({
        type: ActionTypes.UPDATE_STREAK,
        payload: { count, lastDate }
    }),
    resetState: () => ({ type: ActionTypes.RESET_STATE }),
    restoreState: (state) => ({ type: ActionTypes.RESTORE_STATE, payload: state })
};

/**
 * Weight reducer - handles weight-related state changes
 * @param {Object} state - Current state
 * @param {Action} action - Action to process
 * @returns {Object} New state
 */
export function weightReducer(state, action) {
    switch (action.type) {
        case ActionTypes.SET_WEIGHT:
            return {
                ...state,
                weight: action.payload
            };
            
        case ActionTypes.SAVE_WEIGHT:
            const { weight, date } = action.payload;
            return {
                ...state,
                weight,
                weightHistory: {
                    ...state.weightHistory,
                    [date]: weight
                }
            };
            
        default:
            return state;
    }
}

/**
 * Meal reducer - handles meal-related state changes
 * @param {Object} state - Current state
 * @param {Action} action - Action to process
 * @returns {Object} New state
 */
export function mealReducer(state, action) {
    switch (action.type) {
        case ActionTypes.ADD_MEAL: {
            const { meal, date } = action.payload;
            const currentMeals = state.meals[date] || [];
            return {
                ...state,
                meals: {
                    ...state.meals,
                    [date]: [...currentMeals, meal]
                }
            };
        }
        
        case ActionTypes.DELETE_MEAL: {
            const { index, date } = action.payload;
            const currentMeals = state.meals[date] || [];
            const newMeals = [...currentMeals];
            newMeals.splice(index, 1);
            return {
                ...state,
                meals: {
                    ...state.meals,
                    [date]: newMeals
                }
            };
        }
        
        case ActionTypes.SET_MEALS: {
            const { date, meals } = action.payload;
            return {
                ...state,
                meals: {
                    ...state.meals,
                    [date]: meals
                }
            };
        }
        
        case ActionTypes.ADD_CUSTOM_FOOD:
            return {
                ...state,
                customFoods: [...state.customFoods, action.payload]
            };
            
        case ActionTypes.REMOVE_CUSTOM_FOOD:
            return {
                ...state,
                customFoods: state.customFoods.filter((_, i) => i !== action.payload)
            };
            
        case ActionTypes.SET_CUSTOM_FOODS:
            return {
                ...state,
                customFoods: action.payload
            };
            
        case ActionTypes.SET_DAILY_PLAN:
            return {
                ...state,
                dailyPlan: action.payload
            };
            
        default:
            return state;
    }
}

/**
 * Workout reducer - handles workout-related state changes
 * @param {Object} state - Current state
 * @param {Action} action - Action to process
 * @returns {Object} New state
 */
export function workoutReducer(state, action) {
    switch (action.type) {
        case ActionTypes.SET_WORKOUT_TASKS: {
            const { date, tasks } = action.payload;
            return {
                ...state,
                workoutTasks: {
                    ...state.workoutTasks,
                    [date]: tasks
                }
            };
        }
        
        case ActionTypes.TOGGLE_TASK: {
            const { taskId, date } = action.payload;
            const currentTasks = state.workoutTasks[date] || [];
            const hasTask = currentTasks.includes(taskId);
            const newTasks = hasTask
                ? currentTasks.filter(id => id !== taskId)
                : [...currentTasks, taskId];
            return {
                ...state,
                workoutTasks: {
                    ...state.workoutTasks,
                    [date]: newTasks
                }
            };
        }
        
        case ActionTypes.LOG_SET: {
            const { taskId, setIndex, weight, reps, date } = action.payload;
            const dateKey = date;
            const currentData = state.workoutData[dateKey] || {};
            const taskSets = currentData[taskId] || [];
            const newSets = [...taskSets];
            newSets[setIndex] = {
                weight,
                reps,
                timestamp: new Date().toISOString(),
                completed: true
            };
            return {
                ...state,
                workoutData: {
                    ...state.workoutData,
                    [dateKey]: {
                        ...currentData,
                        [taskId]: newSets
                    }
                }
            };
        }
        
        case ActionTypes.SET_WORKOUT_DATA: {
            const { date, data } = action.payload;
            return {
                ...state,
                workoutData: {
                    ...state.workoutData,
                    [date]: data
                }
            };
        }
        
        case ActionTypes.SAVE_EXERCISE_HISTORY: {
            const { exerciseId, entry } = action.payload;
            const currentHistory = state.exerciseHistory[exerciseId] || [];
            const newHistory = [...currentHistory, entry].slice(-100); // Keep last 100
            return {
                ...state,
                exerciseHistory: {
                    ...state.exerciseHistory,
                    [exerciseId]: newHistory
                }
            };
        }
        
        case ActionTypes.SET_EXERCISE_HISTORY:
            return {
                ...state,
                exerciseHistory: action.payload
            };
            
        default:
            return state;
    }
}

/**
 * Mental progress reducer - handles mental phase state changes
 * @param {Object} state - Current state
 * @param {Action} action - Action to process
 * @returns {Object} New state
 */
export function mentalReducer(state, action) {
    switch (action.type) {
        case ActionTypes.COMPLETE_MENTAL_PHASE: {
            const phase = action.payload;
            const completedPhases = state.mentalProgress.completedPhases || [];
            if (completedPhases.includes(phase)) return state;
            return {
                ...state,
                mentalProgress: {
                    ...state.mentalProgress,
                    completedPhases: [...completedPhases, phase]
                }
            };
        }
        
        case ActionTypes.RECORD_DAILY_PRACTICE: {
            const { date, done } = action.payload;
            return {
                ...state,
                mentalProgress: {
                    ...state.mentalProgress,
                    dailyPractice: {
                        ...state.mentalProgress.dailyPractice,
                        [date]: done
                    },
                    lastPracticeDate: date
                }
            };
        }
        
        case ActionTypes.UPDATE_MENTAL_PROGRESS:
            return {
                ...state,
                mentalProgress: {
                    ...state.mentalProgress,
                    ...action.payload
                }
            };
            
        default:
            return state;
    }
}

/**
 * Stats reducer - handles statistics and tracking state changes
 * @param {Object} state - Current state
 * @param {Action} action - Action to process
 * @returns {Object} New state
 */
export function statsReducer(state, action) {
    switch (action.type) {
        case ActionTypes.SAVE_BODY_MEASUREMENTS: {
            const measurements = action.payload;
            const today = new Date().toISOString().split('T')[0];
            const current = state.bodyMeasurements.current || {};
            const history = state.bodyMeasurements.history || [];
            
            // Add current to history if it exists
            let newHistory = history;
            if (Object.keys(current).length > 0 && current.chest) {
                newHistory = [...history, {
                    date: current.savedAt || today,
                    ...current
                }].slice(-30);
            }
            
            return {
                ...state,
                bodyMeasurements: {
                    current: { ...measurements, savedAt: today },
                    history: newHistory
                }
            };
        }
        
        case ActionTypes.SET_BODY_MEASUREMENTS:
            return {
                ...state,
                bodyMeasurements: action.payload
            };
            
        case ActionTypes.UPDATE_STREAK: {
            const { count, lastDate } = action.payload;
            return {
                ...state,
                streak: { count, lastDate }
            };
        }
        
        case ActionTypes.SET_STREAK:
            return {
                ...state,
                streak: action.payload
            };
            
        case ActionTypes.SET_SLEEP: {
            const { hours, date } = action.payload;
            return {
                ...state,
                sleepData: {
                    ...state.sleepData,
                    [date]: hours
                }
            };
        }
        
        case ActionTypes.ADD_WATER: {
            const { cups, date } = action.payload;
            const current = state.waterData[date] || 0;
            return {
                ...state,
                waterData: {
                    ...state.waterData,
                    [date]: current + cups
                }
            };
        }
        
        case ActionTypes.SET_WATER: {
            const { cups, date } = action.payload;
            return {
                ...state,
                waterData: {
                    ...state.waterData,
                    [date]: cups
                }
            };
        }
        
        default:
            return state;
    }
}

/**
 * UI reducer - handles UI-related state changes
 * @param {Object} state - Current state
 * @param {Action} action - Action to process
 * @returns {Object} New state
 */
export function uiReducer(state, action) {
    switch (action.type) {
        case ActionTypes.SET_ACTIVE_TAB:
            return {
                ...state,
                activeTab: action.payload
            };
            
        case ActionTypes.SET_SELECTED_MUSCLE:
            return {
                ...state,
                selectedMuscle: action.payload
            };
            
        default:
            return state;
    }
}

/**
 * System reducer - handles system-level state changes
 * @param {Object} state - Current state
 * @param {Action} action - Action to process
 * @returns {Object} New state
 */
export function systemReducer(state, action) {
    switch (action.type) {
        case ActionTypes.SET_FUEL_DATE:
            return {
                ...state,
                fuelDate: action.payload
            };
            
        case ActionTypes.SET_LAST_BACKUP:
            return {
                ...state,
                lastBackup: action.payload
            };
            
        case ActionTypes.RESET_STATE:
            return { ...initialState };
            
        case ActionTypes.RESTORE_STATE:
            return { ...action.payload };
            
        case ActionTypes.IMPORT_DATA:
            return {
                ...state,
                ...action.payload
            };
            
        default:
            return state;
    }
}

/**
 * Root reducer - combines all reducers
 * Processes actions through all reducers in sequence
 * 
 * @param {Object} state - Current state
 * @param {Action} action - Action to process
 * @returns {Object} New state
 */
export function rootReducer(state, action) {
    // Start with current state
    let newState = state;
    
    // Process through each reducer
    newState = weightReducer(newState, action);
    newState = mealReducer(newState, action);
    newState = workoutReducer(newState, action);
    newState = mentalReducer(newState, action);
    newState = statsReducer(newState, action);
    newState = uiReducer(newState, action);
    newState = systemReducer(newState, action);
    
    return newState;
}

/**
 * Create a reducer that handles multiple action types with the same handler
 * @param {Object} handlers - Object mapping action types to handlers
 * @param {Object} initialState - Initial state for this reducer
 * @returns {Function} Reducer function
 * 
 * @example
 * const myReducer = createReducer({
 *   [ActionTypes.SET_WEIGHT]: (state, action) => ({ ...state, weight: action.payload }),
 *   [ActionTypes.RESET_STATE]: () => initialState
 * }, initialState);
 */
export function createReducer(handlers, initialState) {
    return function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action);
        }
        return state;
    };
}

export default rootReducer;
