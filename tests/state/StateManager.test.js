/**
 * Unit Tests for StateManager
 * 
 * @fileoverview Tests for zero-dependency state management
 */

import { StateManager } from '../../src/js/state/StateManager.js';
import { rootReducer, ActionTypes, actions } from '../../src/js/state/reducers.js';
import { initialState } from '../../src/js/state/initialState.js';
import {
    assertEqual,
    assertTrue,
    assertFalse,
    assertDeepEqual,
    assertLength,
    assertNotNull,
    assertNull,
    assertThrows
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

// Create a simple reducer for testing
function testReducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return { ...state, count: (state.count || 0) + 1 };
        case 'SET_VALUE':
            return { ...state, value: action.payload };
        default:
            return state;
    }
}

// Create store with test reducer
function createTestStore(initial = { count: 0, value: '' }) {
    return new StateManager(initial, testReducer);
}

// Create store with app reducer
function createAppStore() {
    return new StateManager(initialState, rootReducer);
}

// ============================================
// StateManager Tests
// ============================================

describe('StateManager', () => {
    
    describe('constructor', () => {
        test('should create store with initial state', () => {
            const store = createTestStore({ count: 5 });
            
            const state = store.getState();
            
            assertEqual(state.count, 5);
        });
        
        test('should throw for null initial state', () => {
            assertThrows(() => new StateManager(null, testReducer));
        });
        
        test('should throw for undefined initial state', () => {
            assertThrows(() => new StateManager(undefined, testReducer));
        });
        
        test('should work without reducer', () => {
            const store = new StateManager({ count: 0 });
            
            const state = store.getState();
            
            assertEqual(state.count, 0);
        });
    });
    
    describe('getState', () => {
        test('should return current state', () => {
            const store = createTestStore({ count: 10 });
            
            const state = store.getState();
            
            assertEqual(state.count, 10);
        });
        
        test('should return immutable copy', () => {
            const store = createTestStore({ count: 10, nested: { value: 5 } });
            
            const state1 = store.getState();
            state1.count = 20;
            state1.nested.value = 10;
            
            const state2 = store.getState();
            
            assertEqual(state2.count, 10);
            assertEqual(state2.nested.value, 5);
        });
    });
    
    describe('dispatch', () => {
        test('should update state with action', () => {
            const store = createTestStore({ count: 0 });
            
            store.dispatch({ type: 'INCREMENT' });
            
            assertEqual(store.getState().count, 1);
        });
        
        test('should return the action', () => {
            const store = createTestStore();
            
            const action = { type: 'SET_VALUE', payload: 'test' };
            const result = store.dispatch(action);
            
            assertEqual(result.type, 'SET_VALUE');
        });
        
        test('should throw for action without type', () => {
            const store = createTestStore();
            
            assertThrows(() => store.dispatch({}));
            assertThrows(() => store.dispatch({ type: 123 }));
        });
        
        test('should throw for null action', () => {
            const store = createTestStore();
            
            assertThrows(() => store.dispatch(null));
        });
        
        test('should prevent nested dispatch', () => {
            const store = createTestStore();
            
            assertThrows(() => {
                store.subscribe(() => {
                    store.dispatch({ type: 'INCREMENT' });
                });
                store.dispatch({ type: 'INCREMENT' });
            });
        });
    });
    
    describe('subscribe', () => {
        test('should call listener on state change', () => {
            const store = createTestStore();
            let called = false;
            
            store.subscribe(() => { called = true; });
            store.dispatch({ type: 'INCREMENT' });
            
            assertTrue(called);
        });
        
        test('should receive prev and next state', () => {
            const store = createTestStore({ count: 0 });
            let receivedPrev = null;
            let receivedNext = null;
            
            store.subscribe((prev, next) => {
                receivedPrev = prev;
                receivedNext = next;
            });
            
            store.dispatch({ type: 'INCREMENT' });
            
            assertEqual(receivedPrev.count, 0);
            assertEqual(receivedNext.count, 1);
        });
        
        test('should receive action', () => {
            const store = createTestStore();
            let receivedAction = null;
            
            store.subscribe((prev, next, action) => {
                receivedAction = action;
            });
            
            store.dispatch({ type: 'INCREMENT' });
            
            assertEqual(receivedAction.type, 'INCREMENT');
        });
        
        test('should return unsubscribe function', () => {
            const store = createTestStore();
            let callCount = 0;
            
            const unsubscribe = store.subscribe(() => { callCount++; });
            
            store.dispatch({ type: 'INCREMENT' });
            assertEqual(callCount, 1);
            
            unsubscribe();
            store.dispatch({ type: 'INCREMENT' });
            assertEqual(callCount, 1); // Not called again
        });
        
        test('should throw for non-function listener', () => {
            const store = createTestStore();
            
            assertThrows(() => store.subscribe('not a function'));
        });
        
        test('should handle multiple listeners', () => {
            const store = createTestStore();
            let count1 = 0;
            let count2 = 0;
            
            store.subscribe(() => { count1++; });
            store.subscribe(() => { count2++; });
            
            store.dispatch({ type: 'INCREMENT' });
            
            assertEqual(count1, 1);
            assertEqual(count2, 1);
        });
    });
    
    describe('subscribeTo', () => {
        test('should only call when selected value changes', () => {
            const store = createTestStore({ count: 0, value: 'a' });
            let callCount = 0;
            
            store.subscribeTo(
                state => state.count,
                () => { callCount++; }
            );
            
            store.dispatch({ type: 'SET_VALUE', payload: 'b' });
            assertEqual(callCount, 0); // Not called
            
            store.dispatch({ type: 'INCREMENT' });
            assertEqual(callCount, 1); // Called
        });
        
        test('should receive new and old values', () => {
            const store = createTestStore({ count: 0 });
            let receivedNew = null;
            let receivedOld = null;
            
            store.subscribeTo(
                state => state.count,
                (newVal, oldVal) => {
                    receivedNew = newVal;
                    receivedOld = oldVal;
                }
            );
            
            store.dispatch({ type: 'INCREMENT' });
            
            assertEqual(receivedNew, 1);
            assertEqual(receivedOld, 0);
        });
    });
    
    describe('select', () => {
        test('should return selected value', () => {
            const store = createTestStore({ count: 5, value: 'test' });
            
            const count = store.select(state => state.count);
            const value = store.select(state => state.value);
            
            assertEqual(count, 5);
            assertEqual(value, 'test');
        });
        
        test('should throw for non-function selector', () => {
            const store = createTestStore();
            
            assertThrows(() => store.select('not a function'));
        });
    });
    
    describe('addMiddleware', () => {
        test('should process action through middleware', () => {
            const store = createTestStore();
            let middlewareCalled = false;
            
            store.addMiddleware((store, next, action) => {
                middlewareCalled = true;
                return next(action);
            });
            
            store.dispatch({ type: 'INCREMENT' });
            
            assertTrue(middlewareCalled);
        });
        
        test('should allow middleware to modify action', () => {
            const store = createTestStore({ count: 0 });
            
            store.addMiddleware((store, next, action) => {
                if (action.type === 'SET_VALUE') {
                    return next({ ...action, payload: 'modified' });
                }
                return next(action);
            });
            
            store.dispatch({ type: 'SET_VALUE', payload: 'original' });
            
            assertEqual(store.getState().value, 'modified');
        });
        
        test('should allow middleware to block action', () => {
            const store = createTestStore({ count: 0 });
            
            store.addMiddleware((store, next, action) => {
                if (action.type === 'INCREMENT') {
                    return action; // Don't call next
                }
                return next(action);
            });
            
            store.dispatch({ type: 'INCREMENT' });
            
            assertEqual(store.getState().count, 0); // Not incremented
        });
        
        test('should return store for chaining', () => {
            const store = createTestStore();
            
            const result = store.addMiddleware(() => {});
            
            assertEqual(result, store);
        });
    });
    
    describe('clearMiddleware', () => {
        test('should remove all middleware', () => {
            const store = createTestStore();
            let callCount = 0;
            
            store.addMiddleware((store, next, action) => {
                callCount++;
                return next(action);
            });
            
            store.dispatch({ type: 'INCREMENT' });
            assertEqual(callCount, 1);
            
            store.clearMiddleware();
            store.dispatch({ type: 'INCREMENT' });
            assertEqual(callCount, 1); // Not called again
        });
    });
    
    describe('replaceReducer', () => {
        test('should replace reducer function', () => {
            const store = createTestStore({ count: 0 });
            
            const newReducer = (state, action) => {
                if (action.type === 'DOUBLE') {
                    return { ...state, count: state.count * 2 };
                }
                return state;
            };
            
            store.replaceReducer(newReducer);
            store.dispatch({ type: 'DOUBLE' });
            
            assertEqual(store.getState().count, 0); // 0 * 2 = 0
            
            store.dispatch({ type: 'INCREMENT' });
            assertEqual(store.getState().count, 0); // New reducer doesn't handle INCREMENT
        });
        
        test('should throw for non-function reducer', () => {
            const store = createTestStore();
            
            assertThrows(() => store.replaceReducer('not a function'));
        });
    });
    
    describe('reset', () => {
        test('should reset to new state', () => {
            const store = createTestStore({ count: 0 });
            
            store.dispatch({ type: 'INCREMENT' });
            assertEqual(store.getState().count, 1);
            
            store.reset({ count: 10 });
            assertEqual(store.getState().count, 10);
        });
    });
    
    describe('shallowEqual', () => {
        test('should return true for equal objects', () => {
            const obj = { a: 1, b: 2 };
            
            assertTrue(StateManager.shallowEqual(obj, obj));
        });
        
        test('should return true for shallow equal objects', () => {
            assertTrue(StateManager.shallowEqual({ a: 1 }, { a: 1 }));
            assertTrue(StateManager.shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 }));
        });
        
        test('should return false for different objects', () => {
            assertFalse(StateManager.shallowEqual({ a: 1 }, { a: 2 }));
            assertFalse(StateManager.shallowEqual({ a: 1 }, { b: 1 }));
        });
        
        test('should return false for different key counts', () => {
            assertFalse(StateManager.shallowEqual({ a: 1 }, { a: 1, b: 2 }));
        });
    });
    
    describe('createSelector', () => {
        test('should memoize selector result', () => {
            let callCount = 0;
            
            const selector = StateManager.createSelector((state) => {
                callCount++;
                return state.count * 2;
            });
            
            const state1 = { count: 5 };
            const state2 = { count: 5 };
            const state3 = { count: 10 };
            
            selector(state1);
            assertEqual(callCount, 1);
            
            selector(state2); // Same args
            assertEqual(callCount, 1); // Not called again
            
            selector(state3); // Different args
            assertEqual(callCount, 2); // Called
        });
    });
    
    describe('integration with app reducer', () => {
        test('should handle SET_WEIGHT action', () => {
            const store = createAppStore();
            
            store.dispatch(actions.setWeight(75.5));
            
            assertEqual(store.getState().weight, 75.5);
        });
        
        test('should handle SET_ACTIVE_TAB action', () => {
            const store = createAppStore();
            
            store.dispatch(actions.setActiveTab('training'));
            
            assertEqual(store.getState().activeTab, 'training');
        });
        
        test('should handle ADD_MEAL action', () => {
            const store = createAppStore();
            const date = new Date().toISOString().split('T')[0];
            
            store.dispatch(actions.addMeal({ name: 'Breakfast', calories: 500 }, date));
            
            const meals = store.getState().meals[date];
            assertLength(meals, 1);
            assertEqual(meals[0].name, 'Breakfast');
        });
        
        test('should handle TOGGLE_TASK action', () => {
            const store = createAppStore();
            const date = new Date().toISOString().split('T')[0];
            
            store.dispatch(actions.toggleTask('squat', date));
            
            const tasks = store.getState().workoutTasks[date];
            assertLength(tasks, 1);
            assertTrue(tasks.includes('squat'));
            
            // Toggle again to remove
            store.dispatch(actions.toggleTask('squat', date));
            
            const tasks2 = store.getState().workoutTasks[date];
            assertLength(tasks2, 0);
        });
        
        test('should handle RESET_STATE action', () => {
            const store = createAppStore();
            
            store.dispatch(actions.setWeight(100));
            assertEqual(store.getState().weight, 100);
            
            store.dispatch(actions.resetState());
            assertEqual(store.getState().weight, initialState.weight);
        });
    });
});

// Print summary
console.log('\n---');
console.log(`StateManager Tests: ${passCount}/${testCount} passed`);
if (failCount > 0) {
    console.log(`Failed: ${failCount}`);
}

// Export for test runner
export { testCount, passCount, failCount };
