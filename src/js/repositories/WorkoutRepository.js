/**
 * WorkoutRepository - Repository for workout data operations
 * 
 * Handles workout logs, exercise history, and personal records.
 * 
 * @module repositories/WorkoutRepository
 * @since Phase 3
 */

import { BaseRepository } from './BaseRepository.js';
import { KEYS, createDatedKey, isDatePrefixedKey } from '../config/keys.js';
import { VALIDATION_LIMITS } from '../config/validation.js';

/**
 * Repository for workout data
 * @extends BaseRepository
 * 
 * @example
 * const workoutRepo = new WorkoutRepository(storage);
 * 
 * // Save workout for today
 * await workoutRepo.saveWorkout('2026-02-14', workoutData);
 * 
 * // Get workout history
 * const history = await workoutRepo.getWorkoutByDate('2026-02-14');
 */
export class WorkoutRepository extends BaseRepository {
    /**
     * Create a new WorkoutRepository
     * @param {StorageAdapter} storage - Storage adapter instance
     */
    constructor(storage) {
        super(storage, '');
        this.workoutKey = KEYS.WORKOUT;
        this.workoutDataKey = KEYS.WORKOUT_DATA;
        this.exerciseHistoryKey = KEYS.EXERCISE_HISTORY;
    }

    /**
     * Get workout log for a specific date
     * @param {string} date - ISO date string (YYYY-MM-DD)
     * @returns {Promise<Array>} Workout log entries
     */
    async getWorkoutByDate(date) {
        const key = createDatedKey(this.workoutKey, date);
        return await this.storage.get(key) || [];
    }

    /**
     * Save workout log for a specific date
     * @param {string} date - ISO date string
     * @param {Array} workoutLog - Workout log entries
     * @returns {Promise<boolean>} True if successful
     */
    async saveWorkout(date, workoutLog) {
        this._validateWorkoutLog(workoutLog);
        const key = createDatedKey(this.workoutKey, date);
        return await this.storage.set(key, workoutLog);
    }

    /**
     * Add exercise to workout log
     * @param {string} date - ISO date string
     * @param {Object} exercise - Exercise entry
     * @returns {Promise<Array>} Updated workout log
     */
    async addExercise(date, exercise) {
        const log = await this.getWorkoutByDate(date);
        log.push(exercise);
        await this.saveWorkout(date, log);
        return log;
    }

    /**
     * Remove exercise from workout log by index
     * @param {string} date - ISO date string
     * @param {number} index - Exercise index
     * @returns {Promise<Array>} Updated workout log
     */
    async removeExercise(date, index) {
        const log = await this.getWorkoutByDate(date);
        if (index >= 0 && index < log.length) {
            log.splice(index, 1);
            await this.saveWorkout(date, log);
        }
        return log;
    }

    /**
     * Get workout data (sets) for a specific date
     * @param {string} date - ISO date string
     * @returns {Promise<Object>} Workout set data
     */
    async getWorkoutData(date) {
        const key = createDatedKey(this.workoutDataKey, date);
        return await this.storage.get(key) || {};
    }

    /**
     * Save workout data (sets) for a specific date
     * @param {string} date - ISO date string
     * @param {Object} data - Workout set data
     * @returns {Promise<boolean>} True if successful
     */
    async saveWorkoutData(date, data) {
        const key = createDatedKey(this.workoutDataKey, date);
        return await this.storage.set(key, data);
    }

    /**
     * Get exercise history for PR tracking
     * @returns {Promise<Object.<string, Array>>} Exercise ID -> history entries
     */
    async getExerciseHistory() {
        return await this.storage.get(this.exerciseHistoryKey) || {};
    }

    /**
     * Save exercise history
     * @param {Object} history - Exercise history object
     * @returns {Promise<boolean>} True if successful
     */
    async saveExerciseHistory(history) {
        return await this.storage.set(this.exerciseHistoryKey, history);
    }

    /**
     * Add entry to exercise history
     * @param {string} exerciseId - Exercise identifier
     * @param {Object} entry - History entry (date, weight, reps, volume)
     * @returns {Promise<boolean>} True if successful
     */
    async addToExerciseHistory(exerciseId, entry) {
        const history = await this.getExerciseHistory();
        
        if (!history[exerciseId]) {
            history[exerciseId] = [];
        }
        
        // Add entry with timestamp
        history[exerciseId].push({
            ...entry,
            timestamp: entry.timestamp || Date.now()
        });
        
        // Limit history size
        const maxEntries = VALIDATION_LIMITS.EXERCISE_HISTORY_MAX || 100;
        if (history[exerciseId].length > maxEntries) {
            history[exerciseId] = history[exerciseId].slice(-maxEntries);
        }
        
        return await this.saveExerciseHistory(history);
    }

    /**
     * Get history for a specific exercise
     * @param {string} exerciseId - Exercise identifier
     * @returns {Promise<Array>} Exercise history entries
     */
    async getExerciseHistoryById(exerciseId) {
        const history = await this.getExerciseHistory();
        return history[exerciseId] || [];
    }

    /**
     * Get personal best for an exercise
     * @param {string} exerciseId - Exercise identifier
     * @param {string} [type='volume'] - PR type: 'volume', 'weight', 'reps'
     * @returns {Promise<Object|null>} PR entry or null
     */
    async getPersonalBest(exerciseId, type = 'volume') {
        const history = await this.getExerciseHistoryById(exerciseId);
        
        if (history.length === 0) {
            return null;
        }
        
        let best = null;
        let bestValue = -Infinity;
        
        for (const entry of history) {
            const value = entry[type];
            if (typeof value === 'number' && value > bestValue) {
                bestValue = value;
                best = entry;
            }
        }
        
        return best;
    }

    /**
     * Get all personal records
     * @returns {Promise<Object.<string, Object>>} Exercise ID -> PR entry
     */
    async getAllPersonalRecords() {
        const history = await this.getExerciseHistory();
        const records = {};
        
        for (const [exerciseId, entries] of Object.entries(history)) {
            if (entries.length > 0) {
                // Find best volume
                const best = entries.reduce((max, entry) => {
                    const volume = entry.volume || 0;
                    return volume > (max.volume || 0) ? entry : max;
                }, entries[0]);
                
                records[exerciseId] = best;
            }
        }
        
        return records;
    }

    /**
     * Get workout dates in a range
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Promise<string[]>} Array of dates with workouts
     */
    async getWorkoutDatesInRange(startDate, endDate) {
        const allKeys = await this.storage.keys();
        const dates = [];
        
        for (const key of allKeys) {
            if (key.startsWith(this.workoutKey)) {
                const date = key.slice(this.workoutKey.length);
                if (date >= startDate && date <= endDate) {
                    dates.push(date);
                }
            }
        }
        
        return dates.sort();
    }

    /**
     * Get workout streak (consecutive days)
     * @returns {Promise<number>} Number of consecutive workout days
     */
    async getWorkoutStreak() {
        const today = this._getTodayString();
        const dates = await this.getWorkoutDatesInRange(
            this._getDateOffset(today, -365),
            today
        );
        
        if (dates.length === 0) return 0;
        
        let streak = 0;
        let checkDate = today;
        
        // Check if today has a workout
        const todayWorkout = await this.getWorkoutByDate(today);
        if (!todayWorkout || todayWorkout.length === 0) {
            // Check yesterday
            checkDate = this._getDateOffset(today, -1);
        }
        
        for (let i = dates.length - 1; i >= 0; i--) {
            if (dates[i] === checkDate) {
                streak++;
                checkDate = this._getDateOffset(checkDate, -1);
            } else if (dates[i] < checkDate) {
                break;
            }
        }
        
        return streak;
    }

    /**
     * Clear workout data for a date
     * @param {string} date - ISO date string
     * @returns {Promise<boolean>} True if successful
     */
    async clearWorkout(date) {
        const workoutKey = createDatedKey(this.workoutKey, date);
        const dataKey = createDatedKey(this.workoutDataKey, date);
        
        await this.storage.remove(workoutKey);
        await this.storage.remove(dataKey);
        
        return true;
    }

    /**
     * Validate workout log
     * @private
     * @param {Array} log - Workout log to validate
     * @throws {Error} If log is invalid
     */
    _validateWorkoutLog(log) {
        if (!Array.isArray(log)) {
            throw new Error('Workout log must be an array');
        }
        
        const maxTasks = VALIDATION_LIMITS.WORKOUT_TASKS_MAX || 128;
        if (log.length > maxTasks) {
            throw new Error(`Workout log exceeds maximum of ${maxTasks} entries`);
        }
    }

    /**
     * Get today's date as ISO string
     * @private
     * @returns {string} YYYY-MM-DD format
     */
    _getTodayString() {
        return new Date().toISOString().split('T')[0];
    }

    /**
     * Get date offset by days
     * @private
     * @param {string} dateStr - Date string (YYYY-MM-DD)
     * @param {number} days - Days to offset (negative for past)
     * @returns {string} New date string
     */
    _getDateOffset(dateStr, days) {
        const date = new Date(dateStr);
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    }
}

export default WorkoutRepository;
