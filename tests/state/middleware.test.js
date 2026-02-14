/**
 * Unit Tests for Middleware
 * 
 * @fileoverview Tests for state middleware functions
 */

import {
    loggingMiddleware,
    silentLoggingMiddleware,
    persistenceMiddleware,
    throttleMiddleware,
    debounceMiddleware,
    validationMiddleware,
    errorMiddleware,
    transformMiddleware,
    timingMiddleware,
    batchMiddleware,
    composeMiddleware
} from '../../src/js/state/middleware.js';
import { StateManager } from '../../src/js/state/StateManager.js';
import { MockStorage } from '../mocks/storage.js';
import {
    assertEqual,
    assertTrue,
    assertFalse,
    assertDeepEqual,
    assertLength,
    assertNotNull,
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

// Simple test reducer
function testReducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return { ...state, count: (state.count || 0) + 1 };
        case 'SET_VALUE':
            return { ...state, value: action.payload };
        case 'THROW_ERROR':
            throw new Error('Test error');
        default:
            return state;
    }
}

// Create store with middleware
function createStoreWithMiddleware(middleware, initial = { count: 0 }) {
    const store = new StateManager(initial, testReducer);
    if (middleware) {
        store.addMiddleware(middleware);
    }
    return store;
}

// ============================================
// Middleware Tests
// ============================================

describe('loggingMiddleware', () => {
    test('should log action and state changes', () => {
        const store = createStoreWithMiddleware(loggingMiddleware);
        
        // Capture console output
        const originalGroup = console.group;
        const originalLog = console.log;
        const originalGroupEnd = console.groupEnd;
        
        let logged = false;
        console.group = () => { logged = true; };
        console.log = () => {};
        console.groupEnd = () => {};
        
        store.dispatch({ type: 'INCREMENT' });
        
        console.group = originalGroup;
        console.log = originalLog;
        console.groupEnd = originalGroupEnd;
        
        assertTrue(logged);
    });
    
    test('should process action and return result', () => {
        const store = createStoreWithMiddleware(loggingMiddleware);
        
        const result = store.dispatch({ type: 'INCREMENT' });
        
        assertEqual(result.type, 'INCREMENT');
        assertEqual(store.getState().count, 1);
    });
});

describe('silentLoggingMiddleware', () => {
    test('should process action silently', () => {
        const store = createStoreWithMiddleware(silentLoggingMiddleware);
        
        store.dispatch({ type: 'INCREMENT' });
        
        assertEqual(store.getState().count, 1);
    });
    
    test('should log errors', () => {
        const store = createStoreWithMiddleware(silentLoggingMiddleware);
        
        const originalError = console.error;
        let errorLogged = false;
        console.error = () => { errorLogged = true; };
        
        try {
            store.dispatch({ type: 'THROW_ERROR' });
        } catch (e) {
            // Expected
        }
        
        console.error = originalError;
        assertTrue(errorLogged);
    });
});

describe('persistenceMiddleware', () => {
    test('should save state to storage', async () => {
        const storage = new MockStorage();
        const middleware = persistenceMiddleware(storage, { key: 'test_state', debounce: 0 });
        const store = createStoreWithMiddleware(middleware);
        
        store.dispatch({ type: 'INCREMENT' });
        
        // Wait for debounce
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const saved = await storage.get('test_state');
        assertEqual(saved.count, 1);
    });
    
    test('should use whitelist to filter state', async () => {
        const storage = new MockStorage();
        const middleware = persistenceMiddleware(storage, {
            key: 'test_state',
            whitelist: ['count'],
            debounce: 0
        });
        const store = createStoreWithMiddleware(middleware, { count: 0, value: 'test' });
        
        store.dispatch({ type: 'INCREMENT' });
        
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const saved = await storage.get('test_state');
        assertEqual(saved.count, 1);
        assertFalse(saved.value !== undefined);
    });
    
    test('should use blacklist to filter state', async () => {
        const storage = new MockStorage();
        const middleware = persistenceMiddleware(storage, {
            key: 'test_state',
            blacklist: ['value'],
            debounce: 0
        });
        const store = createStoreWithMiddleware(middleware, { count: 0, value: 'test' });
        
        store.dispatch({ type: 'INCREMENT' });
        
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const saved = await storage.get('test_state');
        assertEqual(saved.count, 1);
        assertFalse(saved.value !== undefined);
    });
});

describe('throttleMiddleware', () => {
    test('should throttle specified actions', () => {
        const middleware = throttleMiddleware({
            actionTypes: ['INCREMENT'],
            delay: 100
        });
        const store = createStoreWithMiddleware(middleware);
        
        store.dispatch({ type: 'INCREMENT' });
        assertEqual(store.getState().count, 1);
        
        // Rapid dispatch should be throttled
        store.dispatch({ type: 'INCREMENT' });
        assertEqual(store.getState().count, 1); // Still 1
    });
    
    test('should not throttle other actions', () => {
        const middleware = throttleMiddleware({
            actionTypes: ['INCREMENT'],
            delay: 100
        });
        const store = createStoreWithMiddleware(middleware);
        
        store.dispatch({ type: 'SET_VALUE', payload: 'a' });
        store.dispatch({ type: 'SET_VALUE', payload: 'b' });
        
        assertEqual(store.getState().value, 'b');
    });
});

describe('debounceMiddleware', () => {
    test('should debounce specified actions', async () => {
        const middleware = debounceMiddleware({
            actionTypes: ['SET_VALUE'],
            delay: 50
        });
        const store = createStoreWithMiddleware(middleware);
        
        store.dispatch({ type: 'SET_VALUE', payload: 'a' });
        store.dispatch({ type: 'SET_VALUE', payload: 'b' });
        store.dispatch({ type: 'SET_VALUE', payload: 'c' });
        
        // Value should not be set yet
        assertEqual(store.getState().value, undefined);
        
        // Wait for debounce
        await new Promise(resolve => setTimeout(resolve, 100));
        
        assertEqual(store.getState().value, 'c');
    });
});

describe('validationMiddleware', () => {
    test('should validate actions', () => {
        const middleware = validationMiddleware({
            SET_VALUE: (action) => {
                if (typeof action.payload !== 'string') {
                    throw new Error('Value must be string');
                }
                return action;
            }
        });
        const store = createStoreWithMiddleware(middleware);
        
        store.dispatch({ type: 'SET_VALUE', payload: 'valid' });
        assertEqual(store.getState().value, 'valid');
    });
    
    test('should reject invalid actions', () => {
        const middleware = validationMiddleware({
            SET_VALUE: (action) => {
                if (typeof action.payload !== 'string') {
                    throw new Error('Value must be string');
                }
                return action;
            }
        });
        const store = createStoreWithMiddleware(middleware);
        
        assertThrows(() => store.dispatch({ type: 'SET_VALUE', payload: 123 }));
    });
    
    test('should allow action transformation', () => {
        const middleware = validationMiddleware({
            SET_VALUE: (action) => ({
                ...action,
                payload: action.payload.toUpperCase()
            })
        });
        const store = createStoreWithMiddleware(middleware);
        
        store.dispatch({ type: 'SET_VALUE', payload: 'test' });
        assertEqual(store.getState().value, 'TEST');
    });
});

describe('errorMiddleware', () => {
    test('should catch errors', () => {
        let caughtError = null;
        const middleware = errorMiddleware((error, action, store) => {
            caughtError = error;
        });
        const store = createStoreWithMiddleware(middleware);
        
        try {
            store.dispatch({ type: 'THROW_ERROR' });
        } catch (e) {
            // Expected
        }
        
        assertNotNull(caughtError);
    });
    
    test('should re-throw error after handling', () => {
        const middleware = errorMiddleware(() => {});
        const store = createStoreWithMiddleware(middleware);
        
        assertThrows(() => store.dispatch({ type: 'THROW_ERROR' }));
    });
});

describe('transformMiddleware', () => {
    test('should transform actions', () => {
        const middleware = transformMiddleware({
            SET_VALUE: (action) => ({
                ...action,
                payload: action.payload.toUpperCase(),
                meta: { transformed: true }
            })
        });
        const store = createStoreWithMiddleware(middleware);
        
        const result = store.dispatch({ type: 'SET_VALUE', payload: 'test' });
        
        assertEqual(store.getState().value, 'TEST');
        assertTrue(result.meta.transformed);
    });
    
    test('should pass through untransformed actions', () => {
        const middleware = transformMiddleware({
            SET_VALUE: (action) => action
        });
        const store = createStoreWithMiddleware(middleware);
        
        store.dispatch({ type: 'INCREMENT' });
        
        assertEqual(store.getState().count, 1);
    });
});

describe('timingMiddleware', () => {
    test('should add timing to action', () => {
        const middleware = timingMiddleware();
        const store = createStoreWithMiddleware(middleware);
        
        const result = store.dispatch({ type: 'INCREMENT' });
        
        assertNotNull(result._timing);
    });
    
    test('should call onSlowAction for slow actions', () => {
        let slowActionCalled = false;
        const middleware = timingMiddleware((action, duration) => {
            slowActionCalled = true;
        }, 0); // 0ms threshold
        const store = createStoreWithMiddleware(middleware);
        
        store.dispatch({ type: 'INCREMENT' });
        
        assertTrue(slowActionCalled);
    });
});

describe('batchMiddleware', () => {
    test('should batch actions', async () => {
        const middleware = batchMiddleware(10);
        const store = createStoreWithMiddleware(middleware);
        
        let callCount = 0;
        store.subscribe(() => { callCount++; });
        
        store.dispatch({ type: 'INCREMENT' });
        store.dispatch({ type: 'INCREMENT' });
        store.dispatch({ type: 'INCREMENT' });
        
        // Wait for batch
        await new Promise(resolve => setTimeout(resolve, 20));
        
        // All actions should have been processed
        assertEqual(store.getState().count, 3);
    });
    
    test('should process non-batched actions immediately', () => {
        const middleware = batchMiddleware(100);
        const store = createStoreWithMiddleware(middleware);
        
        store.dispatch({ type: 'INCREMENT', meta: { batch: false } });
        
        assertEqual(store.getState().count, 1);
    });
});

describe('composeMiddleware', () => {
    test('should compose multiple middleware', () => {
        const order = [];
        
        const middleware1 = (store, next, action) => {
            order.push(1);
            return next(action);
        };
        
        const middleware2 = (store, next, action) => {
            order.push(2);
            return next(action);
        };
        
        const middleware3 = (store, next, action) => {
            order.push(3);
            return next(action);
        };
        
        const composed = composeMiddleware(middleware1, middleware2, middleware3);
        const store = createStoreWithMiddleware(composed);
        
        store.dispatch({ type: 'INCREMENT' });
        
        assertDeepEqual(order, [1, 2, 3]);
    });
    
    test('should allow early termination', () => {
        const middleware1 = (store, next, action) => {
            return action; // Don't call next
        };
        
        const middleware2 = (store, next, action) => {
            throw new Error('Should not be called');
        };
        
        const composed = composeMiddleware(middleware1, middleware2);
        const store = createStoreWithMiddleware(composed);
        
        store.dispatch({ type: 'INCREMENT' });
        
        // State should not change
        assertEqual(store.getState().count, 0);
    });
});

describe('middleware integration', () => {
    test('should work with multiple middleware in chain', () => {
        const storage = new MockStorage();
        const store = new StateManager({ count: 0 }, testReducer);
        
        // Add multiple middleware
        store
            .addMiddleware(timingMiddleware())
            .addMiddleware(validationMiddleware({
                SET_VALUE: (action) => {
                    if (action.payload.length < 3) {
                        throw new Error('Value too short');
                    }
                    return action;
                }
            }))
            .addMiddleware(persistenceMiddleware(storage, { debounce: 0 }));
        
        // Valid action
        store.dispatch({ type: 'SET_VALUE', payload: 'valid' });
        assertEqual(store.getState().value, 'valid');
        
        // Invalid action
        assertThrows(() => store.dispatch({ type: 'SET_VALUE', payload: 'ab' }));
    });
});

// Print summary
console.log('\n---');
console.log(`Middleware Tests: ${passCount}/${testCount} passed`);
if (failCount > 0) {
    console.log(`Failed: ${failCount}`);
}

// Export for test runner
export { testCount, passCount, failCount };
