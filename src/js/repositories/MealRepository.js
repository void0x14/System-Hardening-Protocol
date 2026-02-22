/**
 * MealRepository - Repository for meal and nutrition data operations
 * 
 * Handles meal logs, custom foods, and daily meal plans.
 * 
 * @module repositories/MealRepository
 * @since Phase 3
 */

import { BaseRepository } from './BaseRepository.js';
import { KEYS, createDatedKey } from '../config/keys.js';
import { VALIDATION_LIMITS } from '../config/validation.js';

/**
 * Repository for meal and nutrition data
 * @extends BaseRepository
 * 
 * @example
 * const mealRepo = new MealRepository(storage);
 * 
 * // Add meal for today
 * await mealRepo.addMeal('2026-02-14', { name: 'Breakfast', calories: 500 });
 * 
 * // Get meals for a date
 * const meals = await mealRepo.getMealsByDate('2026-02-14');
 */
export class MealRepository extends BaseRepository {
    /**
     * Create a new MealRepository
     * @param {StorageAdapter} storage - Storage adapter instance
     */
    constructor(storage) {
        super(storage, '');
        this.mealKey = KEYS.MEAL;
        this.customFoodsKey = KEYS.CUSTOM_FOODS;
        this.dailyPlanKey = KEYS.DAILY_PLAN;
    }

    /**
     * Get meals for a specific date
     * @param {string} date - ISO date string (YYYY-MM-DD)
     * @returns {Promise<Array>} Meal entries
     */
    async getMealsByDate(date) {
        const key = createDatedKey(this.mealKey, date);
        return await this.storage.get(key) || [];
    }

    /**
     * Save meals for a specific date
     * @param {string} date - ISO date string
     * @param {Array} meals - Meal entries
     * @returns {Promise<boolean>} True if successful
     */
    async saveMeals(date, meals) {
        this._validateMeals(meals);
        const key = createDatedKey(this.mealKey, date);
        return await this.storage.set(key, meals);
    }

    /**
     * Add a meal to a date
     * @param {string} date - ISO date string
     * @param {Object} meal - Meal entry
     * @returns {Promise<Array>} Updated meals array
     */
    async addMeal(date, meal) {
        const meals = await this.getMealsByDate(date);
        meals.push({
            ...meal,
            timestamp: meal.timestamp || Date.now()
        });
        await this.saveMeals(date, meals);
        return meals;
    }

    /**
     * Update a meal by index
     * @param {string} date - ISO date string
     * @param {number} index - Meal index
     * @param {Object} updates - Properties to update
     * @returns {Promise<Array>} Updated meals array
     */
    async updateMeal(date, index, updates) {
        const meals = await this.getMealsByDate(date);
        
        if (index >= 0 && index < meals.length) {
            meals[index] = { ...meals[index], ...updates };
            await this.saveMeals(date, meals);
        }
        
        return meals;
    }

    /**
     * Remove a meal by index
     * @param {string} date - ISO date string
     * @param {number} index - Meal index
     * @returns {Promise<Array>} Updated meals array
     */
    async removeMeal(date, index) {
        const meals = await this.getMealsByDate(date);
        
        if (index >= 0 && index < meals.length) {
            meals.splice(index, 1);
            await this.saveMeals(date, meals);
        }
        
        return meals;
    }

    /**
     * Get total nutrition for a date
     * @param {string} date - ISO date string
     * @returns {Promise<{calories: number, protein: number, carbs: number, fat: number}>}
     */
    async getDailyNutrition(date) {
        const meals = await this.getMealsByDate(date);
        
        return meals.reduce((totals, meal) => ({
            calories: totals.calories + (meal.calories || 0),
            protein: totals.protein + (meal.protein || 0),
            carbs: totals.carbs + (meal.carbs || 0),
            fat: totals.fat + (meal.fat || 0)
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }

    /**
     * Get custom foods
     * @returns {Promise<Array>} Custom food entries
     */
    async getCustomFoods() {
        return await this.storage.get(this.customFoodsKey) || [];
    }

    /**
     * Save custom foods
     * @param {Array} foods - Custom food entries
     * @returns {Promise<boolean>} True if successful
     */
    async saveCustomFoods(foods) {
        this._validateCustomFoods(foods);
        return await this.storage.set(this.customFoodsKey, foods);
    }

    /**
     * Add a custom food
     * @param {Object} food - Custom food entry
     * @returns {Promise<Array>} Updated custom foods array
     */
    async addCustomFood(food) {
        const foods = await this.getCustomFoods();
        
        // Check limit
        const maxFoods = VALIDATION_LIMITS.CUSTOM_FOODS_MAX || 300;
        if (foods.length >= maxFoods) {
            throw new Error(`Maximum custom foods limit (${maxFoods}) reached`);
        }
        
        foods.push({
            ...food,
            id: food.id || this._generateId(),
            createdAt: Date.now()
        });
        
        await this.saveCustomFoods(foods);
        return foods;
    }

    /**
     * Update a custom food by ID
     * @param {string} id - Food ID
     * @param {Object} updates - Properties to update
     * @returns {Promise<Array>} Updated custom foods array
     */
    async updateCustomFood(id, updates) {
        const foods = await this.getCustomFoods();
        const index = foods.findIndex(f => f.id === id);
        
        if (index !== -1) {
            foods[index] = { ...foods[index], ...updates, updatedAt: Date.now() };
            await this.saveCustomFoods(foods);
        }
        
        return foods;
    }

    /**
     * Remove a custom food by ID
     * @param {string} id - Food ID
     * @returns {Promise<Array>} Updated custom foods array
     */
    async removeCustomFood(id) {
        const foods = await this.getCustomFoods();
        const filtered = foods.filter(f => f.id !== id);
        await this.saveCustomFoods(filtered);
        return filtered;
    }

    /**
     * Get daily meal plan
     * @returns {Promise<Object|null>} Daily plan or null
     */
    async getDailyPlan() {
        return await this.storage.get(this.dailyPlanKey);
    }

    /**
     * Save daily meal plan
     * @param {Object} plan - Daily plan object
     * @returns {Promise<boolean>} True if successful
     */
    async saveDailyPlan(plan) {
        return await this.storage.set(this.dailyPlanKey, plan);
    }

    /**
     * Clear daily meal plan
     * @returns {Promise<boolean>} True if successful
     */
    async clearDailyPlan() {
        return await this.storage.remove(this.dailyPlanKey);
    }

    /**
     * Get meal dates in a range
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Promise<string[]>} Array of dates with meals
     */
    async getMealDatesInRange(startDate, endDate) {
        const allKeys = await this.storage.keys();
        const dates = [];
        
        for (const key of allKeys) {
            if (key.startsWith(this.mealKey)) {
                const date = key.slice(this.mealKey.length);
                if (date >= startDate && date <= endDate) {
                    dates.push(date);
                }
            }
        }
        
        return dates.sort();
    }

    /**
     * Get nutrition summary for a date range
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Promise<Object.<string, Object>>} Date -> nutrition summary
     */
    async getNutritionSummary(startDate, endDate) {
        const dates = await this.getMealDatesInRange(startDate, endDate);
        const summary = {};
        
        for (const date of dates) {
            summary[date] = await this.getDailyNutrition(date);
        }
        
        return summary;
    }

    /**
     * Clear meals for a date
     * @param {string} date - ISO date string
     * @returns {Promise<boolean>} True if successful
     */
    async clearMeals(date) {
        const key = createDatedKey(this.mealKey, date);
        return await this.storage.remove(key);
    }

    /**
     * Validate meals array
     * @private
     * @param {Array} meals - Meals to validate
     * @throws {Error} If meals is invalid
     */
    _validateMeals(meals) {
        if (!Array.isArray(meals)) {
            throw new Error('Meals must be an array');
        }
    }

    /**
     * Validate custom foods array
     * @private
     * @param {Array} foods - Foods to validate
     * @throws {Error} If foods is invalid
     */
    _validateCustomFoods(foods) {
        if (!Array.isArray(foods)) {
            throw new Error('Custom foods must be an array');
        }
        
        const maxFoods = VALIDATION_LIMITS.CUSTOM_FOODS_MAX || 300;
        if (foods.length > maxFoods) {
            throw new Error(`Custom foods exceed maximum of ${maxFoods}`);
        }
    }

    /**
     * Generate unique ID
     * @private
     * @returns {string} Unique ID
     */
    _generateId() {
        return `food_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

export default MealRepository;
