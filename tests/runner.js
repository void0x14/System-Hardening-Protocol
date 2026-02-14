/**
 * Custom Test Runner
 * Zero external dependencies - Pure Vanilla JS
 * 
 * @fileoverview Provides describe/it pattern for running tests
 * @version 1.0.0
 */

import { Reporter } from './reporter.js';

/**
 * Represents a single test case
 */
class TestCase {
    constructor(name, fn, suite = '') {
        this.name = name;
        this.fn = fn;
        this.suite = suite;
        this.status = 'pending'; // pending, passed, failed, skipped
        this.error = null;
        this.duration = 0;
    }
}

/**
 * Represents a test suite
 */
class TestSuite {
    constructor(name) {
        this.name = name;
        this.tests = [];
        this.beforeEach = null;
        this.afterEach = null;
        this.beforeAll = null;
        this.afterAll = null;
    }
}

/**
 * Custom Test Runner with describe/it pattern
 */
export class TestRunner {
    constructor() {
        this.suites = new Map();
        this.currentSuite = null;
        this.reporter = new Reporter();
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            skipped: 0,
            duration: 0,
            errors: []
        };
        this.onlyMode = false;
        this.onlyTests = [];
    }

    /**
     * Define a test suite
     * @param {string} name - Suite name
     * @param {Function} fn - Suite function containing tests
     */
    describe(name, fn) {
        const suite = new TestSuite(name);
        this.suites.set(name, suite);
        this.currentSuite = suite;
        
        try {
            fn();
        } catch (e) {
            this.reporter.error(`Suite "${name}" setup error: ${e.message}`);
        }
        
        this.currentSuite = null;
    }

    /**
     * Define a test case
     * @param {string} name - Test name
     * @param {Function} fn - Test function
     */
    it(name, fn) {
        if (!this.currentSuite) {
            throw new Error(`Test "${name}" must be inside a describe block`);
        }
        
        const test = new TestCase(name, fn, this.currentSuite.name);
        this.currentSuite.tests.push(test);
    }

    /**
     * Define a test case that should be skipped
     * @param {string} name - Test name
     * @param {Function} fn - Test function (not executed)
     */
    itSkip(name, fn) {
        if (!this.currentSuite) {
            throw new Error(`Test "${name}" must be inside a describe block`);
        }
        
        const test = new TestCase(name, fn, this.currentSuite.name);
        test.status = 'skipped';
        this.currentSuite.tests.push(test);
    }

    /**
     * Define a test case that runs exclusively
     * @param {string} name - Test name
     * @param {Function} fn - Test function
     */
    itOnly(name, fn) {
        if (!this.currentSuite) {
            throw new Error(`Test "${name}" must be inside a describe block`);
        }
        
        this.onlyMode = true;
        const test = new TestCase(name, fn, this.currentSuite.name);
        test.only = true;
        this.currentSuite.tests.push(test);
        this.onlyTests.push(test);
    }

    /**
     * Define a hook to run before each test in the suite
     * @param {Function} fn - Hook function
     */
    beforeEach(fn) {
        if (!this.currentSuite) {
            throw new Error('beforeEach must be inside a describe block');
        }
        this.currentSuite.beforeEach = fn;
    }

    /**
     * Define a hook to run after each test in the suite
     * @param {Function} fn - Hook function
     */
    afterEach(fn) {
        if (!this.currentSuite) {
            throw new Error('afterEach must be inside a describe block');
        }
        this.currentSuite.afterEach = fn;
    }

    /**
     * Define a hook to run before all tests in the suite
     * @param {Function} fn - Hook function
     */
    beforeAll(fn) {
        if (!this.currentSuite) {
            throw new Error('beforeAll must be inside a describe block');
        }
        this.currentSuite.beforeAll = fn;
    }

    /**
     * Define a hook to run after all tests in the suite
     * @param {Function} fn - Hook function
     */
    afterAll(fn) {
        if (!this.currentSuite) {
            throw new Error('afterAll must be inside a describe block');
        }
        this.currentSuite.afterAll = fn;
    }

    /**
     * Run a single test
     * @param {TestCase} test - Test to run
     * @param {TestSuite} suite - Suite the test belongs to
     */
    async runTest(test, suite) {
        if (test.status === 'skipped') {
            this.results.skipped++;
            this.reporter.skip(test.suite, test.name);
            return;
        }

        // If onlyMode is active and this test is not marked as only, skip it
        if (this.onlyMode && !test.only) {
            this.results.skipped++;
            this.reporter.skip(test.suite, test.name);
            return;
        }

        const startTime = performance.now();
        
        try {
            // Run beforeEach hook
            if (suite.beforeEach) {
                await suite.beforeEach();
            }
            
            // Run the test
            await test.fn();
            
            // Run afterEach hook
            if (suite.afterEach) {
                await suite.afterEach();
            }
            
            test.status = 'passed';
            this.results.passed++;
            this.reporter.pass(test.suite, test.name);
        } catch (e) {
            test.status = 'failed';
            test.error = e;
            this.results.failed++;
            this.results.errors.push({
                suite: test.suite,
                name: test.name,
                error: e.message,
                stack: e.stack
            });
            this.reporter.fail(test.suite, test.name, e.message);
        }
        
        test.duration = performance.now() - startTime;
        this.results.total++;
    }

    /**
     * Run all tests
     * @returns {Promise<Object>} Test results
     */
    async run() {
        const startTime = performance.now();
        
        this.reporter.start();
        
        for (const [suiteName, suite] of this.suites) {
            // Run beforeAll hook
            if (suite.beforeAll) {
                try {
                    await suite.beforeAll();
                } catch (e) {
                    this.reporter.error(`beforeAll hook failed for "${suiteName}": ${e.message}`);
                    // Mark all tests in suite as failed
                    for (const test of suite.tests) {
                        test.status = 'failed';
                        test.error = e;
                        this.results.failed++;
                        this.results.total++;
                        this.reporter.fail(suiteName, test.name, `beforeAll failed: ${e.message}`);
                    }
                    continue;
                }
            }
            
            // Run tests
            for (const test of suite.tests) {
                await this.runTest(test, suite);
            }
            
            // Run afterAll hook
            if (suite.afterAll) {
                try {
                    await suite.afterAll();
                } catch (e) {
                    this.reporter.error(`afterAll hook failed for "${suiteName}": ${e.message}`);
                }
            }
        }
        
        this.results.duration = performance.now() - startTime;
        
        this.reporter.end(this.results);
        
        return this.results;
    }

    /**
     * Check if all tests passed
     * @returns {boolean} True if all tests passed
     */
    success() {
        return this.results.failed === 0;
    }

    /**
     * Get exit code for CLI
     * @returns {number} 0 if success, 1 if failures
     */
    exitCode() {
        return this.success() ? 0 : 1;
    }
}

// Create singleton instance
const runner = new TestRunner();

// Export convenience functions
export const describe = runner.describe.bind(runner);
export const it = runner.it.bind(runner);
export const itSkip = runner.itSkip.bind(runner);
export const itOnly = runner.itOnly.bind(runner);
export const beforeEach = runner.beforeEach.bind(runner);
export const afterEach = runner.afterEach.bind(runner);
export const beforeAll = runner.beforeAll.bind(runner);
export const afterAll = runner.afterAll.bind(runner);

// Aliases
export const xit = itSkip;
export const fit = itOnly;
export const context = describe;

// Default export
export default {
    TestRunner,
    describe,
    it,
    itSkip,
    itOnly,
    beforeEach,
    afterEach,
    beforeAll,
    afterAll,
    xit,
    fit,
    context,
    runner
};
