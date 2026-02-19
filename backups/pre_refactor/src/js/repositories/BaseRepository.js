/**
 * BaseRepository - Base class for all repositories
 * 
 * Provides common CRUD operations and patterns for data access.
 * All entity-specific repositories should extend this class.
 * 
 * @module repositories/BaseRepository
 * @since Phase 3
 */

/**
 * Base repository with common data access operations
 * 
 * @example
 * class WeightRepository extends BaseRepository {
 *     constructor(storage) {
 *         super(storage, 'monk_weight');
 *     }
 * }
 */
export class BaseRepository {
    /**
     * Create a new BaseRepository
     * @param {StorageAdapter} storage - Storage adapter instance
     * @param {string} keyPrefix - Prefix for all storage keys
     */
    constructor(storage, keyPrefix = '') {
        this.storage = storage;
        this.keyPrefix = keyPrefix;
    }

    /**
     * Get the full storage key (with prefix)
     * @protected
     * @param {string} key - Base key
     * @returns {string} Full key with prefix
     */
    _getKey(key) {
        return this.keyPrefix ? `${this.keyPrefix}${key}` : key;
    }

    /**
     * Get a value by key
     * @param {string} key - Storage key (without prefix)
     * @returns {Promise<*>} Stored value or null
     */
    async get(key) {
        return await this.storage.get(this._getKey(key));
    }

    /**
     * Set a value by key
     * @param {string} key - Storage key (without prefix)
     * @param {*} value - Value to store
     * @returns {Promise<boolean>} True if successful
     */
    async set(key, value) {
        return await this.storage.set(this._getKey(key), value);
    }

    /**
     * Delete a value by key
     * @param {string} key - Storage key (without prefix)
     * @returns {Promise<boolean>} True if successful
     */
    async delete(key) {
        return await this.storage.remove(this._getKey(key));
    }

    /**
     * Check if a key exists
     * @param {string} key - Storage key (without prefix)
     * @returns {Promise<boolean>} True if exists
     */
    async has(key) {
        return await this.storage.has(this._getKey(key));
    }

    /**
     * Get all entries for this repository
     * Filters keys by the repository's prefix
     * @returns {Promise<Object.<string, *>>} All entries as key-value object
     */
    async getAll() {
        const allKeys = await this.storage.keys();
        const result = {};
        
        for (const key of allKeys) {
            if (this.keyPrefix && !key.startsWith(this.keyPrefix)) {
                continue;
            }
            const shortKey = this.keyPrefix ? key.slice(this.keyPrefix.length) : key;
            result[shortKey] = await this.storage.get(key);
        }
        
        return result;
    }

    /**
     * Get all keys for this repository
     * @returns {Promise<string[]>} Array of keys (without prefix)
     */
    async keys() {
        const allKeys = await this.storage.keys();
        
        if (!this.keyPrefix) {
            return allKeys;
        }
        
        return allKeys
            .filter(key => key.startsWith(this.keyPrefix))
            .map(key => key.slice(this.keyPrefix.length));
    }

    /**
     * Clear all entries for this repository
     * Only removes keys with this repository's prefix
     * @returns {Promise<boolean>} True if successful
     */
    async clear() {
        const keys = await this.keys();
        
        for (const key of keys) {
            await this.delete(key);
        }
        
        return true;
    }

    /**
     * Count entries in this repository
     * @returns {Promise<number>} Number of entries
     */
    async count() {
        const keys = await this.keys();
        return keys.length;
    }

    /**
     * Find entries matching a predicate
     * @param {Function} predicate - Filter function (value, key) => boolean
     * @returns {Promise<Object.<string, *>>} Matching entries
     */
    async find(predicate) {
        const all = await this.getAll();
        const result = {};
        
        for (const [key, value] of Object.entries(all)) {
            if (predicate(value, key)) {
                result[key] = value;
            }
        }
        
        return result;
    }

    /**
     * Find one entry matching a predicate
     * @param {Function} predicate - Filter function (value, key) => boolean
     * @returns {Promise<{key: string, value: *}|null>} First match or null
     */
    async findOne(predicate) {
        const all = await this.getAll();
        
        for (const [key, value] of Object.entries(all)) {
            if (predicate(value, key)) {
                return { key, value };
            }
        }
        
        return null;
    }

    /**
     * Update a value by key (merge with existing)
     * @param {string} key - Storage key
     * @param {Object} updates - Properties to update
     * @returns {Promise<*>} Updated value
     */
    async update(key, updates) {
        const existing = await this.get(key) || {};
        const updated = { ...existing, ...updates };
        await this.set(key, updated);
        return updated;
    }

    /**
     * Increment a numeric value
     * @param {string} key - Storage key
     * @param {number} [amount=1] - Amount to increment
     * @returns {Promise<number>} New value
     */
    async increment(key, amount = 1) {
        const current = await this.get(key) || 0;
        const newValue = current + amount;
        await this.set(key, newValue);
        return newValue;
    }

    /**
     * Decrement a numeric value
     * @param {string} key - Storage key
     * @param {number} [amount=1] - Amount to decrement
     * @returns {Promise<number>} New value
     */
    async decrement(key, amount = 1) {
        return await this.increment(key, -amount);
    }

    /**
     * Add an item to an array
     * @param {string} key - Storage key
     * @param {*} item - Item to add
     * @returns {Promise<Array>} Updated array
     */
    async push(key, item) {
        const arr = await this.get(key) || [];
        arr.push(item);
        await this.set(key, arr);
        return arr;
    }

    /**
     * Remove an item from an array by index
     * @param {string} key - Storage key
     * @param {number} index - Index to remove
     * @returns {Promise<Array>} Updated array
     */
    async splice(key, index) {
        const arr = await this.get(key) || [];
        arr.splice(index, 1);
        await this.set(key, arr);
        return arr;
    }
}

export default BaseRepository;
