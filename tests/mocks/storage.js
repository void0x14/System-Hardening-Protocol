/**
 * Mock Storage Adapter
 * Zero external dependencies - Pure Vanilla JS
 * 
 * @fileoverview Provides an in-memory storage implementation that mimics localStorage API
 * @version 1.0.0
 */

/**
 * Mock Storage class that implements the Storage interface
 * Fully compatible with localStorage API for testing purposes
 */
export class MockStorage {
    constructor(initialData = {}) {
        this._data = new Map();
        this._listeners = new Set();
        
        // Initialize with any provided data
        for (const [key, value] of Object.entries(initialData)) {
            this._data.set(key, String(value));
        }
    }

    /**
     * Get the number of items in storage
     * @returns {number} Number of items
     */
    get length() {
        return this._data.size;
    }

    /**
     * Get an item from storage
     * @param {string} key - The key to retrieve
     * @returns {string|null} The value or null if not found
     */
    getItem(key) {
        return this._data.has(key) ? this._data.get(key) : null;
    }

    /**
     * Set an item in storage
     * @param {string} key - The key to set
     * @param {string} value - The value to store
     * @returns {undefined}
     */
    setItem(key, value) {
        const oldValue = this._data.get(key);
        const newValue = String(value);
        this._data.set(key, newValue);
        
        // Dispatch storage event
        this._dispatchStorageEvent(key, oldValue, newValue);
        
        return undefined;
    }

    /**
     * Remove an item from storage
     * @param {string} key - The key to remove
     * @returns {undefined}
     */
    removeItem(key) {
        const oldValue = this._data.get(key);
        this._data.delete(key);
        
        // Dispatch storage event
        this._dispatchStorageEvent(key, oldValue, null);
        
        return undefined;
    }

    /**
     * Clear all items from storage
     * @returns {undefined}
     */
    clear() {
        this._data.clear();
        
        // Dispatch storage event for clear
        this._dispatchStorageEvent(null, null, null);
        
        return undefined;
    }

    /**
     * Get the key at a specific index
     * @param {number} index - The index to retrieve
     * @returns {string|null} The key at that index or null
     */
    key(index) {
        const keys = Array.from(this._data.keys());
        return keys[index] !== undefined ? keys[index] : null;
    }

    /**
     * Get all keys in storage
     * @returns {string[]} Array of keys
     */
    keys() {
        return Array.from(this._data.keys());
    }

    /**
     * Get all values in storage
     * @returns {string[]} Array of values
     */
    values() {
        return Array.from(this._data.values());
    }

    /**
     * Get all entries in storage
     * @returns {[string, string][]} Array of key-value pairs
     */
    entries() {
        return Array.from(this._data.entries());
    }

    /**
     * Check if a key exists in storage
     * @param {string} key - The key to check
     * @returns {boolean} True if key exists
     */
    has(key) {
        return this._data.has(key);
    }

    /**
     * Get storage as a plain object
     * @returns {Object} Plain object representation
     */
    toObject() {
        const obj = {};
        for (const [key, value] of this._data) {
            obj[key] = value;
        }
        return obj;
    }

    /**
     * Import data from an object
     * @param {Object} data - Data to import
     */
    import(data) {
        for (const [key, value] of Object.entries(data)) {
            this._data.set(key, String(value));
        }
    }

    /**
     * Export storage data as JSON
     * @returns {string} JSON string
     */
    toJSON() {
        return JSON.stringify(this.toObject());
    }

    /**
     * Parse a JSON value from storage
     * @param {string} key - The key to retrieve
     * @param {*} defaultValue - Default value if key not found or parse fails
     * @returns {*} Parsed value or default
     */
    getJSON(key, defaultValue = null) {
        const value = this.getItem(key);
        if (value === null) {
            return defaultValue;
        }
        
        try {
            return JSON.parse(value);
        } catch (e) {
            return defaultValue;
        }
    }

    /**
     * Store a value as JSON
     * @param {string} key - The key to set
     * @param {*} value - The value to store (will be JSON stringified)
     */
    setJSON(key, value) {
        this.setItem(key, JSON.stringify(value));
    }

    /**
     * Add a storage event listener
     * @param {Function} listener - Event listener function
     */
    addEventListener(listener) {
        this._listeners.add(listener);
    }

    /**
     * Remove a storage event listener
     * @param {Function} listener - Event listener function
     */
    removeEventListener(listener) {
        this._listeners.delete(listener);
    }

    /**
     * Dispatch a storage event to all listeners
     * @param {string|null} key - The key that changed
     * @param {string|null} oldValue - The old value
     * @param {string|null} newValue - The new value
     * @private
     */
    _dispatchStorageEvent(key, oldValue, newValue) {
        const event = {
            key,
            oldValue,
            newValue,
            url: 'mock://test',
            storageArea: this
        };
        
        for (const listener of this._listeners) {
            try {
                listener(event);
            } catch (e) {
                console.error('Storage event listener error:', e);
            }
        }
    }

    /**
     * Create a snapshot of current storage state
     * @returns {Object} Snapshot object
     */
    snapshot() {
        return {
            data: this.toObject(),
            length: this.length,
            timestamp: Date.now()
        };
    }

    /**
     * Restore from a snapshot
     * @param {Object} snapshot - Snapshot to restore
     */
    restore(snapshot) {
        this.clear();
        if (snapshot && snapshot.data) {
            this.import(snapshot.data);
        }
    }

    /**
     * Reset storage to initial state
     */
    reset() {
        this.clear();
        this._listeners.clear();
    }
}

/**
 * Create a mock storage instance with optional initial data
 * @param {Object} initialData - Initial data to populate
 * @returns {MockStorage} New mock storage instance
 */
export function createMockStorage(initialData = {}) {
    return new MockStorage(initialData);
}

/**
 * Create a mock storage pre-populated with System Hardening Protocol data
 * @returns {MockStorage} Mock storage with sample data
 */
export function createSystemHardeningStorage() {
    const today = new Date().toISOString().split('T')[0];
    
    return new MockStorage({
        // Weight data
        'monk_weight': '55.5',
        
        // Daily workout log
        [`monk_workout_log_${today}`]: JSON.stringify({
            completed: ['squat', 'pushup', 'plank'],
            skipped: [],
            date: today
        }),
        
        // Workout data with sets
        [`monk_workout_data_${today}`]: JSON.stringify({
            squat: { sets: [{ reps: 10, weight: 50 }, { reps: 8, weight: 55 }] },
            pushup: { sets: [{ reps: 15 }, { reps: 12 }] },
            plank: { sets: [{ duration: 60 }] }
        }),
        
        // Meal log
        [`monk_meal_log_${today}`]: JSON.stringify([
            { meal: 'breakfast', calories: 500, protein: 30, carbs: 60, fat: 15 },
            { meal: 'lunch', calories: 700, protein: 40, carbs: 80, fat: 20 }
        ]),
        
        // Exercise history
        'monk_exercise_history': JSON.stringify([
            { exercise: 'squat', date: today, maxWeight: 55, totalVolume: 940 },
            { exercise: 'pushup', date: today, maxReps: 15, totalVolume: 0 }
        ]),
        
        // Water intake
        [`monk_water_${today}`]: '6',
        
        // Sleep data
        [`monk_sleep_${today}`]: '7.5',
        
        // Streak data
        'monk_streak': '15',
        
        // App version
        'monk_version': '9.0.0'
    });
}

/**
 * Mock localStorage for Node.js environment
 * Sets global.localStorage if not defined
 * @param {MockStorage} storage - Storage instance to use
 */
export function installMockLocalStorage(storage = null) {
    if (typeof global !== 'undefined' && !global.localStorage) {
        global.localStorage = storage || new MockStorage();
    }
    return global.localStorage;
}

/**
 * Create a storage proxy that logs all operations
 * @param {MockStorage} storage - Storage to wrap
 * @param {Object} logger - Logger object with log method
 * @returns {Proxy} Proxied storage
 */
export function createLoggedStorage(storage, logger = console) {
    return new Proxy(storage, {
        get(target, prop) {
            if (typeof target[prop] === 'function') {
                return function(...args) {
                    logger.log(`[Storage] ${prop}(${args.map(a => JSON.stringify(a)).join(', ')})`);
                    return target[prop].apply(target, args);
                };
            }
            return target[prop];
        }
    });
}

// Default export
export default {
    MockStorage,
    createMockStorage,
    createSystemHardeningStorage,
    installMockLocalStorage,
    createLoggedStorage
};
