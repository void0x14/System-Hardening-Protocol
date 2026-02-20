// StateManager.js - Zero-dependency State Management
// Inspired by Redux but simplified for this project's needs

import { Store } from '../store.js';

/**
 * @typedef {Object} Action
 * @property {string} type - Action type identifier
 * @property {*} [payload] - Action payload data
 * @property {Object} [meta] - Additional metadata
 */

/**
 * @typedef {Function} Reducer
 * @param {Object} state - Current state
 * @param {Action} action - Action to process
 * @returns {Object} New state
 */

/**
 * @typedef {Function} Middleware
 * @param {StateManager} store - Store instance
 * @param {Function} next - Next middleware in chain
 * @param {Action} action - Action being dispatched
 * @returns {*} Result of action processing
 */

/**
 * @typedef {Function} Listener
 * @param {Object} prevState - Previous state
 * @param {Object} newState - New state
 * @param {Action} action - Action that caused the change
 */

/**
 * @typedef {Function} Selector
 * @param {Object} state - Current state
 * @returns {*} Selected value
 */

/**
 * Zero-dependency state management container
 * Inspired by Redux but simplified for this project
 * 
 * @example
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
 * // Get current state
 * const state = store.getState();
 * 
 * // Use selectors
 * const weight = store.select(state => state.weight);
 */
export class StateManager {
    /** @type {Object} Current state */
    #state;
    
    /** @type {Set<Listener>} State change listeners */
    #listeners = new Set();
    
    /** @type {Reducer} Root reducer function */
    #reducer;
    
    /** @type {Function[]} Middleware chain */
    #middleware = [];
    
    /** @type {boolean} Whether dispatch is in progress */
    #isDispatching = false;
    
    /** @type {Map<string, Selector>} Cached selectors */
    #selectors = new Map();

    /**
     * Create a new StateManager instance
     * @param {Object} initialState - Initial state object
     * @param {Reducer} reducer - Root reducer function
     * @throws {Error} If initialState is null or undefined
     */
    constructor(initialState, reducer) {
        if (initialState === null || initialState === undefined) {
            throw new Error('StateManager: initialState is required');
        }
        
        this.#state = this.#deepClone(initialState);
        this.#reducer = reducer || this.#defaultReducer;
        
        // Bind methods to ensure correct 'this' context
        this.dispatch = this.dispatch.bind(this);
        this.getState = this.getState.bind(this);
        this.subscribe = this.subscribe.bind(this);
    }

    /**
     * Default reducer that returns state unchanged
     * @param {Object} state - Current state
     * @param {Action} action - Action
     * @returns {Object} State unchanged
     */
    #defaultReducer(state, action) {
        return state;
    }

    /**
     * Deep clone an object to prevent mutation
     * @param {*} obj - Object to clone
     * @returns {*} Cloned object
     */
    #deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        
        if (Array.isArray(obj)) {
            return obj.map(item => this.#deepClone(item));
        }
        
        const cloned = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                cloned[key] = this.#deepClone(obj[key]);
            }
        }
        return cloned;
    }

    /**
     * Get current state (immutable copy)
     * @returns {Object} Current state
     */
    getState() {
        return this.#deepClone(this.#state);
    }

    /**
     * Get a specific value from state using a selector
     * @param {Selector} selector - Selector function
     * @returns {*} Selected value
     * 
     * @example
     * const weight = store.select(state => state.weight);
     */
    select(selector) {
        if (typeof selector !== 'function') {
            throw new Error('StateManager.select: selector must be a function');
        }
        return selector(this.getState());
    }

    /**
     * Dispatch an action to update state
     * @param {Action} action - Action to dispatch
     * @returns {Action} The dispatched action
     * @throws {Error} If action is missing type property
     * 
     * @example
     * store.dispatch({ type: 'SET_WEIGHT', payload: 75.5 });
     */
    dispatch(action) {
        if (!action || typeof action.type !== 'string') {
            throw new Error('StateManager.dispatch: action must have a string type property');
        }

        if (this.#isDispatching) {
            throw new Error('StateManager.dispatch: cannot dispatch while dispatching');
        }

        // Process through middleware chain
        if (this.#middleware.length > 0) {
            return this.#processMiddleware(action);
        }

        return this.#processAction(action);
    }

    /**
     * Process action through middleware chain
     * @param {Action} action - Action to process
     * @returns {Action} The processed action
     */
    #processMiddleware(action) {
        let index = 0;
        
        const next = (act) => {
            if (index >= this.#middleware.length) {
                return this.#processAction(act);
            }
            
            const middleware = this.#middleware[index++];
            return middleware(this, next, act);
        };
        
        return next(action);
    }

    /**
     * Process action directly (after middleware)
     * @param {Action} action - Action to process
     * @returns {Action} The processed action
     */
    #processAction(action) {
        const prevState = this.#state;
        
        try {
            this.#isDispatching = true;
            this.#state = this.#reducer(this.#deepClone(prevState), action);
        } catch (error) {
            console.error('StateManager: reducer error:', error);
            this.#state = prevState; // Rollback on error
            throw error;
        } finally {
            this.#isDispatching = false;
        }

        // Notify listeners
        this.#notifyListeners(prevState, this.#state, action);

        return action;
    }

    /**
     * Subscribe to state changes
     * @param {Listener} listener - Callback function
     * @returns {Function} Unsubscribe function
     * 
     * @example
     * const unsubscribe = store.subscribe((prev, next, action) => {
     *   console.log('State changed:', action.type);
     * });
     * 
     * // Later: stop listening
     * unsubscribe();
     */
    subscribe(listener) {
        if (typeof listener !== 'function') {
            throw new Error('StateManager.subscribe: listener must be a function');
        }

        this.#listeners.add(listener);

        // Return unsubscribe function
        return () => {
            this.#listeners.delete(listener);
        };
    }

    /**
     * Subscribe to changes in a specific part of state
     * @param {Selector} selector - Selector for the part of state to watch
     * @param {Function} callback - Callback when selected value changes
     * @returns {Function} Unsubscribe function
     * 
     * @example
     * store.subscribeTo(
     *   state => state.weight,
     *   (newWeight, oldWeight) => console.log('Weight changed:', oldWeight, '->', newWeight)
     * );
     */
    subscribeTo(selector, callback) {
        let previousValue = this.select(selector);
        
        return this.subscribe((prevState, newState, action) => {
            const newValue = selector(newState);
            
            // Only call callback if value changed
            if (newValue !== previousValue) {
                callback(newValue, previousValue, action);
                previousValue = newValue;
            }
        });
    }

    /**
     * Notify all listeners of state change
     * @param {Object} prevState - Previous state
     * @param {Object} newState - New state
     * @param {Action} action - Action that caused change
     */
    #notifyListeners(prevState, newState, action) {
        this.#listeners.forEach(listener => {
            try {
                listener(prevState, newState, action);
            } catch (error) {
                console.error('StateManager: listener error:', error);
            }
        });
    }

    /**
     * Add middleware to the processing chain
     * @param {Middleware} middleware - Middleware function
     * @returns {StateManager} This instance for chaining
     * 
     * @example
     * store.addMiddleware((store, next, action) => {
     *   console.log('Dispatching:', action.type);
     *   return next(action);
     * });
     */
    addMiddleware(middleware) {
        if (typeof middleware !== 'function') {
            throw new Error('StateManager.addMiddleware: middleware must be a function');
        }
        
        this.#middleware.push(middleware);
        return this; // Enable chaining
    }

    /**
     * Remove all middleware
     * @returns {StateManager} This instance for chaining
     */
    clearMiddleware() {
        this.#middleware = [];
        return this;
    }

    /**
     * Replace the reducer function
     * @param {Reducer} nextReducer - New reducer function
     * @returns {StateManager} This instance for chaining
     */
    replaceReducer(nextReducer) {
        if (typeof nextReducer !== 'function') {
            throw new Error('StateManager.replaceReducer: reducer must be a function');
        }
        
        this.#reducer = nextReducer;
        return this;
    }

    /**
     * Reset state to initial values
     * @param {Object} [initialState] - New initial state (optional)
     * @returns {StateManager} This instance for chaining
     */
    reset(initialState) {
        if (initialState) {
            this.#state = this.#deepClone(initialState);
        }
        return this;
    }

    /**
     * Check if two states are equal (shallow comparison)
     * @param {Object} state1 - First state
     * @param {Object} state2 - Second state
     * @returns {boolean} True if states are equal
     */
    static shallowEqual(state1, state2) {
        if (state1 === state2) return true;
        
        const keys1 = Object.keys(state1);
        const keys2 = Object.keys(state2);
        
        if (keys1.length !== keys2.length) return false;
        
        for (const key of keys1) {
            if (state1[key] !== state2[key]) return false;
        }
        
        return true;
    }

    /**
     * Create a memoized selector
     * @param {Function} selector - Selector function
     * @param {Function} [equalityFn] - Equality comparison function
     * @returns {Function} Memoized selector
     */
    static createSelector(selector, equalityFn = (a, b) => a === b) {
        let lastArgs = null;
        let lastResult = null;
        
        return (...args) => {
            if (lastArgs !== null && args.length === lastArgs.length) {
                let argsEqual = true;
                for (let i = 0; i < args.length; i++) {
                    if (!equalityFn(args[i], lastArgs[i])) {
                        argsEqual = false;
                        break;
                    }
                }
                if (argsEqual) {
                    return lastResult;
                }
            }
            
            lastArgs = args;
            lastResult = selector(...args);
            return lastResult;
        };
    }
}

export default StateManager;
