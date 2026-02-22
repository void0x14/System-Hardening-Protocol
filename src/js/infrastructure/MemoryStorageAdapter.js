/**
 * Copyright (c) 2025-2026 void0x14
 */

import { Store } from '../store.js';

/**
 * MemoryStorageAdapter - In-memory implementation of StorageAdapter
 * 
 * Provides volatile storage using a Map. Perfect for testing
 * or temporary data that shouldn't persist.
 * 
 * @module infrastructure/MemoryStorageAdapter
 * @since Phase 3
 */

import { StorageAdapter } from './StorageAdapter.js';

/**
 * In-memory storage adapter for testing and temporary data
 * @extends StorageAdapter
 * 
 * @example
 * const storage = new MemoryStorageAdapter();
 * await storage.set('test', { value: 123 });
 * const data = await storage.get('test'); // { value: 123 }
 * 
 * // With initial data
 * const storageWithData = new MemoryStorageAdapter({
 *     initialData: { user: { name: 'John' } }
 * });
 */
export class MemoryStorageAdapter extends StorageAdapter {
    /**
     * Create a new MemoryStorageAdapter
     * @param {Object} [options] - Configuration options
     * @param {Object} [options.initialData={}] - Initial data to populate
     */
    constructor(options = {}) {
        super();
        this._data = new Map();
        
        // Populate with initial data if provided
        if (options.initialData) {
            for (const [key, value] of Object.entries(options.initialData)) {
                this._data.set(key, value);
            }
        }
    }

    /**
     * Get a value from memory by key
     * @param {string} key - Storage key
     * @returns {Promise<*>} Stored value or null if not found
     */
    async get(key) {
        if (this._data.has(key)) {
            // Return a deep copy to prevent mutation
            return this._deepClone(this._data.get(key));
        }
        return null;
    }

    /**
     * Set a value in memory
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {Promise<boolean>} Always true
     */
    async set(key, value) {
        // Store a deep copy to prevent external mutation
        this._data.set(key, this._deepClone(value));
        return true;
    }

    /**
     * Remove a key from memory
     * @param {string} key - Storage key to remove
     * @returns {Promise<boolean>} True if key existed and was removed
     */
    async remove(key) {
        return this._data.delete(key);
    }

    /**
     * Clear all memory storage
     * @returns {Promise<boolean>} Always true
     */
    async clear() {
        this._data.clear();
        return true;
    }

    /**
     * Get all storage keys
     * @returns {Promise<string[]>} Array of all keys
     */
    async keys() {
        return Array.from(this._data.keys());
    }

    /**
     * Check if a key exists in memory
     * @param {string} key - Storage key to check
     * @returns {Promise<boolean>} True if key exists
     */
    async has(key) {
        return this._data.has(key);
    }

    /**
     * Get the number of items in storage
     * @returns {Promise<number>} Number of stored items
     */
    async size() {
        return this._data.size;
    }

    /**
     * Get a snapshot of all stored data (for debugging/testing)
     * @returns {Promise<Object.<string, *>>} All stored data
     */
    async snapshot() {
        const result = {};
        for (const [key, value] of this._data.entries()) {
            result[key] = this._deepClone(value);
        }
        return result;
    }

    /**
     * Deep clone a value to prevent mutation
     * @private
     * @param {*} value - Value to clone
     * @returns {*} Cloned value
     */
    _deepClone(value) {
        if (value === null || value === undefined) {
            return value;
        }
        
        // Handle primitives
        if (typeof value !== 'object') {
            return value;
        }
        
        // Handle Date
        if (value instanceof Date) {
            return new Date(value.getTime());
        }
        
        // Handle Array
        if (Array.isArray(value)) {
            return value.map(item => this._deepClone(item));
        }
        
        // Handle Map
        if (value instanceof Map) {
            const cloned = new Map();
            for (const [k, v] of value.entries()) {
                cloned.set(k, this._deepClone(v));
            }
            return cloned;
        }
        
        // Handle Set
        if (value instanceof Set) {
            const cloned = new Set();
            for (const item of value.values()) {
                cloned.add(this._deepClone(item));
            }
            return cloned;
        }
        
        // Handle plain objects
        const cloned = {};
        for (const [key, val] of Object.entries(value)) {
            cloned[key] = this._deepClone(val);
        }
        return cloned;
    }

    /**
     * Import data from an object (for testing setup)
     * @param {Object.<string, *>} data - Data to import
     * @returns {Promise<boolean>} True if successful
     */
    async importData(data) {
        for (const [key, value] of Object.entries(data)) {
            await this.set(key, value);
        }
        return true;
    }

    /**
     * Reset storage to initial state
     * @returns {Promise<boolean>} Always true
     */
    async reset() {
        await this.clear();
        return true;
    }
}

export default MemoryStorageAdapter;
