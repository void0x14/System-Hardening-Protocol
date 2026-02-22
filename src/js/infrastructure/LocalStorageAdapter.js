/**
 * LocalStorageAdapter - localStorage implementation of StorageAdapter
 * 
 * Provides persistent storage using the browser's localStorage API.
 * All values are serialized to JSON for storage.
 * 
 * @module infrastructure/LocalStorageAdapter
 * @since Phase 3
 */

import { StorageAdapter } from './StorageAdapter.js';

/**
 * LocalStorage adapter for browser persistence
 * @extends StorageAdapter
 * 
 * @example
 * const storage = new LocalStorageAdapter();
 * await storage.set('user', { name: 'John' });
 * const user = await storage.get('user'); // { name: 'John' }
 */
export class LocalStorageAdapter extends StorageAdapter {
    /**
     * Create a new LocalStorageAdapter
     * @param {Object} [options] - Configuration options
     * @param {string} [options.prefix=''] - Optional key prefix for namespacing
     */
    constructor(options = {}) {
        super();
        this.prefix = options.prefix || '';
    }

    /**
     * Add prefix to key if configured
     * @private
     * @param {string} key - Original key
     * @returns {string} Prefixed key
     */
    _prefixKey(key) {
        return this.prefix ? `${this.prefix}${key}` : key;
    }

    /**
     * Get a value from localStorage by key
     * @param {string} key - Storage key
     * @returns {Promise<*>} Stored value or null if not found
     */
    async get(key) {
        try {
            const prefixedKey = this._prefixKey(key);
            const item = localStorage.getItem(prefixedKey);
            if (item === null) {
                return null;
            }
            return JSON.parse(item);
        } catch (error) {
            console.error(`LocalStorageAdapter.get() error for key "${key}":`, error);
            return null;
        }
    }

    /**
     * Set a value in localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store (will be JSON serialized)
     * @returns {Promise<boolean>} True if successful
     * @throws {Error} If storage quota exceeded or serialization fails
     */
    async set(key, value) {
        try {
            const prefixedKey = this._prefixKey(key);
            const serialized = JSON.stringify(value);
            localStorage.setItem(prefixedKey, serialized);
            return true;
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('LocalStorageAdapter.set() - Storage quota exceeded');
                throw new Error('Storage quota exceeded. Consider clearing old data.');
            }
            console.error(`LocalStorageAdapter.set() error for key "${key}":`, error);
            throw error;
        }
    }

    /**
     * Remove a key from localStorage
     * @param {string} key - Storage key to remove
     * @returns {Promise<boolean>} True if successful
     */
    async remove(key) {
        try {
            const prefixedKey = this._prefixKey(key);
            localStorage.removeItem(prefixedKey);
            return true;
        } catch (error) {
            console.error(`LocalStorageAdapter.remove() error for key "${key}":`, error);
            return false;
        }
    }

    /**
     * Clear all localStorage (or only prefixed keys if prefix is set)
     * @returns {Promise<boolean>} True if successful
     */
    async clear() {
        try {
            if (this.prefix) {
                // Only clear keys with our prefix
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(this.prefix)) {
                        keysToRemove.push(key);
                    }
                }
                keysToRemove.forEach(key => localStorage.removeItem(key));
            } else {
                localStorage.clear();
            }
            return true;
        } catch (error) {
            console.error('LocalStorageAdapter.clear() error:', error);
            return false;
        }
    }

    /**
     * Get all storage keys (excluding prefix if set)
     * @returns {Promise<string[]>} Array of all keys
     */
    async keys() {
        try {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                    if (this.prefix && key.startsWith(this.prefix)) {
                        keys.push(key.slice(this.prefix.length));
                    } else if (!this.prefix) {
                        keys.push(key);
                    }
                }
            }
            return keys;
        } catch (error) {
            console.error('LocalStorageAdapter.keys() error:', error);
            return [];
        }
    }

    /**
     * Check if a key exists in localStorage
     * @param {string} key - Storage key to check
     * @returns {Promise<boolean>} True if key exists
     */
    async has(key) {
        try {
            const prefixedKey = this._prefixKey(key);
            return localStorage.getItem(prefixedKey) !== null;
        } catch (error) {
            console.error(`LocalStorageAdapter.has() error for key "${key}":`, error);
            return false;
        }
    }

    /**
     * Get the number of items in storage
     * @returns {Promise<number>} Number of stored items
     */
    async size() {
        const allKeys = await this.keys();
        return allKeys.length;
    }

    /**
     * Get storage usage information
     * @returns {Promise<{used: number, quota: number, available: number}>}
     */
    async getStorageInfo() {
        // Estimate storage usage
        let used = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                const value = localStorage.getItem(key);
                used += key.length + (value ? value.length : 0);
            }
        }
        
        // Most browsers have ~5MB quota for localStorage
        const quota = 5 * 1024 * 1024; // 5MB in characters
        
        return {
            used: used * 2, // UTF-16 = 2 bytes per character
            quota,
            available: quota - (used * 2)
        };
    }
}

export default LocalStorageAdapter;
