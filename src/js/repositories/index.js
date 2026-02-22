/**
 * Copyright (c) 2025-2026 void0x14
 */

/**
 * Repositories Module - Data Access Layer
 * 
 * This module provides repository classes for data access operations.
 * Each repository handles a specific domain (weight, workouts, meals)
 * and provides a clean API for CRUD operations.
 * 
 * @module repositories
 * @since Phase 3
 * 
 * @example
 * // Import specific repositories
 * import { WeightRepository, WorkoutRepository, MealRepository } from '../repositories/index.js';
 * 
 * // Create instances with storage adapter
 * const weightRepo = new WeightRepository(storage);
 * const workoutRepo = new WorkoutRepository(storage);
 * const mealRepo = new MealRepository(storage);
 * 
 * // Use repositories
 * await weightRepo.saveWeight(75.5);
 * await workoutRepo.addExercise('2026-02-14', { exercise: 'squat' });
 * await mealRepo.addMeal('2026-02-14', { name: 'Breakfast', calories: 500 });
 */

// Base Repository
export { BaseRepository } from '../BaseRepository.js';

// Entity Repositories
export { WeightRepository } from '../WeightRepository.js';
export { WorkoutRepository } from '../WorkoutRepository.js';
export { MealRepository } from '../MealRepository.js';

// Default export for convenience
export default {
    BaseRepository: (await import('./BaseRepository.js')).BaseRepository,
    WeightRepository: (await import('./WeightRepository.js')).WeightRepository,
    WorkoutRepository: (await import('./WorkoutRepository.js')).WorkoutRepository,
    MealRepository: (await import('./MealRepository.js')).MealRepository
};
