/**
 * Unit Tests for WeightRepository
 * 
 * @fileoverview Tests for weight data repository
 */

import { WeightRepository } from '../../src/js/repositories/WeightRepository.js';
import { MockStorage } from '../mocks/storage.js';
import {
    assertEqual,
    assertTrue,
    assertFalse,
    assertDeepEqual,
    assertLength,
    assertNotNull,
    assertNull,
    assertThrows,
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

// Create repository with mock storage
function createWeightRepo(storage = new MockStorage()) {
    return new WeightRepository(storage);
}

// Get today's date string
function getTodayStr() {
    return new Date().toISOString().split('T')[0];
}

// ============================================
// WeightRepository Tests
// ============================================

describe('WeightRepository', () => {
    
    describe('constructor', () => {
        test('should create repository with storage', () => {
            const storage = new MockStorage();
            const repo = new WeightRepository(storage);
            
            assertNotNull(repo.storage);
            assertNotNull(repo.weightKey);
            assertNotNull(repo.historyKey);
        });
    });
    
    describe('getCurrentWeight', () => {
        test('should return null when no weight set', async () => {
            const repo = createWeightRepo();
            
            const weight = await repo.getCurrentWeight();
            
            assertNull(weight);
        });
        
        test('should return current weight', async () => {
            const storage = new MockStorage();
            storage.set('monk_weight', 75.5);
            
            const repo = createWeightRepo(storage);
            
            const weight = await repo.getCurrentWeight();
            
            assertEqual(weight, 75.5);
        });
    });
    
    describe('setCurrentWeight', () => {
        test('should set current weight', async () => {
            const storage = new MockStorage();
            const repo = createWeightRepo(storage);
            
            await repo.setCurrentWeight(75.5);
            
            const weight = await storage.get('monk_weight');
            assertEqual(weight, 75.5);
        });
        
        test('should throw for invalid weight', async () => {
            const repo = createWeightRepo();
            
            assertThrows(() => repo.setCurrentWeight('not a number'));
            assertThrows(() => repo.setCurrentWeight(NaN));
        });
        
        test('should throw for weight out of range', async () => {
            const repo = createWeightRepo();
            
            assertThrows(() => repo.setCurrentWeight(10)); // below min
            assertThrows(() => repo.setCurrentWeight(600)); // above max
        });
    });
    
    describe('saveWeight', () => {
        test('should save weight with date', async () => {
            const storage = new MockStorage();
            const repo = createWeightRepo(storage);
            
            await repo.saveWeight(75.5, '2026-02-14');
            
            const current = await repo.getCurrentWeight();
            assertEqual(current, 75.5);
            
            const history = await repo.getHistory();
            assertEqual(history['2026-02-14'], 75.5);
        });
        
        test('should use today as default date', async () => {
            const storage = new MockStorage();
            const repo = createWeightRepo(storage);
            
            await repo.saveWeight(75.5);
            
            const history = await repo.getHistory();
            const today = getTodayStr();
            assertEqual(history[today], 75.5);
        });
        
        test('should update existing weight for same date', async () => {
            const storage = new MockStorage();
            const repo = createWeightRepo(storage);
            
            await repo.saveWeight(75.5, '2026-02-14');
            await repo.saveWeight(76.0, '2026-02-14');
            
            const history = await repo.getHistory();
            assertEqual(history['2026-02-14'], 76.0);
        });
    });
    
    describe('getHistory', () => {
        test('should return empty object when no history', async () => {
            const repo = createWeightRepo();
            
            const history = await repo.getHistory();
            
            assertDeepEqual(history, {});
        });
        
        test('should return weight history', async () => {
            const storage = new MockStorage();
            storage.set('monk_weight_history', {
                '2026-02-14': 75.5,
                '2026-02-13': 75.0
            });
            
            const repo = createWeightRepo(storage);
            
            const history = await repo.getHistory();
            
            assertEqual(history['2026-02-14'], 75.5);
            assertEqual(history['2026-02-13'], 75.0);
        });
    });
    
    describe('getWeightByDate', () => {
        test('should return weight for specific date', async () => {
            const storage = new MockStorage();
            storage.set('monk_weight_history', {
                '2026-02-14': 75.5,
                '2026-02-13': 75.0
            });
            
            const repo = createWeightRepo(storage);
            
            const weight = await repo.getWeightByDate('2026-02-14');
            
            assertEqual(weight, 75.5);
        });
        
        test('should return null for missing date', async () => {
            const repo = createWeightRepo();
            
            const weight = await repo.getWeightByDate('2020-01-01');
            
            assertNull(weight);
        });
    });
    
    describe('getSortedHistory', () => {
        test('should return sorted history', async () => {
            const storage = new MockStorage();
            storage.set('monk_weight_history', {
                '2026-02-14': 76,
                '2026-02-12': 74,
                '2026-02-13': 75
            });
            
            const repo = createWeightRepo(storage);
            
            const sorted = await repo.getSortedHistory();
            
            assertEqual(sorted[0].date, '2026-02-12');
            assertEqual(sorted[1].date, '2026-02-13');
            assertEqual(sorted[2].date, '2026-02-14');
        });
        
        test('should limit entries', async () => {
            const storage = new MockStorage();
            storage.set('monk_weight_history', {
                '2026-02-10': 74,
                '2026-02-11': 75,
                '2026-02-12': 76,
                '2026-02-13': 77,
                '2026-02-14': 78
            });
            
            const repo = createWeightRepo(storage);
            
            const sorted = await repo.getSortedHistory(3);
            
            assertLength(sorted, 3);
            assertEqual(sorted[0].date, '2026-02-12');
        });
    });
    
    describe('getWeightChange', () => {
        test('should calculate weight change', async () => {
            const storage = new MockStorage();
            storage.set('monk_weight_history', {
                '2026-02-10': 74,
                '2026-02-14': 78
            });
            
            const repo = createWeightRepo(storage);
            
            const change = await repo.getWeightChange(5);
            
            assertEqual(change.start, 74);
            assertEqual(change.end, 78);
            assertEqual(change.change, 4);
        });
        
        test('should return nulls for insufficient data', async () => {
            const storage = new MockStorage();
            storage.set('monk_weight_history', {
                '2026-02-14': 75
            });
            
            const repo = createWeightRepo(storage);
            
            const change = await repo.getWeightChange(7);
            
            assertNull(change.start);
            assertNull(change.end);
            assertNull(change.change);
        });
    });
    
    describe('getStatistics', () => {
        test('should return weight statistics', async () => {
            const storage = new MockStorage();
            storage.set('monk_weight_history', {
                '2026-02-10': 70,
                '2026-02-11': 75,
                '2026-02-12': 80
            });
            
            const repo = createWeightRepo(storage);
            
            const stats = await repo.getStatistics();
            
            assertEqual(stats.min, 70);
            assertEqual(stats.max, 80);
            assertApproxEqual(stats.avg, 75, 0.1);
            assertEqual(stats.count, 3);
        });
        
        test('should return nulls for empty history', async () => {
            const repo = createWeightRepo();
            
            const stats = await repo.getStatistics();
            
            assertNull(stats.min);
            assertNull(stats.max);
            assertNull(stats.avg);
            assertEqual(stats.count, 0);
        });
    });
    
    describe('deleteWeight', () => {
        test('should delete weight entry', async () => {
            const storage = new MockStorage();
            storage.set('monk_weight_history', {
                '2026-02-14': 75.5,
                '2026-02-13': 75.0
            });
            
            const repo = createWeightRepo(storage);
            
            const result = await repo.deleteWeight('2026-02-14');
            
            assertTrue(result);
            
            const history = await repo.getHistory();
            assertNull(history['2026-02-14']);
            assertNotNull(history['2026-02-13']);
        });
        
        test('should return false for missing date', async () => {
            const repo = createWeightRepo();
            
            const result = await repo.deleteWeight('2020-01-01');
            
            assertFalse(result);
        });
    });
    
    describe('clearAll', () => {
        test('should clear all weight data', async () => {
            const storage = new MockStorage();
            storage.set('monk_weight', 75.5);
            storage.set('monk_weight_history', {
                '2026-02-14': 75.5
            });
            
            const repo = createWeightRepo(storage);
            
            await repo.clearAll();
            
            assertNull(await storage.get('monk_weight'));
            assertNull(await storage.get('monk_weight_history'));
        });
    });
    
    describe('integration tests', () => {
        test('should handle full weight tracking workflow', async () => {
            const repo = createWeightRepo();
            
            // Save weights over time
            await repo.saveWeight(75.0, '2026-02-10');
            await repo.saveWeight(75.5, '2026-02-11');
            await repo.saveWeight(76.0, '2026-02-12');
            await repo.saveWeight(76.5, '2026-02-13');
            await repo.saveWeight(77.0, '2026-02-14');
            
            // Get current weight
            const current = await repo.getCurrentWeight();
            assertEqual(current, 77.0);
            
            // Get history
            const history = await repo.getSortedHistory();
            assertLength(history, 5);
            
            // Get statistics
            const stats = await repo.getStatistics();
            assertEqual(stats.count, 5);
            
            // Get weight change
            const change = await repo.getWeightChange(5);
            assertEqual(change.change, 2.0);
        });
    });
});

// Print summary
console.log('\n---');
console.log(`WeightRepository Tests: ${passCount}/${testCount} passed`);
if (failCount > 0) {
    console.log(`Failed: ${failCount}`);
}

// Export for test runner
export { testCount, passCount, failCount };
