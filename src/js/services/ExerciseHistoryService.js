// ExerciseHistoryService.js - Exercise History Tracking
// Phase 5: Service Layer - Extracted from store.js

import { config } from '../config/index.js';
import { ValidationService } from './ValidationService.js';

/**
 * ExerciseHistoryService
 * Handles exercise history tracking and personal records
 * Zero external dependencies
 */
export class ExerciseHistoryService {
    /**
     * @param {Object} options - Configuration options
     * @param {Object} options.storage - Storage adapter
     * @param {Object} [options.keys] - Storage keys from config
     * @param {Object} [options.validationService] - Validation service instance
     * @param {number} [options.maxHistoryPerExercise=100] - Max history entries per exercise
     */
    constructor(options) {
        this.storage = options.storage;
        this.keys = options.keys || config.keys;
        this.validationService = options.validationService || new ValidationService();
        this.maxHistoryPerExercise = options.maxHistoryPerExercise || 100;
    }

    /**
     * Save exercise set to history
     * @async
     * @param {string} exerciseId - Exercise ID
     * @param {number} weight - Weight in kg
     * @param {number} reps - Number of reps
     * @returns {Promise<boolean>} Success status
     */
    async saveToHistory(exerciseId, weight, reps) {
        const history = await this.getHistoryRaw();
        
        if (!history[exerciseId]) {
            history[exerciseId] = [];
        }
        
        history[exerciseId].push({
            date: this.getDateStr(),
            weight: weight,
            reps: reps,
            volume: weight * reps,
            timestamp: new Date().toISOString()
        });
        
        // Limit history size
        if (history[exerciseId].length > this.maxHistoryPerExercise) {
            history[exerciseId] = history[exerciseId].slice(-this.maxHistoryPerExercise);
        }
        
        await this.storage.set(this.keys.EXERCISE_HISTORY, history);
        return true;
    }

    /**
     * Log a set for an exercise (alias for saveToHistory)
     * @async
     * @param {string} exerciseId - Exercise ID
     * @param {Object} setData - Set data { weight, reps, duration, completed }
     * @returns {Promise<Object>} Logged set data
     */
    async logSet(exerciseId, setData) {
        const { weight = 0, reps = 0, duration, completed } = setData;
        
        if (completed && weight > 0 && reps > 0) {
            await this.saveToHistory(exerciseId, weight, reps);
        }
        
        return {
            exerciseId,
            weight,
            reps,
            volume: weight * reps,
            duration,
            completed,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Get exercise history for a specific exercise
     * @async
     * @param {string} exerciseId - Exercise ID
     * @returns {Promise<Array>} Exercise history entries
     */
    async getHistory(exerciseId) {
        const history = await this.getHistoryRaw();
        
        if (!Array.isArray(history[exerciseId])) {
            return [];
        }
        
        return history[exerciseId]
            .map(record => this.validationService.sanitizeExerciseHistoryEntry(record))
            .filter(Boolean)
            .slice(-this.maxHistoryPerExercise);
    }

    /**
     * Get all exercise history
     * @async
     * @returns {Promise<Object>} All exercise history
     */
    async getAllHistory() {
        const history = await this.getHistoryRaw();
        return this.validationService.sanitizeExerciseHistoryData(history);
    }

    /**
     * Get raw history data from storage
     * @async
     * @returns {Promise<Object>} Raw history data
     * @private
     */
    async getHistoryRaw() {
        return await this.storage.get(this.keys.EXERCISE_HISTORY) || {};
    }

    /**
     * Get personal best for an exercise
     * @async
     * @param {string} exerciseId - Exercise ID
     * @param {string} [type='volume'] - PR type: 'volume', 'weight', 'reps'
     * @returns {Promise<Object|null>} Personal best record
     */
    async getPersonalBest(exerciseId, type = 'volume') {
        const history = await this.getHistory(exerciseId);
        
        if (history.length === 0) {
            return null;
        }
        
        let bestRecord = null;
        let bestValue = 0;
        
        history.forEach(record => {
            let value;
            
            switch (type) {
                case 'weight':
                    value = record.weight || 0;
                    break;
                case 'reps':
                    value = record.reps || 0;
                    break;
                case 'volume':
                default:
                    value = record.volume || (record.weight * record.reps);
                    break;
            }
            
            if (value > bestValue) {
                bestValue = value;
                bestRecord = { ...record, [type]: value };
            }
        });
        
        return bestRecord;
    }

    /**
     * Get personal bests for all exercises
     * @async
     * @param {string} [type='volume'] - PR type
     * @returns {Promise<Object>} Personal bests by exercise ID
     */
    async getAllPersonalBests(type = 'volume') {
        const history = await this.getHistoryRaw();
        const prs = {};
        
        for (const exerciseId of Object.keys(history)) {
            const pr = await this.getPersonalBest(exerciseId, type);
            if (pr) {
                prs[exerciseId] = pr;
            }
        }
        
        return prs;
    }

    /**
     * Get recent history for an exercise
     * @async
     * @param {string} exerciseId - Exercise ID
     * @param {number} [days=7] - Number of days to look back
     * @returns {Promise<Array>} Recent history entries
     */
    async getRecentHistory(exerciseId, days = 7) {
        const history = await this.getHistory(exerciseId);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const cutoffStr = this.formatDate(cutoffDate);
        
        return history.filter(record => {
            const recordDate = record.date || '';
            return recordDate >= cutoffStr;
        });
    }

    /**
     * Get exercise statistics
     * @async
     * @param {string} exerciseId - Exercise ID
     * @returns {Promise<Object>} Exercise statistics
     */
    async getExerciseStats(exerciseId) {
        const history = await this.getHistory(exerciseId);
        
        if (history.length === 0) {
            return {
                totalSessions: 0,
                totalSets: 0,
                totalVolume: 0,
                avgWeight: 0,
                avgReps: 0,
                avgVolume: 0,
                prVolume: null,
                prWeight: null,
                prReps: null,
                firstSession: null,
                lastSession: null
            };
        }
        
        let totalVolume = 0;
        let totalWeight = 0;
        let totalReps = 0;
        let prVolume = 0;
        let prWeight = 0;
        let prReps = 0;
        const dates = new Set();
        
        history.forEach(record => {
            const vol = record.volume || (record.weight * record.reps);
            totalVolume += vol;
            totalWeight += record.weight || 0;
            totalReps += record.reps || 0;
            
            if (vol > prVolume) prVolume = vol;
            if ((record.weight || 0) > prWeight) prWeight = record.weight || 0;
            if ((record.reps || 0) > prReps) prReps = record.reps || 0;
            
            if (record.date) dates.add(record.date);
        });
        
        const sortedDates = Array.from(dates).sort();
        
        return {
            totalSessions: dates.size,
            totalSets: history.length,
            totalVolume,
            avgWeight: Math.round(totalWeight / history.length),
            avgReps: Math.round(totalReps / history.length),
            avgVolume: Math.round(totalVolume / history.length),
            prVolume: prVolume > 0 ? prVolume : null,
            prWeight: prWeight > 0 ? prWeight : null,
            prReps: prReps > 0 ? prReps : null,
            firstSession: sortedDates[0] || null,
            lastSession: sortedDates[sortedDates.length - 1] || null
        };
    }

    /**
     * Check if a new PR was set
     * @async
     * @param {string} exerciseId - Exercise ID
     * @param {number} weight - Weight
     * @param {number} reps - Reps
     * @returns {Promise<Object>} PR check result { isPR, type, previousPR }
     */
    async checkForPR(exerciseId, weight, reps) {
        const volume = weight * reps;
        const prVolume = await this.getPersonalBest(exerciseId, 'volume');
        const prWeight = await this.getPersonalBest(exerciseId, 'weight');
        
        const result = { isPR: false, type: null, previousPR: null };
        
        // Check volume PR
        if (prVolume && volume > (prVolume.volume || 0)) {
            result.isPR = true;
            result.type = 'volume';
            result.previousPR = prVolume;
        }
        
        // Check weight PR
        if (prWeight && weight > (prWeight.weight || 0)) {
            if (!result.isPR || weight > (prWeight.weight || 0)) {
                result.isPR = true;
                result.type = 'weight';
                result.previousPR = prWeight;
            }
        }
        
        return result;
    }

    /**
     * Clear history for an exercise
     * @async
     * @param {string} exerciseId - Exercise ID
     * @returns {Promise<boolean>} Success status
     */
    async clearHistory(exerciseId) {
        const history = await this.getHistoryRaw();
        
        if (history[exerciseId]) {
            delete history[exerciseId];
            await this.storage.set(this.keys.EXERCISE_HISTORY, history);
        }
        
        return true;
    }

    /**
     * Clear all exercise history
     * @async
     * @returns {Promise<boolean>} Success status
     */
    async clearAllHistory() {
        await this.storage.set(this.keys.EXERCISE_HISTORY, {});
        return true;
    }

    // ===========================================
    // HELPER METHODS
    // ===========================================

    /**
     * Get current date string
     * @returns {string} Date string YYYY-MM-DD
     * @private
     */
    getDateStr() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Format date to YYYY-MM-DD
     * @param {Date} date - Date object
     * @returns {string} Formatted date string
     * @private
     */
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

export default ExerciseHistoryService;
