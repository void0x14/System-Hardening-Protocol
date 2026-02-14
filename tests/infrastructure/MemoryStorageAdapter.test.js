/**
 * Unit Tests for MemoryStorageAdapter
 * 
 * @fileoverview Tests for in-memory storage adapter
 */

import { MemoryStorageAdapter } from '../../src/js/infrastructure/MemoryStorageAdapter.js';
import {
    assertEqual,
    assertTrue,
    assertFalse,
    assertDeepEqual,
    assertLength,
    assertNotNull,
    assertNull
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
// MemoryStorageAdapter Tests
// ============================================

describe('MemoryStorageAdapter', () => {
    
    describe('constructor', () => {
        test('should create empty adapter', () => {
            const adapter = new MemoryStorageAdapter();
            
            assertEqual(adapter._data.size, 0);
        });
        
        test('should accept initial data', () => {
            const adapter = new MemoryStorageAdapter({
                initialData: {
                    key1: 'value1',
                    key2: 'value2'
                }
            });
            
            assertEqual(adapter._data.size, 2);
        });
    });
    
    describe('get', () => {
        test('should return null for missing key', async () => {
            const adapter = new MemoryStorageAdapter();
            
            const result = await adapter.get('missing');
            
            assertNull(result);
        });
        
        test('should return stored value', async () => {
            const adapter = new MemoryStorageAdapter();
            await adapter.set('test', { value: 123 });
            
            const result = await adapter.get('test');
            
            assertEqual(result.value, 123);
        });
        
        test('should return deep copy', async () => {
            const adapter = new MemoryStorageAdapter();
            const original = { nested: { value: 123 } };
            await adapter.set('test', original);
            
            const result = await adapter.get('test');
            result.nested.value = 456;
            
            const result2 = await adapter.get('test');
            assertEqual(result2.nested.value, 123); // Original unchanged
        });
    });
    
    describe('set', () => {
        test('should store value', async () => {
            const adapter = new MemoryStorageAdapter();
            
            await adapter.set('test', 'value');
            
            assertTrue(adapter._data.has('test'));
        });
        
        test('should return true', async () => {
            const adapter = new MemoryStorageAdapter();
            
            const result = await adapter.set('test', 'value');
            
            assertTrue(result);
        });
        
        test('should store deep copy', async () => {
            const adapter = new MemoryStorageAdapter();
            const original = { nested: { value: 123 } };
            
            await adapter.set('test', original);
            original.nested.value = 456;
            
            const stored = await adapter.get('test');
            assertEqual(stored.nested.value, 123); // Stored value unchanged
        });
        
        test('should overwrite existing value', async () => {
            const adapter = new MemoryStorageAdapter();
            
            await adapter.set('test', 'first');
            await adapter.set('test', 'second');
            
            const result = await adapter.get('test');
            assertEqual(result, 'second');
        });
    });
    
    describe('remove', () => {
        test('should remove key', async () => {
            const adapter = new MemoryStorageAdapter();
            await adapter.set('test', 'value');
            
            await adapter.remove('test');
            
            assertFalse(adapter._data.has('test'));
        });
        
        test('should return true when key existed', async () => {
            const adapter = new MemoryStorageAdapter();
            await adapter.set('test', 'value');
            
            const result = await adapter.remove('test');
            
            assertTrue(result);
        });
        
        test('should return false when key did not exist', async () => {
            const adapter = new MemoryStorageAdapter();
            
            const result = await adapter.remove('nonexistent');
            
            assertFalse(result);
        });
    });
    
    describe('clear', () => {
        test('should clear all data', async () => {
            const adapter = new MemoryStorageAdapter();
            await adapter.set('key1', 'value1');
            await adapter.set('key2', 'value2');
            
            await adapter.clear();
            
            assertEqual(adapter._data.size, 0);
        });
        
        test('should return true', async () => {
            const adapter = new MemoryStorageAdapter();
            
            const result = await adapter.clear();
            
            assertTrue(result);
        });
    });
    
    describe('keys', () => {
        test('should return all keys', async () => {
            const adapter = new MemoryStorageAdapter();
            await adapter.set('key1', 'value1');
            await adapter.set('key2', 'value2');
            await adapter.set('key3', 'value3');
            
            const keys = await adapter.keys();
            
            assertLength(keys, 3);
            assertTrue(keys.includes('key1'));
            assertTrue(keys.includes('key2'));
            assertTrue(keys.includes('key3'));
        });
        
        test('should return empty array for empty storage', async () => {
            const adapter = new MemoryStorageAdapter();
            
            const keys = await adapter.keys();
            
            assertLength(keys, 0);
        });
    });
    
    describe('has', () => {
        test('should return true for existing key', async () => {
            const adapter = new MemoryStorageAdapter();
            await adapter.set('test', 'value');
            
            const result = await adapter.has('test');
            
            assertTrue(result);
        });
        
        test('should return false for missing key', async () => {
            const adapter = new MemoryStorageAdapter();
            
            const result = await adapter.has('missing');
            
            assertFalse(result);
        });
    });
    
    describe('size', () => {
        test('should return number of items', async () => {
            const adapter = new MemoryStorageAdapter();
            await adapter.set('key1', 'value1');
            await adapter.set('key2', 'value2');
            
            const size = await adapter.size();
            
            assertEqual(size, 2);
        });
        
        test('should return 0 for empty storage', async () => {
            const adapter = new MemoryStorageAdapter();
            
            const size = await adapter.size();
            
            assertEqual(size, 0);
        });
    });
    
    describe('snapshot', () => {
        test('should return all data', async () => {
            const adapter = new MemoryStorageAdapter();
            await adapter.set('key1', 'value1');
            await adapter.set('key2', 'value2');
            
            const snapshot = await adapter.snapshot();
            
            assertEqual(snapshot.key1, 'value1');
            assertEqual(snapshot.key2, 'value2');
        });
        
        test('should return deep copy', async () => {
            const adapter = new MemoryStorageAdapter();
            await adapter.set('test', { nested: { value: 123 } });
            
            const snapshot = await adapter.snapshot();
            snapshot.test.nested.value = 456;
            
            const snapshot2 = await adapter.snapshot();
            assertEqual(snapshot2.test.nested.value, 123);
        });
    });
    
    describe('importData', () => {
        test('should import multiple values', async () => {
            const adapter = new MemoryStorageAdapter();
            
            await adapter.importData({
                key1: 'value1',
                key2: 'value2',
                key3: 'value3'
            });
            
            assertEqual(adapter._data.size, 3);
            assertEqual(await adapter.get('key1'), 'value1');
        });
        
        test('should return true', async () => {
            const adapter = new MemoryStorageAdapter();
            
            const result = await adapter.importData({ key: 'value' });
            
            assertTrue(result);
        });
    });
    
    describe('reset', () => {
        test('should clear all data', async () => {
            const adapter = new MemoryStorageAdapter();
            await adapter.set('test', 'value');
            
            await adapter.reset();
            
            assertEqual(adapter._data.size, 0);
        });
        
        test('should return true', async () => {
            const adapter = new MemoryStorageAdapter();
            
            const result = await adapter.reset();
            
            assertTrue(result);
        });
    });
    
    describe('_deepClone', () => {
        test('should clone primitives', async () => {
            const adapter = new MemoryStorageAdapter();
            
            assertEqual(adapter._deepClone(123), 123);
            assertEqual(adapter._deepClone('string'), 'string');
            assertEqual(adapter._deepClone(true), true);
            assertNull(adapter._deepClone(null));
        });
        
        test('should clone arrays', async () => {
            const adapter = new MemoryStorageAdapter();
            const original = [1, 2, { nested: 3 }];
            
            const cloned = adapter._deepClone(original);
            
            cloned[2].nested = 4;
            assertEqual(original[2].nested, 3);
        });
        
        test('should clone objects', async () => {
            const adapter = new MemoryStorageAdapter();
            const original = { a: 1, b: { c: 2 } };
            
            const cloned = adapter._deepClone(original);
            
            cloned.b.c = 3;
            assertEqual(original.b.c, 2);
        });
        
        test('should clone Date objects', async () => {
            const adapter = new MemoryStorageAdapter();
            const original = new Date('2026-02-14');
            
            const cloned = adapter._deepClone(original);
            
            assertEqual(cloned.getTime(), original.getTime());
            assertTrue(cloned !== original);
        });
        
        test('should clone Map objects', async () => {
            const adapter = new MemoryStorageAdapter();
            const original = new Map([['key', { value: 123 }]]);
            
            const cloned = adapter._deepClone(original);
            
            cloned.get('key').value = 456;
            assertEqual(original.get('key').value, 123);
        });
        
        test('should clone Set objects', async () => {
            const adapter = new MemoryStorageAdapter();
            const original = new Set([1, 2, 3]);
            
            const cloned = adapter._deepClone(original);
            
            cloned.add(4);
            assertFalse(original.has(4));
        });
    });
    
    describe('integration tests', () => {
        test('should handle complex objects', async () => {
            const adapter = new MemoryStorageAdapter();
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
            const adapter = new MemoryStorageAdapter();
            const array = [1, 'two', { three: 3 }, [4, 5]];
            
            await adapter.set('array', array);
            const result = await adapter.get('array');
            
            assertDeepEqual(result, array);
        });
        
        test('should handle null values', async () => {
            const adapter = new MemoryStorageAdapter();
            
            await adapter.set('null', null);
            const result = await adapter.get('null');
            
            assertNull(result);
        });
        
        test('should handle undefined values', async () => {
            const adapter = new MemoryStorageAdapter();
            
            await adapter.set('undefined', undefined);
            const result = await adapter.get('undefined');
            
            assertNull(result); // get returns null for missing/undefined
        });
        
        test('should support full CRUD workflow', async () => {
            const adapter = new MemoryStorageAdapter();
            
            // Create
            await adapter.set('user', { name: 'John', age: 30 });
            assertTrue(await adapter.has('user'));
            
            // Read
            const user = await adapter.get('user');
            assertEqual(user.name, 'John');
            
            // Update
            await adapter.set('user', { name: 'Jane', age: 25 });
            const updated = await adapter.get('user');
            assertEqual(updated.name, 'Jane');
            
            // Delete
            await adapter.remove('user');
            assertFalse(await adapter.has('user'));
        });
        
        test('should work with initial data', async () => {
            const adapter = new MemoryStorageAdapter({
                initialData: {
                    user: { name: 'John' },
                    settings: { theme: 'dark' }
                }
            });
            
            const user = await adapter.get('user');
            const settings = await adapter.get('settings');
            
            assertEqual(user.name, 'John');
            assertEqual(settings.theme, 'dark');
        });
    });
});

// Print summary
console.log('\n---');
console.log(`MemoryStorageAdapter Tests: ${passCount}/${testCount} passed`);
if (failCount > 0) {
    console.log(`Failed: ${failCount}`);
}

// Export for test runner
export { testCount, passCount, failCount };
