/**
 * StorageAdapter - Abstract base class for storage operations
 * 
 * This defines the interface that all storage adapters must implement.
 * The pattern allows for different storage backends (localStorage, memory, etc.)
 * while providing a consistent API for the application.
 * 
 * @module infrastructure/StorageAdapter
 * @since Phase 3
 */

/**
 * Abstract storage adapter interface
 * All storage adapters must extend this class and implement its methods
 * 
 * @example
 * class LocalStorageAdapter extends StorageAdapter {
 *     async get(key) {
 *         const item = localStorage.getItem(key);
 *         return item ? JSON.parse(item) : null;
 *     }
 * }
 */
export class StorageAdapter {
    /**
     * Get a value from storage by key
     * @abstract
     * @param {string} key - Storage key
     * @returns {Promise<*>} Stored value or null if not found
     * @throws {Error} Must be implemented by subclass
     */
    async get(key) {
        throw new Error('StorageAdapter.get() must be implemented by subclass');
    }

    /**
     * Set a value in storage
     * @abstract
     * @param {string} key - Storage key
     * @param {*} value - Value to store (will be serialized)
     * @returns {Promise<boolean>} True if successful
     * @throws {Error} Must be implemented by subclass
     */
    async set(key, value) {
        throw new Error('StorageAdapter.set() must be implemented by subclass');
    }

    /**
     * Remove a key from storage
     * @abstract
     * @param {string} key - Storage key to remove
     * @returns {Promise<boolean>} True if successful
     * @throws {Error} Must be implemented by subclass
     */
    async remove(key) {
        throw new Error('StorageAdapter.remove() must be implemented by subclass');
    }

    /**
     * Clear all storage
     * @abstract
     * @returns {Promise<boolean>} True if successful
     * @throws {Error} Must be implemented by subclass
     */
    async clear() {
        throw new Error('StorageAdapter.clear() must be implemented by subclass');
    }

    /**
     * Get all storage keys
     * @abstract
     * @returns {Promise<string[]>} Array of all keys
     * @throws {Error} Must be implemented by subclass
     */
    async keys() {
        throw new Error('StorageAdapter.keys() must be implemented by subclass');
    }

    /**
     * Check if a key exists in storage
     * @abstract
     * @param {string} key - Storage key to check
     * @returns {Promise<boolean>} True if key exists
     * @throws {Error} Must be implemented by subclass
     */
    async has(key) {
        throw new Error('StorageAdapter.has() must be implemented by subclass');
    }

    /**
     * Get multiple values by keys
     * @param {string[]} keys - Array of storage keys
     * @returns {Promise<Object.<string, *>>} Object with key-value pairs
     */
    async getMultiple(keys) {
        const result = {};
        for (const key of keys) {
            result[key] = await this.get(key);
        }
        return result;
    }

    /**
     * Set multiple values at once
     * @param {Object.<string, *>} items - Object with key-value pairs
     * @returns {Promise<boolean>} True if all successful
     */
    async setMultiple(items) {
        for (const [key, value] of Object.entries(items)) {
            await this.set(key, value);
        }
        return true;
    }

    /**
     * Remove multiple keys at once
     * @param {string[]} keys - Array of keys to remove
     * @returns {Promise<boolean>} True if all successful
     */
    async removeMultiple(keys) {
        for (const key of keys) {
            await this.remove(key);
        }
        return true;
    }
}

export default StorageAdapter;
