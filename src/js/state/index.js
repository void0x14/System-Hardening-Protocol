/**
 * Copyright (c) 2025-2026 void0x14
 */

// index.js - State Management Module Exports
// Zero-dependency state management inspired by Redux

import { Store } from '../store.js';

/**
 * State Management Module
 * 
 * This module provides a complete state management solution with:
 * - StateManager: Core state container with dispatch/subscribe pattern
 * - initialState: Default state values
 * - reducers: State transformation functions
 * - middleware: Cross-cutting concerns (logging, persistence, etc.)
 * 
 * @example
 * // Basic usage
 * import { StateManager, initialState, rootReducer } from '../state/index.js';
 * 
 * const store = new StateManager(initialState, rootReducer);
 * 
 * // Subscribe to changes
 * const unsubscribe = store.subscribe((prev, next, action) => {
 *   console.log('State changed:', action.type);
 * });
 * 
 * // Dispatch actions
 * store.dispatch({ type: 'SET_WEIGHT', payload: 75.5 });
 * 
 * // Get state
 * const state = store.getState();
 */

// Core exports
export { StateManager } from '../StateManager.js';

// State exports
export { 
    initialState, 
    createInitialState, 
    validateState, 
    mergeState,
    stateTypes,
    checkType
} from '../initialState.js';

// Reducer exports
export { 
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
} from '../reducers.js';

// Middleware exports
export { 
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
} from '../middleware.js';

/**
 * Create a fully configured store with common middleware
 * Factory function for quick setup
 * 
 * @param {Object} options - Configuration options
 * @param {Object} [options.initialState] - Initial state (uses default if not provided)
 * @param {Object} [options.storage] - Storage adapter for persistence
 * @param {boolean} [options.logging] - Enable logging middleware (default: false)
 * @param {string[]} [options.persistKeys] - State keys to persist (default: all)
 * @returns {StateManager} Configured store instance
 * 
 * @example
 * import { createStore, LocalStorageAdapter } from '../index.js';
 * 
 * const storage = new LocalStorageAdapter({ prefix: 'app_' });
 * const store = createStore({
 *   storage,
 *   logging: true,
 *   persistKeys: ['weight', 'meals', 'workoutData']
 * });
 */
export function createStore(options = {}) {
    const {
        initialState: customInitialState,
        storage,
        logging = false,
        persistKeys = null
    } = options;
    
    // Use custom initial state or default
    const state = customInitialState || initialState;
    
    // Create store
    const store = new StateManager(state, rootReducer);
    
    // Add logging middleware if enabled
    if (logging) {
        store.addMiddleware(loggingMiddleware);
    }
    
    // Add persistence middleware if storage provided
    if (storage) {
        const persistenceConfig = { key: 'state' };
        if (persistKeys) {
            persistenceConfig.whitelist = persistKeys;
        }
        store.addMiddleware(persistenceMiddleware(storage, persistenceConfig));
    }
    
    return store;
}

/**
 * Helper to create action dispatchers
 * Creates bound action creators that automatically dispatch
 * 
 * @param {StateManager} store - Store instance
 * @param {Object} actionCreators - Object of action creator functions
 * @returns {Object} Bound action creators
 * 
 * @example
 * import { bindActionCreators, actions } from '../state/index.js';
 * 
 * const boundActions = bindActionCreators(store, actions);
 * boundActions.setWeight(75.5); // Automatically dispatches
 */
export function bindActionCreators(store, actionCreators) {
    const bound = {};
    
    for (const key in actionCreators) {
        if (typeof actionCreators[key] === 'function') {
            bound[key] = (...args) => {
                const action = actionCreators[key](...args);
                return store.dispatch(action);
            };
        }
    }
    
    return bound;
}

/**
 * Combine multiple reducers into a single reducer
 * Each reducer manages its own slice of state
 * 
 * @param {Object} reducers - Object mapping state keys to reducers
 * @returns {Function} Combined reducer function
 * 
 * @example
 * const rootReducer = combineReducers({
 *   weight: weightReducer,
 *   meals: mealReducer,
 *   workouts: workoutReducer
 * });
 */
export function combineReducers(reducers) {
    const reducerKeys = Object.keys(reducers);
    
    return function combination(state = {}, action) {
        let hasChanged = false;
        const nextState = {};
        
        for (let i = 0; i < reducerKeys.length; i++) {
            const key = reducerKeys[i];
            const reducer = reducers[key];
            const previousStateForKey = state[key];
            const nextStateForKey = reducer(previousStateForKey, action);
            
            nextState[key] = nextStateForKey;
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        }
        
        return hasChanged ? nextState : state;
    };
}

// Default export for convenience
export default {
    StateManager,
    initialState,
    rootReducer,
    ActionTypes,
    actions,
    createStore,
    bindActionCreators,
    combineReducers
};
