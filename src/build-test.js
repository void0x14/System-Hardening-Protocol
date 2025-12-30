// build-test.js - Diagnostic Build Script
// Tests modules incrementally to find which one breaks execution

const fs = require('fs');
const path = require('path');

console.log('🔬 DIAGNOSTIC BUILD - Testing module by module...\n');

const srcDir = __dirname;
const distDir = path.join(srcDir, '..', 'dist');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// CSS - same as before
const cssFiles = ['base', 'components', 'animations', 'overrides'];
let css = '';
cssFiles.forEach(name => {
    const filePath = path.join(srcDir, 'styles', `${name}.css`);
    if (fs.existsSync(filePath)) {
        css += fs.readFileSync(filePath, 'utf8') + '\n';
    }
});

// TEST 1: MINIMAL - Just a console.log test
const TEST_PHASE = process.env.TEST_PHASE || '1';

let js = '';

// Always add initial test
js += `console.log("=== DIAGNOSTIC: Script tag is executing! ===");\n\n`;

const allModules = [
    // Phase 1: Config only
    ['config'],
    // Phase 2: Config + DB
    ['config', 'db/exercises', 'db/foods', 'db/weekly-plan', 'db/mental-phases', 'db/anatomy'],
    // Phase 3: Phase 2 + Utils + Store
    ['config', 'db/exercises', 'db/foods', 'db/weekly-plan', 'db/mental-phases', 'db/anatomy', 'utils', 'store'],
    // Phase 4: Phase 3 + UI + Components
    ['config', 'db/exercises', 'db/foods', 'db/weekly-plan', 'db/mental-phases', 'db/anatomy', 'utils', 'store', 'ui', 'components', 'video-player'],
    // Phase 5: Phase 4 + Renderers
    ['config', 'db/exercises', 'db/foods', 'db/weekly-plan', 'db/mental-phases', 'db/anatomy', 'utils', 'store', 'ui', 'components', 'video-player', 'renderers/dashboard', 'renderers/training', 'renderers/nutrition', 'renderers/progress', 'renderers/anatomy', 'renderers/mental'],
    // Phase 6: Full - Phase 5 + Actions + App
    ['config', 'db/exercises', 'db/foods', 'db/weekly-plan', 'db/mental-phases', 'db/anatomy', 'utils', 'store', 'ui', 'components', 'video-player', 'renderers/dashboard', 'renderers/training', 'renderers/nutrition', 'renderers/progress', 'renderers/anatomy', 'renderers/mental', 'actions', 'app']
];

const phaseIndex = parseInt(TEST_PHASE) - 1;
const modulesToInclude = allModules[phaseIndex] || allModules[0];

console.log(`📋 TEST PHASE ${TEST_PHASE}: Including ${modulesToInclude.length} modules\n`);

modulesToInclude.forEach(name => {
    const filePath = path.join(srcDir, 'js', `${name}.js`);
    if (fs.existsSync(filePath)) {
        js += `// ============================================\n`;
        js += `// ${name}.js\n`;
        js += `// ============================================\n`;
        js += fs.readFileSync(filePath, 'utf8') + '\n\n';
        console.log(`  ✅ ${name}.js`);
    } else {
        console.log(`  ⚠️ ${name}.js (not found)`);
    }
});

// Add phase completion log
js += `\nconsole.log("=== DIAGNOSTIC: Phase ${TEST_PHASE} completed successfully! ===");\n`;

// Read template and inject
const templatePath = path.join(srcDir, 'index.html');
let html = fs.readFileSync(templatePath, 'utf8');
html = html.replace('/* CSS_PLACEHOLDER */', css);
html = html.replace('/* JS_PLACEHOLDER */', js);

// Write output
const outputPath = path.join(distDir, 'index.html');
fs.writeFileSync(outputPath, html, 'utf8');

console.log(`\n✅ Diagnostic build complete (Phase ${TEST_PHASE})`);
console.log(`📁 Output: dist/index.html`);
console.log(`📦 Size: ${(html.length / 1024).toFixed(2)} KB`);
console.log(`\n📌 TEST INSTRUCTIONS:`);
console.log(`   1. Open dist/index.html in browser`);
console.log(`   2. Open DevTools Console (F12)`);
console.log(`   3. Look for "DIAGNOSTIC" messages`);
console.log(`   4. If Phase ${TEST_PHASE} completes, run: TEST_PHASE=${parseInt(TEST_PHASE) + 1} node src/build-test.js`);
