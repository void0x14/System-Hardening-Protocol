/**
 * Copyright (c) 2025-2026 void0x14
 */

/**
 * Event Bus for decoupled communication
 * Zero-dependency implementation for publish/subscribe pattern
 * 
 * @module EventBus
 * @description A lightweight event bus that enables loose coupling between components.
 * Replaces direct function calls with event-based communication.
 * 
 * @example
 * const eventBus = new EventBus();
 * 
 * // Subscribe to an event
 * const unsubscribe = eventBus.on('user:login', (user) => {
 *     console.log(`User ${user.name} logged in`);
 * });
 * 
 * // Emit an event
 * eventBus.emit('user:login', { name: 'John' });
 * 
 * // Unsubscribe
 * unsubscribe();
 * 
 * // One-time subscription
 * eventBus.once('app:ready', () => console.log('App is ready!'));
 */

/**
 * @typedef {Function} EventHandler
 * @param {*} payload - Event payload data
 * @returns {void}
 */

/**
 * @typedef {Object} EventSubscription
 * @property {string} event - Event name
 * @property {EventHandler} handler - Event handler function
 */

/**
 * Event Bus for decoupled communication
 * @class
 */
export class EventBus {
    /**
     * Creates a new EventBus instance
     */
    constructor() {
        /** @type {Map<string, Set<EventHandler>>} */
        this.#handlers = new Map();
        /** @type {Map<string, Set<EventHandler>>} */
        this.#onceHandlers = new Map();
        /** @type {Array<{event: string, payload: *}>} */
        this.#eventHistory = [];
        /** @type {boolean} */
        this.#recordHistory = false;
    }

    /** @type {Map<string, Set<EventHandler>>} */
    #handlers;

    /** @type {Map<string, Set<EventHandler>>} */
    #onceHandlers;

    /** @type {Array<{event: string, payload: *}>} */
    #eventHistory;

    /** @type {boolean} */
    #recordHistory;

    /**
     * Subscribe to an event
     * 
     * @param {string} event - Event name
     * @param {EventHandler} handler - Event handler function
     * @returns {Function} Unsubscribe function
     * @throws {Error} If event name is not a string or handler is not a function
     * 
     * @example
     * const unsubscribe = eventBus.on('store:change', (state) => {
     *     console.log('State changed:', state);
     * });
     * 
     * // Later: unsubscribe
     * unsubscribe();
     */
    on(event, handler) {
        if (typeof event !== 'string' || event.trim() === '') {
            throw new Error('Event name must be a non-empty string');
        }
        if (typeof handler !== 'function') {
            throw new Error('Handler must be a function');
        }

        if (!this.#handlers.has(event)) {
            this.#handlers.set(event, new Set());
        }
        this.#handlers.get(event).add(handler);

        // Return unsubscribe function
        return () => this.off(event, handler);
    }

    /**
     * Subscribe to an event only once
     * The handler will be automatically removed after first invocation
     * 
     * @param {string} event - Event name
     * @param {EventHandler} handler - Event handler function
     * @returns {Function} Unsubscribe function
     * @throws {Error} If event name is not a string or handler is not a function
     * 
     * @example
     * eventBus.once('app:ready', () => {
     *     console.log('This will only run once');
     * });
     */
    once(event, handler) {
        if (typeof event !== 'string' || event.trim() === '') {
            throw new Error('Event name must be a non-empty string');
        }
        if (typeof handler !== 'function') {
            throw new Error('Handler must be a function');
        }

        if (!this.#onceHandlers.has(event)) {
            this.#onceHandlers.set(event, new Set());
        }
        this.#onceHandlers.get(event).add(handler);

        // Return unsubscribe function
        return () => {
            if (this.#onceHandlers.has(event)) {
                this.#onceHandlers.get(event).delete(handler);
            }
        };
    }

    /**
     * Unsubscribe from an event
     * 
     * @param {string} event - Event name
     * @param {EventHandler} handler - Event handler function to remove
     * @returns {boolean} True if handler was removed
     * 
     * @example
     * const handler = (data) => console.log(data);
     * eventBus.on('test', handler);
     * eventBus.off('test', handler);
     */
    off(event, handler) {
        let removed = false;

        if (this.#handlers.has(event)) {
            removed = this.#handlers.get(event).delete(handler) || removed;
            // Clean up empty sets
            if (this.#handlers.get(event).size === 0) {
                this.#handlers.delete(event);
            }
        }

        if (this.#onceHandlers.has(event)) {
            removed = this.#onceHandlers.get(event).delete(handler) || removed;
            // Clean up empty sets
            if (this.#onceHandlers.get(event).size === 0) {
                this.#onceHandlers.delete(event);
            }
        }

        return removed;
    }

    /**
     * Emit an event to all subscribers
     * 
     * @param {string} event - Event name
     * @param {*} [payload] - Optional payload data to pass to handlers
     * @returns {number} Number of handlers invoked
     * 
     * @example
     * eventBus.emit('user:login', { id: 1, name: 'John' });
     */
    emit(event, payload) {
        if (typeof event !== 'string' || event.trim() === '') {
            throw new Error('Event name must be a non-empty string');
        }

        // Record event history if enabled
        if (this.#recordHistory) {
            this.#eventHistory.push({ event, payload });
        }

        let handlerCount = 0;

        // Call regular handlers
        if (this.#handlers.has(event)) {
            const handlers = this.#handlers.get(event);
            handlers.forEach(handler => {
                try {
                    handler(payload);
                    handlerCount++;
                } catch (error) {
                    console.error(`EventBus: Error in handler for event "${event}":`, error);
                }
            });
        }

        // Call once handlers and remove them
        if (this.#onceHandlers.has(event)) {
            const onceHandlers = Array.from(this.#onceHandlers.get(event));
            this.#onceHandlers.delete(event);
            
            onceHandlers.forEach(handler => {
                try {
                    handler(payload);
                    handlerCount++;
                } catch (error) {
                    console.error(`EventBus: Error in once handler for event "${event}":`, error);
                }
            });
        }

        return handlerCount;
    }

    /**
     * Emit an event asynchronously
     * Handlers are invoked in the next microtask
     * 
     * @param {string} event - Event name
     * @param {*} [payload] - Optional payload data
     * @returns {Promise<number>} Promise resolving to number of handlers invoked
     * 
     * @example
     * await eventBus.emitAsync('data:save', data);
     */
    async emitAsync(event, payload) {
        return new Promise((resolve) => {
            queueMicrotask(() => {
                resolve(this.emit(event, payload));
            });
        });
    }

    /**
     * Clear all handlers for a specific event
     * 
     * @param {string} event - Event name
     * @returns {number} Number of handlers removed
     * 
     * @example
     * eventBus.clearEvent('user:login');
     */
    clearEvent(event) {
        let count = 0;

        if (this.#handlers.has(event)) {
            count += this.#handlers.get(event).size;
            this.#handlers.delete(event);
        }

        if (this.#onceHandlers.has(event)) {
            count += this.#onceHandlers.get(event).size;
            this.#onceHandlers.delete(event);
        }

        return count;
    }

    /**
     * Clear all handlers for all events
     * Useful for testing or resetting the bus
     * 
     * @returns {void}
     * 
     * @example
     * eventBus.clear();
     */
    clear() {
        this.#handlers.clear();
        this.#onceHandlers.clear();
        this.#eventHistory = [];
    }

    /**
     * Check if there are any handlers for an event
     * 
     * @param {string} event - Event name
     * @returns {boolean} True if event has handlers
     * 
     * @example
     * if (eventBus.hasHandlers('store:change')) {
     *     eventBus.emit('store:change', newState);
     * }
     */
    hasHandlers(event) {
        return (this.#handlers.has(event) && this.#handlers.get(event).size > 0) ||
               (this.#onceHandlers.has(event) && this.#onceHandlers.get(event).size > 0);
    }

    /**
     * Get the number of handlers for an event
     * 
     * @param {string} event - Event name
     * @returns {number} Number of handlers
     * 
     * @example
     * const count = eventBus.handlerCount('user:login');
     * console.log(`${count} handlers subscribed`);
     */
    handlerCount(event) {
        let count = 0;
        if (this.#handlers.has(event)) {
            count += this.#handlers.get(event).size;
        }
        if (this.#onceHandlers.has(event)) {
            count += this.#onceHandlers.get(event).size;
        }
        return count;
    }

    /**
     * Get all registered event names
     * 
     * @returns {string[]} Array of event names
     * 
     * @example
     * const events = eventBus.getEvents();
     * console.log('Active events:', events);
     */
    getEvents() {
        const events = new Set([
            ...this.#handlers.keys(),
            ...this.#onceHandlers.keys()
        ]);
        return Array.from(events);
    }

    /**
     * Enable or disable event history recording
     * Useful for debugging
     * 
     * @param {boolean} enabled - Whether to record history
     * @returns {void}
     * 
     * @example
     * eventBus.setHistoryRecording(true);
     * eventBus.emit('test', { data: 1 });
     * console.log(eventBus.getHistory());
     */
    setHistoryRecording(enabled) {
        this.#recordHistory = enabled;
    }

    /**
     * Get event history (if recording is enabled)
     * 
     * @returns {Array<{event: string, payload: *}>} Event history
     * 
     * @example
     * const history = eventBus.getHistory();
     * history.forEach(e => console.log(e.event, e.payload));
     */
    getHistory() {
        return [...this.#eventHistory];
    }

    /**
     * Clear event history
     * 
     * @returns {void}
     * 
     * @example
     * eventBus.clearHistory();
     */
    clearHistory() {
        this.#eventHistory = [];
    }
}

export default EventBus;
