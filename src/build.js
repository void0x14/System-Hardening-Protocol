// build.js - System Hardening Protocol Build Script
// Combines modular JS files and injects into template.html

const fs = require('fs');
const path = require('path');

console.log('🔨 Building System Hardening Protocol v8.3.1...\n');

const srcDir = __dirname;
const distDir = path.join(srcDir, '..', 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// JavaScript files in dependency order
const jsFiles = [
    // Layer 1: Config & Data (no dependencies)
    'config',
    'db/exercises',
    'db/foods',
    'db/weekly-plan',
    'db/mental-phases',
    'db/anatomy',

    // Layer 2: Utilities (no dependencies)
    'utils',

    // Layer 3: Business Logic (depends on utils)
    'store',

    // Layer 4: UI (depends on store)
    'ui',
    'components',
    'video-player',
    'stealth',

    // Layer 5: Renderers (all consolidated in dashboard.js)
    'renderers/dashboard',
    // NOTE: training, nutrition, progress, anatomy, mental were empty stubs
    // All render logic is in dashboard.js

    // Layer 6: Actions (depends on everything)
    'actions',

    // Layer 7: Bootstrap (depends on actions)
    'app'
];

let js = '';

jsFiles.forEach(name => {
    const filePath = path.join(srcDir, 'js', `${name}.js`);
    if (fs.existsSync(filePath)) {
        js += `// ============================================\n`;
        js += `// ${name}.js\n`;
        js += `// ============================================\n`;
        js += fs.readFileSync(filePath, 'utf8') + '\n\n';
        console.log(`  ✅ js/${name}.js`);
    } else {
        console.log(`  ⚠️ js/${name}.js (not found, skipping)`);
    }
});

console.log(`\n📦 JavaScript bundled: ${jsFiles.length} files\n`);

// Read HTML template (contains all HTML and CSS already)
const templatePath = path.join(srcDir, 'template.html');
if (!fs.existsSync(templatePath)) {
    console.error('❌ template.html not found!');
    process.exit(1);
}

let html = fs.readFileSync(templatePath, 'utf8');

// Replace JS placeholder only
html = html.replace('/* JS_PLACEHOLDER */', js);

// Write to dist
const outputPath = path.join(distDir, 'index.html');
fs.writeFileSync(outputPath, html, 'utf8');

// Summary
const sizeKB = (html.length / 1024).toFixed(2);
console.log('─'.repeat(50));
console.log(`✅ Build complete!`);
console.log(`📁 Output: dist/index.html`);
console.log(`📦 Size: ${sizeKB} KB`);
console.log('─'.repeat(50));
