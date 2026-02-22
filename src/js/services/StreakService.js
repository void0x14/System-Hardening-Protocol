// StreakService.js - Streak Calculation and Management
// Phase 5: Service Layer - Extracted from store.js

import { config } from '../config/index.js';
// BUG-002 FIX: Correct import path - ValidationService is in same directory
import { ValidationService } from './ValidationService.js';

/**
 * StreakService
 * Handles streak calculation and management
 * Zero external dependencies
 */
export class StreakService {
    /**
     * @param {Object} options - Configuration options
     * @param {Object} options.storage - Storage adapter
     * @param {Object} [options.keys] - Storage keys from config
     * @param {Object} [options.validationService] - Validation service instance
     * @param {Object} [options.weeklyPlan] - Weekly plan data
     */
    constructor(options) {
        this.storage = options.storage;
        this.keys = options.keys || config.keys;
        this.validationService = options.validationService || new ValidationService();
        this.weeklyPlan = options.weeklyPlan || {};
    }

    /**
     * Get current streak count
     * @async
     * @returns {Promise<number>} Current streak count
     */
    async getStreak() {
        const streakData = await this.getStreakData();
        const today = this.getDateStr();
        const yesterday = this.getYesterdayStr();

        // If last workout was today, return current count
        if (streakData.lastDate === today) {
            return streakData.count;
        }

        // If last workout was yesterday, streak is still active
        if (streakData.lastDate === yesterday) {
            return streakData.count;
        }

        // Streak is broken
        return 0;
    }

    /**
     * Get streak data object
     * @async
     * @returns {Promise<Object>} Streak data { count, lastDate }
     */
    async getStreakData() {
        const data = await this.storage.get(this.keys.STREAK);
        return this.validationService.sanitizeStreakData(data);
    }

    /**
     * Update streak based on workout completion
     * @async
     * @param {number} [tasksCompleted] - Number of tasks completed today
     * @param {number} [totalTasks] - Total tasks for today
     * @returns {Promise<Object>} Updated streak data
     */
    async updateStreak(tasksCompleted, totalTasks) {
        const today = this.getDateStr();
        
        // Check if minimum workout threshold is met
        const threshold = totalTasks ? Math.ceil(totalTasks / 2) : 1;
        const meetsThreshold = tasksCompleted >= threshold;
        
        if (!meetsThreshold) {
            return await this.getStreakData();
        }

        let streakData = await this.getStreakData();
        const yesterday = this.getYesterdayStr();

        // Only update if not already updated today
        if (streakData.lastDate !== today) {
            if (streakData.lastDate === yesterday) {
                // Continue streak
                streakData.count += 1;
            } else if (streakData.lastDate !== today) {
                // Start new streak
                streakData.count = 1;
            }
            
            streakData.lastDate = today;
            await this.storage.set(this.keys.STREAK, streakData);
        }

        return streakData;
    }

    /**
     * Calculate streak from array of dates
     * @param {Array<string>} dates - Array of date strings (YYYY-MM-DD)
     * @returns {Object} Streak info { current, longest, lastDate }
     */
    calculateStreak(dates) {
        if (!Array.isArray(dates) || dates.length === 0) {
            return { current: 0, longest: 0, lastDate: null };
        }

        // Sort dates descending
        const sortedDates = [...dates]
            .filter(d => this.validationService.isIsoDateKey(d))
            .sort()
            .reverse();

        if (sortedDates.length === 0) {
            return { current: 0, longest: 0, lastDate: null };
        }

        const today = this.getDateStr();
        const yesterday = this.getYesterdayStr();

        // Calculate current streak
        let currentStreak = 0;
        const lastDate = sortedDates[0];

        // Check if streak is still active
        if (lastDate === today || lastDate === yesterday) {
            currentStreak = 1;
            
            for (let i = 1; i < sortedDates.length; i++) {
                const prevDate = new Date(sortedDates[i - 1]);
                const currDate = new Date(sortedDates[i]);
                const diffDays = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) {
                    currentStreak++;
                } else {
                    break;
                }
            }
        }

        // Calculate longest streak
        let longestStreak = 1;
        let tempStreak = 1;
        
        for (let i = 1; i < sortedDates.length; i++) {
            const prevDate = new Date(sortedDates[i - 1]);
            const currDate = new Date(sortedDates[i]);
            const diffDays = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                tempStreak++;
                longestStreak = Math.max(longestStreak, tempStreak);
            } else {
                tempStreak = 1;
            }
        }

        return {
            current: currentStreak,
            longest: longestStreak,
            lastDate
        };
    }

    /**
     * Get streak history
     * @async
     * @param {number} [days=30] - Number of days to analyze
     * @returns {Promise<Object>} Streak history and statistics
     */
    async getStreakHistory(days = 30) {
        const workoutDates = [];
        
        for (let i = 0; i < days; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = this.formatDate(d);
            
            const workout = await this.getWorkout(dateStr);
            if (workout.length > 0) {
                workoutDates.push(dateStr);
            }
        }

        const streakInfo = this.calculateStreak(workoutDates);
        
        return {
            ...streakInfo,
            workoutDates,
            totalWorkoutDays: workoutDates.length,
            periodDays: days
        };
    }

    /**
     * Check if streak is at risk (no workout today and it's past noon)
     * @async
     * @returns {Promise<Object>} Risk status { atRisk, hoursRemaining, message }
     */
    async checkStreakRisk() {
        const streakData = await this.getStreakData();
        const today = this.getDateStr();
        
        // Already worked out today
        if (streakData.lastDate === today) {
            return {
                atRisk: false,
                hoursRemaining: null,
                message: 'Workout completed today'
            };
        }

        // No active streak
        if (streakData.count === 0) {
            return {
                atRisk: false,
                hoursRemaining: null,
                message: 'No active streak'
            };
        }

        // Calculate hours remaining in the day
        const now = new Date();
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        const hoursRemaining = (endOfDay - now) / (1000 * 60 * 60);

        // At risk if less than 6 hours remaining
        const atRisk = hoursRemaining < 6;

        return {
            atRisk,
            hoursRemaining: Math.round(hoursRemaining),
            message: atRisk
                ? `Streak at risk! ${Math.round(hoursRemaining)} hours remaining`
                : `${Math.round(hoursRemaining)} hours remaining today`
        };
    }

    /**
     * Get streak milestones
     * @async
     * @returns {Promise<Object>} Milestone info { next, completed }
     */
    async getStreakMilestones() {
        const currentStreak = await this.getStreak();
        const milestones = [7, 14, 30, 60, 90, 180, 365];
        
        let nextMilestone = null;
        const completedMilestones = [];
        
        for (const milestone of milestones) {
            if (currentStreak >= milestone) {
                completedMilestones.push(milestone);
            } else if (!nextMilestone) {
                nextMilestone = {
                    target: milestone,
                    remaining: milestone - currentStreak,
                    progress: Math.round((currentStreak / milestone) * 100)
                };
            }
        }

        return {
            current: currentStreak,
            next: nextMilestone,
            completed: completedMilestones
        };
    }

    /**
     * Reset streak
     * @async
     * @returns {Promise<boolean>} Success status
     */
    async resetStreak() {
        await this.storage.set(this.keys.STREAK, { count: 0, lastDate: null });
        return true;
    }

    /**
     * Manually set streak (for testing or import)
     * @async
     * @param {number} count - Streak count
     * @param {string} lastDate - Last workout date
     * @returns {Promise<boolean>} Success status
     */
    async setStreak(count, lastDate) {
        const sanitized = this.validationService.sanitizeStreakData({
            count,
            lastDate
        });
        await this.storage.set(this.keys.STREAK, sanitized);
        return true;
    }

    // ===========================================
    // HELPER METHODS
    // ===========================================

    /**
     * Get workout tasks for a date
     * @async
     * @param {string} date - Date string
     * @returns {Promise<Array>} Workout task IDs
     * @private
     */
    async getWorkout(date) {
        return await this.storage.get(this.keys.WORKOUT + date) || [];
    }

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
     * Get yesterday's date string
     * @returns {string} Date string YYYY-MM-DD
     * @private
     */
    getYesterdayStr() {
        const d = new Date();
        d.setDate(d.getDate() - 1);
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

export default StreakService;
