/**
 * Test Runner Entry Point
 * 
 * @fileoverview Runs all tests for the System Hardening Protocol project
 * 
 * Usage: node tests/run-all.js
 * 
 * Options:
 *   --verbose    Show detailed output
 *   --filter=X   Run only tests matching pattern X
 *   --parallel   Run tests in parallel (default: sequential)
 */

import { TestRunner } from './runner.js';

// Import all test files
// Core tests
import './core/Container.test.js';
import './core/EventBus.test.js';

// Service tests
import './services/ValidationService.test.js';
import './services/BackupService.test.js';
import './services/StatisticsService.test.js';

// Repository tests
import './repositories/WeightRepository.test.js';
import './repositories/WorkoutRepository.test.js';
import './repositories/MealRepository.test.js';

// State tests
import './state/StateManager.test.js';
import './state/reducers.test.js';
import './state/middleware.test.js';

// Infrastructure tests
import './infrastructure/LocalStorageAdapter.test.js';
import './infrastructure/MemoryStorageAdapter.test.js';

/**
 * Main test runner
 */
async function main() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║     System Hardening Protocol - Test Suite                 ║');
    console.log('║     Phase 7: Testing Infrastructure                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
    
    const startTime = Date.now();
    
    // Parse command line arguments
    const args = process.argv.slice(2);
    const verbose = args.includes('--verbose');
    const filterArg = args.find(arg => arg.startsWith('--filter='));
    const filter = filterArg ? filterArg.split('=')[1] : null;
    const parallel = args.includes('--parallel');
    
    // Create test runner
    const runner = new TestRunner({
        verbose,
        filter,
        parallel
    });
    
    // Run all tests
    const results = await runner.run();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Print summary
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    TEST SUMMARY                            ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║  Total Tests:  ${results.total.toString().padEnd(43)}║`);
    console.log(`║  Passed:       ${results.passed.toString().padEnd(43)}║`);
    console.log(`║  Failed:       ${results.failed.toString().padEnd(43)}║`);
    console.log(`║  Skipped:      ${results.skipped.toString().padEnd(43)}║`);
    console.log(`║  Duration:     ${duration}s`.padEnd(61) + '║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    
    // Print test categories
    console.log('\nTest Categories:');
    console.log('  • Core (Container, EventBus)');
    console.log('  • Services (Validation, Backup, Statistics)');
    console.log('  • Repositories (Weight, Workout, Meal)');
    console.log('  • State (StateManager, Reducers, Middleware)');
    console.log('  • Infrastructure (LocalStorage, MemoryStorage)');
    
    // Exit with appropriate code
    if (results.failed > 0) {
        console.log('\n❌ Some tests failed!');
        process.exit(1);
    } else {
        console.log('\n✅ All tests passed!');
        process.exit(0);
    }
}

// Run main
main().catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
});
