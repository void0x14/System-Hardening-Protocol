/**
 * Copyright (c) 2025-2026 void0x14
 */

// views/index.js - View Components Module
// Re-exports all view components for easy importing

// View components
import { Store } from '../store.js';
import { UI } from '../ui.js';
import { Stealth } from '../stealth.js';

export { DashboardView } from './DashboardView.js';
export { TrainingView } from './TrainingView.js';
export { NutritionView } from './NutritionView.js';
export { ProgressView } from './ProgressView.js';
export { AnatomyView } from './AnatomyView.js';
export { MentalView } from './MentalView.js';

/**
 * Create Views Factory Object
 * Creates all view instances with injected dependencies
 * 
 * @param {Object} dependencies - Shared dependencies
 * @param {Object} dependencies.store - Store instance
 * @param {Object} dependencies.config - Configuration object
 * @param {Object} dependencies.theme - Theme constants
 * @param {Object} dependencies.utils - Utility functions
 * @param {Object} dependencies.weeklyPlan - Weekly plan data
 * @param {Object} dependencies.db - Exercise database
 * @param {Object} dependencies.anatomyDb - Anatomy database
 * @param {Object} dependencies.mentalPhases - Mental phases data
 * @param {Object} dependencies.storage - Storage adapter
 * @param {Object} dependencies.ui - UI manager
 * @param {Object} dependencies.stealth - Stealth mode handler
 * @returns {Object} Object containing all view instances
 */
export function createViews(dependencies = {}) {
    const dashboardView = new DashboardView({
        store: dependencies.store,
        config: dependencies.config,
        theme: dependencies.theme,
        utils: dependencies.utils,
        weeklyPlan: dependencies.weeklyPlan
    });

    const trainingView = new TrainingView({
        store: dependencies.store,
        config: dependencies.config,
        theme: dependencies.theme,
        utils: dependencies.utils,
        weeklyPlan: dependencies.weeklyPlan,
        db: dependencies.db,
        stealth: dependencies.stealth
    });

    const nutritionView = new NutritionView({
        store: dependencies.store,
        config: dependencies.config,
        theme: dependencies.theme,
        utils: dependencies.utils
    });

    const progressView = new ProgressView({
        store: dependencies.store,
        config: dependencies.config,
        theme: dependencies.theme,
        utils: dependencies.utils,
        stealth: dependencies.stealth
    });

    const anatomyView = new AnatomyView({
        store: dependencies.store,
        config: dependencies.config,
        theme: dependencies.theme,
        utils: dependencies.utils,
        anatomyDb: dependencies.anatomyDb,
        ui: dependencies.ui,
        stealth: dependencies.stealth
    });

    const mentalView = new MentalView({
        store: dependencies.store,
        config: dependencies.config,
        theme: dependencies.theme,
        utils: dependencies.utils,
        mentalPhases: dependencies.mentalPhases,
        storage: dependencies.storage
    });

    return {
        dashboard: dashboardView,
        training: trainingView,
        nutrition: nutritionView,
        progress: progressView,
        anatomy: anatomyView,
        mental: mentalView
    };
}

/**
 * Renderers namespace for backward compatibility
 * Creates a Renderers-like object with async render methods
 * 
 * @param {Object} views - Views object from createViews()
 * @returns {Object} Renderers-like object
 */
export function createRenderersNamespace(views) {
    return {
        dashboard: async () => views.dashboard.render(),
        training: async () => views.training.render(),
        nutrition: async () => views.nutrition.render(),
        progress: async () => views.progress.render(),
        anatomy: async () => views.anatomy.render(),
        mental: async () => views.mental.render(),
        getHeatmapHTML: async () => views.dashboard._getHeatmapHTML()
    };
}

export default {
    DashboardView,
    TrainingView,
    NutritionView,
    ProgressView,
    AnatomyView,
    MentalView,
    createViews,
    createRenderersNamespace
};
