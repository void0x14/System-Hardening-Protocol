/**
 * Unit Tests for MealRepository
 * 
 * @fileoverview Tests for meal and nutrition data repository
 */

import { MealRepository } from '../../src/js/repositories/MealRepository.js';
import { MockStorage } from '../mocks/storage.js';
import {
    assertEqual,
    assertTrue,
    assertFalse,
    assertDeepEqual,
    assertLength,
    assertNotNull,
    assertNull,
    assertThrows
} from '../assert.js';

// Test utilities
let testCount = 0;
let passCount = 0;
let failCount = 0;

function test(name, fn) {
    testCount++;
    try {
        fn();
        passCount++;
        console.log(`  ✓ ${name}`);
    } catch (e) {
        failCount++;
        console.log(`  ✗ ${name}\n    ${e.message}`);
    }
}

function describe(name, fn) {
    console.log(`\n=== ${name} ===`);
    fn();
}

// Create repository with mock storage
function createMealRepo(storage = new MockStorage()) {
    return new MealRepository(storage);
}

// Get today's date string
function getTodayStr() {
    return new Date().toISOString().split('T')[0];
}

// ============================================
// MealRepository Tests
// ============================================

describe('MealRepository', () => {
    
    describe('constructor', () => {
        test('should create repository with storage', () => {
            const storage = new MockStorage();
            const repo = new MealRepository(storage);
            
            assertNotNull(repo.storage);
            assertNotNull(repo.mealKey);
            assertNotNull(repo.customFoodsKey);
            assertNotNull(repo.dailyPlanKey);
        });
    });
    
    describe('getMealsByDate', () => {
        test('should return empty array when no meals', async () => {
            const repo = createMealRepo();
            
            const meals = await repo.getMealsByDate('2026-02-14');
            
            assertDeepEqual(meals, []);
        });
        
        test('should return meals for date', async () => {
            const storage = new MockStorage();
            storage.set('monk_meal_2026-02-14', [
                { name: 'Breakfast', calories: 500 },
                { name: 'Lunch', calories: 700 }
            ]);
            
            const repo = createMealRepo(storage);
            
            const meals = await repo.getMealsByDate('2026-02-14');
            
            assertLength(meals, 2);
            assertEqual(meals[0].name, 'Breakfast');
        });
    });
    
    describe('saveMeals', () => {
        test('should save meals for date', async () => {
            const storage = new MockStorage();
            const repo = createMealRepo(storage);
            
            await repo.saveMeals('2026-02-14', [
                { name: 'Breakfast', calories: 500 }
            ]);
            
            const meals = await storage.get('monk_meal_2026-02-14');
            assertLength(meals, 1);
        });
        
        test('should throw for invalid meals', async () => {
            const repo = createMealRepo();
            
            assertThrows(() => repo.saveMeals('2026-02-14', 'not an array'));
        });
    });
    
    describe('addMeal', () => {
        test('should add meal to date', async () => {
            const storage = new MockStorage();
            const repo = createMealRepo(storage);
            
            await repo.addMeal('2026-02-14', {
                name: 'Breakfast',
                calories: 500,
                protein: 30
            });
            
            const meals = await repo.getMealsByDate('2026-02-14');
            assertLength(meals, 1);
            assertEqual(meals[0].name, 'Breakfast');
            assertNotNull(meals[0].timestamp);
        });
        
        test('should append to existing meals', async () => {
            const storage = new MockStorage();
            storage.set('monk_meal_2026-02-14', [
                { name: 'Breakfast', calories: 500 }
            ]);
            
            const repo = createMealRepo(storage);
            
            await repo.addMeal('2026-02-14', {
                name: 'Lunch',
                calories: 700
            });
            
            const meals = await repo.getMealsByDate('2026-02-14');
            assertLength(meals, 2);
        });
    });
    
    describe('updateMeal', () => {
        test('should update meal by index', async () => {
            const storage = new MockStorage();
            storage.set('monk_meal_2026-02-14', [
                { name: 'Breakfast', calories: 500 },
                { name: 'Lunch', calories: 700 }
            ]);
            
            const repo = createMealRepo(storage);
            
            await repo.updateMeal('2026-02-14', 0, { calories: 550 });
            
            const meals = await repo.getMealsByDate('2026-02-14');
            assertEqual(meals[0].calories, 550);
            assertEqual(meals[0].name, 'Breakfast'); // preserved
        });
        
        test('should handle invalid index', async () => {
            const storage = new MockStorage();
            storage.set('monk_meal_2026-02-14', [
                { name: 'Breakfast' }
            ]);
            
            const repo = createMealRepo(storage);
            
            await repo.updateMeal('2026-02-14', 5, { calories: 100 });
            
            const meals = await repo.getMealsByDate('2026-02-14');
            assertLength(meals, 1);
        });
    });
    
    describe('removeMeal', () => {
        test('should remove meal by index', async () => {
            const storage = new MockStorage();
            storage.set('monk_meal_2026-02-14', [
                { name: 'Breakfast' },
                { name: 'Lunch' },
                { name: 'Dinner' }
            ]);
            
            const repo = createMealRepo(storage);
            
            await repo.removeMeal('2026-02-14', 1);
            
            const meals = await repo.getMealsByDate('2026-02-14');
            assertLength(meals, 2);
            assertEqual(meals[1].name, 'Dinner');
        });
    });
    
    describe('getDailyNutrition', () => {
        test('should calculate daily nutrition totals', async () => {
            const storage = new MockStorage();
            storage.set('monk_meal_2026-02-14', [
                { name: 'Breakfast', calories: 500, protein: 30, carbs: 50, fat: 15 },
                { name: 'Lunch', calories: 700, protein: 40, carbs: 80, fat: 20 }
            ]);
            
            const repo = createMealRepo(storage);
            
            const nutrition = await repo.getDailyNutrition('2026-02-14');
            
            assertEqual(nutrition.calories, 1200);
            assertEqual(nutrition.protein, 70);
            assertEqual(nutrition.carbs, 130);
            assertEqual(nutrition.fat, 35);
        });
        
        test('should return zeros for no meals', async () => {
            const repo = createMealRepo();
            
            const nutrition = await repo.getDailyNutrition('2026-02-14');
            
            assertDeepEqual(nutrition, {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            });
        });
        
        test('should handle missing macro values', async () => {
            const storage = new MockStorage();
            storage.set('monk_meal_2026-02-14', [
                { name: 'Breakfast', calories: 500 }, // missing other macros
                { name: 'Lunch', protein: 30 } // missing other macros
            ]);
            
            const repo = createMealRepo(storage);
            
            const nutrition = await repo.getDailyNutrition('2026-02-14');
            
            assertEqual(nutrition.calories, 500);
            assertEqual(nutrition.protein, 30);
        });
    });
    
    describe('getCustomFoods', () => {
        test('should return empty array when no custom foods', async () => {
            const repo = createMealRepo();
            
            const foods = await repo.getCustomFoods();
            
            assertDeepEqual(foods, []);
        });
        
        test('should return custom foods', async () => {
            const storage = new MockStorage();
            storage.set('monk_custom_foods', [
                { id: 'food1', name: 'Protein Bar' },
                { id: 'food2', name: 'Custom Shake' }
            ]);
            
            const repo = createMealRepo(storage);
            
            const foods = await repo.getCustomFoods();
            
            assertLength(foods, 2);
        });
    });
    
    describe('addCustomFood', () => {
        test('should add custom food', async () => {
            const storage = new MockStorage();
            const repo = createMealRepo(storage);
            
            await repo.addCustomFood({
                name: 'Protein Bar',
                calories: 200,
                protein: 20
            });
            
            const foods = await repo.getCustomFoods();
            assertLength(foods, 1);
            assertNotNull(foods[0].id);
            assertNotNull(foods[0].createdAt);
        });
        
        test('should use provided ID', async () => {
            const storage = new MockStorage();
            const repo = createMealRepo(storage);
            
            await repo.addCustomFood({
                id: 'custom_id',
                name: 'Protein Bar'
            });
            
            const foods = await repo.getCustomFoods();
            assertEqual(foods[0].id, 'custom_id');
        });
    });
    
    describe('updateCustomFood', () => {
        test('should update custom food by ID', async () => {
            const storage = new MockStorage();
            storage.set('monk_custom_foods', [
                { id: 'food1', name: 'Protein Bar', calories: 200 }
            ]);
            
            const repo = createMealRepo(storage);
            
            await repo.updateCustomFood('food1', { calories: 250 });
            
            const foods = await repo.getCustomFoods();
            assertEqual(foods[0].calories, 250);
            assertNotNull(foods[0].updatedAt);
        });
        
        test('should handle unknown ID', async () => {
            const storage = new MockStorage();
            storage.set('monk_custom_foods', [
                { id: 'food1', name: 'Protein Bar' }
            ]);
            
            const repo = createMealRepo(storage);
            
            await repo.updateCustomFood('unknown', { calories: 100 });
            
            const foods = await repo.getCustomFoods();
            assertLength(foods, 1);
            assertFalse(foods[0].calories !== undefined);
        });
    });
    
    describe('removeCustomFood', () => {
        test('should remove custom food by ID', async () => {
            const storage = new MockStorage();
            storage.set('monk_custom_foods', [
                { id: 'food1', name: 'Protein Bar' },
                { id: 'food2', name: 'Custom Shake' }
            ]);
            
            const repo = createMealRepo(storage);
            
            await repo.removeCustomFood('food1');
            
            const foods = await repo.getCustomFoods();
            assertLength(foods, 1);
            assertEqual(foods[0].id, 'food2');
        });
    });
    
    describe('getDailyPlan', () => {
        test('should return null when no plan', async () => {
            const repo = createMealRepo();
            
            const plan = await repo.getDailyPlan();
            
            assertNull(plan);
        });
        
        test('should return daily plan', async () => {
            const storage = new MockStorage();
            storage.set('monk_daily_plan', {
                date: '2026-02-14',
                plan: {
                    breakfast: { text: 'Oatmeal', kcal: 350 }
                }
            });
            
            const repo = createMealRepo(storage);
            
            const plan = await repo.getDailyPlan();
            
            assertEqual(plan.date, '2026-02-14');
        });
    });
    
    describe('saveDailyPlan', () => {
        test('should save daily plan', async () => {
            const storage = new MockStorage();
            const repo = createMealRepo(storage);
            
            await repo.saveDailyPlan({
                date: '2026-02-14',
                plan: {
                    breakfast: { text: 'Oatmeal', kcal: 350 }
                }
            });
            
            const plan = await storage.get('monk_daily_plan');
            assertEqual(plan.date, '2026-02-14');
        });
    });
    
    describe('clearDailyPlan', () => {
        test('should clear daily plan', async () => {
            const storage = new MockStorage();
            storage.set('monk_daily_plan', { date: '2026-02-14' });
            
            const repo = createMealRepo(storage);
            
            await repo.clearDailyPlan();
            
            assertNull(await storage.get('monk_daily_plan'));
        });
    });
    
    describe('getMealDatesInRange', () => {
        test('should return dates with meals', async () => {
            const storage = new MockStorage();
            storage.set('monk_meal_2026-02-10', [{ name: 'Breakfast' }]);
            storage.set('monk_meal_2026-02-12', [{ name: 'Lunch' }]);
            storage.set('monk_meal_2026-02-14', [{ name: 'Dinner' }]);
            
            const repo = createMealRepo(storage);
            
            const dates = await repo.getMealDatesInRange('2026-02-10', '2026-02-14');
            
            assertLength(dates, 3);
            assertEqual(dates[0], '2026-02-10');
        });
        
        test('should filter by date range', async () => {
            const storage = new MockStorage();
            storage.set('monk_meal_2026-02-10', [{ name: 'Breakfast' }]);
            storage.set('monk_meal_2026-02-14', [{ name: 'Lunch' }]);
            storage.set('monk_meal_2026-02-20', [{ name: 'Dinner' }]);
            
            const repo = createMealRepo(storage);
            
            const dates = await repo.getMealDatesInRange('2026-02-10', '2026-02-15');
            
            assertLength(dates, 2);
        });
    });
    
    describe('getNutritionSummary', () => {
        test('should return nutrition summary for range', async () => {
            const storage = new MockStorage();
            storage.set('monk_meal_2026-02-14', [
                { name: 'Breakfast', calories: 500, protein: 30, carbs: 50, fat: 15 }
            ]);
            storage.set('monk_meal_2026-02-15', [
                { name: 'Lunch', calories: 700, protein: 40, carbs: 80, fat: 20 }
            ]);
            
            const repo = createMealRepo(storage);
            
            const summary = await repo.getNutritionSummary('2026-02-14', '2026-02-15');
            
            assertEqual(summary['2026-02-14'].calories, 500);
            assertEqual(summary['2026-02-15'].calories, 700);
        });
    });
    
    describe('clearMeals', () => {
        test('should clear meals for date', async () => {
            const storage = new MockStorage();
            storage.set('monk_meal_2026-02-14', [{ name: 'Breakfast' }]);
            
            const repo = createMealRepo(storage);
            
            await repo.clearMeals('2026-02-14');
            
            assertNull(await storage.get('monk_meal_2026-02-14'));
        });
    });
    
    describe('integration tests', () => {
        test('should handle full meal tracking workflow', async () => {
            const repo = createMealRepo();
            
            // Add meals
            await repo.addMeal('2026-02-14', {
                name: 'Breakfast',
                calories: 500,
                protein: 30,
                carbs: 50,
                fat: 15
            });
            
            await repo.addMeal('2026-02-14', {
                name: 'Lunch',
                calories: 700,
                protein: 40,
                carbs: 80,
                fat: 20
            });
            
            // Get daily nutrition
            const nutrition = await repo.getDailyNutrition('2026-02-14');
            assertEqual(nutrition.calories, 1200);
            
            // Add custom food
            await repo.addCustomFood({
                name: 'Protein Bar',
                calories: 200,
                protein: 20
            });
            
            const foods = await repo.getCustomFoods();
            assertLength(foods, 1);
            
            // Save daily plan
            await repo.saveDailyPlan({
                date: '2026-02-14',
                plan: {
                    breakfast: { text: 'Oatmeal', kcal: 350 }
                }
            });
            
            const plan = await repo.getDailyPlan();
            assertNotNull(plan);
        });
    });
});

// Print summary
console.log('\n---');
console.log(`MealRepository Tests: ${passCount}/${testCount} passed`);
if (failCount > 0) {
    console.log(`Failed: ${failCount}`);
}

// Export for test runner
export { testCount, passCount, failCount };
