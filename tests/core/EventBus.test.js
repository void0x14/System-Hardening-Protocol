/**
 * Unit Tests for EventBus
 * 
 * @fileoverview Tests for the Event Bus implementation
 */

import { EventBus } from '../../src/js/core/EventBus.js';
import {
    assertEqual,
    assertTrue,
    assertFalse,
    assertThrows,
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

async function asyncTest(name, fn) {
    testCount++;
    try {
        await fn();
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
// EventBus Tests
// ============================================

describe('EventBus', () => {
    
    describe('constructor', () => {
        test('should create an empty event bus', () => {
            const eventBus = new EventBus();
            
            assertLength(eventBus.getEvents(), 0);
        });
    });
    
    describe('on', () => {
        test('should subscribe to an event', () => {
            const eventBus = new EventBus();
            
            eventBus.on('test', () => {});
            
            assertTrue(eventBus.hasHandlers('test'));
        });
        
        test('should return an unsubscribe function', () => {
            const eventBus = new EventBus();
            
            const unsubscribe = eventBus.on('test', () => {});
            
            assertEqual(typeof unsubscribe, 'function');
        });
        
        test('unsubscribe function should remove handler', () => {
            const eventBus = new EventBus();
            
            const unsubscribe = eventBus.on('test', () => {});
            unsubscribe();
            
            assertFalse(eventBus.hasHandlers('test'));
        });
        
        test('should throw for empty event name', () => {
            const eventBus = new EventBus();
            
            assertThrows(() => eventBus.on('', () => {}));
        });
        
        test('should throw for non-string event name', () => {
            const eventBus = new EventBus();
            
            assertThrows(() => eventBus.on(123, () => {}));
        });
        
        test('should throw for non-function handler', () => {
            const eventBus = new EventBus();
            
            assertThrows(() => eventBus.on('test', 'not a function'));
        });
        
        test('should support multiple handlers for same event', () => {
            const eventBus = new EventBus();
            
            eventBus.on('test', () => {});
            eventBus.on('test', () => {});
            
            assertEqual(eventBus.handlerCount('test'), 2);
        });
    });
    
    describe('once', () => {
        test('should subscribe to an event once', () => {
            const eventBus = new EventBus();
            
            eventBus.once('test', () => {});
            
            assertTrue(eventBus.hasHandlers('test'));
        });
        
        test('should remove handler after first emit', () => {
            const eventBus = new EventBus();
            
            eventBus.once('test', () => {});
            eventBus.emit('test', {});
            
            assertFalse(eventBus.hasHandlers('test'));
        });
        
        test('should only call handler once', () => {
            const eventBus = new EventBus();
            let callCount = 0;
            
            eventBus.once('test', () => callCount++);
            eventBus.emit('test', {});
            eventBus.emit('test', {});
            
            assertEqual(callCount, 1);
        });
        
        test('should return an unsubscribe function', () => {
            const eventBus = new EventBus();
            
            const unsubscribe = eventBus.once('test', () => {});
            
            assertEqual(typeof unsubscribe, 'function');
        });
        
        test('should throw for empty event name', () => {
            const eventBus = new EventBus();
            
            assertThrows(() => eventBus.once('', () => {}));
        });
        
        test('should throw for non-function handler', () => {
            const eventBus = new EventBus();
            
            assertThrows(() => eventBus.once('test', 'not a function'));
        });
    });
    
    describe('off', () => {
        test('should remove a handler', () => {
            const eventBus = new EventBus();
            const handler = () => {};
            
            eventBus.on('test', handler);
            eventBus.off('test', handler);
            
            assertFalse(eventBus.hasHandlers('test'));
        });
        
        test('should return true when handler was removed', () => {
            const eventBus = new EventBus();
            const handler = () => {};
            
            eventBus.on('test', handler);
            const result = eventBus.off('test', handler);
            
            assertTrue(result);
        });
        
        test('should return false when handler was not found', () => {
            const eventBus = new EventBus();
            
            const result = eventBus.off('test', () => {});
            
            assertFalse(result);
        });
        
        test('should only remove specified handler', () => {
            const eventBus = new EventBus();
            const handler1 = () => {};
            const handler2 = () => {};
            
            eventBus.on('test', handler1);
            eventBus.on('test', handler2);
            eventBus.off('test', handler1);
            
            assertEqual(eventBus.handlerCount('test'), 1);
        });
        
        test('should remove once handlers too', () => {
            const eventBus = new EventBus();
            const handler = () => {};
            
            eventBus.once('test', handler);
            eventBus.off('test', handler);
            
            assertFalse(eventBus.hasHandlers('test'));
        });
    });
    
    describe('emit', () => {
        test('should call all handlers for an event', () => {
            const eventBus = new EventBus();
            let callCount = 0;
            
            eventBus.on('test', () => callCount++);
            eventBus.on('test', () => callCount++);
            eventBus.emit('test', {});
            
            assertEqual(callCount, 2);
        });
        
        test('should pass payload to handlers', () => {
            const eventBus = new EventBus();
            let received = null;
            
            eventBus.on('test', (payload) => received = payload);
            eventBus.emit('test', { value: 42 });
            
            assertEqual(received.value, 42);
        });
        
        test('should return number of handlers called', () => {
            const eventBus = new EventBus();
            
            eventBus.on('test', () => {});
            eventBus.on('test', () => {});
            
            const count = eventBus.emit('test', {});
            
            assertEqual(count, 2);
        });
        
        test('should return 0 for event with no handlers', () => {
            const eventBus = new EventBus();
            
            const count = eventBus.emit('nonexistent', {});
            
            assertEqual(count, 0);
        });
        
        test('should throw for empty event name', () => {
            const eventBus = new EventBus();
            
            assertThrows(() => eventBus.emit('', {}));
        });
        
        test('should not stop on handler error', () => {
            const eventBus = new EventBus();
            let callCount = 0;
            
            eventBus.on('test', () => { throw new Error('Handler error'); });
            eventBus.on('test', () => callCount++);
            
            // Suppress console.error for this test
            const originalError = console.error;
            console.error = () => {};
            
            eventBus.emit('test', {});
            
            console.error = originalError;
            
            assertEqual(callCount, 1);
        });
        
        test('should call once handlers and remove them', () => {
            const eventBus = new EventBus();
            let callCount = 0;
            
            eventBus.once('test', () => callCount++);
            eventBus.emit('test', {});
            
            assertFalse(eventBus.hasHandlers('test'));
            assertEqual(callCount, 1);
        });
    });
    
    describe('emitAsync', () => {
        asyncTest('should emit asynchronously', async () => {
            const eventBus = new EventBus();
            let called = false;
            
            eventBus.on('test', () => called = true);
            
            const promise = eventBus.emitAsync('test', {});
            
            // Handler should not be called yet
            // Note: This is tricky to test in microtask timing
            await promise;
            
            assertTrue(called);
        });
        
        asyncTest('should return promise with handler count', async () => {
            const eventBus = new EventBus();
            
            eventBus.on('test', () => {});
            eventBus.on('test', () => {});
            
            const count = await eventBus.emitAsync('test', {});
            
            assertEqual(count, 2);
        });
    });
    
    describe('clearEvent', () => {
        test('should remove all handlers for an event', () => {
            const eventBus = new EventBus();
            
            eventBus.on('test', () => {});
            eventBus.on('test', () => {});
            eventBus.once('test', () => {});
            
            eventBus.clearEvent('test');
            
            assertFalse(eventBus.hasHandlers('test'));
        });
        
        test('should return number of removed handlers', () => {
            const eventBus = new EventBus();
            
            eventBus.on('test', () => {});
            eventBus.on('test', () => {});
            eventBus.once('test', () => {});
            
            const count = eventBus.clearEvent('test');
            
            assertEqual(count, 3);
        });
        
        test('should return 0 for nonexistent event', () => {
            const eventBus = new EventBus();
            
            const count = eventBus.clearEvent('nonexistent');
            
            assertEqual(count, 0);
        });
    });
    
    describe('clear', () => {
        test('should remove all handlers for all events', () => {
            const eventBus = new EventBus();
            
            eventBus.on('test1', () => {});
            eventBus.on('test2', () => {});
            
            eventBus.clear();
            
            assertLength(eventBus.getEvents(), 0);
        });
    });
    
    describe('hasHandlers', () => {
        test('should return true when event has handlers', () => {
            const eventBus = new EventBus();
            
            eventBus.on('test', () => {});
            
            assertTrue(eventBus.hasHandlers('test'));
        });
        
        test('should return false when event has no handlers', () => {
            const eventBus = new EventBus();
            
            assertFalse(eventBus.hasHandlers('test'));
        });
    });
    
    describe('handlerCount', () => {
        test('should return correct count of handlers', () => {
            const eventBus = new EventBus();
            
            eventBus.on('test', () => {});
            eventBus.on('test', () => {});
            eventBus.once('test', () => {});
            
            assertEqual(eventBus.handlerCount('test'), 3);
        });
        
        test('should return 0 for nonexistent event', () => {
            const eventBus = new EventBus();
            
            assertEqual(eventBus.handlerCount('nonexistent'), 0);
        });
    });
    
    describe('getEvents', () => {
        test('should return array of event names', () => {
            const eventBus = new EventBus();
            
            eventBus.on('test1', () => {});
            eventBus.on('test2', () => {});
            eventBus.once('test3', () => {});
            
            const events = eventBus.getEvents();
            
            assertLength(events, 3);
            assertTrue(events.includes('test1'));
            assertTrue(events.includes('test2'));
            assertTrue(events.includes('test3'));
        });
    });
    
    describe('event history', () => {
        test('should record events when history is enabled', () => {
            const eventBus = new EventBus();
            
            eventBus.setHistoryRecording(true);
            eventBus.emit('test', { value: 1 });
            eventBus.emit('test2', { value: 2 });
            
            const history = eventBus.getHistory();
            
            assertLength(history, 2);
            assertEqual(history[0].event, 'test');
            assertEqual(history[1].event, 'test2');
        });
        
        test('should not record events when history is disabled', () => {
            const eventBus = new EventBus();
            
            eventBus.setHistoryRecording(false);
            eventBus.emit('test', {});
            
            const history = eventBus.getHistory();
            
            assertLength(history, 0);
        });
        
        test('should clear history', () => {
            const eventBus = new EventBus();
            
            eventBus.setHistoryRecording(true);
            eventBus.emit('test', {});
            eventBus.clearHistory();
            
            const history = eventBus.getHistory();
            
            assertLength(history, 0);
        });
    });
    
    describe('integration scenarios', () => {
        test('should support pub/sub pattern', () => {
            const eventBus = new EventBus();
            const received = [];
            
            eventBus.on('user:login', (user) => received.push(`Login: ${user.name}`));
            eventBus.on('user:logout', () => received.push('Logout'));
            
            eventBus.emit('user:login', { name: 'John' });
            eventBus.emit('user:logout');
            
            assertDeepEqual(received, ['Login: John', 'Logout']);
        });
        
        test('should support state change notifications', () => {
            const eventBus = new EventBus();
            let state = { count: 0 };
            
            eventBus.on('state:change', (newState) => state = newState);
            
            eventBus.emit('state:change', { count: 1 });
            
            assertEqual(state.count, 1);
        });
        
        test('should support multiple subscribers with same payload', () => {
            const eventBus = new EventBus();
            const results = [];
            
            eventBus.on('data', (payload) => results.push(payload.value * 2));
            eventBus.on('data', (payload) => results.push(payload.value * 3));
            
            eventBus.emit('data', { value: 5 });
            
            assertDeepEqual(results, [10, 15]);
        });
    });
});

// Print summary
console.log('\n---');
console.log(`EventBus Tests: ${passCount}/${testCount} passed`);
if (failCount > 0) {
    console.log(`Failed: ${failCount}`);
}

// Export for potential test runner integration
export { testCount, passCount, failCount };
