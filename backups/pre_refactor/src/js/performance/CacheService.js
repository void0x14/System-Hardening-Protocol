/**
 * CacheService - Zero-dependency in-memory cache with TTL support
 * 
 * @module performance/CacheService
 * @description Provides a simple but powerful caching mechanism with:
 * - Time-to-live (TTL) support for automatic expiration
 * - getOrSet pattern for cache-aside implementation
 * - Statistics tracking (hits, misses, size)
 * - Automatic cleanup of expired entries
 * 
 * @example
 * const cache = new CacheService({ defaultTTL: 60000 }); // 1 minute default
 * 
 * // Basic usage
 * cache.set('user:123', { name: 'John' });
 * const user = cache.get('user:123');
 * 
 * // With TTL override
 * cache.set('temp:data', { value: 42 }, 5000); // 5 seconds
 * 
 * // Cache-aside pattern
 * const data = await cache.getOrSet('expensive:key', async () => {
 *     return await fetchExpensiveData();
 * }, 30000);
 */

/**
 * @typedef {Object} CacheEntry
 * @property {*} value - The cached value
 * @property {number} expiry - Timestamp when entry expires (milliseconds)
 * @property {number} created - Timestamp when entry was created
 * @property {string} [tag] - Optional tag for grouping entries
 */

/**
 * @typedef {Object} CacheOptions
 * @property {number} [defaultTTL=60000] - Default time-to-live in milliseconds
 * @property {number} [maxSize=1000] - Maximum number of entries
 * @property {boolean} [cleanupOnAccess=true] - Clean expired entries on access
 * @property {number} [cleanupInterval=60000] - Automatic cleanup interval in milliseconds
 */

/**
 * @typedef {Object} CacheStats
 * @property {number} hits - Number of cache hits
 * @property {number} misses - Number of cache misses
 * @property {number} size - Current number of entries
 * @property {number} expired - Number of expired entries removed
 * @property {number} hitRate - Cache hit rate (0-1)
 */

/**
 * Zero-dependency cache service with TTL support
 * @class
 */
export class CacheService {
    /** @type {Map<string, CacheEntry>} */
    #cache = new Map();
    
    /** @type {Map<string, NodeJS.Timeout>} */
    #timers = new Map();
    
    /** @type {CacheOptions} */
    #options;
    
    /** @type {Object} */
    #stats = {
        hits: 0,
        misses: 0,
        expired: 0
    };
    
    /** @type {NodeJS.Timeout|null} */
    #cleanupTimer = null;

    /**
     * Creates a new CacheService instance
     * @param {CacheOptions} [options={}] - Cache configuration options
     */
    constructor(options = {}) {
        this.#options = {
            defaultTTL: 60000,      // 1 minute default
            maxSize: 1000,          // Maximum 1000 entries
            cleanupOnAccess: true,  // Clean expired on access
            cleanupInterval: 60000, // Auto cleanup every minute
            ...options
        };
        
        // Start automatic cleanup if interval is set
        if (this.#options.cleanupInterval > 0) {
            this.#startCleanupTimer();
        }
    }

    /**
     * Sets a value in the cache
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     * @param {number} [ttl] - Time-to-live in milliseconds (uses default if not provided)
     * @param {string} [tag] - Optional tag for grouping entries
     * @returns {boolean} True if value was set successfully
     * 
     * @example
     * cache.set('user:123', { name: 'John' });
     * cache.set('temp:data', { value: 42 }, 5000, 'temporary');
     */
    set(key, value, ttl, tag) {
        // Enforce max size
        if (this.#cache.size >= this.#options.maxSize && !this.#cache.has(key)) {
            this.#evictOldest();
        }
        
        // Clear existing timer if any
        this.#clearTimer(key);
        
        const actualTTL = ttl ?? this.#options.defaultTTL;
        const now = Date.now();
        
        /** @type {CacheEntry} */
        const entry = {
            value,
            expiry: now + actualTTL,
            created: now,
            tag
        };
        
        this.#cache.set(key, entry);
        
        // Set individual timer for this entry
        if (actualTTL > 0) {
            const timer = setTimeout(() => {
                this.delete(key);
            }, actualTTL);
            
            // Unref timer to not prevent process exit
            if (timer.unref) {
                timer.unref();
            }
            
            this.#timers.set(key, timer);
        }
        
        return true;
    }

    /**
     * Gets a value from the cache
     * @param {string} key - Cache key
     * @returns {*} Cached value or undefined if not found/expired
     * 
     * @example
     * const user = cache.get('user:123');
     * if (user === undefined) {
     *     // Cache miss - fetch from source
     * }
     */
    get(key) {
        const entry = this.#cache.get(key);
        
        if (!entry) {
            this.#stats.misses++;
            return undefined;
        }
        
        // Check if expired
        if (Date.now() > entry.expiry) {
            this.#stats.misses++;
            this.#stats.expired++;
            this.delete(key);
            return undefined;
        }
        
        this.#stats.hits++;
        return entry.value;
    }

    /**
     * Checks if a key exists in the cache (and is not expired)
     * @param {string} key - Cache key
     * @returns {boolean} True if key exists and is not expired
     * 
     * @example
     * if (cache.has('user:123')) {
     *     // Use cached data
     * }
     */
    has(key) {
        const entry = this.#cache.get(key);
        
        if (!entry) {
            return false;
        }
        
        // Check if expired
        if (Date.now() > entry.expiry) {
            this.delete(key);
            return false;
        }
        
        return true;
    }

    /**
     * Deletes a key from the cache
     * @param {string} key - Cache key
     * @returns {boolean} True if key was deleted, false if it didn't exist
     * 
     * @example
     * cache.delete('user:123');
     */
    delete(key) {
        this.#clearTimer(key);
        return this.#cache.delete(key);
    }

    /**
     * Clears all entries from the cache
     * @returns {void}
     * 
     * @example
     * cache.clear();
     */
    clear() {
        // Clear all timers
        for (const key of this.#timers.keys()) {
            this.#clearTimer(key);
        }
        
        this.#cache.clear();
        this.#stats = { hits: 0, misses: 0, expired: 0 };
    }

    /**
     * Gets a value from cache, or sets it using the factory function
     * This is the cache-aside pattern for efficient data loading
     * @param {string} key - Cache key
     * @param {Function} factory - Async or sync function to create value if not cached
     * @param {number} [ttl] - Time-to-live in milliseconds
     * @param {string} [tag] - Optional tag for grouping
     * @returns {Promise<*>} Cached or newly created value
     * 
     * @example
     * // Async factory
     * const user = await cache.getOrSet('user:123', async () => {
     *     return await fetchUserFromAPI(123);
     * }, 300000); // 5 minutes
     * 
     * // Sync factory
     * const computed = cache.getOrSet('expensive:calc', () => {
     *     return performExpensiveCalculation();
     * });
     */
    async getOrSet(key, factory, ttl, tag) {
        // Check cache first
        const cached = this.get(key);
        if (cached !== undefined) {
            return cached;
        }
        
        // Create new value
        const value = await factory();
        
        // Cache the result
        this.set(key, value, ttl, tag);
        
        return value;
    }

    /**
     * Gets multiple values from the cache
     * @param {string[]} keys - Array of cache keys
     * @returns {Object} Object with key-value pairs (only existing entries)
     * 
     * @example
     * const users = cache.getMultiple(['user:1', 'user:2', 'user:3']);
     * // { 'user:1': {...}, 'user:3': {...} } // user:2 was not cached
     */
    getMultiple(keys) {
        const result = {};
        
        for (const key of keys) {
            const value = this.get(key);
            if (value !== undefined) {
                result[key] = value;
            }
        }
        
        return result;
    }

    /**
     * Sets multiple values in the cache
     * @param {Object} entries - Object with key-value pairs
     * @param {number} [ttl] - Time-to-live in milliseconds
     * @param {string} [tag] - Optional tag for all entries
     * @returns {void}
     * 
     * @example
     * cache.setMultiple({
     *     'user:1': { name: 'John' },
     *     'user:2': { name: 'Jane' }
     * }, 60000, 'users');
     */
    setMultiple(entries, ttl, tag) {
        for (const [key, value] of Object.entries(entries)) {
            this.set(key, value, ttl, tag);
        }
    }

    /**
     * Deletes all entries with a specific tag
     * @param {string} tag - Tag to delete
     * @returns {number} Number of entries deleted
     * 
     * @example
     * cache.set('user:1', data, 60000, 'users');
     * cache.set('user:2', data, 60000, 'users');
     * cache.deleteByTag('users'); // Deletes both entries
     */
    deleteByTag(tag) {
        let count = 0;
        
        for (const [key, entry] of this.#cache.entries()) {
            if (entry.tag === tag) {
                this.delete(key);
                count++;
            }
        }
        
        return count;
    }

    /**
     * Gets cache statistics
     * @returns {CacheStats} Cache statistics
     * 
     * @example
     * const stats = cache.getStats();
     * console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
     */
    getStats() {
        const total = this.#stats.hits + this.#stats.misses;
        
        return {
            hits: this.#stats.hits,
            misses: this.#stats.misses,
            size: this.#cache.size,
            expired: this.#stats.expired,
            hitRate: total > 0 ? this.#stats.hits / total : 0
        };
    }

    /**
     * Gets all keys in the cache
     * @returns {string[]} Array of cache keys
     */
    keys() {
        return Array.from(this.#cache.keys());
    }

    /**
     * Gets the current size of the cache
     * @returns {number} Number of entries
     */
    get size() {
        return this.#cache.size;
    }

    /**
     * Gets the remaining TTL for a key
     * @param {string} key - Cache key
     * @returns {number} Remaining TTL in milliseconds, or -1 if not found
     * 
     * @example
     * const remaining = cache.getTTL('user:123');
     * if (remaining > 0) {
     *     console.log(`Expires in ${remaining}ms`);
     * }
     */
    getTTL(key) {
        const entry = this.#cache.get(key);
        
        if (!entry) {
            return -1;
        }
        
        const remaining = entry.expiry - Date.now();
        return remaining > 0 ? remaining : 0;
    }

    /**
     * Refreshes the TTL for a key
     * @param {string} key - Cache key
     * @param {number} [ttl] - New TTL (uses default if not provided)
     * @returns {boolean} True if TTL was refreshed, false if key doesn't exist
     * 
     * @example
     * cache.set('session', token, 300000);
     * // Later, extend the session
     * cache.refresh('session', 300000);
     */
    refresh(key, ttl) {
        const entry = this.#cache.get(key);
        
        if (!entry) {
            return false;
        }
        
        const actualTTL = ttl ?? this.#options.defaultTTL;
        entry.expiry = Date.now() + actualTTL;
        
        // Reset timer
        this.#clearTimer(key);
        
        if (actualTTL > 0) {
            const timer = setTimeout(() => {
                this.delete(key);
            }, actualTTL);
            
            if (timer.unref) {
                timer.unref();
            }
            
            this.#timers.set(key, timer);
        }
        
        return true;
    }

    /**
     * Cleans up expired entries
     * @returns {number} Number of entries removed
     */
    cleanup() {
        const now = Date.now();
        let count = 0;
        
        for (const [key, entry] of this.#cache.entries()) {
            if (now > entry.expiry) {
                this.delete(key);
                count++;
            }
        }
        
        this.#stats.expired += count;
        return count;
    }

    /**
     * Destroys the cache and cleans up resources
     * @returns {void}
     */
    destroy() {
        if (this.#cleanupTimer) {
            clearInterval(this.#cleanupTimer);
            this.#cleanupTimer = null;
        }
        
        this.clear();
    }

    // Private methods

    /**
     * Clears the timer for a key
     * @param {string} key - Cache key
     */
    #clearTimer(key) {
        const timer = this.#timers.get(key);
        if (timer) {
            clearTimeout(timer);
            this.#timers.delete(key);
        }
    }

    /**
     * Starts the automatic cleanup timer
     */
    #startCleanupTimer() {
        this.#cleanupTimer = setInterval(() => {
            this.cleanup();
        }, this.#options.cleanupInterval);
        
        // Unref to not prevent process exit
        if (this.#cleanupTimer.unref) {
            this.#cleanupTimer.unref();
        }
    }

    /**
     * Evicts the oldest entry when cache is full
     */
    #evictOldest() {
        let oldestKey = null;
        let oldestTime = Infinity;
        
        for (const [key, entry] of this.#cache.entries()) {
            if (entry.created < oldestTime) {
                oldestTime = entry.created;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            this.delete(oldestKey);
        }
    }
}

export default CacheService;
