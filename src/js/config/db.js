// config/db.js
// Exports the central DB namespace and deferred init functions

export const DB = {};

// Import init functions from each DB module
import { initExercisesDB } from '../db/exercises.js';
import { initFoodsDB } from '../db/foods.js';
import { initAnatomyDB } from '../db/anatomy.js';
import { initMentalPhasesDB } from '../db/mental-phases.js';
import { initWeeklyPlan } from '../db/weekly-plan.js';

/**
 * Initialize all DB data. Must be called AFTER i18n.init() so translations resolve.
 */
export function initAllDB() {
    initExercisesDB();
    initFoodsDB();
    initAnatomyDB();
    initMentalPhasesDB();
    initWeeklyPlan();
}
