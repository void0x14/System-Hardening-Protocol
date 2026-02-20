/**
 * WeightRepository - Repository for weight data operations
 * 
 * Handles weight history, current weight, and weight-related statistics.
 * 
 * @module repositories/WeightRepository
 * @since Phase 3
 */

import { BaseRepository } from '../BaseRepository.js';
import { KEYS } from '../config/keys.js';
import { VALIDATION_LIMITS } from '../config/validation.js';

/**
 * Repository for weight data
 * @extends BaseRepository
 * 
 * @example
 * const weightRepo = new WeightRepository(storage);
 * 
 * // Save weight for today
 * await weightRepo.saveWeight(75.5);
 * 
 * // Get weight history
 * const history = await weightRepo.getHistory();
 * 
 * // Get current weight
 * const current = await weightRepo.getCurrentWeight();
 */
export class WeightRepository extends BaseRepository {
    /**
     * Create a new WeightRepository
     * @param {StorageAdapter} storage - Storage adapter instance
     */
    constructor(storage) {
        super(storage, '');
        this.weightKey = KEYS.WEIGHT;
        this.historyKey = KEYS.WEIGHT_HISTORY;
    }

    /**
     * Get current weight
     * @returns {Promise<number|null>} Current weight in kg or null
     */
    async getCurrentWeight() {
        return await this.storage.get(this.weightKey);
    }

    /**
     * Set current weight
     * @param {number} weight - Weight in kg
     * @returns {Promise<boolean>} True if successful
     * @throws {Error} If weight is invalid
     */
    async setCurrentWeight(weight) {
        this._validateWeight(weight);
        return await this.storage.set(this.weightKey, weight);
    }

    /**
     * Save weight with date (adds to history and updates current)
     * @param {number} weight - Weight in kg
     * @param {string} [date] - ISO date string (defaults to today)
     * @returns {Promise<boolean>} True if successful
     */
    async saveWeight(weight, date = null) {
        this._validateWeight(weight);
        
        const dateStr = date || this._getTodayString();
        
        // Update current weight
        await this.setCurrentWeight(weight);
        
        // Add to history
        const history = await this.getHistory();
        history[dateStr] = weight;
        await this.storage.set(this.historyKey, history);
        
        return true;
    }

    /**
     * Get weight history
     * @returns {Promise<Object.<string, number>>} Date -> weight mapping
     */
    async getHistory() {
        return await this.storage.get(this.historyKey) || {};
    }

    /**
     * Get weight for a specific date
     * @param {string} date - ISO date string
     * @returns {Promise<number|null>} Weight or null if not found
     */
    async getWeightByDate(date) {
        const history = await this.getHistory();
        return history[date] || null;
    }

    /**
     * Get weight history sorted by date
     * @param {number} [limit] - Maximum number of entries to return
     * @returns {Promise<Array<{date: string, weight: number}>>} Sorted history
     */
    async getSortedHistory(limit = null) {
        const history = await this.getHistory();
        const entries = Object.entries(history)
            .map(([date, weight]) => ({ date, weight }))
            .sort((a, b) => a.date.localeCompare(b.date));
        
        if (limit !== null) {
            return entries.slice(-limit);
        }
        
        return entries;
    }

    /**
     * Get weight change over a period
     * @param {number} days - Number of days to look back
     * @returns {Promise<{start: number|null, end: number|null, change: number|null}>}
     */
    async getWeightChange(days) {
        const history = await this.getSortedHistory(days + 1);
        
        if (history.length < 2) {
            return { start: null, end: null, change: null };
        }
        
        const start = history[0].weight;
        const end = history[history.length - 1].weight;
        
        return {
            start,
            end,
            change: end - start
        };
    }

    /**
     * Get weight statistics
     * @returns {Promise<{min: number, max: number, avg: number, count: number}>}
     */
    async getStatistics() {
        const history = await this.getHistory();
        const weights = Object.values(history);
        
        if (weights.length === 0) {
            return { min: null, max: null, avg: null, count: 0 };
        }
        
        return {
            min: Math.min(...weights),
            max: Math.max(...weights),
            avg: weights.reduce((a, b) => a + b, 0) / weights.length,
            count: weights.length
        };
    }

    /**
     * Delete weight entry for a date
     * @param {string} date - ISO date string
     * @returns {Promise<boolean>} True if successful
     */
    async deleteWeight(date) {
        const history = await this.getHistory();
        
        if (history[date]) {
            delete history[date];
            await this.storage.set(this.historyKey, history);
            return true;
        }
        
        return false;
    }

    /**
     * Clear all weight data
     * @returns {Promise<boolean>} True if successful
     */
    async clearAll() {
        await this.storage.remove(this.weightKey);
        await this.storage.remove(this.historyKey);
        return true;
    }

    /**
     * Validate weight value
     * @private
     * @param {number} weight - Weight to validate
     * @throws {Error} If weight is invalid
     */
    _validateWeight(weight) {
        if (typeof weight !== 'number' || isNaN(weight)) {
            throw new Error('Weight must be a valid number');
        }
        
        const { MIN, MAX } = VALIDATION_LIMITS.WEIGHT;
        
        if (weight < MIN || weight > MAX) {
            throw new Error(`Weight must be between ${MIN} and ${MAX} kg`);
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
}

export default WeightRepository;
