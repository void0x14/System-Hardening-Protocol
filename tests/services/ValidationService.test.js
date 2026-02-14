/**
 * Unit Tests for ValidationService
 * 
 * @fileoverview Tests for data validation and sanitization service
 */

import { ValidationService } from '../../src/js/services/ValidationService.js';
import {
    assertEqual,
    assertTrue,
    assertFalse,
    assertDeepEqual,
    assertLength,
    assertNaN,
    assertNotNaN,
    assertNull,
    assertNotNull
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

// ============================================
// ValidationService Tests
// ============================================

describe('ValidationService', () => {
    
    describe('constructor', () => {
        test('should create service with default config', () => {
            const service = new ValidationService();
            assertNotNull(service.limits);
        });
        
        test('should accept custom limits', () => {
            const customLimits = { WEIGHT: { MIN: 10, MAX: 200 } };
            const service = new ValidationService({ limits: customLimits });
            
            assertDeepEqual(service.limits, customLimits);
        });
        
        test('should accept exercise IDs set', () => {
            const exerciseIds = new Set(['squat', 'bench', 'deadlift']);
            const service = new ValidationService({ exerciseIds });
            
            assertEqual(service.exerciseIds.size, 3);
        });
    });
    
    describe('setExerciseIds', () => {
        test('should update exercise IDs', () => {
            const service = new ValidationService();
            const ids = new Set(['squat', 'bench']);
            
            service.setExerciseIds(ids);
            
            assertEqual(service.exerciseIds.size, 2);
        });
    });
    
    describe('toSafeNumber', () => {
        test('should return number for valid input', () => {
            const service = new ValidationService();
            
            assertEqual(service.toSafeNumber(42), 42);
            assertEqual(service.toSafeNumber('42'), 42);
            assertEqual(service.toSafeNumber(3.14), 3.14);
        });
        
        test('should return fallback for invalid input', () => {
            const service = new ValidationService();
            
            assertEqual(service.toSafeNumber(NaN, 0), 0);
            assertEqual(service.toSafeNumber(Infinity, 10), 10);
            assertEqual(service.toSafeNumber('abc', 5), 5);
            assertEqual(service.toSafeNumber(null, 3), 3);
            assertEqual(service.toSafeNumber(undefined, 7), 7);
        });
        
        test('should clamp to minimum', () => {
            const service = new ValidationService();
            
            assertEqual(service.toSafeNumber(-5, 0, 0, 100), 0);
            assertEqual(service.toSafeNumber(5, 0, 10, 100), 10);
        });
        
        test('should clamp to maximum', () => {
            const service = new ValidationService();
            
            assertEqual(service.toSafeNumber(150, 0, 0, 100), 100);
            assertEqual(service.toSafeNumber(1000, 0, 0, 500), 500);
        });
        
        test('should use default bounds', () => {
            const service = new ValidationService();
            
            assertEqual(service.toSafeNumber(-100, 0), 0); // min = 0
        });
    });
    
    describe('isIsoDateKey', () => {
        test('should return true for valid ISO date format', () => {
            const service = new ValidationService();
            
            assertTrue(service.isIsoDateKey('2026-02-14'));
            assertTrue(service.isIsoDateKey('2025-12-31'));
            assertTrue(service.isIsoDateKey('2000-01-01'));
        });
        
        test('should return false for invalid formats', () => {
            const service = new ValidationService();
            
            assertFalse(service.isIsoDateKey('2026/02/14'));
            assertFalse(service.isIsoDateKey('14-02-2026'));
            assertFalse(service.isIsoDateKey('2026-2-14'));
            assertFalse(service.isIsoDateKey('2026-02-14T10:30:00'));
            assertFalse(service.isIsoDateKey(null));
            assertFalse(service.isIsoDateKey(123));
            assertFalse(service.isIsoDateKey(''));
        });
    });
    
    describe('sanitizeDateString', () => {
        test('should return valid date string unchanged', () => {
            const service = new ValidationService();
            
            assertEqual(service.sanitizeDateString('2026-02-14'), '2026-02-14');
        });
        
        test('should trim whitespace', () => {
            const service = new ValidationService();
            
            assertEqual(service.sanitizeDateString('  2026-02-14  '), '2026-02-14');
        });
        
        test('should return empty string for invalid input', () => {
            const service = new ValidationService();
            
            assertEqual(service.sanitizeDateString('invalid'), '');
            assertEqual(service.sanitizeDateString('2026/02/14'), '');
            assertEqual(service.sanitizeDateString(null), '');
            assertEqual(service.sanitizeDateString(123), '');
        });
    });
    
    describe('sanitizeTimestampString', () => {
        test('should return valid timestamp unchanged', () => {
            const service = new ValidationService();
            
            assertEqual(
                service.sanitizeTimestampString('2026-02-14T10:30:00.000Z'),
                '2026-02-14T10:30:00.000Z'
            );
        });
        
        test('should accept date-only format', () => {
            const service = new ValidationService();
            
            assertEqual(service.sanitizeTimestampString('2026-02-14'), '2026-02-14');
        });
        
        test('should truncate to 40 characters', () => {
            const service = new ValidationService();
            const longTimestamp = '2026-02-14T10:30:00.000000000+00:00:00:00:00';
            
            assertEqual(service.sanitizeTimestampString(longTimestamp).length, 40);
        });
        
        test('should return empty string for invalid input', () => {
            const service = new ValidationService();
            
            assertEqual(service.sanitizeTimestampString('invalid'), '');
            assertEqual(service.sanitizeTimestampString(null), '');
        });
    });
    
    describe('sanitizeWorkoutLog', () => {
        test('should return array of valid task IDs', () => {
            const service = new ValidationService();
            service.setExerciseIds(new Set(['squat', 'bench', 'deadlift']));
            
            const result = service.sanitizeWorkoutLog(['squat', 'bench']);
            
            assertLength(result, 2);
            assertEqual(result[0], 'squat');
            assertEqual(result[1], 'bench');
        });
        
        test('should filter out invalid IDs when exerciseIds set', () => {
            const service = new ValidationService();
            service.setExerciseIds(new Set(['squat', 'bench']));
            
            const result = service.sanitizeWorkoutLog(['squat', 'invalid', 'bench']);
            
            assertLength(result, 2);
        });
        
        test('should accept all strings when exerciseIds not set', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeWorkoutLog(['any', 'string', 'id']);
            
            assertLength(result, 3);
        });
        
        test('should limit to 128 entries', () => {
            const service = new ValidationService();
            const manyIds = Array(200).fill('id').map((v, i) => `${v}${i}`);
            
            const result = service.sanitizeWorkoutLog(manyIds);
            
            assertLength(result, 128);
        });
        
        test('should return empty array for non-array input', () => {
            const service = new ValidationService();
            
            assertLength(service.sanitizeWorkoutLog(null), 0);
            assertLength(service.sanitizeWorkoutLog('not array'), 0);
            assertLength(service.sanitizeWorkoutLog({}), 0);
        });
    });
    
    describe('sanitizeWorkoutSetEntry', () => {
        test('should sanitize valid entry', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeWorkoutSetEntry({
                weight: 100,
                reps: 5,
                duration: 60,
                timestamp: '2026-02-14T10:00:00Z',
                completed: true
            });
            
            assertEqual(result.weight, 100);
            assertEqual(result.reps, 5);
            assertEqual(result.duration, 60);
            assertEqual(result.completed, true);
        });
        
        test('should add timestamp if missing', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeWorkoutSetEntry({
                weight: 50,
                reps: 10
            });
            
            assertNotNull(result.timestamp);
        });
        
        test('should clamp values to bounds', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeWorkoutSetEntry({
                weight: 2000,
                reps: -5,
                duration: 100000
            });
            
            assertEqual(result.weight, 1000); // max
            assertEqual(result.reps, 0); // min
            assertEqual(result.duration, 86400); // max (24h in seconds)
        });
        
        test('should return null for invalid input', () => {
            const service = new ValidationService();
            
            assertNull(service.sanitizeWorkoutSetEntry(null));
            assertNull(service.sanitizeWorkoutSetEntry('string'));
            assertNull(service.sanitizeWorkoutSetEntry(123));
        });
    });
    
    describe('sanitizeWorkoutDataLog', () => {
        test('should sanitize workout data object', () => {
            const service = new ValidationService();
            service.setExerciseIds(new Set(['squat', 'bench']));
            
            const result = service.sanitizeWorkoutDataLog({
                squat: [
                    { weight: 100, reps: 5 },
                    { weight: 110, reps: 3 }
                ],
                bench: [
                    { weight: 60, reps: 8 }
                ]
            });
            
            assertLength(result.squat, 2);
            assertLength(result.bench, 1);
        });
        
        test('should filter out invalid exercise IDs', () => {
            const service = new ValidationService();
            service.setExerciseIds(new Set(['squat']));
            
            const result = service.sanitizeWorkoutDataLog({
                squat: [{ weight: 100, reps: 5 }],
                invalid: [{ weight: 50, reps: 10 }]
            });
            
            assertTrue(result.squat !== undefined);
            assertFalse(result.invalid !== undefined);
        });
        
        test('should limit entries per exercise to 64', () => {
            const service = new ValidationService();
            
            const manyEntries = Array(100).fill({ weight: 100, reps: 5 });
            const result = service.sanitizeWorkoutDataLog({ squat: manyEntries });
            
            assertLength(result.squat, 64);
        });
        
        test('should return empty object for invalid input', () => {
            const service = new ValidationService();
            
            assertDeepEqual(service.sanitizeWorkoutDataLog(null), {});
            assertDeepEqual(service.sanitizeWorkoutDataLog('string'), {});
        });
    });
    
    describe('sanitizeWeightHistory', () => {
        test('should sanitize weight history object', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeWeightHistory({
                '2026-02-14': 75.5,
                '2026-02-13': 75.0,
                '2026-02-12': 74.5
            });
            
            assertEqual(result['2026-02-14'], 75.5);
            assertEqual(result['2026-02-13'], 75.0);
            assertEqual(result['2026-02-12'], 74.5);
        });
        
        test('should filter out invalid dates', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeWeightHistory({
                '2026-02-14': 75.5,
                'invalid-date': 70.0
            });
            
            assertEqual(result['2026-02-14'], 75.5);
            assertFalse(result['invalid-date'] !== undefined);
        });
        
        test('should clamp weights to 20-500 range', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeWeightHistory({
                '2026-02-14': 10,  // below min
                '2026-02-13': 600  // above max
            });
            
            assertEqual(result['2026-02-14'], 20);
            assertEqual(result['2026-02-13'], 500);
        });
        
        test('should return empty object for invalid input', () => {
            const service = new ValidationService();
            
            assertDeepEqual(service.sanitizeWeightHistory(null), {});
            assertDeepEqual(service.sanitizeWeightHistory('string'), {});
        });
    });
    
    describe('sanitizeStreakData', () => {
        test('should sanitize valid streak data', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeStreakData({
                count: 30,
                lastDate: '2026-02-14'
            });
            
            assertEqual(result.count, 30);
            assertEqual(result.lastDate, '2026-02-14');
        });
        
        test('should return defaults for invalid input', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeStreakData(null);
            
            assertEqual(result.count, 0);
            assertNull(result.lastDate);
        });
        
        test('should clamp count to 0-10000', () => {
            const service = new ValidationService();
            
            const result1 = service.sanitizeStreakData({ count: -5 });
            const result2 = service.sanitizeStreakData({ count: 20000 });
            
            assertEqual(result1.count, 0);
            assertEqual(result2.count, 10000);
        });
        
        test('should truncate count to integer', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeStreakData({ count: 30.7 });
            
            assertEqual(result.count, 30);
        });
    });
    
    describe('sanitizeDailyPlanMeal', () => {
        test('should sanitize valid meal', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeDailyPlanMeal({
                text: 'Oatmeal with berries',
                kcal: 350
            });
            
            assertEqual(result.text, 'Oatmeal with berries');
            assertEqual(result.kcal, 350);
        });
        
        test('should truncate text to 140 chars', () => {
            const service = new ValidationService();
            const longText = 'A'.repeat(200);
            
            const result = service.sanitizeDailyPlanMeal({
                text: longText,
                kcal: 300
            });
            
            assertEqual(result.text.length, 140);
        });
        
        test('should clamp kcal to 0-5000', () => {
            const service = new ValidationService();
            
            const result1 = service.sanitizeDailyPlanMeal({ text: 'Test', kcal: -100 });
            const result2 = service.sanitizeDailyPlanMeal({ text: 'Test', kcal: 10000 });
            
            assertEqual(result1.kcal, 0);
            assertEqual(result2.kcal, 5000);
        });
        
        test('should return null for empty meal', () => {
            const service = new ValidationService();
            
            assertNull(service.sanitizeDailyPlanMeal({ text: '', kcal: 0 }));
            assertNull(service.sanitizeDailyPlanMeal(null));
        });
    });
    
    describe('sanitizeDailyPlanData', () => {
        test('should sanitize valid plan data', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeDailyPlanData({
                date: '2026-02-14',
                plan: {
                    breakfast: { text: 'Eggs', kcal: 300 },
                    lunch: { text: 'Salad', kcal: 400 }
                }
            });
            
            assertEqual(result.date, '2026-02-14');
            assertTrue(result.plan.breakfast !== undefined);
            assertTrue(result.plan.lunch !== undefined);
        });
        
        test('should use fallback date if invalid', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeDailyPlanData(
                { date: 'invalid' },
                '2026-02-14'
            );
            
            assertEqual(result.date, '2026-02-14');
        });
        
        test('should return defaults for invalid input', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeDailyPlanData(null, '2026-02-14');
            
            assertEqual(result.date, '2026-02-14');
            assertDeepEqual(result.plan, {});
        });
    });
    
    describe('sanitizeCustomFood', () => {
        test('should sanitize valid custom food', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeCustomFood({
                id: 1,
                cat: 'BREAKFAST',
                name: 'Protein Bar',
                type: 'piece',
                vals: { cal: 200, prot: 20, carb: 25, fat: 8 },
                unitName: 'bar'
            });
            
            assertEqual(result.id, 1);
            assertEqual(result.name, 'Protein Bar');
            assertEqual(result.type, 'piece');
            assertEqual(result.unitName, 'bar');
        });
        
        test('should handle portion type with options', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeCustomFood({
                id: 2,
                name: 'Rice',
                type: 'portion',
                vals: { cal: 200, prot: 4, carb: 45, fat: 1 },
                options: [
                    { label: '1 Cup', ratio: 1 },
                    { label: 'Half Cup', ratio: 0.5 }
                ]
            });
            
            assertEqual(result.type, 'portion');
            assertLength(result.options, 2);
        });
        
        test('should add default option for portion without options', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeCustomFood({
                id: 3,
                name: 'Pasta',
                type: 'portion',
                vals: { cal: 300, prot: 10, carb: 60, fat: 2 }
            });
            
            assertLength(result.options, 1);
            assertEqual(result.options[0].label, '1 Porsiyon');
        });
        
        test('should return null for food without name', () => {
            const service = new ValidationService();
            
            assertNull(service.sanitizeCustomFood({
                id: 1,
                vals: { cal: 100 }
            }));
        });
        
        test('should return null for invalid input', () => {
            const service = new ValidationService();
            
            assertNull(service.sanitizeCustomFood(null));
            assertNull(service.sanitizeCustomFood('string'));
        });
    });
    
    describe('sanitizeCustomFoods', () => {
        test('should sanitize array of foods', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeCustomFoods([
                { id: 1, name: 'Food 1', vals: { cal: 100 } },
                { id: 2, name: 'Food 2', vals: { cal: 200 } }
            ]);
            
            assertLength(result, 2);
        });
        
        test('should filter out invalid foods', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeCustomFoods([
                { id: 1, name: 'Valid', vals: { cal: 100 } },
                null,
                { id: 2, vals: { cal: 200 } } // no name
            ]);
            
            assertLength(result, 1);
        });
        
        test('should limit to 300 foods', () => {
            const service = new ValidationService();
            const manyFoods = Array(400).fill(null).map((_, i) => ({
                id: i,
                name: `Food ${i}`,
                vals: { cal: 100 }
            }));
            
            const result = service.sanitizeCustomFoods(manyFoods);
            
            assertLength(result, 300);
        });
        
        test('should return empty array for non-array input', () => {
            const service = new ValidationService();
            
            assertLength(service.sanitizeCustomFoods(null), 0);
            assertLength(service.sanitizeCustomFoods({}), 0);
        });
    });
    
    describe('sanitizeExerciseHistoryEntry', () => {
        test('should sanitize valid entry', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeExerciseHistoryEntry({
                weight: 100,
                reps: 5,
                volume: 500,
                date: '2026-02-14',
                timestamp: '2026-02-14T10:00:00Z'
            });
            
            assertEqual(result.weight, 100);
            assertEqual(result.reps, 5);
            assertEqual(result.volume, 500);
            assertEqual(result.date, '2026-02-14');
        });
        
        test('should compute volume if not provided', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeExerciseHistoryEntry({
                weight: 100,
                reps: 5
            });
            
            assertEqual(result.volume, 500);
        });
        
        test('should return null for empty entry', () => {
            const service = new ValidationService();
            
            assertNull(service.sanitizeExerciseHistoryEntry({}));
            assertNull(service.sanitizeExerciseHistoryEntry(null));
        });
    });
    
    describe('sanitizeExerciseHistoryData', () => {
        test('should sanitize history data', () => {
            const service = new ValidationService();
            service.setExerciseIds(new Set(['squat', 'bench']));
            
            const result = service.sanitizeExerciseHistoryData({
                squat: [
                    { weight: 100, reps: 5 },
                    { weight: 110, reps: 3 }
                ],
                bench: [
                    { weight: 60, reps: 8 }
                ]
            });
            
            assertLength(result.squat, 2);
            assertLength(result.bench, 1);
        });
        
        test('should limit to 100 entries per exercise', () => {
            const service = new ValidationService();
            const manyEntries = Array(150).fill({ weight: 100, reps: 5 });
            
            const result = service.sanitizeExerciseHistoryData({ squat: manyEntries });
            
            assertLength(result.squat, 100);
        });
    });
    
    describe('sanitizeMentalProgressData', () => {
        test('should sanitize valid mental progress', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeMentalProgressData({
                completedPhases: [1, 2, 3],
                dailyPractice: {
                    '2026-02-14': true,
                    '2026-02-13': false
                },
                lastPracticeDate: '2026-02-14'
            });
            
            assertLength(result.completedPhases, 3);
            assertTrue(result.dailyPractice['2026-02-14']);
            assertFalse(result.dailyPractice['2026-02-13']);
            assertEqual(result.lastPracticeDate, '2026-02-14');
        });
        
        test('should return defaults for invalid input', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeMentalProgressData(null);
            
            assertDeepEqual(result.completedPhases, []);
            assertDeepEqual(result.dailyPractice, {});
        });
        
        test('should dedupe and validate phase numbers', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeMentalProgressData({
                completedPhases: [1, 1, 2, 2, 10, -1] // dupes and out of range
            });
            
            assertLength(result.completedPhases, 2); // only 1 and 2 are valid
        });
    });
    
    describe('sanitizeMealEntry', () => {
        test('should sanitize valid meal entry', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeMealEntry({
                name: 'Chicken Breast',
                amount: 200,
                unit: 'g',
                portionLabel: '1 serving',
                cal: 330,
                prot: 62,
                carb: 0,
                fat: 7
            });
            
            assertEqual(result.name, 'Chicken Breast');
            assertEqual(result.amount, 200);
            assertEqual(result.cal, 330);
        });
        
        test('should truncate long strings', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeMealEntry({
                name: 'A'.repeat(200),
                portionLabel: 'B'.repeat(100)
            });
            
            assertEqual(result.name.length, 120);
            assertEqual(result.portionLabel.length, 80);
        });
        
        test('should return null for invalid input', () => {
            const service = new ValidationService();
            
            assertNull(service.sanitizeMealEntry(null));
            assertNull(service.sanitizeMealEntry('string'));
        });
    });
    
    describe('sanitizeMealLog', () => {
        test('should sanitize meal log array', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeMealLog([
                { name: 'Breakfast', cal: 400 },
                { name: 'Lunch', cal: 600 }
            ]);
            
            assertLength(result, 2);
        });
        
        test('should filter out invalid entries', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeMealLog([
                { name: 'Valid', cal: 400 },
                null,
                'invalid'
            ]);
            
            assertLength(result, 1);
        });
        
        test('should return empty array for non-array input', () => {
            const service = new ValidationService();
            
            assertLength(service.sanitizeMealLog(null), 0);
            assertLength(service.sanitizeMealLog({}), 0);
        });
    });
    
    describe('sanitizeMeasureEntry', () => {
        test('should sanitize valid measurement', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeMeasureEntry({
                chest: 100,
                arm: 35,
                waist: 80,
                leg: 55,
                date: '2026-02-14',
                savedAt: '2026-02-14'
            });
            
            assertEqual(result.chest, 100);
            assertEqual(result.arm, 35);
            assertEqual(result.waist, 80);
            assertEqual(result.leg, 55);
        });
        
        test('should return null for empty entry', () => {
            const service = new ValidationService();
            
            assertNull(service.sanitizeMeasureEntry({}));
            assertNull(service.sanitizeMeasureEntry(null));
        });
    });
    
    describe('sanitizeMeasureData', () => {
        test('should sanitize measure data with current and history', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeMeasureData({
                current: { chest: 100, arm: 35 },
                history: [
                    { chest: 98, arm: 34, date: '2026-02-01' }
                ]
            });
            
            assertEqual(result.current.chest, 100);
            assertLength(result.history, 1);
        });
        
        test('should handle legacy format (flat object)', () => {
            const service = new ValidationService();
            
            const result = service.sanitizeMeasureData({
                chest: 100,
                arm: 35
            });
            
            assertEqual(result.current.chest, 100);
            assertLength(result.history, 0);
        });
        
        test('should limit history to 30 entries', () => {
            const service = new ValidationService();
            const manyHistory = Array(50).fill({ chest: 100 });
            
            const result = service.sanitizeMeasureData({
                current: {},
                history: manyHistory
            });
            
            assertLength(result.history, 30);
        });
    });
    
    describe('sanitizeImportedData', () => {
        test('should sanitize all data types', () => {
            const service = new ValidationService();
            const keys = {
                MEAL: 'monk_meal_',
                MEASURE: 'monk_measure',
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
                EXERCISE_HISTORY: 'monk_exercise_history',
                MENTAL_PROGRESS: 'monk_mental_progress',
                BACKUP: 'monk_backup_date'
            };
            
            const result = service.sanitizeImportedData({
                meta: { version: '1.0' },
                'monk_weight': 75,
                'monk_weight_history': { '2026-02-14': 75 },
                'monk_streak': { count: 10, lastDate: '2026-02-14' },
                'monk_meal_2026-02-14': [{ name: 'Breakfast', cal: 400 }],
                'monk_sleep_2026-02-14': 8,
                'monk_water_2026-02-14': 10
            }, keys);
            
            assertEqual(result['monk_weight'], 75);
            assertEqual(result.meta.version, '1.0');
        });
    });
});

// Print summary
console.log('\n---');
console.log(`ValidationService Tests: ${passCount}/${testCount} passed`);
if (failCount > 0) {
    console.log(`Failed: ${failCount}`);
}

// Export for test runner
export { testCount, passCount, failCount };
