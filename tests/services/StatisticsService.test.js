/**
 * Unit Tests for StatisticsService
 * 
 * @fileoverview Tests for metrics and analytics service
 */

import { StatisticsService } from '../../src/js/services/StatisticsService.js';
import { MockStorage } from '../mocks/storage.js';
import {
    assertEqual,
    assertTrue,
    assertFalse,
    assertDeepEqual,
    assertLength,
    assertNotNull,
    assertNull,
    assertApproxEqual
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

// Mock storage keys
const mockKeys = {
    WEIGHT: 'monk_weight',
    WEIGHT_HISTORY: 'monk_weight_history',
    CUSTOM_FOODS: 'monk_custom_foods',
    DAILY_PLAN: 'monk_daily_plan',
    STREAK: 'monk_streak',
    FUEL: 'monk_fuel_date',
    WORKOUT: 'monk_workout_log_',
    WORKOUT_DATA: 'monk_workout_data_',
    SLEEP: 'monk_sleep_',
    WATER: 'monk_water_',
    MEAL: 'monk_meal_',
    MEASURE: 'monk_measure',
    EXERCISE_HISTORY: 'monk_exercise_history',
    MENTAL_PROGRESS: 'monk_mental_progress',
    BACKUP: 'monk_backup_date'
};

// Mock targets
const mockTargets = {
    CAL: { TARGET: 3000 },
    PROTEIN: { TARGET: 225 },
    CARBS: { TARGET: 375 },
    FAT: { TARGET: 67 }
};

// Create service with mock storage
function createStatsService(storage = new MockStorage()) {
    return new StatisticsService({
        storage,
        keys: mockKeys,
        targets: mockTargets,
        weeklyPlan: {}
    });
}

// Get today's date string
function getTodayStr() {
    return new Date().toISOString().split('T')[0];
}

// ============================================
// StatisticsService Tests
// ============================================

describe('StatisticsService', () => {
    
    describe('constructor', () => {
        test('should create service with required options', () => {
            const storage = new MockStorage();
            const service = new StatisticsService({
                storage,
                keys: mockKeys
            });
            
            assertNotNull(service.storage);
            assertNotNull(service.keys);
        });
        
        test('should initialize empty cache', () => {
            const service = createStatsService();
            
            assertDeepEqual(service._cache, {});
        });
    });
    
    describe('clearCache', () => {
        test('should clear specific cache key', () => {
            const service = createStatsService();
            service._cache.testKey = { data: 'test' };
            
            service.clearCache('testKey');
            
            assertNull(service._cache.testKey);
        });
        
        test('should clear all cache when no key provided', () => {
            const service = createStatsService();
            service._cache.key1 = { data: 1 };
            service._cache.key2 = { data: 2 };
            
            service.clearCache();
            
            assertDeepEqual(service._cache, {});
        });
    });
    
    describe('getVolumeStats', () => {
        test('should return zero stats for empty storage', async () => {
            const service = createStatsService();
            
            const stats = await service.getVolumeStats();
            
            assertEqual(stats.weekly, 0);
            assertEqual(stats.monthly, 0);
            assertEqual(stats.totalSets, 0);
            assertEqual(stats.weeklyDays, 0);
        });
        
        test('should calculate volume from workout data', async () => {
            const storage = new MockStorage();
            const today = getTodayStr();
            
            storage.set('monk_workout_data_' + today, {
                squat: [
                    { weight: 100, reps: 5, completed: true },
                    { weight: 110, reps: 3, completed: true }
                ],
                bench: [
                    { weight: 60, reps: 8, completed: true }
                ]
            });
            
            const service = createStatsService(storage);
            
            const stats = await service.getVolumeStats();
            
            // Volume = (100*5) + (110*3) + (60*8) = 500 + 330 + 480 = 1310
            assertEqual(stats.weekly, 1310);
            assertEqual(stats.totalSets, 3);
            assertEqual(stats.weeklyDays, 1);
        });
        
        test('should only count completed sets', async () => {
            const storage = new MockStorage();
            const today = getTodayStr();
            
            storage.set('monk_workout_data_' + today, {
                squat: [
                    { weight: 100, reps: 5, completed: true },
                    { weight: 110, reps: 3, completed: false }
                ]
            });
            
            const service = createStatsService(storage);
            
            const stats = await service.getVolumeStats();
            
            // Only first set counts
            assertEqual(stats.weekly, 500);
            assertEqual(stats.totalSets, 1);
        });
        
        test('should include daily breakdown for last 7 days', async () => {
            const storage = new MockStorage();
            const today = getTodayStr();
            
            storage.set('monk_workout_data_' + today, {
                squat: [{ weight: 100, reps: 5, completed: true }]
            });
            
            const service = createStatsService(storage);
            
            const stats = await service.getVolumeStats();
            
            assertNotNull(stats.daily[today]);
            assertEqual(stats.daily[today], 500);
        });
    });
    
    describe('getTodayProgress', () => {
        test('should return progress for today', async () => {
            const storage = new MockStorage();
            const today = getTodayStr();
            
            storage.set(mockKeys.WORKOUT + today, ['squat', 'bench']);
            storage.set(mockKeys.MEAL + today, [
                { name: 'Breakfast', cal: 500 },
                { name: 'Lunch', cal: 700 }
            ]);
            
            const service = createStatsService(storage);
            
            const progress = await service.getTodayProgress();
            
            assertEqual(progress.tasksDone, 2);
            assertEqual(progress.calories, 1200);
            assertEqual(progress.caloriesTarget, 3000);
        });
        
        test('should calculate task percentage', async () => {
            const storage = new MockStorage();
            const today = getTodayStr();
            
            storage.set(mockKeys.WORKOUT + today, ['task1', 'task2']);
            
            const service = new StatisticsService({
                storage,
                keys: mockKeys,
                targets: mockTargets,
                weeklyPlan: {
                    [new Date().getDay()]: { tasks: ['task1', 'task2', 'task3', 'task4'] }
                }
            });
            
            const progress = await service.getTodayProgress();
            
            assertEqual(progress.tasksTotal, 4);
            assertEqual(progress.tasksPercent, 50);
        });
        
        test('should calculate calorie percentage', async () => {
            const storage = new MockStorage();
            const today = getTodayStr();
            
            storage.set(mockKeys.MEAL + today, [
                { cal: 1500 } // 50% of 3000 target
            ]);
            
            const service = createStatsService(storage);
            
            const progress = await service.getTodayProgress();
            
            assertEqual(progress.caloriesPercent, 50);
        });
    });
    
    describe('getSleep / setSleep', () => {
        test('should get and set sleep hours', async () => {
            const storage = new MockStorage();
            const service = createStatsService(storage);
            
            await service.setSleep(7.5);
            
            const sleep = await service.getSleep(getTodayStr());
            assertEqual(sleep, 7.5);
        });
        
        test('should return 0 for missing sleep data', async () => {
            const service = createStatsService();
            
            const sleep = await service.getSleep('2020-01-01');
            assertEqual(sleep, 0);
        });
        
        test('should clear cache on set', async () => {
            const service = createStatsService();
            service._cache.sleepStats = { data: 'cached' };
            
            await service.setSleep(8);
            
            assertNull(service._cache.sleepStats);
        });
    });
    
    describe('getSleepStats', () => {
        test('should return sleep statistics', async () => {
            const storage = new MockStorage();
            const today = getTodayStr();
            
            storage.set(mockKeys.SLEEP + today, 8);
            
            const service = createStatsService(storage);
            
            const stats = await service.getSleepStats();
            
            assertEqual(stats.today, 8);
            assertNotNull(stats.weekAvg);
            assertNotNull(stats.monthAvg);
        });
        
        test('should include history for last 7 days', async () => {
            const service = createStatsService();
            
            const stats = await service.getSleepStats();
            
            assertLength(stats.history, 7);
        });
        
        test('should calculate weekly average', async () => {
            const storage = new MockStorage();
            const today = new Date();
            
            // Set sleep for 3 days
            for (let i = 0; i < 3; i++) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                storage.set(mockKeys.SLEEP + dateStr, 8);
            }
            
            const service = createStatsService(storage);
            
            const stats = await service.getSleepStats();
            
            assertEqual(stats.weekDays, 3);
            assertEqual(parseFloat(stats.weekAvg), 8);
        });
    });
    
    describe('getWater / addWater', () => {
        test('should add water cups', async () => {
            const storage = new MockStorage();
            const service = createStatsService(storage);
            
            const result = await service.addWater(2);
            
            assertEqual(result, 2);
            
            const water = await service.getWater(getTodayStr());
            assertEqual(water, 2);
        });
        
        test('should increment existing water count', async () => {
            const storage = new MockStorage();
            const service = createStatsService(storage);
            
            await service.addWater(2);
            await service.addWater(3);
            
            const water = await service.getWater(getTodayStr());
            assertEqual(water, 5);
        });
        
        test('should default to 1 cup', async () => {
            const storage = new MockStorage();
            const service = createStatsService(storage);
            
            await service.addWater();
            
            const water = await service.getWater(getTodayStr());
            assertEqual(water, 1);
        });
        
        test('should clear cache on add', async () => {
            const service = createStatsService();
            service._cache.waterStats = { data: 'cached' };
            
            await service.addWater(1);
            
            assertNull(service._cache.waterStats);
        });
    });
    
    describe('getWaterStats', () => {
        test('should return water statistics', async () => {
            const storage = new MockStorage();
            const today = getTodayStr();
            
            storage.set(mockKeys.WATER + today, 8);
            
            const service = createStatsService(storage);
            
            const stats = await service.getWaterStats();
            
            assertEqual(stats.today, 8);
            assertNotNull(stats.weekTotal);
            assertNotNull(stats.monthTotal);
        });
        
        test('should include history for last 7 days', async () => {
            const service = createStatsService();
            
            const stats = await service.getWaterStats();
            
            assertLength(stats.history, 7);
        });
        
        test('should calculate averages', async () => {
            const storage = new MockStorage();
            const today = new Date();
            
            // Set water for 7 days
            for (let i = 0; i < 7; i++) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                storage.set(mockKeys.WATER + dateStr, 8);
            }
            
            const service = createStatsService(storage);
            
            const stats = await service.getWaterStats();
            
            assertEqual(stats.weekTotal, 56);
            assertEqual(parseFloat(stats.weekAvg), 8);
        });
    });
    
    describe('getWeeklySummary', () => {
        test('should return summary for 4 weeks', async () => {
            const service = createStatsService();
            
            const summary = await service.getWeeklySummary();
            
            assertLength(summary, 4);
        });
        
        test('should calculate average calories', async () => {
            const storage = new MockStorage();
            const today = new Date();
            
            // Add meals for 3 days in current week
            for (let i = 0; i < 3; i++) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                storage.set(mockKeys.MEAL + dateStr, [{ cal: 2000 }]);
            }
            
            const service = createStatsService(storage);
            
            const summary = await service.getWeeklySummary();
            
            assertEqual(summary[0].avgCal, 2000);
        });
        
        test('should count workout days', async () => {
            const storage = new MockStorage();
            const today = new Date();
            
            // Add workouts for 2 days in current week
            for (let i = 0; i < 2; i++) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                storage.set(mockKeys.WORKOUT + dateStr, ['squat']);
            }
            
            const service = createStatsService(storage);
            
            const summary = await service.getWeeklySummary();
            
            assertEqual(summary[0].workoutDays, 2);
        });
    });
    
    describe('calculateMacroAverages', () => {
        test('should calculate macro averages from meals', () => {
            const service = createStatsService();
            
            const result = service.calculateMacroAverages([
                { cal: 500, prot: 30, carb: 50, fat: 15 },
                { cal: 600, prot: 40, carb: 60, fat: 20 }
            ]);
            
            assertEqual(result.cal, 550);
            assertEqual(result.prot, 35);
            assertEqual(result.carb, 55);
            assertEqual(result.fat, 18);
        });
        
        test('should return zeros for empty array', () => {
            const service = createStatsService();
            
            const result = service.calculateMacroAverages([]);
            
            assertDeepEqual(result, { cal: 0, prot: 0, carb: 0, fat: 0 });
        });
        
        test('should handle missing macro values', () => {
            const service = createStatsService();
            
            const result = service.calculateMacroAverages([
                { cal: 500 }, // missing other macros
                { prot: 30 }  // missing other macros
            ]);
            
            assertEqual(result.cal, 250);
            assertEqual(result.prot, 15);
        });
    });
    
    describe('getDailyNutrition', () => {
        test('should return nutrition summary for today', async () => {
            const storage = new MockStorage();
            const today = getTodayStr();
            
            storage.set(mockKeys.MEAL + today, [
                { cal: 500, prot: 30, carb: 50, fat: 15 },
                { cal: 700, prot: 50, carb: 80, fat: 20 }
            ]);
            
            const service = createStatsService(storage);
            
            const nutrition = await service.getDailyNutrition();
            
            assertEqual(nutrition.date, today);
            assertEqual(nutrition.totals.cal, 1200);
            assertEqual(nutrition.totals.prot, 80);
            assertEqual(nutrition.mealCount, 2);
        });
        
        test('should calculate percentages', async () => {
            const storage = new MockStorage();
            const today = getTodayStr();
            
            storage.set(mockKeys.MEAL + today, [
                { cal: 1500, prot: 112, carb: 187, fat: 33 } // 50% of targets
            ]);
            
            const service = createStatsService(storage);
            
            const nutrition = await service.getDailyNutrition();
            
            assertEqual(nutrition.percentages.cal, 50);
            assertEqual(nutrition.percentages.prot, 50);
            assertEqual(nutrition.percentages.carb, 50);
            assertEqual(nutrition.percentages.fat, 50);
        });
        
        test('should accept custom date', async () => {
            const storage = new MockStorage();
            const customDate = '2026-01-15';
            
            storage.set(mockKeys.MEAL + customDate, [{ cal: 500 }]);
            
            const service = createStatsService(storage);
            
            const nutrition = await service.getDailyNutrition(customDate);
            
            assertEqual(nutrition.date, customDate);
            assertEqual(nutrition.totals.cal, 500);
        });
    });
    
    describe('getProgressData', () => {
        test('should return progress data for specified days', async () => {
            const service = createStatsService();
            
            const data = await service.getProgressData(7);
            
            assertLength(data.dates, 7);
            assertLength(data.weights, 7);
            assertLength(data.calories, 7);
            assertLength(data.workouts, 7);
        });
        
        test('should default to 30 days', async () => {
            const service = createStatsService();
            
            const data = await service.getProgressData();
            
            assertLength(data.dates, 30);
        });
        
        test('should include weight history', async () => {
            const storage = new MockStorage();
            const today = getTodayStr();
            
            storage.set(mockKeys.WEIGHT_HISTORY, { [today]: 75.5 });
            
            const service = createStatsService(storage);
            
            const data = await service.getProgressData(1);
            
            assertEqual(data.weights[0], 75.5);
        });
        
        test('should calculate weight change', async () => {
            const storage = new MockStorage();
            const today = new Date();
            
            // Set weight history for 2 days
            const d1 = new Date(today);
            d1.setDate(d1.getDate() - 1);
            const d2 = new Date(today);
            
            storage.set(mockKeys.WEIGHT_HISTORY, {
                [d1.toISOString().split('T')[0]]: 75,
                [d2.toISOString().split('T')[0]]: 76
            });
            
            const service = createStatsService(storage);
            
            const data = await service.getProgressData(2);
            
            assertEqual(data.weightChange, '1.0');
        });
        
        test('should calculate average calories', async () => {
            const storage = new MockStorage();
            const today = new Date();
            
            // Add meals for 2 days
            for (let i = 0; i < 2; i++) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                storage.set(mockKeys.MEAL + dateStr, [{ cal: 2000 }]);
            }
            
            const service = createStatsService(storage);
            
            const data = await service.getProgressData(2);
            
            assertEqual(data.avgCalories, 2000);
        });
    });
    
    describe('calculateWeightChange', () => {
        test('should calculate change between first and last', () => {
            const service = createStatsService();
            
            const result = service.calculateWeightChange([75, 76, 77, 78]);
            
            assertEqual(result, '3.0');
        });
        
        test('should return null for insufficient data', () => {
            const service = createStatsService();
            
            assertNull(service.calculateWeightChange([75]));
            assertNull(service.calculateWeightChange([]));
        });
        
        test('should handle null values', () => {
            const service = createStatsService();
            
            const result = service.calculateWeightChange([null, 75, null, 76, null]);
            
            assertEqual(result, '1.0');
        });
    });
    
    describe('calculateAverage', () => {
        test('should calculate average of array', () => {
            const service = createStatsService();
            
            assertEqual(service.calculateAverage([10, 20, 30]), 20);
            assertEqual(service.calculateAverage([5, 5, 5, 5]), 5);
        });
        
        test('should return 0 for empty array', () => {
            const service = createStatsService();
            
            assertEqual(service.calculateAverage([]), 0);
        });
    });
    
    describe('helper methods', () => {
        test('getDateStr should return YYYY-MM-DD format', () => {
            const service = createStatsService();
            
            const result = service.getDateStr();
            
            assertTrue(/^\d{4}-\d{2}-\d{2}$/.test(result));
        });
        
        test('formatDate should format date correctly', () => {
            const service = createStatsService();
            
            const date = new Date('2026-02-14T10:30:00Z');
            const result = service.formatDate(date);
            
            assertEqual(result, '2026-02-14');
        });
    });
});

// Print summary
console.log('\n---');
console.log(`StatisticsService Tests: ${passCount}/${testCount} passed`);
if (failCount > 0) {
    console.log(`Failed: ${failCount}`);
}

// Export for test runner
export { testCount, passCount, failCount };
