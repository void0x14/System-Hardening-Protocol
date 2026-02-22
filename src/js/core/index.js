/**
 * Copyright (c) 2025-2026 void0x14
 */

import { Store } from '../store.js';

/**
 * Core Module - DI Container and Event Bus
 * 
 * @module core
 * @description Core infrastructure components for the application.
 * Provides dependency injection and event-driven communication patterns.
 * 
 * @example
 * import { Container, EventBus } from '../core/index.js';
 * 
 * // Create container and event bus
 * const container = new Container();
 * const eventBus = new EventBus();
 * 
 * // Register services
 * container.register('eventBus', () => eventBus);
 * container.register('store', (c) => new Store(c.get('eventBus')));
 * 
 * // Subscribe to events
 * eventBus.on('store:change', (state) => console.log(state));
 */

export { Container } from '../Container.js';
export { EventBus } from '../EventBus.js';
