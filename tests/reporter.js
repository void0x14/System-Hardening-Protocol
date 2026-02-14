/**
 * Custom Test Reporter
 * Zero external dependencies - Pure Vanilla JS
 * 
 * @fileoverview Provides console output formatting for test results
 * @version 1.0.0
 */

/**
 * ANSI color codes for terminal output
 */
const COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    
    // Foreground colors
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    
    // Background colors
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m'
};

/**
 * Symbols for test status
 */
const SYMBOLS = {
    pass: '✓',
    fail: '✗',
    skip: '○',
    error: '!',
    info: 'ℹ'
};

/**
 * Test Reporter class for formatting test output
 */
export class Reporter {
    constructor(options = {}) {
        this.colors = options.colors !== false && this.supportsColor();
        this.verbose = options.verbose || false;
        this.suiteCount = 0;
        this.currentSuite = null;
    }

    /**
     * Check if terminal supports colors
     * @returns {boolean} True if colors are supported
     */
    supportsColor() {
        // Check for NO_COLOR environment variable
        if (process.env.NO_COLOR) {
            return false;
        }
        
        // Check for TTY
        if (process.stdout && process.stdout.isTTY) {
            return true;
        }
        
        return false;
    }

    /**
     * Apply color to text
     * @param {string} text - Text to colorize
     * @param {string} color - Color name from COLORS
     * @returns {string} Colorized text
     */
    color(text, color) {
        if (!this.colors || !COLORS[color]) {
            return text;
        }
        return `${COLORS[color]}${text}${COLORS.reset}`;
    }

    /**
     * Format a timestamp
     * @param {number} ms - Duration in milliseconds
     * @returns {string} Formatted duration
     */
    formatDuration(ms) {
        if (ms < 1000) {
            return `${ms.toFixed(1)}ms`;
        }
        return `${(ms / 1000).toFixed(2)}s`;
    }

    /**
     * Print a line to console
     * @param {string} text - Text to print
     */
    print(text = '') {
        console.log(text);
    }

    /**
     * Print at the start of test run
     */
    start() {
        this.print();
        this.print(this.color('  Test Runner', 'cyan'));
        this.print(this.color('  ' + '─'.repeat(50), 'dim'));
        this.print();
    }

    /**
     * Print suite header
     * @param {string} suite - Suite name
     */
    suite(suite) {
        if (this.currentSuite !== suite) {
            this.currentSuite = suite;
            this.suiteCount++;
            this.print();
            this.print(`  ${this.color(suite, 'bright')}`);
        }
    }

    /**
     * Print a passing test
     * @param {string} suite - Suite name
     * @param {string} name - Test name
     * @param {number} duration - Test duration in ms
     */
    pass(suite, name, duration = 0) {
        this.suite(suite);
        const symbol = this.color(SYMBOLS.pass, 'green');
        const testName = this.color(name, 'green');
        const time = duration > 10 ? this.color(` (${this.formatDuration(duration)})`, 'yellow') : '';
        this.print(`    ${symbol} ${testName}${time}`);
    }

    /**
     * Print a failing test
     * @param {string} suite - Suite name
     * @param {string} name - Test name
     * @param {string} error - Error message
     */
    fail(suite, name, error) {
        this.suite(suite);
        const symbol = this.color(SYMBOLS.fail, 'red');
        const testName = this.color(name, 'red');
        this.print(`    ${symbol} ${testName}`);
        
        if (this.verbose && error) {
            const lines = error.split('\n');
            for (const line of lines) {
                this.print(`        ${this.color(line, 'dim')}`);
            }
        }
    }

    /**
     * Print a skipped test
     * @param {string} suite - Suite name
     * @param {string} name - Test name
     */
    skip(suite, name) {
        this.suite(suite);
        const symbol = this.color(SYMBOLS.skip, 'yellow');
        const testName = this.color(name, 'dim');
        this.print(`    ${symbol} ${testName}`);
    }

    /**
     * Print an error message
     * @param {string} message - Error message
     */
    error(message) {
        const symbol = this.color(SYMBOLS.error, 'bgRed');
        this.print(`    ${symbol} ${this.color(message, 'red')}`);
    }

    /**
     * Print an info message
     * @param {string} message - Info message
     */
    info(message) {
        const symbol = this.color(SYMBOLS.info, 'blue');
        this.print(`    ${symbol} ${this.color(message, 'dim')}`);
    }

    /**
     * Print summary at the end of test run
     * @param {Object} results - Test results object
     */
    end(results) {
        this.print();
        this.print(this.color('  ' + '─'.repeat(50), 'dim'));
        this.print();
        
        // Summary line
        const parts = [];
        
        if (results.passed > 0) {
            parts.push(this.color(`${results.passed} passed`, 'green'));
        }
        
        if (results.failed > 0) {
            parts.push(this.color(`${results.failed} failed`, 'red'));
        }
        
        if (results.skipped > 0) {
            parts.push(this.color(`${results.skipped} skipped`, 'yellow'));
        }
        
        const summary = parts.join(', ') || '0 tests';
        const duration = this.color(`(${this.formatDuration(results.duration)})`, 'dim');
        
        this.print(`  ${summary} ${duration}`);
        
        // Print errors if any
        if (results.errors.length > 0) {
            this.print();
            this.print(this.color('  Failures:', 'red'));
            this.print();
            
            let i = 1;
            for (const error of results.errors) {
                this.print(`  ${i}) ${error.suite} > ${this.color(error.name, 'red')}`);
                this.print(`     ${this.color(error.error, 'dim')}`);
                
                if (this.verbose && error.stack) {
                    const stackLines = error.stack.split('\n').slice(1, 4);
                    for (const line of stackLines) {
                        this.print(`       ${this.color(line.trim(), 'dim')}`);
                    }
                }
                this.print();
                i++;
            }
        }
        
        // Final status
        this.print();
        if (results.failed === 0 && results.passed > 0) {
            this.print(this.color('  ✓ All tests passed!', 'green'));
        } else if (results.failed > 0) {
            this.print(this.color('  ✗ Some tests failed!', 'red'));
        } else {
            this.print(this.color('  ○ No tests run', 'yellow'));
        }
        this.print();
    }

    /**
     * Print a simple separator
     */
    separator() {
        this.print(this.color('  ' + '─'.repeat(50), 'dim'));
    }
}

// Create default instance
const reporter = new Reporter();

// Export convenience methods
export const start = reporter.start.bind(reporter);
export const pass = reporter.pass.bind(reporter);
export const fail = reporter.fail.bind(reporter);
export const skip = reporter.skip.bind(reporter);
export const error = reporter.error.bind(reporter);
export const info = reporter.info.bind(reporter);
export const end = reporter.end.bind(reporter);

export default {
    Reporter,
    COLORS,
    SYMBOLS,
    start,
    pass,
    fail,
    skip,
    error,
    info,
    end
};
