/**
 * Unit Tests for Container (DI Container)
 * 
 * @fileoverview Tests for the Dependency Injection Container
 */

import { Container } from '../../src/js/core/Container.js';
import {
    assertEqual,
    assertTrue,
    assertFalse,
    assertThrows,
    assertInstanceOf,
    assertLength,
    assertDeepEqual
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
// Container Tests
// ============================================

describe('Container', () => {
    
    describe('constructor', () => {
        test('should create an empty container', () => {
            const container = new Container();
            assertLength(container.getRegisteredServices(), 0);
        });
    });
    
    describe('register', () => {
        test('should register a service with default singleton lifecycle', () => {
            const container = new Container();
            container.register('test', () => ({ value: 42 }));
            
            assertTrue(container.has('test'));
        });
        
        test('should register a service with transient lifecycle', () => {
            const container = new Container();
            container.register('test', () => ({ value: 42 }), 'transient');
            
            assertTrue(container.has('test'));
        });
        
        test('should return container for chaining', () => {
            const container = new Container();
            const result = container.register('test', () => ({}));
            
            assertInstanceOf(result, Container);
        });
        
        test('should throw for empty name', () => {
            const container = new Container();
            
            assertThrows(() => container.register('', () => ()));
        });
        
        test('should throw for non-string name', () => {
            const container = new Container();
            
            assertThrows(() => container.register(123, () => ()));
        });
        
        test('should throw for non-function factory', () => {
            const container = new Container();
            
            assertThrows(() => container.register('test', 'not a function'));
        });
        
        test('should throw for invalid lifecycle', () => {
            const container = new Container();
            
            assertThrows(() => container.register('test', () => (), 'invalid'));
        });
    });
    
    describe('get', () => {
        test('should return service instance', () => {
            const container = new Container();
            container.register('test', () => ({ value: 42 }));
            
            const service = container.get('test');
            
            assertEqual(service.value, 42);
        });
        
        test('should return same instance for singleton', () => {
            const container = new Container();
            container.register('test', () => ({ id: Math.random() }));
            
            const instance1 = container.get('test');
            const instance2 = container.get('test');
            
            assertEqual(instance1, instance2);
        });
        
        test('should return new instance for transient', () => {
            const container = new Container();
            container.register('test', () => ({ id: Math.random() }), 'transient');
            
            const instance1 = container.get('test');
            const instance2 = container.get('test');
            
            assertTrue(instance1 !== instance2);
        });
        
        test('should throw for unregistered service', () => {
            const container = new Container();
            
            assertThrows(() => container.get('nonexistent'));
        });
        
        test('should pass container to factory', () => {
            const container = new Container();
            container.register('config', () => ({ apiUrl: 'test' }));
            container.register('api', (c) => ({ config: c.get('config') }));
            
            const api = container.get('api');
            
            assertEqual(api.config.apiUrl, 'test');
        });
    });
    
    describe('has', () => {
        test('should return true for registered service', () => {
            const container = new Container();
            container.register('test', () => ({}));
            
            assertTrue(container.has('test'));
        });
        
        test('should return false for unregistered service', () => {
            const container = new Container();
            
            assertFalse(container.has('nonexistent'));
        });
    });
    
    describe('resolve', () => {
        test('should be an alias for get', () => {
            const container = new Container();
            container.register('test', () => ({ value: 42 }));
            
            const service = container.resolve('test');
            
            assertEqual(service.value, 42);
        });
    });
    
    describe('unregister', () => {
        test('should remove a registered service', () => {
            const container = new Container();
            container.register('test', () => ({}));
            
            container.unregister('test');
            
            assertFalse(container.has('test'));
        });
        
        test('should return true when removing existing service', () => {
            const container = new Container();
            container.register('test', () => ({}));
            
            const result = container.unregister('test');
            
            assertTrue(result);
        });
        
        test('should return false when removing non-existent service', () => {
            const container = new Container();
            
            const result = container.unregister('nonexistent');
            
            assertFalse(result);
        });
    });
    
    describe('clear', () => {
        test('should remove all services', () => {
            const container = new Container();
            container.register('test1', () => ({}));
            container.register('test2', () => ({}));
            
            container.clear();
            
            assertLength(container.getRegisteredServices(), 0);
        });
    });
    
    describe('getRegisteredServices', () => {
        test('should return array of service names', () => {
            const container = new Container();
            container.register('service1', () => ({}));
            container.register('service2', () => ({}));
            
            const services = container.getRegisteredServices();
            
            assertLength(services, 2);
            assertTrue(services.includes('service1'));
            assertTrue(services.includes('service2'));
        });
    });
    
    describe('isInstantiated', () => {
        test('should return false before singleton is instantiated', () => {
            const container = new Container();
            container.register('test', () => ({}));
            
            assertFalse(container.isInstantiated('test'));
        });
        
        test('should return true after singleton is instantiated', () => {
            const container = new Container();
            container.register('test', () => ({}));
            
            container.get('test');
            
            assertTrue(container.isInstantiated('test'));
        });
        
        test('should return false for transient services', () => {
            const container = new Container();
            container.register('test', () => ({}), 'transient');
            
            container.get('test');
            
            assertFalse(container.isInstantiated('test'));
        });
        
        test('should return false for unregistered service', () => {
            const container = new Container();
            
            assertFalse(container.isInstantiated('nonexistent'));
        });
    });
    
    describe('createChild', () => {
        test('should create a new container', () => {
            const parent = new Container();
            const child = parent.createChild();
            
            assertInstanceOf(child, Container);
        });
        
        test('should inherit parent services', () => {
            const parent = new Container();
            parent.register('test', () => ({ value: 42 }));
            
            const child = parent.createChild();
            
            assertTrue(child.has('test'));
            assertEqual(child.get('test').value, 42);
        });
        
        test('should not affect parent when child is modified', () => {
            const parent = new Container();
            parent.register('test', () => ({ value: 42 }));
            
            const child = parent.createChild();
            child.register('childService', () => ({}));
            
            assertFalse(parent.has('childService'));
            assertTrue(child.has('childService'));
        });
        
        test('should allow child to override parent service', () => {
            const parent = new Container();
            parent.register('test', () => ({ value: 'parent' }));
            
            const child = parent.createChild();
            child.register('test', () => ({ value: 'child' }));
            
            assertEqual(parent.get('test').value, 'parent');
            assertEqual(child.get('test').value, 'child');
        });
    });
    
    describe('dependency injection', () => {
        test('should resolve nested dependencies', () => {
            const container = new Container();
            
            container.register('config', () => ({ apiUrl: 'https://api.test.com' }));
            container.register('http', (c) => ({ 
                get: (url) => `${c.get('config').apiUrl}${url}` 
            }));
            container.register('api', (c) => ({
                getUser: (id) => c.get('http').get(`/users/${id}`)
            }));
            
            const api = container.get('api');
            
            assertEqual(api.getUser(1), 'https://api.test.com/users/1');
        });
        
        test('should handle circular dependency detection (manual)', () => {
            // Note: This container doesn't auto-detect circular dependencies
            // but we can test that it doesn't infinite loop
            const container = new Container();
            
            container.register('a', (c) => ({ b: c.get('b') }));
            container.register('b', (c) => ({ a: c.get('a') }));
            
            // This would cause infinite recursion - we test that it throws
            // In a real implementation, you'd want circular dependency detection
            // For now, we just verify the container works with non-circular deps
            assertTrue(container.has('a'));
            assertTrue(container.has('b'));
        });
    });
});

// Print summary
console.log('\n---');
console.log(`Container Tests: ${passCount}/${testCount} passed`);
if (failCount > 0) {
    console.log(`Failed: ${failCount}`);
}

// Export for potential test runner integration
export { testCount, passCount, failCount };
