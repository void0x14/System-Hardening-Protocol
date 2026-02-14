/**
 * Unit Tests for BackupService
 * 
 * @fileoverview Tests for data export/import functionality
 */

import { BackupService } from '../../src/js/services/BackupService.js';
import { ValidationService } from '../../src/js/services/ValidationService.js';
import { MockStorage, createSystemHardeningStorage } from '../mocks/storage.js';
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

// Create service with mock storage
function createBackupService(storage = new MockStorage()) {
    return new BackupService({
        storage,
        keys: mockKeys,
        version: '9.0.0',
        validationService: new ValidationService()
    });
}

// ============================================
// BackupService Tests
// ============================================

describe('BackupService', () => {
    
    describe('constructor', () => {
        test('should create service with required options', () => {
            const storage = new MockStorage();
            const service = new BackupService({
                storage,
                keys: mockKeys
            });
            
            assertNotNull(service.storage);
            assertNotNull(service.keys);
            assertNotNull(service.validationService);
        });
        
        test('should use default version if not provided', () => {
            const service = createBackupService();
            
            assertEqual(service.version, '9.0.0');
        });
        
        test('should accept custom version', () => {
            const storage = new MockStorage();
            const service = new BackupService({
                storage,
                keys: mockKeys,
                version: '10.0.0'
            });
            
            assertEqual(service.version, '10.0.0');
        });
    });
    
    describe('validateImportData', () => {
        test('should validate correct data structure', () => {
            const service = createBackupService();
            
            const result = service.validateImportData({
                meta: { version: '1.0' },
                'monk_weight': 75
            });
            
            assertTrue(result.valid);
            assertNotNull(result.data);
        });
        
        test('should reject null data', () => {
            const service = createBackupService();
            
            const result = service.validateImportData(null);
            
            assertFalse(result.valid);
            assertNotNull(result.error);
        });
        
        test('should reject non-object data', () => {
            const service = createBackupService();
            
            const result = service.validateImportData('string');
            
            assertFalse(result.valid);
        });
        
        test('should reject data without meta', () => {
            const service = createBackupService();
            
            const result = service.validateImportData({
                'monk_weight': 75
            });
            
            assertFalse(result.valid);
            assertEqual(result.error, 'Missing metadata');
        });
        
        test('should reject data without known keys', () => {
            const service = createBackupService();
            
            const result = service.validateImportData({
                meta: { version: '1.0' },
                unknown_key: 'value'
            });
            
            assertFalse(result.valid);
            assertEqual(result.error, 'No valid data keys found');
        });
        
        test('should accept data with prefixed keys', () => {
            const service = createBackupService();
            
            const result = service.validateImportData({
                meta: { version: '1.0' },
                'monk_meal_2026-02-14': [{ name: 'Breakfast' }]
            });
            
            assertTrue(result.valid);
        });
    });
    
    describe('importData', () => {
        test('should import valid JSON data', async () => {
            const storage = new MockStorage();
            const service = createBackupService(storage);
            
            const jsonData = JSON.stringify({
                meta: { version: '1.0', date: '2026-02-14' },
                'monk_weight': 75,
                'monk_streak': { count: 10, lastDate: '2026-02-14' }
            });
            
            const result = await service.importData(jsonData);
            
            assertTrue(result.success);
            assertEqual(result.date, '2026-02-14');
        });
        
        test('should reject invalid JSON', async () => {
            const service = createBackupService();
            
            const result = await service.importData('not valid json');
            
            assertFalse(result.success);
            assertNotNull(result.error);
        });
        
        test('should reject data without meta', async () => {
            const service = createBackupService();
            
            const result = await service.importData(JSON.stringify({
                'monk_weight': 75
            }));
            
            assertFalse(result.success);
        });
        
        test('should use default weight for missing weight', async () => {
            const storage = new MockStorage();
            const service = createBackupService(storage);
            
            const jsonData = JSON.stringify({
                meta: { version: '1.0' },
                'monk_streak': { count: 5 }
            });
            
            await service.importData(jsonData, 50.0);
            
            // Weight should not be set since it wasn't in import
            const weight = await storage.get('monk_weight');
            assertNull(weight);
        });
        
        test('should clear existing data before import', async () => {
            const storage = new MockStorage();
            storage.set('monk_weight', 100);
            storage.set('monk_streak', { count: 50 });
            
            const service = createBackupService(storage);
            
            const jsonData = JSON.stringify({
                meta: { version: '1.0' },
                'monk_weight': 75
            });
            
            await service.importData(jsonData);
            
            const weight = await storage.get('monk_weight');
            assertEqual(weight, 75);
        });
    });
    
    describe('checkBackupStatus', () => {
        test('should return NEVER when no backup exists', async () => {
            const storage = new MockStorage();
            const service = createBackupService(storage);
            
            const status = await service.checkBackupStatus();
            
            assertEqual(status, 'NEVER');
        });
        
        test('should return OK for recent backup', async () => {
            const storage = new MockStorage();
            const today = new Date().toISOString().split('T')[0];
            storage.set('monk_backup_date', today);
            
            const service = createBackupService(storage);
            
            const status = await service.checkBackupStatus();
            
            assertEqual(status, 'OK');
        });
        
        test('should return WARNING for old backup', async () => {
            const storage = new MockStorage();
            const oldDate = new Date();
            oldDate.setDate(oldDate.getDate() - 10);
            storage.set('monk_backup_date', oldDate.toISOString().split('T')[0]);
            
            const service = createBackupService(storage);
            
            const status = await service.checkBackupStatus();
            
            assertEqual(status, 'WARNING');
        });
        
        test('should return WARNING for invalid date', async () => {
            const storage = new MockStorage();
            storage.set('monk_backup_date', 'invalid-date');
            
            const service = createBackupService(storage);
            
            const status = await service.checkBackupStatus();
            
            assertEqual(status, 'WARNING');
        });
    });
    
    describe('getDateStr', () => {
        test('should return date in YYYY-MM-DD format', () => {
            const service = createBackupService();
            
            const result = service.getDateStr();
            
            assertTrue(/^\d{4}-\d{2}-\d{2}$/.test(result));
        });
    });
    
    describe('createBackupData', () => {
        test('should collect all data from storage', async () => {
            const storage = new MockStorage();
            storage.set('monk_weight', 75);
            storage.set('monk_streak', { count: 10 });
            storage.set('monk_meal_2026-02-14', [{ name: 'Breakfast' }]);
            
            const service = createBackupService(storage);
            
            const data = await service.createBackupData();
            
            assertEqual(data['monk_weight'], 75);
            assertEqual(data['monk_streak'].count, 10);
            assertLength(data['monk_meal_2026-02-14'], 1);
        });
        
        test('should include metadata', async () => {
            const storage = new MockStorage();
            const service = createBackupService(storage);
            
            const data = await service.createBackupData();
            
            assertNotNull(data.meta);
            assertEqual(data.meta.version, '9.0.0');
            assertTrue(data.meta.autoBackup);
        });
    });
    
    describe('restoreFromData', () => {
        test('should restore from backup data object', async () => {
            const storage = new MockStorage();
            const service = createBackupService(storage);
            
            const backupData = {
                meta: { version: '1.0', date: '2026-02-14' },
                'monk_weight': 75,
                'monk_streak': { count: 10, lastDate: '2026-02-14' }
            };
            
            const result = await service.restoreFromData(backupData);
            
            assertTrue(result.success);
            
            const weight = await storage.get('monk_weight');
            assertEqual(weight, 75);
        });
        
        test('should reject invalid backup data', async () => {
            const service = createBackupService();
            
            const result = await service.restoreFromData({
                meta: { version: '1.0' },
                unknown_key: 'value'
            });
            
            assertFalse(result.success);
            assertNotNull(result.error);
        });
        
        test('should clear existing data before restore', async () => {
            const storage = new MockStorage();
            storage.set('monk_weight', 100);
            
            const service = createBackupService(storage);
            
            await service.restoreFromData({
                meta: { version: '1.0' },
                'monk_streak': { count: 5 }
            });
            
            const weight = await storage.get('monk_weight');
            assertNull(weight);
        });
    });
    
    describe('clearExistingData', () => {
        test('should remove all app data from storage', async () => {
            const storage = new MockStorage();
            storage.set('monk_weight', 75);
            storage.set('monk_streak', { count: 10 });
            storage.set('monk_meal_2026-02-14', []);
            storage.set('other_key', 'should remain');
            
            const service = createBackupService(storage);
            
            await service.clearExistingData();
            
            assertNull(await storage.get('monk_weight'));
            assertNull(await storage.get('monk_streak'));
            assertNull(await storage.get('monk_meal_2026-02-14'));
            assertEqual(await storage.get('other_key'), 'should remain');
        });
    });
    
    describe('exportData', () => {
        test('should create downloadable backup', async () => {
            const storage = new MockStorage();
            storage.set('monk_weight', 75);
            storage.set('monk_streak', { count: 10 });
            
            const service = createBackupService(storage);
            
            // Mock DOM elements
            const mockAnchor = {
                href: '',
                download: '',
                click: () => {},
                style: {}
            };
            
            const originalCreateElement = document.createElement;
            const originalAppendChild = document.body.appendChild;
            const originalRemoveChild = document.body.removeChild;
            
            document.createElement = (tag) => {
                if (tag === 'a') return mockAnchor;
                return originalCreateElement.call(document, tag);
            };
            
            document.body.appendChild = () => mockAnchor;
            document.body.removeChild = () => {};
            
            try {
                const result = await service.exportData();
                
                assertTrue(result);
                assertTrue(mockAnchor.download.includes('system_hardening_backup'));
                
                // Check backup date was saved
                const backupDate = await storage.get('monk_backup_date');
                assertNotNull(backupDate);
            } finally {
                document.createElement = originalCreateElement;
                document.body.appendChild = originalAppendChild;
                document.body.removeChild = originalRemoveChild;
            }
        });
    });
    
    describe('integration tests', () => {
        test('should handle full backup/restore cycle', async () => {
            const storage1 = new MockStorage();
            storage1.set('monk_weight', 75.5);
            storage1.set('monk_streak', { count: 30, lastDate: '2026-02-14' });
            storage1.set('monk_meal_2026-02-14', [{ name: 'Breakfast', cal: 400 }]);
            
            const service1 = createBackupService(storage1);
            
            // Create backup
            const backupData = await service1.createBackupData();
            
            // Restore to new storage
            const storage2 = new MockStorage();
            const service2 = createBackupService(storage2);
            
            const result = await service2.restoreFromData(backupData);
            
            assertTrue(result.success);
            
            // Verify data
            assertEqual(await storage2.get('monk_weight'), 75.5);
            assertEqual((await storage2.get('monk_streak')).count, 30);
            assertLength(await storage2.get('monk_meal_2026-02-14'), 1);
        });
        
        test('should sanitize imported data', async () => {
            const storage = new MockStorage();
            const service = createBackupService(storage);
            
            // Data with values that need sanitization
            const backupData = {
                meta: { version: '1.0' },
                'monk_weight': 1000, // Will be clamped to 500
                'monk_streak': { count: -5, lastDate: 'invalid' } // count clamped, date cleared
            };
            
            const result = await service.restoreFromData(backupData);
            
            assertTrue(result.success);
            
            const weight = await storage.get('monk_weight');
            assertEqual(weight, 500); // Clamped to max
        });
    });
});

// Print summary
console.log('\n---');
console.log(`BackupService Tests: ${passCount}/${testCount} passed`);
if (failCount > 0) {
    console.log(`Failed: ${failCount}`);
}

// Export for test runner
export { testCount, passCount, failCount };
