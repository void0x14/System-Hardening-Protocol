/**
 * Memoize - Zero-dependency function memoization utilities
 * 
 * @module performance/Memoize
 * @description Provides function memoization for performance optimization:
 * - Simple memoization with automatic key generation
 * - Custom key function support for complex arguments
 * - TTL (time-to-live) support for cache expiration
 * - Cache statistics and management
 * - Support for async functions
 * 
 * @example
 * import { memoize, memoizeWith, memoizeAsync } from './Memoize.js';
 * 
 * // Simple memoization
 * const expensiveCalc = memoize((n) => {
 *     console.log('Computing...');
 *     return n * n;
 * });
 * 
 * expensiveCalc(5); // Logs "Computing...", returns 25
 * expensiveCalc(5); // Returns 25 without logging
 * 
 * // Custom key function
 * const getUser = memoizeWith(
 *     (id) => `user:${id}`,
 *     async (id) => fetchUser(id)
 * );
 * 
 * // With TTL
 * const cachedFetch = memoize(fetchData, { ttl: 60000 });
 */

/**
 * @typedef {Object} MemoizeOptions
 * @property {number} [ttl] - Time-to-live in milliseconds
 * @property {number} [maxSize=100] - Maximum cache size
 * @property {Function} [keyFn] - Custom key generation function
 * @property {boolean} [cacheErrors=false] - Whether to cache rejected promises
 */

/**
 * @typedef {Object} MemoizedFunction
 * @property {Function} original - The original function
 * @property {Map} cache - The cache map
 * @property {Function} clear - Clear the cache
 * @property {Function} delete - Delete a specific key from cache
 * @property {Function} has - Check if key is cached
 * @property {Function} getStats - Get cache statistics
 */

/**
 * Default key generator for function arguments
 * Creates a string key from all arguments using JSON serialization
 * @param {...*} args - Function arguments
 * @returns {string} Cache key
 */
function defaultKeyGenerator(...args) {
    if (args.length === 0) {
        return '()';
    }
    
    if (args.length === 1) {
        const arg = args[0];
        // Handle primitives directly for better performance
        if (typeof arg === 'string') return `"${arg}"`;
        if (typeof arg === 'number') return String(arg);
        if (typeof arg === 'boolean') return String(arg);
        if (arg === null) return 'null';
        if (arg === undefined) return 'undefined';
        // Objects and arrays use JSON
        try {
            return JSON.stringify(arg);
        } catch (e) {
            // Handle circular references
            return String(Object.prototype.toString.call(arg));
        }
    }
    
    // Multiple arguments
    try {
        return JSON.stringify(args);
    } catch (e) {
        // Fallback for circular references
        return args.map((arg, i) => {
            try {
                return JSON.stringify(arg);
            } catch {
                return `[arg${i}]`;
            }
        }).join(',');
    }
}

/**
 * Creates a memoized version of a function
 * Results are cached based on arguments
 * 
 * @param {Function} fn - Function to memoize
 * @param {MemoizeOptions} [options={}] - Memoization options
 * @returns {MemoizedFunction} Memoized function with cache management
 * 
 * @example
 * const fib = memoize((n) => {
 *     if (n <= 1) return n;
 *     return fib(n - 1) + fib(n - 2);
 * });
 * 
 * fib(40); // Fast due to memoization
 */
export function memoize(fn, options = {}) {
    const {
        ttl,
        maxSize = 100,
        keyFn = defaultKeyGenerator,
        cacheErrors = false
    } = options;
    
    const cache = new Map();
    const timers = new Map();
    const stats = { hits: 0, misses: 0 };
    
    // Track insertion order for LRU eviction
    const order = [];
    
    /**
     * Memoized function
     * @param {...*} args - Function arguments
     * @returns {*} Memoized result
     */
    function memoized(...args) {
        const key = keyFn.apply(this, args);
        
        // Check cache
        if (cache.has(key)) {
            stats.hits++;
            return cache.get(key);
        }
        
        // Cache miss - compute result
        stats.misses++;
        const result = fn.apply(this, args);
        
        // Enforce max size with LRU eviction
        while (cache.size >= maxSize) {
            const oldest = order.shift();
            if (oldest !== undefined) {
                cache.delete(oldest);
                clearTimer(oldest);
            }
        }
        
        // Store result
        cache.set(key, result);
        order.push(key);
        
        // Set TTL timer if specified
        if (ttl && ttl > 0) {
            const timer = setTimeout(() => {
                memoized.delete(key);
            }, ttl);
            
            if (timer.unref) {
                timer.unref();
            }
            
            timers.set(key, timer);
        }
        
        return result;
    }
    
    /**
     * Clear timer for a key
     * @param {string} key - Cache key
     */
    function clearTimer(key) {
        const timer = timers.get(key);
        if (timer) {
            clearTimeout(timer);
            timers.delete(key);
        }
    }
    
    /**
     * Clear all cached values
     */
    memoized.clear = function() {
        for (const key of timers.keys()) {
            clearTimer(key);
        }
        cache.clear();
        order.length = 0;
        stats.hits = 0;
        stats.misses = 0;
    };
    
    /**
     * Delete a specific key from cache
     * @param {string} key - Cache key
     * @returns {boolean} True if deleted
     */
    memoized.delete = function(key) {
        clearTimer(key);
        const index = order.indexOf(key);
        if (index > -1) {
            order.splice(index, 1);
        }
        return cache.delete(key);
    };
    
    /**
     * Check if a key is cached
     * @param {...*} args - Function arguments
     * @returns {boolean} True if cached
     */
    memoized.has = function(...args) {
        const key = keyFn.apply(this, args);
        return cache.has(key);
    };
    
    /**
     * Get cached value without computing
     * @param {...*} args - Function arguments
     * @returns {*} Cached value or undefined
     */
    memoized.get = function(...args) {
        const key = keyFn.apply(this, args);
        return cache.get(key);
    };
    
    /**
     * Get cache statistics
     * @returns {Object} Statistics object
     */
    memoized.getStats = function() {
        const total = stats.hits + stats.misses;
        return {
            hits: stats.hits,
            misses: stats.misses,
            size: cache.size,
            hitRate: total > 0 ? stats.hits / total : 0
        };
    };
    
    /**
     * Reference to original function
     */
    memoized.original = fn;
    
    /**
     * Direct cache access
     */
    memoized.cache = cache;
    
    return memoized;
}

/**
 * Creates a memoized function with a custom key generator
 * Useful when arguments are complex objects
 * 
 * @param {Function} keyFn - Function to generate cache key from arguments
 * @param {Function} fn - Function to memoize
 * @param {MemoizeOptions} [options={}] - Additional options
 * @returns {MemoizedFunction} Memoized function
 * 
 * @example
 * const fetchUser = memoizeWith(
 *     (id) => `user:${id}`,
 *     async (id) => {
 *         const res = await fetch(`/api/users/${id}`);
 *         return res.json();
 *     }
 * );
 */
export function memoizeWith(keyFn, fn, options = {}) {
    return memoize(fn, { ...options, keyFn });
}

/**
 * Creates a memoized async function
 * Handles promise caching and prevents duplicate in-flight requests
 * 
 * @param {Function} fn - Async function to memoize
 * @param {MemoizeOptions} [options={}] - Memoization options
 * @returns {MemoizedFunction} Memoized async function
 * 
 * @example
 * const fetchUser = memoizeAsync(async (id) => {
 *     const res = await fetch(`/api/users/${id}`);
 *     return res.json();
 * }, { ttl: 60000 });
 * 
 * // Multiple calls with same ID will only make one request
 * const [user1, user2] = await Promise.all([
 *     fetchUser(123),
 *     fetchUser(123)
 * ]);
 */
export function memoizeAsync(fn, options = {}) {
    const {
        ttl,
        maxSize = 100,
        keyFn = defaultKeyGenerator,
        cacheErrors = false
    } = options;
    
    const cache = new Map();
    const inflight = new Map(); // Track pending promises
    const timers = new Map();
    const stats = { hits: 0, misses: 0 };
    const order = [];
    
    /**
     * Clear timer for a key
     * @param {string} key - Cache key
     */
    function clearTimer(key) {
        const timer = timers.get(key);
        if (timer) {
            clearTimeout(timer);
            timers.delete(key);
        }
    }
    
    /**
     * Memoized async function
     * @param {...*} args - Function arguments
     * @returns {Promise<*>} Memoized result
     */
    async function memoized(...args) {
        const key = keyFn.apply(this, args);
        
        // Check if we have a cached result
        if (cache.has(key)) {
            stats.hits++;
            return cache.get(key);
        }
        
        // Check if request is already in flight
        if (inflight.has(key)) {
            stats.hits++;
            return inflight.get(key);
        }
        
        // New request
        stats.misses++;
        
        // Create the promise
        const promise = fn.apply(this, args)
            .then(result => {
                // Cache successful result
                cache.set(key, result);
                order.push(key);
                
                // Enforce max size
                while (cache.size > maxSize) {
                    const oldest = order.shift();
                    if (oldest !== undefined) {
                        cache.delete(oldest);
                        clearTimer(oldest);
                    }
                }
                
                // Set TTL
                if (ttl && ttl > 0) {
                    const timer = setTimeout(() => {
                        memoized.delete(key);
                    }, ttl);
                    
                    if (timer.unref) {
                        timer.unref();
                    }
                    
                    timers.set(key, timer);
                }
                
                return result;
            })
            .catch(error => {
                // Optionally cache errors
                if (cacheErrors) {
                    cache.set(key, Promise.reject(error));
                }
                throw error;
            })
            .finally(() => {
                // Remove from inflight
                inflight.delete(key);
            });
        
        // Track in-flight request
        inflight.set(key, promise);
        
        return promise;
    }
    
    /**
     * Clear all cached values
     */
    memoized.clear = function() {
        for (const key of timers.keys()) {
            clearTimer(key);
        }
        cache.clear();
        inflight.clear();
        order.length = 0;
        stats.hits = 0;
        stats.misses = 0;
    };
    
    /**
     * Delete a specific key from cache
     * @param {string} key - Cache key
     * @returns {boolean} True if deleted
     */
    memoized.delete = function(key) {
        clearTimer(key);
        inflight.delete(key);
        const index = order.indexOf(key);
        if (index > -1) {
            order.splice(index, 1);
        }
        return cache.delete(key);
    };
    
    /**
     * Check if a key is cached
     * @param {...*} args - Function arguments
     * @returns {boolean} True if cached
     */
    memoized.has = function(...args) {
        const key = keyFn.apply(this, args);
        return cache.has(key) || inflight.has(key);
    };
    
    /**
     * Get cached value without computing
     * @param {...*} args - Function arguments
     * @returns {*} Cached value or undefined
     */
    memoized.get = function(...args) {
        const key = keyFn.apply(this, args);
        return cache.get(key);
    };
    
    /**
     * Get cache statistics
     * @returns {Object} Statistics object
     */
    memoized.getStats = function() {
        const total = stats.hits + stats.misses;
        return {
            hits: stats.hits,
            misses: stats.misses,
            size: cache.size,
            inflight: inflight.size,
            hitRate: total > 0 ? stats.hits / total : 0
        };
    };
    
    /**
     * Reference to original function
     */
    memoized.original = fn;
    
    /**
     * Direct cache access
     */
    memoized.cache = cache;
    
    return memoized;
}

/**
 * Clears the memoization cache for a function
 * Works with functions memoized by memoize() or memoizeAsync()
 * 
 * @param {MemoizedFunction} memoizedFn - Memoized function
 * @returns {void}
 * 
 * @example
 * const cached = memoize(expensiveFn);
 * cached(1, 2);
 * cached(3, 4);
 * clearMemoizedCache(cached); // Clears all cached values
 */
export function clearMemoizedCache(memoizedFn) {
    if (typeof memoizedFn.clear === 'function') {
        memoizedFn.clear();
    }
}

/**
 * Creates a memoized function that caches based on object property
 * Useful for methods that depend on specific object properties
 * 
 * @param {string} property - Property name to use as cache key
 * @param {Function} fn - Function to memoize
 * @param {MemoizeOptions} [options={}] - Additional options
 * @returns {MemoizedFunction} Memoized function
 * 
 * @example
 * const getUserName = memoizeByProperty('id', (user) => {
 *     return expensiveNameFormatting(user);
 * });
 */
export function memoizeByProperty(property, fn, options = {}) {
    return memoizeWith(
        (obj) => String(obj[property]),
        fn,
        options
    );
}

/**
 * Creates a memoized function with weak map caching
 * Useful for memoizing methods that take objects as arguments
 * Allows garbage collection of cached results when objects are no longer referenced
 * 
 * @param {Function} fn - Function to memoize
 * @returns {Function} Memoized function with WeakMap cache
 * 
 * @example
 * const getElementData = memoizeWeak((element) => {
 *     return expensiveComputation(element);
 * });
 * 
 * // When element is garbage collected, cache entry is automatically removed
 */
export function memoizeWeak(fn) {
    const cache = new WeakMap();
    
    function memoized(obj) {
        if (cache.has(obj)) {
            return cache.get(obj);
        }
        
        const result = fn.call(this, obj);
        cache.set(obj, result);
        return result;
    }
    
    memoized.clear = function() {
        // WeakMap doesn't have clear(), create new instance
        // This is a limitation of WeakMap
    };
    
    memoized.has = function(obj) {
        return cache.has(obj);
    };
    
    memoized.get = function(obj) {
        return cache.get(obj);
    };
    
    memoized.original = fn;
    memoized.cache = cache;
    
    return memoized;
}

/**
 * Creates a throttled memoized function
 * Combines throttling with memoization for rate-limited caching
 * 
 * @param {Function} fn - Function to memoize
 * @param {number} limit - Minimum time between calls in milliseconds
 * @param {MemoizeOptions} [options={}] - Memoization options
 * @returns {Function} Throttled memoized function
 * 
 * @example
 * const throttledFetch = memoizeThrottled(
 *     async (query) => fetchResults(query),
 *     1000 // Max once per second
 * );
 */
export function memoizeThrottled(fn, limit, options = {}) {
    const memoized = memoize(fn, options);
    const lastCall = new Map();
    
    return function(...args) {
        const key = options.keyFn 
            ? options.keyFn.apply(this, args)
            : defaultKeyGenerator.apply(this, args);
        
        const now = Date.now();
        const last = lastCall.get(key) || 0;
        
        if (now - last >= limit) {
            lastCall.set(key, now);
            return memoized.apply(this, args);
        }
        
        // Return cached value if within throttle window
        return memoized.get.apply(this, args);
    };
}

export default memoize;
