/**
 * LazyLoader - Zero-dependency lazy loading for components and images
 * 
 * @module performance/LazyLoader
 * @description Provides lazy loading functionality using IntersectionObserver:
 * - Lazy load images when they enter viewport
 * - Lazy load components and content
 * - Placeholder/skeleton support
 * - Priority loading for above-fold content
 * - Preloading for anticipated content
 * 
 * @example
 * import { LazyLoader, LazyImage, LazyComponent } from './LazyLoader.js';
 * 
 * // Basic lazy loading
 * const loader = new LazyLoader({
 *     rootMargin: '100px',
 *     threshold: 0.1
 * });
 * 
 * loader.observe(document.querySelectorAll('.lazy'));
 * 
 * // Lazy images
 * const lazyImg = new LazyImage({
 *     placeholder: '/placeholder.jpg',
 *     fadeIn: true
 * });
 */

/**
 * @typedef {Object} LazyLoaderOptions
 * @property {string} [rootMargin='50px'] - Margin around the root element
 * @property {number|number[]} [threshold=0.1] - Visibility threshold(s)
 * @property {Element} [root=null] - Root element for intersection
 * @property {string} [dataSrc='data-src'] - Attribute for lazy source
 * @property {string} [dataSrcset='data-srcset'] - Attribute for lazy srcset
 * @property {string} [loadingClass='lazy-loading'] - Class during loading
 * @property {string} [loadedClass='lazy-loaded'] - Class after loaded
 * @property {string} [errorClass='lazy-error'] - Class on error
 * @property {Function} [onLoad] - Callback when element loads
 * @property {Function} [onError] - Callback on load error
 * @property {Function} [onEnter] - Callback when element enters viewport
 * @property {number} [debounce=0] - Debounce time in milliseconds
 */

/**
 * @typedef {Object} LazyImageOptions
 * @property {string} [placeholder] - Placeholder image URL
 * @property {string} [placeholderClass] - Class for placeholder
 * @property {boolean} [fadeIn=true] - Fade in effect on load
 * @property {number} [fadeInDuration=300] - Fade duration in ms
 * @property {boolean} [removePlaceholder=true] - Remove placeholder after load
 * @property {string} [loadingClass] - Class during loading
 * @property {string} [loadedClass] - Class after loaded
 */

/**
 * @typedef {Object} LazyComponentOptions
 * @property {string} [placeholder] - Placeholder HTML
 * @property {string} [placeholderClass] - Class for placeholder
 * @property {Function} [loader] - Async function to load component
 * @property {Function} [onLoad] - Callback when component loads
 * @property {Function} [onError] - Callback on error
 */

/**
 * LazyLoader class for lazy loading elements
 * @class
 */
export class LazyLoader {
    /** @type {IntersectionObserver|null} */
    #observer = null;
    
    /** @type {Map<Element, Object>} */
    #elements = new Map();
    
    /** @type {LazyLoaderOptions} */
    #options;
    
    /** @type {Object} */
    #stats = {
        observed: 0,
        loaded: 0,
        errors: 0
    };

    /**
     * Creates a new LazyLoader instance
     * @param {LazyLoaderOptions} [options={}] - Configuration options
     * 
     * @example
     * const loader = new LazyLoader({
     *     rootMargin: '100px',
     *     threshold: 0.1,
     *     onLoad: (el) => console.log('Loaded:', el)
     * });
     */
    constructor(options = {}) {
        this.#options = {
            rootMargin: '50px',
            threshold: 0.1,
            root: null,
            dataSrc: 'data-src',
            dataSrcset: 'data-srcset',
            loadingClass: 'lazy-loading',
            loadedClass: 'lazy-loaded',
            errorClass: 'lazy-error',
            debounce: 0,
            ...options
        };
        
        this.#init();
    }

    /**
     * Initialize the IntersectionObserver
     * @private
     */
    #init() {
        // Check for IntersectionObserver support
        if (typeof IntersectionObserver === 'undefined') {
            console.warn('IntersectionObserver not supported. Loading all elements immediately.');
            return;
        }
        
        this.#observer = new IntersectionObserver(
            this.#handleIntersection.bind(this),
            {
                root: this.#options.root,
                rootMargin: this.#options.rootMargin,
                threshold: this.#options.threshold
            }
        );
    }

    /**
     * Handle intersection events
     * @param {IntersectionObserverEntry[]} entries - Intersection entries
     * @private
     */
    #handleIntersection(entries) {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                this.#loadElement(entry.target);
            }
        }
    }

    /**
     * Load an element
     * @param {Element} element - Element to load
     * @private
     */
    async #loadElement(element) {
        const data = this.#elements.get(element);
        
        if (!data || data.loading || data.loaded) {
            return;
        }
        
        data.loading = true;
        
        // Add loading class
        if (this.#options.loadingClass) {
            element.classList.add(this.#options.loadingClass);
        }
        
        // Call onEnter callback
        if (this.#options.onEnter) {
            this.#options.onEnter(element);
        }
        
        try {
            // Handle different element types
            if (element.tagName === 'IMG') {
                await this.#loadImage(element);
            } else if (element.tagName === 'IFRAME') {
                await this.#loadIframe(element);
            } else if (element.tagName === 'VIDEO') {
                await this.#loadVideo(element);
            } else {
                await this.#loadContent(element);
            }
            
            data.loaded = true;
            this.#stats.loaded++;
            
            // Swap classes
            if (this.#options.loadingClass) {
                element.classList.remove(this.#options.loadingClass);
            }
            if (this.#options.loadedClass) {
                element.classList.add(this.#options.loadedClass);
            }
            
            // Call onLoad callback
            if (this.#options.onLoad) {
                this.#options.onLoad(element);
            }
            
            // Unobserve after loading
            this.unobserve(element);
            
        } catch (error) {
            data.loading = false;
            this.#stats.errors++;
            
            // Add error class
            if (this.#options.errorClass) {
                element.classList.add(this.#options.errorClass);
            }
            
            // Call onError callback
            if (this.#options.onError) {
                this.#options.onError(element, error);
            }
        }
    }

    /**
     * Load an image element
     * @param {HTMLImageElement} img - Image element
     * @returns {Promise<void>}
     * @private
     */
    #loadImage(img) {
        return new Promise((resolve, reject) => {
            const src = img.getAttribute(this.#options.dataSrc);
            const srcset = img.getAttribute(this.#options.dataSrcset);
            
            if (!src && !srcset) {
                resolve();
                return;
            }
            
            const onLoad = () => {
                img.removeEventListener('load', onLoad);
                img.removeEventListener('error', onError);
                resolve();
            };
            
            const onError = (e) => {
                img.removeEventListener('load', onLoad);
                img.removeEventListener('error', onError);
                reject(new Error(`Failed to load image: ${src || srcset}`));
            };
            
            img.addEventListener('load', onLoad);
            img.addEventListener('error', onError);
            
            // Set src/srcset
            if (srcset) {
                img.srcset = srcset;
                img.removeAttribute(this.#options.dataSrcset);
            }
            
            if (src) {
                img.src = src;
                img.removeAttribute(this.#options.dataSrc);
            }
        });
    }

    /**
     * Load an iframe element
     * @param {HTMLIFrameElement} iframe - Iframe element
     * @returns {Promise<void>}
     * @private
     */
    #loadIframe(iframe) {
        return new Promise((resolve, reject) => {
            const src = iframe.getAttribute(this.#options.dataSrc);
            
            if (!src) {
                resolve();
                return;
            }
            
            const onLoad = () => {
                iframe.removeEventListener('load', onLoad);
                iframe.removeEventListener('error', onError);
                resolve();
            };
            
            const onError = () => {
                iframe.removeEventListener('load', onLoad);
                iframe.removeEventListener('error', onError);
                reject(new Error(`Failed to load iframe: ${src}`));
            };
            
            iframe.addEventListener('load', onLoad);
            iframe.addEventListener('error', onError);
            
            iframe.src = src;
            iframe.removeAttribute(this.#options.dataSrc);
        });
    }

    /**
     * Load a video element
     * @param {HTMLVideoElement} video - Video element
     * @returns {Promise<void>}
     * @private
     */
    #loadVideo(video) {
        return new Promise((resolve, reject) => {
            const src = video.getAttribute(this.#options.dataSrc);
            const poster = video.getAttribute('data-poster');
            
            if (!src && !poster) {
                resolve();
                return;
            }
            
            if (poster) {
                video.poster = poster;
                video.removeAttribute('data-poster');
            }
            
            if (src) {
                const source = document.createElement('source');
                source.src = src;
                video.appendChild(source);
                video.removeAttribute(this.#options.dataSrc);
                
                video.load();
            }
            
            resolve();
        });
    }

    /**
     * Load content for a generic element
     * @param {Element} element - Element to load
     * @returns {Promise<void>}
     * @private
     */
    async #loadContent(element) {
        const src = element.getAttribute(this.#options.dataSrc);
        
        if (!src) {
            return;
        }
        
        try {
            const response = await fetch(src);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const content = await response.text();
            element.innerHTML = content;
            element.removeAttribute(this.#options.dataSrc);
            
        } catch (error) {
            throw new Error(`Failed to load content: ${src}`);
        }
    }

    /**
     * Observe elements for lazy loading
     * @param {Element|Element[]|NodeList} elements - Element(s) to observe
     * @returns {void}
     * 
     * @example
     * loader.observe(document.querySelectorAll('.lazy'));
     * loader.observe(document.getElementById('my-image'));
     */
    observe(elements) {
        // Normalize to array
        const elementArray = elements instanceof NodeList || Array.isArray(elements)
            ? Array.from(elements)
            : [elements];
        
        for (const element of elementArray) {
            if (!element || this.#elements.has(element)) {
                continue;
            }
            
            this.#elements.set(element, {
                loading: false,
                loaded: false
            });
            
            this.#stats.observed++;
            
            // If IntersectionObserver not available, load immediately
            if (!this.#observer) {
                this.#loadElement(element);
                continue;
            }
            
            this.#observer.observe(element);
        }
    }

    /**
     * Stop observing an element
     * @param {Element} element - Element to unobserve
     * @returns {void}
     */
    unobserve(element) {
        if (this.#observer && this.#elements.has(element)) {
            this.#observer.unobserve(element);
            this.#elements.delete(element);
        }
    }

    /**
     * Stop observing all elements
     * @returns {void}
     */
    unobserveAll() {
        if (this.#observer) {
            this.#observer.disconnect();
        }
        this.#elements.clear();
    }

    /**
     * Force load all remaining elements
     * @returns {Promise<void>}
     * 
     * @example
     * // Load all lazy elements before printing
     * await loader.loadAll();
     * window.print();
     */
    async loadAll() {
        const promises = [];
        
        for (const [element, data] of this.#elements.entries()) {
            if (!data.loaded && !data.loading) {
                promises.push(this.#loadElement(element));
            }
        }
        
        await Promise.allSettled(promises);
    }

    /**
     * Preload elements that will be needed soon
     * @param {Element|Element[]|NodeList} elements - Elements to preload
     * @returns {void}
     */
    preload(elements) {
        const elementArray = elements instanceof NodeList || Array.isArray(elements)
            ? Array.from(elements)
            : [elements];
        
        for (const element of elementArray) {
            if (!element) continue;
            
            // Create a temporary clone to preload
            const src = element.getAttribute(this.#options.dataSrc);
            if (src) {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = src;
                document.head.appendChild(link);
            }
        }
    }

    /**
     * Get loading statistics
     * @returns {Object} Statistics object
     */
    getStats() {
        return { ...this.#stats };
    }

    /**
     * Check if an element is loaded
     * @param {Element} element - Element to check
     * @returns {boolean} True if loaded
     */
    isLoaded(element) {
        const data = this.#elements.get(element);
        return data ? data.loaded : false;
    }

    /**
     * Reset an element to be lazy loaded again
     * @param {Element} element - Element to reset
     * @returns {void}
     */
    reset(element) {
        const data = this.#elements.get(element);
        if (data) {
            data.loading = false;
            data.loaded = false;
            
            if (this.#options.loadedClass) {
                element.classList.remove(this.#options.loadedClass);
            }
            if (this.#options.errorClass) {
                element.classList.remove(this.#options.errorClass);
            }
            
            if (this.#observer) {
                this.#observer.observe(element);
            }
        }
    }

    /**
     * Destroy the lazy loader
     * @returns {void}
     */
    destroy() {
        if (this.#observer) {
            this.#observer.disconnect();
            this.#observer = null;
        }
        
        this.#elements.clear();
        this.#stats = { observed: 0, loaded: 0, errors: 0 };
    }
}

/**
 * LazyImage - Specialized lazy loader for images
 * @class
 */
export class LazyImage {
    /** @type {LazyLoader} */
    #loader;
    
    /** @type {LazyImageOptions} */
    #options;

    /**
     * Creates a new LazyImage instance
     * @param {LazyImageOptions} [options={}] - Configuration options
     * 
     * @example
     * const lazyImg = new LazyImage({
     *     placeholder: '/placeholder.jpg',
     *     fadeIn: true,
     *     fadeInDuration: 300
     * });
     */
    constructor(options = {}) {
        this.#options = {
            fadeIn: true,
            fadeInDuration: 300,
            removePlaceholder: true,
            loadingClass: 'lazy-img-loading',
            loadedClass: 'lazy-img-loaded',
            ...options
        };
        
        this.#loader = new LazyLoader({
            loadingClass: this.#options.loadingClass,
            loadedClass: this.#options.loadedClass,
            onLoad: this.#onImageLoad.bind(this)
        });
    }

    /**
     * Handle image load
     * @param {HTMLImageElement} img - Loaded image
     * @private
     */
    #onImageLoad(img) {
        if (this.#options.fadeIn) {
            img.style.opacity = '0';
            img.style.transition = `opacity ${this.#options.fadeInDuration}ms ease-in-out`;
            
            // Trigger reflow
            img.offsetHeight;
            
            img.style.opacity = '1';
        }
        
        // Remove placeholder if exists
        if (this.#options.removePlaceholder) {
            const placeholder = img.previousElementSibling;
            if (placeholder && placeholder.classList.contains('lazy-placeholder')) {
                setTimeout(() => {
                    placeholder.remove();
                }, this.#options.fadeInDuration);
            }
        }
    }

    /**
     * Create a lazy image element
     * @param {string} src - Image source URL
     * @param {Object} [attrs={}] - Additional attributes
     * @returns {HTMLElement} Container with lazy image
     * 
     * @example
     * const img = lazyImg.create('/images/photo.jpg', {
     *     alt: 'Photo',
     *     width: 400,
     *     height: 300
     * });
     * container.appendChild(img);
     */
    create(src, attrs = {}) {
        const container = document.createElement('div');
        container.className = 'lazy-img-container';
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        
        // Add placeholder if specified
        if (this.#options.placeholder) {
            const placeholder = document.createElement('img');
            placeholder.src = this.#options.placeholder;
            placeholder.className = `lazy-placeholder ${this.#options.placeholderClass || ''}`;
            placeholder.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                filter: blur(10px);
                transition: opacity ${this.#options.fadeInDuration}ms ease-in-out;
            `;
            container.appendChild(placeholder);
        }
        
        // Create lazy image
        const img = document.createElement('img');
        img.setAttribute('data-src', src);
        img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
        `;
        
        // Apply attributes
        for (const [key, value] of Object.entries(attrs)) {
            if (key === 'class') {
                img.className = value;
            } else if (key === 'style') {
                img.style.cssText += value;
            } else {
                img.setAttribute(key, value);
            }
        }
        
        container.appendChild(img);
        
        // Observe for lazy loading
        this.#loader.observe(img);
        
        return container;
    }

    /**
     * Observe existing images
     * @param {Element|Element[]|NodeList} images - Images to observe
     */
    observe(images) {
        this.#loader.observe(images);
    }

    /**
     * Destroy the lazy image loader
     */
    destroy() {
        this.#loader.destroy();
    }
}

/**
 * LazyComponent - Lazy load components and heavy content
 * @class
 */
export class LazyComponent {
    /** @type {Map<Element, Object>} */
    #components = new Map();
    
    /** @type {IntersectionObserver|null} */
    #observer = null;
    
    /** @type {LazyComponentOptions} */
    #options;

    /**
     * Creates a new LazyComponent instance
     * @param {LazyComponentOptions} [options={}] - Configuration options
     * 
     * @example
     * const lazyComp = new LazyComponent({
     *     placeholder: '<div class="skeleton">Loading...</div>',
     *     loader: async (el) => {
     *         const module = await import('./HeavyComponent.js');
     *         return module.render(el);
     *     }
     * });
     */
    constructor(options = {}) {
        this.#options = {
            rootMargin: '100px',
            threshold: 0.1,
            ...options
        };
        
        this.#init();
    }

    /**
     * Initialize the observer
     * @private
     */
    #init() {
        if (typeof IntersectionObserver === 'undefined') {
            return;
        }
        
        this.#observer = new IntersectionObserver(
            this.#handleIntersection.bind(this),
            {
                rootMargin: this.#options.rootMargin,
                threshold: this.#options.threshold
            }
        );
    }

    /**
     * Handle intersection
     * @param {IntersectionObserverEntry[]} entries - Entries
     * @private
     */
    #handleIntersection(entries) {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                this.#loadComponent(entry.target);
            }
        }
    }

    /**
     * Load a component
     * @param {Element} element - Element to load into
     * @private
     */
    async #loadComponent(element) {
        const data = this.#components.get(element);
        
        if (!data || data.loading || data.loaded) {
            return;
        }
        
        data.loading = true;
        
        try {
            // Call loader function
            if (this.#options.loader) {
                await this.#options.loader(element);
            }
            
            data.loaded = true;
            
            // Call onLoad callback
            if (this.#options.onLoad) {
                this.#options.onLoad(element);
            }
            
            // Unobserve
            if (this.#observer) {
                this.#observer.unobserve(element);
            }
            
        } catch (error) {
            data.loading = false;
            
            // Call onError callback
            if (this.#options.onError) {
                this.#options.onError(element, error);
            }
        }
    }

    /**
     * Create a lazy component container
     * @param {Object} [options={}] - Component options
     * @returns {HTMLElement} Container element
     */
    create(options = {}) {
        const container = document.createElement('div');
        container.className = 'lazy-component';
        
        // Add placeholder
        const placeholder = options.placeholder || this.#options.placeholder;
        if (placeholder) {
            container.innerHTML = placeholder;
        }
        
        this.#components.set(container, {
            loading: false,
            loaded: false,
            loader: options.loader
        });
        
        if (this.#observer) {
            this.#observer.observe(container);
        } else {
            // Load immediately if no observer
            this.#loadComponent(container);
        }
        
        return container;
    }

    /**
     * Observe an element for lazy loading
     * @param {Element} element - Element to observe
     * @param {Function} [loader] - Custom loader function
     */
    observe(element, loader) {
        this.#components.set(element, {
            loading: false,
            loaded: false,
            loader
        });
        
        if (this.#observer) {
            this.#observer.observe(element);
        } else {
            this.#loadComponent(element);
        }
    }

    /**
     * Destroy the lazy component loader
     */
    destroy() {
        if (this.#observer) {
            this.#observer.disconnect();
        }
        this.#components.clear();
    }
}

/**
 * Helper function to create a lazy loader instance
 * @param {LazyLoaderOptions} [options={}] - Options
 * @returns {LazyLoader} LazyLoader instance
 */
export function createLazyLoader(options = {}) {
    return new LazyLoader(options);
}

/**
 * Helper function to lazy load images
 * @param {string} selector - CSS selector for images
 * @param {LazyLoaderOptions} [options={}] - Options
 * @returns {LazyLoader} LazyLoader instance
 */
export function lazyLoadImages(selector = 'img[data-src]', options = {}) {
    const loader = new LazyLoader(options);
    const images = document.querySelectorAll(selector);
    loader.observe(images);
    return loader;
}

export default LazyLoader;
