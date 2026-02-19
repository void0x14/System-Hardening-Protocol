// services/index.js - Service Layer Exports
// Phase 5: Service Layer

/**
 * Service Layer Module
 * Provides business logic services for the application
 * 
 * Services:
 * - ValidationService: Data validation and sanitization
 * - BackupService: Export/import functionality
 * - StatisticsService: Metrics and analytics
 * - ExerciseHistoryService: Exercise history tracking
 * - StreakService: Streak calculation and management
 */

// Export all services
export { ValidationService } from './ValidationService.js';
export { BackupService } from './BackupService.js';
export { StatisticsService } from './StatisticsService.js';
export { ExerciseHistoryService } from './ExerciseHistoryService.js';
export { StreakService } from './StreakService.js';

// Default export with all services
export default {
    ValidationService: (await import('./ValidationService.js')).ValidationService,
    BackupService: (await import('./BackupService.js')).BackupService,
    StatisticsService: (await import('./StatisticsService.js')).StatisticsService,
    ExerciseHistoryService: (await import('./ExerciseHistoryService.js')).ExerciseHistoryService,
    StreakService: (await import('./StreakService.js')).StreakService
};

/**
 * Service Factory
 * Creates configured service instances with shared dependencies
 * 
 * @example
 * import { createServices } from './services/index.js';
 * 
 * const services = createServices({
 *     storage: localStorageAdapter,
 *     config: appConfig,
 *     weeklyPlan: WEEKLY_PLAN
 * });
 * 
 * // Use services
 * await services.streak.getStreak();
 * await services.statistics.getVolumeStats();
 */
export function createServices(options) {
    const {
        storage,
        config: appConfig,
        weeklyPlan,
        exerciseIds
    } = options;

    // Create shared validation service
    const validationService = new ValidationService({
        limits: appConfig?.validation,
        exerciseIds
    });

    // Create all services with shared dependencies
    const backupService = new BackupService({
        storage,
        validationService,
        keys: appConfig?.keys,
        version: appConfig?.VERSION
    });

    const statisticsService = new StatisticsService({
        storage,
        keys: appConfig?.keys,
        targets: appConfig?.targets,
        weeklyPlan
    });

    const exerciseHistoryService = new ExerciseHistoryService({
        storage,
        validationService,
        keys: appConfig?.keys
    });

    const streakService = new StreakService({
        storage,
        validationService,
        keys: appConfig?.keys,
        weeklyPlan
    });

    return {
        validation: validationService,
        backup: backupService,
        statistics: statisticsService,
        exerciseHistory: exerciseHistoryService,
        streak: streakService
    };
}

/**
 * Service container for dependency injection
 * Allows lazy initialization and service registration
 */
export class ServiceContainer {
    constructor() {
        this.services = new Map();
        this.factories = new Map();
    }

    /**
     * Register a service factory
     * @param {string} name - Service name
     * @param {Function} factory - Factory function
     */
    register(name, factory) {
        this.factories.set(name, factory);
    }

    /**
     * Get a service instance (lazy initialization)
     * @param {string} name - Service name
     * @returns {*} Service instance
     */
    get(name) {
        if (!this.services.has(name)) {
            const factory = this.factories.get(name);
            if (!factory) {
                throw new Error(`Service not found: ${name}`);
            }
            this.services.set(name, factory(this));
        }
        return this.services.get(name);
    }

    /**
     * Check if service is registered
     * @param {string} name - Service name
     * @returns {boolean}
     */
    has(name) {
        return this.factories.has(name);
    }

    /**
     * Clear all services (for testing)
     */
    clear() {
        this.services.clear();
        this.factories.clear();
    }
}

/**
 * Create a service container with pre-registered services
 * @param {Object} options - Configuration options
 * @returns {ServiceContainer} Configured service container
 */
export function createServiceContainer(options) {
    const container = new ServiceContainer();
    const {
        storage,
        config: appConfig,
        weeklyPlan,
        exerciseIds
    } = options;

    // Register validation service (singleton)
    container.register('validation', () => new ValidationService({
        limits: appConfig?.validation,
        exerciseIds
    }));

    // Register backup service
    container.register('backup', (c) => new BackupService({
        storage,
        validationService: c.get('validation'),
        keys: appConfig?.keys,
        version: appConfig?.VERSION
    }));

    // Register statistics service
    container.register('statistics', () => new StatisticsService({
        storage,
        keys: appConfig?.keys,
        targets: appConfig?.targets,
        weeklyPlan
    }));

    // Register exercise history service
    container.register('exerciseHistory', (c) => new ExerciseHistoryService({
        storage,
        validationService: c.get('validation'),
        keys: appConfig?.keys
    }));

    // Register streak service
    container.register('streak', (c) => new StreakService({
        storage,
        validationService: c.get('validation'),
        keys: appConfig?.keys,
        weeklyPlan
    }));

    return container;
}
