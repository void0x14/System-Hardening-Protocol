/**
 * Custom Assertion Library
 * Zero external dependencies - Pure Vanilla JS
 * 
 * @fileoverview Provides assertion functions for the custom test framework
 * @version 1.0.0
 */

/**
 * Assert that two values are strictly equal (===)
 * @param {*} actual - The actual value
 * @param {*} expected - The expected value
 * @param {string} message - Optional message to display on failure
 * @throws {Error} If values are not equal
 */
export function assertEqual(actual, expected, message = '') {
    if (actual !== expected) {
        const details = `Expected: ${JSON.stringify(expected)}\n  Actual: ${JSON.stringify(actual)}`;
        throw new Error(`Assertion failed: ${message}\n  ${details}`);
    }
}

/**
 * Assert that a value is truthy
 * @param {*} value - The value to check
 * @param {string} message - Optional message to display on failure
 * @throws {Error} If value is not truthy
 */
export function assertTrue(value, message = '') {
    if (!value) {
        throw new Error(`Assertion failed: ${message}\n  Expected truthy value, got: ${JSON.stringify(value)}`);
    }
}

/**
 * Assert that a value is falsy
 * @param {*} value - The value to check
 * @param {string} message - Optional message to display on failure
 * @throws {Error} If value is not falsy
 */
export function assertFalse(value, message = '') {
    if (value) {
        throw new Error(`Assertion failed: ${message}\n  Expected falsy value, got: ${JSON.stringify(value)}`);
    }
}

/**
 * Assert that two values are deeply equal (JSON comparison)
 * @param {*} actual - The actual value
 * @param {*} expected - The expected value
 * @param {string} message - Optional message to display on failure
 * @throws {Error} If values are not deeply equal
 */
export function assertDeepEqual(actual, expected, message = '') {
    const actualJson = JSON.stringify(actual);
    const expectedJson = JSON.stringify(expected);
    
    if (actualJson !== expectedJson) {
        throw new Error(`Assertion failed: ${message}\n  Expected: ${expectedJson}\n  Actual: ${actualJson}`);
    }
}

/**
 * Assert that a function throws an error
 * @param {Function} fn - The function to execute
 * @param {string} message - Optional message to display on failure
 * @throws {Error} If function does not throw
 */
export function assertThrows(fn, message = '') {
    let threw = false;
    let error = null;
    
    try {
        fn();
    } catch (e) {
        threw = true;
        error = e;
    }
    
    if (!threw) {
        throw new Error(`Assertion failed: ${message}\n  Expected function to throw, but it did not`);
    }
    
    return error; // Return the error for further assertions if needed
}

/**
 * Assert that a function throws a specific error type
 * @param {Function} fn - The function to execute
 * @param {Function} ErrorType - The expected error constructor
 * @param {string} message - Optional message to display on failure
 * @throws {Error} If function does not throw the expected error type
 */
export function assertThrowsType(fn, ErrorType, message = '') {
    let threw = false;
    let error = null;
    
    try {
        fn();
    } catch (e) {
        threw = true;
        error = e;
    }
    
    if (!threw) {
        throw new Error(`Assertion failed: ${message}\n  Expected function to throw ${ErrorType.name}, but it did not throw`);
    }
    
    if (!(error instanceof ErrorType)) {
        throw new Error(`Assertion failed: ${message}\n  Expected ${ErrorType.name}, got ${error.constructor.name}`);
    }
    
    return error;
}

/**
 * Assert that a value is null
 * @param {*} value - The value to check
 * @param {string} message - Optional message to display on failure
 * @throws {Error} If value is not null
 */
export function assertNull(value, message = '') {
    if (value !== null) {
        throw new Error(`Assertion failed: ${message}\n  Expected null, got: ${JSON.stringify(value)}`);
    }
}

/**
 * Assert that a value is not null
 * @param {*} value - The value to check
 * @param {string} message - Optional message to display on failure
 * @throws {Error} If value is null
 */
export function assertNotNull(value, message = '') {
    if (value === null) {
        throw new Error(`Assertion failed: ${message}\n  Expected non-null value, got null`);
    }
}

/**
 * Assert that a value is undefined
 * @param {*} value - The value to check
 * @param {string} message - Optional message to display on failure
 * @throws {Error} If value is not undefined
 */
export function assertUndefined(value, message = '') {
    if (value !== undefined) {
        throw new Error(`Assertion failed: ${message}\n  Expected undefined, got: ${JSON.stringify(value)}`);
    }
}

/**
 * Assert that a value is defined (not undefined)
 * @param {*} value - The value to check
 * @param {string} message - Optional message to display on failure
 * @throws {Error} If value is undefined
 */
export function assertDefined(value, message = '') {
    if (value === undefined) {
        throw new Error(`Assertion failed: ${message}\n  Expected defined value, got undefined`);
    }
}

/**
 * Assert that a value is an instance of a class
 * @param {*} value - The value to check
 * @param {Function} ClassType - The expected class constructor
 * @param {string} message - Optional message to display on failure
 * @throws {Error} If value is not an instance of the class
 */
export function assertInstanceOf(value, ClassType, message = '') {
    if (!(value instanceof ClassType)) {
        throw new Error(`Assertion failed: ${message}\n  Expected instance of ${ClassType.name}, got ${value?.constructor?.name || typeof value}`);
    }
}

/**
 * Assert that a string contains a substring
 * @param {string} str - The string to search in
 * @param {string} substring - The substring to search for
 * @param {string} message - Optional message to display on failure
 * @throws {Error} If string does not contain substring
 */
export function assertContains(str, substring, message = '') {
    if (typeof str !== 'string' || !str.includes(substring)) {
        throw new Error(`Assertion failed: ${message}\n  Expected "${str}" to contain "${substring}"`);
    }
}

/**
 * Assert that an array has a specific length
 * @param {Array} arr - The array to check
 * @param {number} length - The expected length
 * @param {string} message - Optional message to display on failure
 * @throws {Error} If array length does not match
 */
export function assertLength(arr, length, message = '') {
    if (!Array.isArray(arr)) {
        throw new Error(`Assertion failed: ${message}\n  Expected array, got ${typeof arr}`);
    }
    if (arr.length !== length) {
        throw new Error(`Assertion failed: ${message}\n  Expected length ${length}, got ${arr.length}`);
    }
}

/**
 * Assert that a value is a number and is NaN
 * @param {*} value - The value to check
 * @param {string} message - Optional message to display on failure
 * @throws {Error} If value is not NaN
 */
export function assertNaN(value, message = '') {
    if (!Number.isNaN(value)) {
        throw new Error(`Assertion failed: ${message}\n  Expected NaN, got: ${value}`);
    }
}

/**
 * Assert that a value is a number and is not NaN
 * @param {*} value - The value to check
 * @param {string} message - Optional message to display on failure
 * @throws {Error} If value is NaN or not a number
 */
export function assertNotNaN(value, message = '') {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        throw new Error(`Assertion failed: ${message}\n  Expected a valid number, got: ${value}`);
    }
}

/**
 * Assert that two numbers are approximately equal (within tolerance)
 * @param {number} actual - The actual value
 * @param {number} expected - The expected value
 * @param {number} tolerance - The allowed difference (default: 0.0001)
 * @param {string} message - Optional message to display on failure
 * @throws {Error} If values are not approximately equal
 */
export function assertApproxEqual(actual, expected, tolerance = 0.0001, message = '') {
    if (typeof actual !== 'number' || typeof expected !== 'number') {
        throw new Error(`Assertion failed: ${message}\n  Both values must be numbers`);
    }
    
    const diff = Math.abs(actual - expected);
    if (diff > tolerance) {
        throw new Error(`Assertion failed: ${message}\n  Expected ${expected} ± ${tolerance}, got ${actual} (diff: ${diff})`);
    }
}

/**
 * Assert that a function resolves successfully (for async tests)
 * @param {Function} asyncFn - The async function to execute
 * @param {string} message - Optional message to display on failure
 * @returns {Promise<*>} Resolves with the result if successful
 * @throws {Error} If function rejects
 */
export async function assertResolves(asyncFn, message = '') {
    try {
        return await asyncFn();
    } catch (e) {
        throw new Error(`Assertion failed: ${message}\n  Expected function to resolve, but it rejected with: ${e.message}`);
    }
}

/**
 * Assert that a function rejects (for async tests)
 * @param {Function} asyncFn - The async function to execute
 * @param {string} message - Optional message to display on failure
 * @returns {Promise<Error>} Resolves with the rejection error
 * @throws {Error} If function resolves instead of rejecting
 */
export async function assertRejects(asyncFn, message = '') {
    let rejected = false;
    let error = null;
    
    try {
        await asyncFn();
    } catch (e) {
        rejected = true;
        error = e;
    }
    
    if (!rejected) {
        throw new Error(`Assertion failed: ${message}\n  Expected function to reject, but it resolved`);
    }
    
    return error;
}

// Default export with all assertions
export default {
    assertEqual,
    assertTrue,
    assertFalse,
    assertDeepEqual,
    assertThrows,
    assertThrowsType,
    assertNull,
    assertNotNull,
    assertUndefined,
    assertDefined,
    assertInstanceOf,
    assertContains,
    assertLength,
    assertNaN,
    assertNotNaN,
    assertApproxEqual,
    assertResolves,
    assertRejects
};
