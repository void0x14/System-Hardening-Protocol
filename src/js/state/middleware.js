// middleware.js - State Middleware Functions
// Provides logging, persistence, and other cross-cutting concerns

import { Store } from '../store.js';

/**
 * @typedef {Function} Middleware
 * @param {StateManager} store - Store instance
 * @param {Function} next - Next middleware in chain
 * @param {Action} action - Action being dispatched
 * @returns {*} Result of action processing
 */

/**
 * Logging middleware - logs all dispatched actions
 * Useful for debugging and development
 * 
 * @param {StateManager} store - Store instance
 * @param {Function} next - Next middleware function
 * @param {Action} action - Action being dispatched
 * @returns {Action} The processed action
 * 
 * @example
 * store.addMiddleware(loggingMiddleware);
 */
export const loggingMiddleware = (store, next, action) => {
    const prevState = store.getState();
    const startTime = performance.now();
    
    console.group(`%c Action: ${action.type}`, 'color: #00ff41; font-weight: bold;');
    console.log('%c Previous State:', 'color: #9e9e9e;', prevState);
    console.log('%c Payload:', 'color: #03a9f4;', action.payload);
    
    // Process action
    const result = next(action);
    
    const nextState = store.getState();
    const duration = performance.now() - startTime;
    
    console.log('%c Next State:', 'color: #4caf50;', nextState);
    console.log('%c Duration:', 'color: #ff9800;', `${duration.toFixed(2)}ms`);
    console.groupEnd();
    
    return result;
};

/**
 * Silent logging middleware - only logs errors
 * Suitable for production use
 * 
 * @param {StateManager} store - Store instance
 * @param {Function} next - Next middleware function
 * @param {Action} action - Action being dispatched
 * @returns {Action} The processed action
 */
export const silentLoggingMiddleware = (store, next, action) => {
    try {
        return next(action);
    } catch (error) {
        console.error('[StateManager] Action failed:', action.type, error);
        throw error;
    }
};

/**
 * Create persistence middleware for automatic state persistence
 * Saves state to storage after each action
 * 
 * @param {Object} storage - Storage adapter with get/set methods
 * @param {Object} options - Configuration options
 * @param {string} options.key - Storage key (default: 'app_state')
 * @param {string[]} options.whitelist - State keys to persist (default: all)
 * @param {string[]} options.blacklist - State keys to ignore
 * @param {number} options.debounce - Debounce time in ms (default: 100)
 * @returns {Function} Persistence middleware
 * 
 * @example
 * import { LocalStorageAdapter } from '../infrastructure/index.js';
 * const storage = new LocalStorageAdapter({ prefix: 'monk_' });
 * store.addMiddleware(persistenceMiddleware(storage, { key: 'state' }));
 */
export function persistenceMiddleware(storage, options = {}) {
    const {
        key = 'app_state',
        whitelist = null,
        blacklist = [],
        debounce = 100
    } = options;
    
    let saveTimeout = null;
    
    const saveState = async (state) => {
        try {
            // Filter state based on whitelist/blacklist
            let stateToSave = state;
            
            if (whitelist) {
                stateToSave = {};
                whitelist.forEach(k => {
                    if (state.hasOwnProperty(k)) {
                        stateToSave[k] = state[k];
                    }
                });
            }
            
            if (blacklist.length > 0) {
                stateToSave = { ...state };
                blacklist.forEach(k => delete stateToSave[k]);
            }
            
            await storage.set(key, stateToSave);
        } catch (error) {
            console.error('[PersistenceMiddleware] Failed to save state:', error);
        }
    };
    
    return (store, next, action) => {
        const result = next(action);
        
        // Debounce saves
        if (saveTimeout) {
            clearTimeout(saveTimeout);
        }
        
        saveTimeout = setTimeout(() => {
            saveState(store.getState());
        }, debounce);
        
        return result;
    };
}

/**
 * Throttle middleware - limits how often actions can be dispatched
 * Prevents rapid-fire updates for specific action types
 * 
 * @param {Object} options - Configuration options
 * @param {string[]} options.actionTypes - Action types to throttle
 * @param {number} options.delay - Minimum time between actions in ms
 * @returns {Function} Throttle middleware
 * 
 * @example
 * store.addMiddleware(throttleMiddleware({
 *   actionTypes: ['SET_WEIGHT', 'ADD_WATER'],
 *   delay: 500
 * }));
 */
export function throttleMiddleware(options = {}) {
    const { actionTypes = [], delay = 100 } = options;
    const lastDispatch = new Map();
    
    return (store, next, action) => {
        if (!actionTypes.includes(action.type)) {
            return next(action);
        }
        
        const now = Date.now();
        const last = lastDispatch.get(action.type) || 0;
        
        if (now - last < delay) {
            // Skip this action
            return action;
        }
        
        lastDispatch.set(action.type, now);
        return next(action);
    };
}

/**
 * Debounce middleware - delays action processing until after a quiet period
 * Useful for search inputs or rapid updates
 * 
 * @param {Object} options - Configuration options
 * @param {string[]} options.actionTypes - Action types to debounce
 * @param {number} options.delay - Delay time in ms
 * @returns {Function} Debounce middleware
 * 
 * @example
 * store.addMiddleware(debounceMiddleware({
 *   actionTypes: ['SET_SEARCH_QUERY'],
 *   delay: 300
 * }));
 */
export function debounceMiddleware(options = {}) {
    const { actionTypes = [], delay = 300 } = options;
    const timeouts = new Map();
    
    return (store, next, action) => {
        if (!actionTypes.includes(action.type)) {
            return next(action);
        }
        
        // Clear existing timeout
        if (timeouts.has(action.type)) {
            clearTimeout(timeouts.get(action.type));
        }
        
        // Set new timeout
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                const result = next(action);
                timeouts.delete(action.type);
                resolve(result);
            }, delay);
            
            timeouts.set(action.type, timeout);
        });
    };
}

/**
 * Validation middleware - validates actions before processing
 * Can reject invalid actions or transform them
 * 
 * @param {Object} validators - Object mapping action types to validator functions
 * @returns {Function} Validation middleware
 * 
 * @example
 * store.addMiddleware(validationMiddleware({
 *   SET_WEIGHT: (action) => {
 *     if (typeof action.payload !== 'number' || action.payload < 0) {
 *       throw new Error('Invalid weight value');
 *     }
 *     return action;
 *   }
 * }));
 */
export function validationMiddleware(validators = {}) {
    return (store, next, action) => {
        const validator = validators[action.type];
        
        if (validator) {
            try {
                // Validator can transform or reject the action
                const validatedAction = validator(action, store.getState());
                return next(validatedAction);
            } catch (error) {
                console.error(`[ValidationMiddleware] Action ${action.type} rejected:`, error);
                throw error;
            }
        }
        
        return next(action);
    };
}

/**
 * Error handling middleware - catches and handles errors in action processing
 * Prevents crashes from propagating
 * 
 * @param {Function} [errorHandler] - Custom error handler
 * @returns {Function} Error handling middleware
 * 
 * @example
 * store.addMiddleware(errorMiddleware((error, action, store) => {
 *   console.error('Action failed:', action.type, error);
 *   // Optionally dispatch error action
 *   store.dispatch({ type: 'ERROR_OCCURRED', payload: { error, action } });
 * }));
 */
export function errorMiddleware(errorHandler = null) {
    return (store, next, action) => {
        try {
            return next(action);
        } catch (error) {
            if (errorHandler) {
                errorHandler(error, action, store);
            } else {
                console.error('[ErrorMiddleware] Unhandled error in action:', action.type, error);
            }
            
            // Re-throw to let caller handle
            throw error;
        }
    };
}

/**
 * Action transformer middleware - transforms actions before processing
 * Useful for normalizing data or adding metadata
 * 
 * @param {Object} transformers - Object mapping action types to transformer functions
 * @returns {Function} Transformer middleware
 * 
 * @example
 * store.addMiddleware(transformMiddleware({
 *   SET_WEIGHT: (action) => ({
 *     ...action,
 *     payload: parseFloat(action.payload.toFixed(1)),
 *     meta: { timestamp: Date.now() }
 *   })
 * }));
 */
export function transformMiddleware(transformers = {}) {
    return (store, next, action) => {
        const transformer = transformers[action.type];
        
        if (transformer) {
            const transformedAction = transformer(action, store.getState());
            return next(transformedAction);
        }
        
        return next(action);
    };
}

/**
 * Timing middleware - tracks action processing time
 * Useful for performance monitoring
 * 
 * @param {Function} [onSlowAction] - Callback for slow actions
 * @param {number} [threshold=100] - Threshold in ms for slow action warning
 * @returns {Function} Timing middleware
 * 
 * @example
 * store.addMiddleware(timingMiddleware((action, duration) => {
 *   console.warn(`Slow action: ${action.type} took ${duration}ms`);
 * }, 50));
 */
export function timingMiddleware(onSlowAction = null, threshold = 100) {
    return (store, next, action) => {
        const startTime = performance.now();
        const result = next(action);
        const duration = performance.now() - startTime;
        
        if (duration > threshold && onSlowAction) {
            onSlowAction(action, duration);
        }
        
        // Add timing to action meta
        if (result && typeof result === 'object') {
            result._timing = duration;
        }
        
        return result;
    };
}

/**
 * Batch middleware - batches multiple actions into a single state update
 * Useful for reducing re-renders when multiple actions are dispatched
 * 
 * @param {number} [batchDelay=0] - Delay to wait for batching (0 = next tick)
 * @returns {Function} Batch middleware
 * 
 * @example
 * store.addMiddleware(batchMiddleware(16)); // Batch within one frame
 */
export function batchMiddleware(batchDelay = 0) {
    let batchedActions = [];
    let batchTimeout = null;
    
    const flushBatch = (store, next) => {
        if (batchedActions.length === 0) return;
        
        // Process all batched actions
        const actions = [...batchedActions];
        batchedActions = [];
        
        actions.forEach(action => next(action));
    };
    
    return (store, next, action) => {
        // Check if action should be batched
        if (action.meta && action.meta.batch === false) {
            // Process immediately
            return next(action);
        }
        
        batchedActions.push(action);
        
        if (batchTimeout) {
            clearTimeout(batchTimeout);
        }
        
        batchTimeout = setTimeout(() => {
            flushBatch(store, next);
        }, batchDelay);
        
        return action;
    };
}

/**
 * Create a middleware chain from multiple middleware functions
 * @param {...Function} middlewares - Middleware functions to chain
 * @returns {Function} Combined middleware
 * 
 * @example
 * const combinedMiddleware = composeMiddleware(
 *   loggingMiddleware,
 *   errorMiddleware(),
 *   persistenceMiddleware(storage)
 * );
 * store.addMiddleware(combinedMiddleware);
 */
export function composeMiddleware(...middlewares) {
    return (store, next, action) => {
        let index = 0;
        
        const dispatch = (act) => {
            if (index >= middlewares.length) {
                return next(act);
            }
            
            const middleware = middlewares[index++];
            return middleware(store, dispatch, act);
        };
        
        return dispatch(action);
    };
}

export default {
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
};
