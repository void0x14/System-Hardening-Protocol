/**
 * Unit Tests for WorkoutRepository
 * 
 * @fileoverview Tests for workout data repository
 */

import { WorkoutRepository } from '../../src/js/repositories/WorkoutRepository.js';
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
function createWorkoutRepo(storage = new MockStorage()) {
    return new WorkoutRepository(storage);
}

// Get today's date string
function getTodayStr() {
    return new Date().toISOString().split('T')[0];
}

// ============================================
// WorkoutRepository Tests
// ============================================

describe('WorkoutRepository', () => {
    
    describe('constructor', () => {
        test('should create repository with storage', () => {
            const storage = new MockStorage();
            const repo = new WorkoutRepository(storage);
            
            assertNotNull(repo.storage);
            assertNotNull(repo.workoutKey);
            assertNotNull(repo.workoutDataKey);
            assertNotNull(repo.exerciseHistoryKey);
        });
    });
    
    describe('getWorkoutByDate', () => {
        test('should return empty array when no workout', async () => {
            const repo = createWorkoutRepo();
            
            const workout = await repo.getWorkoutByDate('2026-02-14');
            
            assertDeepEqual(workout, []);
        });
        
        test('should return workout log', async () => {
            const storage = new MockStorage();
            storage.set('monk_workout_log_2026-02-14', ['squat', 'bench']);
            
            const repo = createWorkoutRepo(storage);
            
            const workout = await repo.getWorkoutByDate('2026-02-14');
            
            assertLength(workout, 2);
            assertEqual(workout[0], 'squat');
        });
    });
    
    describe('saveWorkout', () => {
        test('should save workout log', async () => {
            const storage = new MockStorage();
            const repo = createWorkoutRepo(storage);
            
            await repo.saveWorkout('2026-02-14', ['squat', 'bench']);
            
            const workout = await storage.get('monk_workout_log_2026-02-14');
            assertLength(workout, 2);
        });
        
        test('should throw for invalid workout log', async () => {
            const repo = createWorkoutRepo();
            
            assertThrows(() => repo.saveWorkout('2026-02-14', 'not an array'));
        });
    });
    
    describe('addExercise', () => {
        test('should add exercise to workout', async () => {
            const storage = new MockStorage();
            const repo = createWorkoutRepo(storage);
            
            await repo.addExercise('2026-02-14', { id: 'squat', sets: 3 });
            
            const workout = await repo.getWorkoutByDate('2026-02-14');
            assertLength(workout, 1);
            assertEqual(workout[0].id, 'squat');
        });
        
        test('should append to existing workout', async () => {
            const storage = new MockStorage();
            storage.set('monk_workout_log_2026-02-14', [{ id: 'squat' }]);
            
            const repo = createWorkoutRepo(storage);
            
            await repo.addExercise('2026-02-14', { id: 'bench' });
            
            const workout = await repo.getWorkoutByDate('2026-02-14');
            assertLength(workout, 2);
        });
    });
    
    describe('removeExercise', () => {
        test('should remove exercise by index', async () => {
            const storage = new MockStorage();
            storage.set('monk_workout_log_2026-02-14', [
                { id: 'squat' },
                { id: 'bench' },
                { id: 'deadlift' }
            ]);
            
            const repo = createWorkoutRepo(storage);
            
            await repo.removeExercise('2026-02-14', 1);
            
            const workout = await repo.getWorkoutByDate('2026-02-14');
            assertLength(workout, 2);
            assertEqual(workout[1].id, 'deadlift');
        });
        
        test('should handle invalid index', async () => {
            const storage = new MockStorage();
            storage.set('monk_workout_log_2026-02-14', [{ id: 'squat' }]);
            
            const repo = createWorkoutRepo(storage);
            
            await repo.removeExercise('2026-02-14', 5);
            
            const workout = await repo.getWorkoutByDate('2026-02-14');
            assertLength(workout, 1);
        });
    });
    
    describe('getWorkoutData', () => {
        test('should return empty object when no data', async () => {
            const repo = createWorkoutRepo();
            
            const data = await repo.getWorkoutData('2026-02-14');
            
            assertDeepEqual(data, {});
        });
        
        test('should return workout set data', async () => {
            const storage = new MockStorage();
            storage.set('monk_workout_data_2026-02-14', {
                squat: [
                    { weight: 100, reps: 5, completed: true }
                ]
            });
            
            const repo = createWorkoutRepo(storage);
            
            const data = await repo.getWorkoutData('2026-02-14');
            
            assertLength(data.squat, 1);
        });
    });
    
    describe('saveWorkoutData', () => {
        test('should save workout set data', async () => {
            const storage = new MockStorage();
            const repo = createWorkoutRepo(storage);
            
            await repo.saveWorkoutData('2026-02-14', {
                squat: [
                    { weight: 100, reps: 5, completed: true }
                ]
            });
            
            const data = await storage.get('monk_workout_data_2026-02-14');
            assertLength(data.squat, 1);
        });
    });
    
    describe('getExerciseHistory', () => {
        test('should return empty object when no history', async () => {
            const repo = createWorkoutRepo();
            
            const history = await repo.getExerciseHistory();
            
            assertDeepEqual(history, {});
        });
        
        test('should return exercise history', async () => {
            const storage = new MockStorage();
            storage.set('monk_exercise_history', {
                squat: [
                    { weight: 100, reps: 5, volume: 500, date: '2026-02-14' }
                ]
            });
            
            const repo = createWorkoutRepo(storage);
            
            const history = await repo.getExerciseHistory();
            
            assertLength(history.squat, 1);
        });
    });
    
    describe('addToExerciseHistory', () => {
        test('should add entry to exercise history', async () => {
            const storage = new MockStorage();
            const repo = createWorkoutRepo(storage);
            
            await repo.addToExerciseHistory('squat', {
                weight: 100,
                reps: 5,
                volume: 500,
                date: '2026-02-14'
            });
            
            const history = await repo.getExerciseHistory();
            assertLength(history.squat, 1);
            assertNotNull(history.squat[0].timestamp);
        });
        
        test('should append to existing history', async () => {
            const storage = new MockStorage();
            storage.set('monk_exercise_history', {
                squat: [
                    { weight: 90, reps: 5, volume: 450 }
                ]
            });
            
            const repo = createWorkoutRepo(storage);
            
            await repo.addToExerciseHistory('squat', {
                weight: 100,
                reps: 5,
                volume: 500
            });
            
            const history = await repo.getExerciseHistory();
            assertLength(history.squat, 2);
        });
    });
    
    describe('getExerciseHistoryById', () => {
        test('should return history for specific exercise', async () => {
            const storage = new MockStorage();
            storage.set('monk_exercise_history', {
                squat: [{ weight: 100, reps: 5 }],
                bench: [{ weight: 60, reps: 8 }]
            });
            
            const repo = createWorkoutRepo(storage);
            
            const history = await repo.getExerciseHistoryById('squat');
            
            assertLength(history, 1);
            assertEqual(history[0].weight, 100);
        });
        
        test('should return empty array for unknown exercise', async () => {
            const repo = createWorkoutRepo();
            
            const history = await repo.getExerciseHistoryById('unknown');
            
            assertDeepEqual(history, []);
        });
    });
    
    describe('getPersonalBest', () => {
        test('should return null for unknown exercise', async () => {
            const repo = createWorkoutRepo();
            
            const pr = await repo.getPersonalBest('unknown');
            
            assertNull(pr);
        });
        
        test('should return best volume by default', async () => {
            const storage = new MockStorage();
            storage.set('monk_exercise_history', {
                squat: [
                    { weight: 100, reps: 5, volume: 500 },
                    { weight: 110, reps: 5, volume: 550 },
                    { weight: 90, reps: 5, volume: 450 }
                ]
            });
            
            const repo = createWorkoutRepo(storage);
            
            const pr = await repo.getPersonalBest('squat');
            
            assertEqual(pr.volume, 550);
        });
        
        test('should return best weight when specified', async () => {
            const storage = new MockStorage();
            storage.set('monk_exercise_history', {
                squat: [
                    { weight: 100, reps: 5, volume: 500 },
                    { weight: 120, reps: 3, volume: 360 },
                    { weight: 90, reps: 8, volume: 720 }
                ]
            });
            
            const repo = createWorkoutRepo(storage);
            
            const pr = await repo.getPersonalBest('squat', 'weight');
            
            assertEqual(pr.weight, 120);
        });
    });
    
    describe('getAllPersonalRecords', () => {
        test('should return all PRs', async () => {
            const storage = new MockStorage();
            storage.set('monk_exercise_history', {
                squat: [
                    { weight: 100, reps: 5, volume: 500 },
                    { weight: 110, reps: 5, volume: 550 }
                ],
                bench: [
                    { weight: 60, reps: 8, volume: 480 }
                ]
            });
            
            const repo = createWorkoutRepo(storage);
            
            const prs = await repo.getAllPersonalRecords();
            
            assertEqual(prs.squat.volume, 550);
            assertEqual(prs.bench.volume, 480);
        });
        
        test('should return empty object for no history', async () => {
            const repo = createWorkoutRepo();
            
            const prs = await repo.getAllPersonalRecords();
            
            assertDeepEqual(prs, {});
        });
    });
    
    describe('getWorkoutDatesInRange', () => {
        test('should return dates with workouts', async () => {
            const storage = new MockStorage();
            storage.set('monk_workout_log_2026-02-10', ['squat']);
            storage.set('monk_workout_log_2026-02-12', ['bench']);
            storage.set('monk_workout_log_2026-02-14', ['deadlift']);
            
            const repo = createWorkoutRepo(storage);
            
            const dates = await repo.getWorkoutDatesInRange('2026-02-10', '2026-02-14');
            
            assertLength(dates, 3);
            assertEqual(dates[0], '2026-02-10');
        });
        
        test('should filter by date range', async () => {
            const storage = new MockStorage();
            storage.set('monk_workout_log_2026-02-10', ['squat']);
            storage.set('monk_workout_log_2026-02-14', ['bench']);
            storage.set('monk_workout_log_2026-02-20', ['deadlift']);
            
            const repo = createWorkoutRepo(storage);
            
            const dates = await repo.getWorkoutDatesInRange('2026-02-10', '2026-02-15');
            
            assertLength(dates, 2);
        });
    });
    
    describe('getWorkoutStreak', () => {
        test('should return 0 for no workouts', async () => {
            const repo = createWorkoutRepo();
            
            const streak = await repo.getWorkoutStreak();
            
            assertEqual(streak, 0);
        });
        
        test('should count consecutive days', async () => {
            const storage = new MockStorage();
            const today = getTodayStr();
            
            // Create 3 consecutive days
            const d1 = new Date();
            d1.setDate(d1.getDate() - 2);
            const d2 = new Date();
            d2.setDate(d2.getDate() - 1);
            
            storage.set(`monk_workout_log_${today}`, ['squat']);
            storage.set(`monk_workout_log_${d2.toISOString().split('T')[0]}`, ['bench']);
            storage.set(`monk_workout_log_${d1.toISOString().split('T')[0]}`, ['deadlift']);
            
            const repo = createWorkoutRepo(storage);
            
            const streak = await repo.getWorkoutStreak();
            
            assertTrue(streak >= 2);
        });
    });
    
    describe('clearWorkout', () => {
        test('should clear workout data for date', async () => {
            const storage = new MockStorage();
            storage.set('monk_workout_log_2026-02-14', ['squat']);
            storage.set('monk_workout_data_2026-02-14', { squat: [] });
            
            const repo = createWorkoutRepo(storage);
            
            await repo.clearWorkout('2026-02-14');
            
            assertNull(await storage.get('monk_workout_log_2026-02-14'));
            assertNull(await storage.get('monk_workout_data_2026-02-14'));
        });
    });
    
    describe('integration tests', () => {
        test('should handle full workout tracking workflow', async () => {
            const repo = createWorkoutRepo();
            
            // Add workout
            await repo.addExercise('2026-02-14', { id: 'squat' });
            await repo.addExercise('2026-02-14', { id: 'bench' });
            
            // Save workout data
            await repo.saveWorkoutData('2026-02-14', {
                squat: [
                    { weight: 100, reps: 5, completed: true }
                ]
            });
            
            // Add to exercise history
            await repo.addToExerciseHistory('squat', {
                weight: 100,
                reps: 5,
                volume: 500,
                date: '2026-02-14'
            });
            
            // Verify
            const workout = await repo.getWorkoutByDate('2026-02-14');
            assertLength(workout, 2);
            
            const data = await repo.getWorkoutData('2026-02-14');
            assertLength(data.squat, 1);
            
            const pr = await repo.getPersonalBest('squat');
            assertEqual(pr.volume, 500);
        });
    });
});

// Print summary
console.log('\n---');
console.log(`WorkoutRepository Tests: ${passCount}/${testCount} passed`);
if (failCount > 0) {
    console.log(`Failed: ${failCount}`);
}

// Export for test runner
export { testCount, passCount, failCount };
