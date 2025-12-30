// build-test-single.js - Test single module
const fs = require('fs');
const path = require('path');

console.log('🔬 SINGLE MODULE TEST...\n');

const srcDir = __dirname;
const distDir = path.join(srcDir, '..', 'dist');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// CSS
const cssFiles = ['base', 'components', 'animations', 'overrides'];
let css = '';
cssFiles.forEach(name => {
    const filePath = path.join(srcDir, 'styles', `${name}.css`);
    if (fs.existsSync(filePath)) {
        css += fs.readFileSync(filePath, 'utf8') + '\n';
    }
});

// JS - Just config + exercises.js
let js = '';
js += `console.log("=== TEST START ===");\n\n`;

// Config
js += fs.readFileSync(path.join(srcDir, 'js', 'config.js'), 'utf8') + '\n\n';
console.log('  ✅ config.js');

js += `console.log("=== AFTER CONFIG ===");\n\n`;

// Exercises
js += fs.readFileSync(path.join(srcDir, 'js', 'db', 'exercises.js'), 'utf8') + '\n\n';
console.log('  ✅ db/exercises.js');

js += `console.log("=== AFTER EXERCISES ===");\n`;
js += `console.log("[TEST] Exercises count:", Object.keys(DB.EXERCISES).length);\n`;
js += `console.log("[TEST] Foods count:", DB.FOODS.length);\n`;
js += `console.log("=== TEST COMPLETE ===");\n`;

// Build
const templatePath = path.join(srcDir, 'index.html');
let html = fs.readFileSync(templatePath, 'utf8');
html = html.replace('/* CSS_PLACEHOLDER */', css);
html = html.replace('/* JS_PLACEHOLDER */', js);

const outputPath = path.join(distDir, 'index.html');
fs.writeFileSync(outputPath, html, 'utf8');

console.log(`\n✅ Single module test build complete`);
console.log(`📁 Output: dist/index.html (${(html.length / 1024).toFixed(2)} KB)`);
