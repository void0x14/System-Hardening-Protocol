/**
 * Copyright (c) 2025-2026 void0x14
 */

/**
 * Infrastructure Module - Storage Abstraction Layer
 * 
 * This module provides storage adapters and infrastructure components
 * for the application. The storage abstraction allows for different
 * storage backends while maintaining a consistent API.
 * 
 * @module infrastructure
 * @since Phase 3
 * 
 * @example
 * // Import specific adapters
 * import { LocalStorageAdapter, MemoryStorageAdapter } from '../infrastructure/index.js';
 * 
 * // Use localStorage for persistence
 * const storage = new LocalStorageAdapter({ prefix: 'monk_' });
 * await storage.set('weight', 75.5);
 * 
 * // Use memory storage for testing
 * const testStorage = new MemoryStorageAdapter();
 */

// Storage Adapters
export { StorageAdapter } from '../StorageAdapter.js';
export { LocalStorageAdapter } from '../LocalStorageAdapter.js';
export { MemoryStorageAdapter } from '../MemoryStorageAdapter.js';

// Default export for convenience
export default {
    StorageAdapter: (await import('./StorageAdapter.js')).StorageAdapter,
    LocalStorageAdapter: (await import('./LocalStorageAdapter.js')).LocalStorageAdapter,
    MemoryStorageAdapter: (await import('./MemoryStorageAdapter.js')).MemoryStorageAdapter
};
