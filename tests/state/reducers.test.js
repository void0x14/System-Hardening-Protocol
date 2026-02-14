/**
 * Unit Tests for Reducers
 * 
 * @fileoverview Tests for state transformation functions
 */

import {
    rootReducer,
    weightReducer,
    mealReducer,
    workoutReducer,
    mentalReducer,
    statsReducer,
    uiReducer,
    systemReducer,
    ActionTypes,
    actions,
    createReducer
} from '../../src/js/state/reducers.js';
import { initialState } from '../../src/js/state/initialState.js';
import {
    assertEqual,
    assertTrue,
    assertFalse,
    assertDeepEqual,
    assertLength,
    assertNotNull,
    assertNull
} from '../assert.js';

// Test utilities
let testCount = 0;
let passCount = 0;
let failCount = 0;

function test(name, fn) {
    testCount++;
    try {
        fn();
        passCount++;
        console.log(`  ✓ ${name}`);
    } catch (e) {
        failCount++;
        console.log(`  ✗ ${name}\n    ${e.message}`);
    }
}

function describe(name, fn) {
    console.log(`\n=== ${name} ===`);
    fn();
}

// Get today's date string
function getTodayStr() {
    return new Date().toISOString().split('T')[0];
}

// ============================================
// Reducers Tests
// ============================================

describe('ActionTypes', () => {
    test('should define weight action types', () => {
        assertNotNull(ActionTypes.SET_WEIGHT);
        assertNotNull(ActionTypes.SAVE_WEIGHT);
    });
    
    test('should define meal action types', () => {
        assertNotNull(ActionTypes.ADD_MEAL);
        assertNotNull(ActionTypes.DELETE_MEAL);
        assertNotNull(ActionTypes.SET_MEALS);
    });
    
    test('should define workout action types', () => {
        assertNotNull(ActionTypes.TOGGLE_TASK);
        assertNotNull(ActionTypes.LOG_SET);
        assertNotNull(ActionTypes.SET_WORKOUT_DATA);
    });
    
    test('should define system action types', () => {
        assertNotNull(ActionTypes.RESET_STATE);
        assertNotNull(ActionTypes.RESTORE_STATE);
        assertNotNull(ActionTypes.IMPORT_DATA);
    });
});

describe('actions creators', () => {
    test('should create SET_WEIGHT action', () => {
        const action = actions.setWeight(75.5);
        
        assertEqual(action.type, ActionTypes.SET_WEIGHT);
        assertEqual(action.payload, 75.5);
    });
    
    test('should create SAVE_WEIGHT action', () => {
        const action = actions.saveWeight(75.5, '2026-02-14');
        
        assertEqual(action.type, ActionTypes.SAVE_WEIGHT);
        assertEqual(action.payload.weight, 75.5);
        assertEqual(action.payload.date, '2026-02-14');
    });
    
    test('should create ADD_MEAL action', () => {
        const meal = { name: 'Breakfast', calories: 500 };
        const action = actions.addMeal(meal, '2026-02-14');
        
        assertEqual(action.type, ActionTypes.ADD_MEAL);
        assertEqual(action.payload.meal, meal);
        assertEqual(action.payload.date, '2026-02-14');
    });
    
    test('should create TOGGLE_TASK action', () => {
        const action = actions.toggleTask('squat', '2026-02-14');
        
        assertEqual(action.type, ActionTypes.TOGGLE_TASK);
        assertEqual(action.payload.taskId, 'squat');
        assertEqual(action.payload.date, '2026-02-14');
    });
    
    test('should create SET_ACTIVE_TAB action', () => {
        const action = actions.setActiveTab('training');
        
        assertEqual(action.type, ActionTypes.SET_ACTIVE_TAB);
        assertEqual(action.payload, 'training');
    });
    
    test('should create RESET_STATE action', () => {
        const action = actions.resetState();
        
        assertEqual(action.type, ActionTypes.RESET_STATE);
    });
    
    test('should create RESTORE_STATE action', () => {
        const state = { weight: 75 };
        const action = actions.restoreState(state);
        
        assertEqual(action.type, ActionTypes.RESTORE_STATE);
        assertEqual(action.payload, state);
    });
});

describe('weightReducer', () => {
    test('should handle SET_WEIGHT', () => {
        const state = { weight: 70, other: 'value' };
        const action = { type: ActionTypes.SET_WEIGHT, payload: 75.5 };
        
        const result = weightReducer(state, action);
        
        assertEqual(result.weight, 75.5);
        assertEqual(result.other, 'value'); // preserved
    });
    
    test('should handle SAVE_WEIGHT', () => {
        const state = { weight: 70, weightHistory: {} };
        const action = {
            type: ActionTypes.SAVE_WEIGHT,
            payload: { weight: 75.5, date: '2026-02-14' }
        };
        
        const result = weightReducer(state, action);
        
        assertEqual(result.weight, 75.5);
        assertEqual(result.weightHistory['2026-02-14'], 75.5);
    });
    
    test('should return unchanged state for unknown action', () => {
        const state = { weight: 70 };
        const action = { type: 'UNKNOWN_ACTION' };
        
        const result = weightReducer(state, action);
        
        assertEqual(result, state);
    });
});

describe('mealReducer', () => {
    test('should handle ADD_MEAL', () => {
        const state = { meals: {} };
        const meal = { name: 'Breakfast', calories: 500 };
        const action = {
            type: ActionTypes.ADD_MEAL,
            payload: { meal, date: '2026-02-14' }
        };
        
        const result = mealReducer(state, action);
        
        assertLength(result.meals['2026-02-14'], 1);
        assertEqual(result.meals['2026-02-14'][0].name, 'Breakfast');
    });
    
    test('should append to existing meals', () => {
        const state = {
            meals: {
                '2026-02-14': [{ name: 'Breakfast' }]
            }
        };
        const action = {
            type: ActionTypes.ADD_MEAL,
            payload: {
                meal: { name: 'Lunch' },
                date: '2026-02-14'
            }
        };
        
        const result = mealReducer(state, action);
        
        assertLength(result.meals['2026-02-14'], 2);
    });
    
    test('should handle DELETE_MEAL', () => {
        const state = {
            meals: {
                '2026-02-14': [
                    { name: 'Breakfast' },
                    { name: 'Lunch' },
                    { name: 'Dinner' }
                ]
            }
        };
        const action = {
            type: ActionTypes.DELETE_MEAL,
            payload: { index: 1, date: '2026-02-14' }
        };
        
        const result = mealReducer(state, action);
        
        assertLength(result.meals['2026-02-14'], 2);
        assertEqual(result.meals['2026-02-14'][1].name, 'Dinner');
    });
    
    test('should handle ADD_CUSTOM_FOOD', () => {
        const state = { customFoods: [] };
        const action = {
            type: ActionTypes.ADD_CUSTOM_FOOD,
            payload: { name: 'Protein Bar', calories: 200 }
        };
        
        const result = mealReducer(state, action);
        
        assertLength(result.customFoods, 1);
        assertEqual(result.customFoods[0].name, 'Protein Bar');
    });
    
    test('should handle REMOVE_CUSTOM_FOOD', () => {
        const state = {
            customFoods: [
                { name: 'Food 1' },
                { name: 'Food 2' }
            ]
        };
        const action = {
            type: ActionTypes.REMOVE_CUSTOM_FOOD,
            payload: 0
        };
        
        const result = mealReducer(state, action);
        
        assertLength(result.customFoods, 1);
        assertEqual(result.customFoods[0].name, 'Food 2');
    });
    
    test('should handle SET_DAILY_PLAN', () => {
        const state = { dailyPlan: null };
        const plan = { date: '2026-02-14', plan: {} };
        const action = {
            type: ActionTypes.SET_DAILY_PLAN,
            payload: plan
        };
        
        const result = mealReducer(state, action);
        
        assertEqual(result.dailyPlan, plan);
    });
});

describe('workoutReducer', () => {
    test('should handle TOGGLE_TASK - add task', () => {
        const state = { workoutTasks: {} };
        const action = {
            type: ActionTypes.TOGGLE_TASK,
            payload: { taskId: 'squat', date: '2026-02-14' }
        };
        
        const result = workoutReducer(state, action);
        
        assertLength(result.workoutTasks['2026-02-14'], 1);
        assertTrue(result.workoutTasks['2026-02-14'].includes('squat'));
    });
    
    test('should handle TOGGLE_TASK - remove task', () => {
        const state = {
            workoutTasks: {
                '2026-02-14': ['squat', 'bench']
            }
        };
        const action = {
            type: ActionTypes.TOGGLE_TASK,
            payload: { taskId: 'squat', date: '2026-02-14' }
        };
        
        const result = workoutReducer(state, action);
        
        assertLength(result.workoutTasks['2026-02-14'], 1);
        assertFalse(result.workoutTasks['2026-02-14'].includes('squat'));
    });
    
    test('should handle LOG_SET', () => {
        const state = { workoutData: {} };
        const action = {
            type: ActionTypes.LOG_SET,
            payload: {
                taskId: 'squat',
                setIndex: 0,
                weight: 100,
                reps: 5,
                date: '2026-02-14'
            }
        };
        
        const result = workoutReducer(state, action);
        
        const sets = result.workoutData['2026-02-14']['squat'];
        assertLength(sets, 1);
        assertEqual(sets[0].weight, 100);
        assertEqual(sets[0].reps, 5);
        assertTrue(sets[0].completed);
    });
    
    test('should handle SAVE_EXERCISE_HISTORY', () => {
        const state = { exerciseHistory: {} };
        const action = {
            type: ActionTypes.SAVE_EXERCISE_HISTORY,
            payload: {
                exerciseId: 'squat',
                entry: { weight: 100, reps: 5, volume: 500 }
            }
        };
        
        const result = workoutReducer(state, action);
        
        assertLength(result.exerciseHistory['squat'], 1);
        assertEqual(result.exerciseHistory['squat'][0].volume, 500);
    });
});

describe('mentalReducer', () => {
    test('should handle COMPLETE_MENTAL_PHASE', () => {
        const state = {
            mentalProgress: {
                completedPhases: []
            }
        };
        const action = {
            type: ActionTypes.COMPLETE_MENTAL_PHASE,
            payload: 1
        };
        
        const result = mentalReducer(state, action);
        
        assertLength(result.mentalProgress.completedPhases, 1);
        assertTrue(result.mentalProgress.completedPhases.includes(1));
    });
    
    test('should not duplicate phases', () => {
        const state = {
            mentalProgress: {
                completedPhases: [1, 2]
            }
        };
        const action = {
            type: ActionTypes.COMPLETE_MENTAL_PHASE,
            payload: 1
        };
        
        const result = mentalReducer(state, action);
        
        assertLength(result.mentalProgress.completedPhases, 2);
    });
    
    test('should handle RECORD_DAILY_PRACTICE', () => {
        const state = {
            mentalProgress: {
                dailyPractice: {}
            }
        };
        const action = {
            type: ActionTypes.RECORD_DAILY_PRACTICE,
            payload: { date: '2026-02-14', done: true }
        };
        
        const result = mentalReducer(state, action);
        
        assertTrue(result.mentalProgress.dailyPractice['2026-02-14']);
        assertEqual(result.mentalProgress.lastPracticeDate, '2026-02-14');
    });
});

describe('statsReducer', () => {
    test('should handle UPDATE_STREAK', () => {
        const state = { streak: { count: 0, lastDate: null } };
        const action = {
            type: ActionTypes.UPDATE_STREAK,
            payload: { count: 10, lastDate: '2026-02-14' }
        };
        
        const result = statsReducer(state, action);
        
        assertEqual(result.streak.count, 10);
        assertEqual(result.streak.lastDate, '2026-02-14');
    });
    
    test('should handle SET_SLEEP', () => {
        const state = { sleepData: {} };
        const action = {
            type: ActionTypes.SET_SLEEP,
            payload: { hours: 8, date: '2026-02-14' }
        };
        
        const result = statsReducer(state, action);
        
        assertEqual(result.sleepData['2026-02-14'], 8);
    });
    
    test('should handle ADD_WATER', () => {
        const state = { waterData: { '2026-02-14': 5 } };
        const action = {
            type: ActionTypes.ADD_WATER,
            payload: { cups: 2, date: '2026-02-14' }
        };
        
        const result = statsReducer(state, action);
        
        assertEqual(result.waterData['2026-02-14'], 7);
    });
    
    test('should handle SET_WATER', () => {
        const state = { waterData: {} };
        const action = {
            type: ActionTypes.SET_WATER,
            payload: { cups: 8, date: '2026-02-14' }
        };
        
        const result = statsReducer(state, action);
        
        assertEqual(result.waterData['2026-02-14'], 8);
    });
    
    test('should handle SAVE_BODY_MEASUREMENTS', () => {
        const state = {
            bodyMeasurements: {
                current: {},
                history: []
            }
        };
        const action = {
            type: ActionTypes.SAVE_BODY_MEASUREMENTS,
            payload: { chest: 100, arm: 35 }
        };
        
        const result = statsReducer(state, action);
        
        assertEqual(result.bodyMeasurements.current.chest, 100);
        assertEqual(result.bodyMeasurements.current.arm, 35);
    });
});

describe('uiReducer', () => {
    test('should handle SET_ACTIVE_TAB', () => {
        const state = { activeTab: 'dashboard' };
        const action = {
            type: ActionTypes.SET_ACTIVE_TAB,
            payload: 'training'
        };
        
        const result = uiReducer(state, action);
        
        assertEqual(result.activeTab, 'training');
    });
    
    test('should handle SET_SELECTED_MUSCLE', () => {
        const state = { selectedMuscle: null };
        const action = {
            type: ActionTypes.SET_SELECTED_MUSCLE,
            payload: 'chest'
        };
        
        const result = uiReducer(state, action);
        
        assertEqual(result.selectedMuscle, 'chest');
    });
});

describe('systemReducer', () => {
    test('should handle SET_FUEL_DATE', () => {
        const state = { fuelDate: null };
        const action = {
            type: ActionTypes.SET_FUEL_DATE,
            payload: '2026-02-14'
        };
        
        const result = systemReducer(state, action);
        
        assertEqual(result.fuelDate, '2026-02-14');
    });
    
    test('should handle SET_LAST_BACKUP', () => {
        const state = { lastBackup: null };
        const action = {
            type: ActionTypes.SET_LAST_BACKUP,
            payload: '2026-02-14'
        };
        
        const result = systemReducer(state, action);
        
        assertEqual(result.lastBackup, '2026-02-14');
    });
    
    test('should handle RESET_STATE', () => {
        const state = { weight: 100, activeTab: 'training' };
        const action = { type: ActionTypes.RESET_STATE };
        
        const result = systemReducer(state, action);
        
        assertDeepEqual(result, initialState);
    });
    
    test('should handle RESTORE_STATE', () => {
        const state = { weight: 70 };
        const newState = { weight: 80, activeTab: 'nutrition' };
        const action = {
            type: ActionTypes.RESTORE_STATE,
            payload: newState
        };
        
        const result = systemReducer(state, action);
        
        assertEqual(result.weight, 80);
        assertEqual(result.activeTab, 'nutrition');
    });
    
    test('should handle IMPORT_DATA', () => {
        const state = { weight: 70, streak: { count: 5 } };
        const action = {
            type: ActionTypes.IMPORT_DATA,
            payload: { weight: 75, streak: { count: 10 } }
        };
        
        const result = systemReducer(state, action);
        
        assertEqual(result.weight, 75);
        assertEqual(result.streak.count, 10);
    });
});

describe('rootReducer', () => {
    test('should process action through all reducers', () => {
        const state = { ...initialState };
        
        const result = rootReducer(state, {
            type: ActionTypes.SET_WEIGHT,
            payload: 75.5
        });
        
        assertEqual(result.weight, 75.5);
    });
    
    test('should preserve state for unknown action', () => {
        const state = { weight: 70, activeTab: 'dashboard' };
        
        const result = rootReducer(state, { type: 'UNKNOWN_ACTION' });
        
        assertEqual(result.weight, 70);
        assertEqual(result.activeTab, 'dashboard');
    });
    
    test('should handle multiple state changes', () => {
        let state = { ...initialState };
        
        state = rootReducer(state, actions.setWeight(75));
        state = rootReducer(state, actions.setActiveTab('training'));
        state = rootReducer(state, actions.toggleTask('squat', '2026-02-14'));
        
        assertEqual(state.weight, 75);
        assertEqual(state.activeTab, 'training');
        assertTrue(state.workoutTasks['2026-02-14'].includes('squat'));
    });
});

describe('createReducer', () => {
    test('should create reducer from handlers', () => {
        const reducer = createReducer({
            INCREMENT: (state, action) => ({ ...state, count: state.count + 1 }),
            SET_VALUE: (state, action) => ({ ...state, value: action.payload })
        }, { count: 0, value: '' });
        
        let state = reducer(undefined, { type: 'INIT' });
        assertEqual(state.count, 0);
        
        state = reducer(state, { type: 'INCREMENT' });
        assertEqual(state.count, 1);
        
        state = reducer(state, { type: 'SET_VALUE', payload: 'test' });
        assertEqual(state.value, 'test');
    });
    
    test('should return state for unhandled action', () => {
        const reducer = createReducer({
            INCREMENT: (state) => ({ ...state, count: state.count + 1 })
        }, { count: 0 });
        
        const state = { count: 5 };
        const result = reducer(state, { type: 'UNKNOWN' });
        
        assertEqual(result, state);
    });
});

// Print summary
console.log('\n---');
console.log(`Reducers Tests: ${passCount}/${testCount} passed`);
if (failCount > 0) {
    console.log(`Failed: ${failCount}`);
}

// Export for test runner
export { testCount, passCount, failCount };
