/**
 * Unit Tests for LocalStorageAdapter
 * 
 * @fileoverview Tests for localStorage storage adapter
 */

import { LocalStorageAdapter } from '../../src/js/infrastructure/LocalStorageAdapter.js';
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

// Mock localStorage for Node.js environment
class MockLocalStorage {
    constructor() {
        this.data = {};
    }
    
    getItem(key) {
        return this.data[key] || null;
    }
    
    setItem(key, value) {
        this.data[key] = value;
    }
    
    removeItem(key) {
        delete this.data[key];
    }
    
    clear() {
        this.data = {};
    }
    
    key(index) {
        const keys = Object.keys(this.data);
        return keys[index] || null;
    }
    
    get length() {
        return Object.keys(this.data).length;
    }
}

// Setup mock localStorage
const mockLocalStorage = new MockLocalStorage();
global.localStorage = mockLocalStorage;

// ============================================
// LocalStorageAdapter Tests
// ============================================

describe('LocalStorageAdapter', () => {
    
    beforeEach: {
        mockLocalStorage.clear();
    }
    
    describe('constructor', () => {
        test('should create adapter without options', () => {
            const adapter = new LocalStorageAdapter();
            
            assertEqual(adapter.prefix, '');
        });
        
        test('should accept prefix option', () => {
            const adapter = new LocalStorageAdapter({ prefix: 'test_' });
            
            assertEqual(adapter.prefix, 'test_');
        });
    });
    
    describe('get', () => {
        test('should return null for missing key', async () => {
            const adapter = new LocalStorageAdapter();
            
            const result = await adapter.get('missing');
            
            assertNull(result);
        });
        
        test('should return stored value', async () => {
            const adapter = new LocalStorageAdapter();
            await adapter.set('test', { value: 123 });
            
            const result = await adapter.get('test');
            
            assertEqual(result.value, 123);
        });
        
        test('should handle prefixed keys', async () => {
            const adapter = new LocalStorageAdapter({ prefix: 'app_' });
            await adapter.set('test', 'value');
            
            // Check that key was stored with prefix
            assertTrue(mockLocalStorage.data.hasOwnProperty('app_test'));
            
            const result = await adapter.get('test');
            assertEqual(result, 'value');
        });
        
        test('should parse JSON values', async () => {
            const adapter = new LocalStorageAdapter();
            mockLocalStorage.data['json_test'] = JSON.stringify({ nested: { value: true } });
            
            const result = await adapter.get('json_test');
            
            assertTrue(result.nested.value);
        });
    });
    
    describe('set', () => {
        test('should store value', async () => {
            const adapter = new LocalStorageAdapter();
            
            await adapter.set('test', { data: 'value' });
            
            assertTrue(mockLocalStorage.data.hasOwnProperty('test'));
        });
        
        test('should serialize to JSON', async () => {
            const adapter = new LocalStorageAdapter();
            
            await adapter.set('test', { num: 123, str: 'hello' });
            
            const parsed = JSON.parse(mockLocalStorage.data['test']);
            assertEqual(parsed.num, 123);
            assertEqual(parsed.str, 'hello');
        });
        
        test('should return true on success', async () => {
            const adapter = new LocalStorageAdapter();
            
            const result = await adapter.set('test', 'value');
            
            assertTrue(result);
        });
        
        test('should use prefix', async () => {
            const adapter = new LocalStorageAdapter({ prefix: 'my_' });
            
            await adapter.set('key', 'value');
            
            assertTrue(mockLocalStorage.data.hasOwnProperty('my_key'));
        });
    });
    
    describe('remove', () => {
        test('should remove key', async () => {
            const adapter = new LocalStorageAdapter();
            await adapter.set('test', 'value');
            
            await adapter.remove('test');
            
            assertNull(await adapter.get('test'));
        });
        
        test('should return true on success', async () => {
            const adapter = new LocalStorageAdapter();
            await adapter.set('test', 'value');
            
            const result = await adapter.remove('test');
            
            assertTrue(result);
        });
        
        test('should handle missing key', async () => {
            const adapter = new LocalStorageAdapter();
            
            const result = await adapter.remove('nonexistent');
            
            assertTrue(result);
        });
    });
    
    describe('clear', () => {
        test('should clear all keys', async () => {
            const adapter = new LocalStorageAdapter();
            await adapter.set('key1', 'value1');
            await adapter.set('key2', 'value2');
            
            await adapter.clear();
            
            assertEqual(mockLocalStorage.length, 0);
        });
        
        test('should only clear prefixed keys when prefix set', async () => {
            mockLocalStorage.data['other_key'] = 'other';
            
            const adapter = new LocalStorageAdapter({ prefix: 'app_' });
            await adapter.set('key1', 'value1');
            await adapter.set('key2', 'value2');
            
            await adapter.clear();
            
            // Other key should remain
            assertTrue(mockLocalStorage.data.hasOwnProperty('other_key'));
            // Prefixed keys should be gone
            assertFalse(mockLocalStorage.data.hasOwnProperty('app_key1'));
        });
    });
    
    describe('keys', () => {
        test('should return all keys', async () => {
            const adapter = new LocalStorageAdapter();
            await adapter.set('key1', 'value1');
            await adapter.set('key2', 'value2');
            
            const keys = await adapter.keys();
            
            assertLength(keys, 2);
            assertTrue(keys.includes('key1'));
            assertTrue(keys.includes('key2'));
        });
        
        test('should strip prefix from keys', async () => {
            const adapter = new LocalStorageAdapter({ prefix: 'app_' });
            await adapter.set('key1', 'value1');
            await adapter.set('key2', 'value2');
            
            const keys = await adapter.keys();
            
            assertTrue(keys.includes('key1'));
            assertTrue(keys.includes('key2'));
            assertFalse(keys.some(k => k.startsWith('app_')));
        });
        
        test('should return empty array for empty storage', async () => {
            const adapter = new LocalStorageAdapter();
            
            const keys = await adapter.keys();
            
            assertLength(keys, 0);
        });
    });
    
    describe('has', () => {
        test('should return true for existing key', async () => {
            const adapter = new LocalStorageAdapter();
            await adapter.set('test', 'value');
            
            const result = await adapter.has('test');
            
            assertTrue(result);
        });
        
        test('should return false for missing key', async () => {
            const adapter = new LocalStorageAdapter();
            
            const result = await adapter.has('missing');
            
            assertFalse(result);
        });
    });
    
    describe('size', () => {
        test('should return number of items', async () => {
            const adapter = new LocalStorageAdapter();
            await adapter.set('key1', 'value1');
            await adapter.set('key2', 'value2');
            await adapter.set('key3', 'value3');
            
            const size = await adapter.size();
            
            assertEqual(size, 3);
        });
        
        test('should return 0 for empty storage', async () => {
            const adapter = new LocalStorageAdapter();
            
            const size = await adapter.size();
            
            assertEqual(size, 0);
        });
    });
    
    describe('getStorageInfo', () => {
        test('should return storage info', async () => {
            const adapter = new LocalStorageAdapter();
            await adapter.set('test', 'value');
            
            const info = await adapter.getStorageInfo();
            
            assertNotNull(info.used);
            assertNotNull(info.quota);
            assertNotNull(info.available);
            assertTrue(info.quota > 0);
        });
    });
    
    describe('integration tests', () => {
        test('should handle complex objects', async () => {
            const adapter = new LocalStorageAdapter();
            const complex = {
                nested: {
                    array: [1, 2, 3],
                    object: { a: 'b' }
                },
                date: '2026-02-14',
                number: 123.45
            };
            
            await adapter.set('complex', complex);
            const result = await adapter.get('complex');
            
            assertDeepEqual(result, complex);
        });
        
        test('should handle arrays', async () => {
            const adapter = new LocalStorageAdapter();
            const array = [1, 'two', { three: 3 }, [4, 5]];
            
            await adapter.set('array', array);
            const result = await adapter.get('array');
            
            assertDeepEqual(result, array);
        });
        
        test('should handle null values', async () => {
            const adapter = new LocalStorageAdapter();
            
            await adapter.set('null', null);
            const result = await adapter.get('null');
            
            assertNull(result);
        });
        
        test('should overwrite existing values', async () => {
            const adapter = new LocalStorageAdapter();
            
            await adapter.set('key', 'first');
            await adapter.set('key', 'second');
            
            const result = await adapter.get('key');
            assertEqual(result, 'second');
        });
    });
});

// Print summary
console.log('\n---');
console.log(`LocalStorageAdapter Tests: ${passCount}/${testCount} passed`);
if (failCount > 0) {
    console.log(`Failed: ${failCount}`);
}

// Export for test runner
export { testCount, passCount, failCount };
