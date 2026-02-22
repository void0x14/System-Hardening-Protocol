/**
 * Copyright (c) 2025-2026 void0x14
 */

/**
 * Performance Module - Zero-dependency performance optimization utilities
 * 
 * @module performance
 * @description Provides a comprehensive set of performance optimization tools:
 * 
 * - **CacheService**: In-memory caching with TTL support
 * - **Memoize**: Function memoization utilities for expensive computations
 * - **VirtualList**: Virtual scrolling for efficient rendering of large lists
 * - **LazyLoader**: Lazy loading for images, components, and content
 * 
 * @example
 * // Import all performance utilities
 * import { 
 *     CacheService, 
 *     memoize, 
 *     VirtualList, 
 *     LazyLoader 
 * } from '../performance/index.js';
 * 
 * // Or import specific modules
 * import { CacheService } from '../performance/CacheService.js';
 * import { memoize, memoizeAsync } from '../performance/Memoize.js';
 * import { VirtualList } from '../performance/VirtualList.js';
 * import { LazyLoader, LazyImage } from '../performance/LazyLoader.js';
 */

// CacheService - In-memory caching with TTL
export { CacheService } from '../CacheService.js';

// Memoize - Function memoization utilities
// BUG-006 FIX: Use static import instead of require()
import {
    memoize,
    memoizeWith,
    memoizeAsync,
    memoizeByProperty,
    memoizeWeak,
    memoizeThrottled,
    clearMemoizedCache
} from '../Memoize.js';

// Re-export memoize functions
export {
    memoize,
    memoizeWith,
    memoizeAsync,
    memoizeByProperty,
    memoizeWeak,
    memoizeThrottled,
    clearMemoizedCache
};

// VirtualList - Virtual scrolling for large lists
export { VirtualList } from '../VirtualList.js';

// LazyLoader - Lazy loading for components and images
export {
    LazyLoader,
    LazyImage,
    LazyComponent,
    createLazyLoader,
    lazyLoadImages
} from '../LazyLoader.js';

/**
 * Create a performance utilities container
 * @param {Object} [options={}] - Configuration options
 * @param {Object} [options.cache] - CacheService options
 * @param {Object} [options.memoize] - Default memoize options
 * @param {Object} [options.lazyLoader] - LazyLoader options
 * @returns {Object} Performance utilities container
 * 
 * @example
 * const perf = createPerformanceContainer({
 *     cache: { defaultTTL: 60000, maxSize: 500 },
 *     lazyLoader: { rootMargin: '100px' }
 * });
 * 
 * // Use the cache
 * perf.cache.set('key', 'value');
 * 
 * // Create a memoized function
 * const memoizedFn = perf.memoize(expensiveFn);
 * 
 * // Lazy load images
 * perf.lazyLoader.observe(document.querySelectorAll('.lazy'));
 */
export function createPerformanceContainer(options = {}) {
    const cache = new CacheService(options.cache || {});
    
    return {
        cache,
        
        /**
         * Create a memoized function
         */
        memoize: (fn, memoOptions) => memoize(fn, { 
            ...options.memoize, 
            ...memoOptions 
        }),
        
        /**
         * Create an async memoized function
         */
        memoizeAsync: (fn, memoOptions) => {
            // BUG-006 FIX: Use imported function instead of require()
            return memoizeAsync(fn, { ...options.memoize, ...memoOptions });
        },
        
        /**
         * Create a virtual list
         */
        createVirtualList: (container, listOptions) => {
            return new VirtualList(container, listOptions);
        },
        
        /**
         * Create a lazy loader
         */
        createLazyLoader: (loaderOptions) => {
            return new LazyLoader({ 
                ...options.lazyLoader, 
                ...loaderOptions 
            });
        },
        
        /**
         * Clear all caches
         */
        clearAll: () => {
            cache.clear();
        },
        
        /**
         * Get statistics
         */
        getStats: () => ({
            cache: cache.getStats()
        })
    };
}

/**
 * Performance monitoring utilities
 */
export const PerformanceMonitor = {
    /**
     * Measure execution time of a function
     * @param {Function} fn - Function to measure
     * @param {string} [label='execution'] - Label for the measurement
     * @returns {*} Function result
     * 
     * @example
     * const result = PerformanceMonitor.measure(() => {
     *     return expensiveComputation();
     * }, 'expensiveComputation');
     * // Logs: expensiveComputation took 123.45ms
     */
    measure(fn, label = 'execution') {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${label} took ${(end - start).toFixed(2)}ms`);
        return result;
    },

    /**
     * Measure async execution time
     * @param {Function} fn - Async function to measure
     * @param {string} [label='execution'] - Label for the measurement
     * @returns {Promise<*>} Function result
     */
    async measureAsync(fn, label = 'execution') {
        const start = performance.now();
        const result = await fn();
        const end = performance.now();
        console.log(`${label} took ${(end - start).toFixed(2)}ms`);
        return result;
    },

    /**
     * Create a performance mark
     * @param {string} name - Mark name
     */
    mark(name) {
        if (typeof performance !== 'undefined' && performance.mark) {
            performance.mark(name);
        }
    },

    /**
     * Measure between two marks
     * @param {string} name - Measurement name
     * @param {string} startMark - Start mark name
     * @param {string} endMark - End mark name
     */
    measureBetween(name, startMark, endMark) {
        if (typeof performance !== 'undefined' && performance.measure) {
            try {
                performance.measure(name, startMark, endMark);
                const entries = performance.getEntriesByName(name);
                if (entries.length > 0) {
                    console.log(`${name}: ${entries[entries.length - 1].duration.toFixed(2)}ms`);
                }
            } catch (e) {
                console.warn(`Performance measure failed: ${e.message}`);
            }
        }
    },

    /**
     * Get memory usage (if available)
     * @returns {Object|null} Memory usage info
     */
    getMemoryUsage() {
        if (typeof performance !== 'undefined' && performance.memory) {
            return {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    },

    /**
     * Get all performance entries
     * @param {string} [type] - Entry type filter
     * @returns {PerformanceEntry[]} Performance entries
     */
    getEntries(type) {
        if (typeof performance === 'undefined') {
            return [];
        }
        
        if (type) {
            return performance.getEntriesByType(type);
        }
        
        return performance.getEntries();
    }
};

/**
 * Debounce utility
 * @param {Function} fn - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} [immediate=false] - Trigger on leading edge
 * @returns {Function} Debounced function
 * 
 * @example
 * const debouncedSearch = debounce((query) => {
 *     fetchResults(query);
 * }, 300);
 * 
 * input.addEventListener('input', (e) => {
 *     debouncedSearch(e.target.value);
 * });
 */
export function debounce(fn, wait, immediate = false) {
    let timeout;
    
    return function debounced(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) {
                fn.apply(this, args);
            }
        };
        
        const callNow = immediate && !timeout;
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) {
            fn.apply(this, args);
        }
    };
}

/**
 * Throttle utility
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Minimum time between calls in milliseconds
 * @returns {Function} Throttled function
 * 
 * @example
 * const throttledScroll = throttle((scrollPos) => {
 *     updateUI(scrollPos);
 * }, 100);
 * 
 * window.addEventListener('scroll', () => {
 *     throttledScroll(window.scrollY);
 * });
 */
export function throttle(fn, limit) {
    let inThrottle;
    let lastResult;
    
    return function throttled(...args) {
        if (!inThrottle) {
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
            
            lastResult = fn.apply(this, args);
        }
        
        return lastResult;
    };
}

/**
 * Request animation frame throttle
 * @param {Function} fn - Function to throttle
 * @returns {Function} RAF-throttled function
 */
export function rafThrottle(fn) {
    let rafId = null;
    let lastArgs = null;
    
    return function throttled(...args) {
        lastArgs = args;
        
        if (rafId === null) {
            rafId = requestAnimationFrame(() => {
                rafId = null;
                fn.apply(this, lastArgs);
            });
        }
    };
}

/**
 * Batch multiple calls into a single execution
 * @param {Function} fn - Function to batch
 * @param {number} [delay=0] - Batch delay in milliseconds
 * @returns {Function} Batched function
 */
export function batch(fn, delay = 0) {
    let args = [];
    let timeout = null;
    
    return function batched(...newArgs) {
        args.push(...newArgs);
        
        if (timeout === null) {
            timeout = setTimeout(() => {
                timeout = null;
                const allArgs = args;
                args = [];
                fn.call(this, allArgs);
            }, delay);
        }
    };
}

export default {
    CacheService,
    memoize,
    memoizeWith,
    memoizeAsync,
    memoizeByProperty,
    memoizeWeak,
    memoizeThrottled,
    clearMemoizedCache,
    VirtualList,
    LazyLoader,
    LazyImage,
    LazyComponent,
    createLazyLoader,
    lazyLoadImages,
    createPerformanceContainer,
    PerformanceMonitor,
    debounce,
    throttle,
    rafThrottle,
    batch
};
