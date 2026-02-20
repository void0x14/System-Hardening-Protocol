import { Store } from '../store.js';

/**
 * Dependency Injection Container
 * Zero-dependency implementation for managing service lifecycles
 * 
 * @module Container
 * @description A lightweight DI container supporting singleton and transient lifecycles.
 * Provides factory-based service registration with lazy instantiation.
 * 
 * @example
 * const container = new Container();
 * 
 * // Register a singleton service
 * container.register('config', (c) => ({ apiUrl: 'https://api.example.com' }));
 * 
 * // Register a service with dependencies
 * container.register('api', (c) => new ApiService(c.get('config')));
 * 
 * // Register a transient service (new instance each time)
 * container.register('logger', (c) => new Logger(), 'transient');
 * 
 * // Get service instance
 * const api = container.get('api');
 */

/**
 * @typedef {'singleton' | 'transient'} LifecycleType
 * @description Service lifecycle type
 * - singleton: Single instance shared across all requests
 * - transient: New instance created for each request
 */

/**
 * @typedef {Object} ServiceRegistration
 * @property {Function} factory - Factory function that creates the service
 * @property {LifecycleType} lifecycle - Service lifecycle type
 * @property {*} [instance] - Cached instance for singleton services
 */

/**
 * Dependency Injection Container
 * @class
 */
export class Container {
    /**
     * Creates a new Container instance
     */
    constructor() {
        /** @type {Map<string, ServiceRegistration>} */
        this.#services = new Map();
        /** @type {Map<string, Function>} */
        this.#factories = new Map();
        /** @type {Map<string, LifecycleType>} */
        this.#lifecycles = new Map();
    }

    /** @type {Map<string, ServiceRegistration>} */
    #services;

    /** @type {Map<string, Function>} */
    #factories;

    /** @type {Map<string, LifecycleType>} */
    #lifecycles;

    /**
     * Register a service with the container
     * 
     * @param {string} name - Unique service identifier
     * @param {Function} factory - Factory function that receives the container and returns the service instance
     * @param {LifecycleType} [lifecycle='singleton'] - Service lifecycle ('singleton' or 'transient')
     * @returns {Container} Returns this container for chaining
     * @throws {Error} If name is not a string or factory is not a function
     * 
     * @example
     * container.register('store', (c) => new Store(c.get('storage')));
     * container.register('logger', (c) => new Logger(), 'transient');
     */
    register(name, factory, lifecycle = 'singleton') {
        if (typeof name !== 'string' || name.trim() === '') {
            throw new Error('Service name must be a non-empty string');
        }
        if (typeof factory !== 'function') {
            throw new Error('Factory must be a function');
        }
        if (lifecycle !== 'singleton' && lifecycle !== 'transient') {
            throw new Error(`Invalid lifecycle: ${lifecycle}. Must be 'singleton' or 'transient'`);
        }

        this.#factories.set(name, factory);
        this.#lifecycles.set(name, lifecycle);
        this.#services.set(name, {
            factory,
            lifecycle,
            instance: undefined
        });

        return this;
    }

    /**
     * Get a service instance from the container
     * 
     * For singleton services, returns the cached instance or creates a new one.
     * For transient services, always creates a new instance.
     * 
     * @param {string} name - Service identifier
     * @returns {*} Service instance
     * @throws {Error} If service is not registered
     * 
     * @example
     * const store = container.get('store');
     */
    get(name) {
        if (!this.has(name)) {
            throw new Error(`Service not found: ${name}`);
        }

        const registration = this.#services.get(name);

        // For transient services, always create a new instance
        if (registration.lifecycle === 'transient') {
            return registration.factory(this);
        }

        // For singleton services, return cached instance or create new
        if (registration.instance === undefined) {
            registration.instance = registration.factory(this);
        }

        return registration.instance;
    }

    /**
     * Check if a service is registered
     * 
     * @param {string} name - Service identifier
     * @returns {boolean} True if service is registered
     * 
     * @example
     * if (container.has('logger')) {
     *     container.get('logger').log('Hello');
     * }
     */
    has(name) {
        return this.#services.has(name);
    }

    /**
     * Resolve a service (alias for get)
     * 
     * @param {string} name - Service identifier
     * @returns {*} Service instance
     * @throws {Error} If service is not registered
     * 
     * @example
     * const api = container.resolve('api');
     */
    resolve(name) {
        return this.get(name);
    }

    /**
     * Unregister a service from the container
     * 
     * @param {string} name - Service identifier
     * @returns {boolean} True if service was removed, false if it didn't exist
     * 
     * @example
     * container.unregister('oldService');
     */
    unregister(name) {
        const existed = this.#services.has(name);
        this.#services.delete(name);
        this.#factories.delete(name);
        this.#lifecycles.delete(name);
        return existed;
    }

    /**
     * Clear all registered services
     * Useful for testing or resetting the container
     * 
     * @returns {void}
     * 
     * @example
     * container.clear();
     */
    clear() {
        this.#services.clear();
        this.#factories.clear();
        this.#lifecycles.clear();
    }

    /**
     * Get all registered service names
     * 
     * @returns {string[]} Array of service names
     * 
     * @example
     * const services = container.getRegisteredServices();
     * console.log(services); // ['store', 'api', 'logger']
     */
    getRegisteredServices() {
        return Array.from(this.#services.keys());
    }

    /**
     * Check if a singleton service has been instantiated
     * 
     * @param {string} name - Service identifier
     * @returns {boolean} True if service is a singleton and has been instantiated
     * 
     * @example
     * if (container.isInstantiated('store')) {
     *     console.log('Store already created');
     * }
     */
    isInstantiated(name) {
        if (!this.has(name)) {
            return false;
        }
        const registration = this.#services.get(name);
        return registration.lifecycle === 'singleton' && registration.instance !== undefined;
    }

    /**
     * Create a child container that inherits services from this container
     * Child containers can override parent services without affecting the parent
     * 
     * @returns {Container} New child container
     * 
     * @example
     * const childContainer = container.createChild();
     * childContainer.register('config', (c) => ({ apiUrl: 'https://test.api' }));
     */
    createChild() {
        const child = new Container();
        
        // Copy all service registrations to child
        for (const [name, registration] of this.#services) {
            child.#services.set(name, { ...registration });
            child.#factories.set(name, registration.factory);
            child.#lifecycles.set(name, registration.lifecycle);
        }
        
        return child;
    }
}

export default Container;
