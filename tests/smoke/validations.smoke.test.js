/**
 * Smoke tests for Sprint 7 — Validaciones de Formularios
 *
 * Verifies that the required validation infrastructure exists:
 *   1. express-validator is listed in package.json dependencies
 *   2. middlewares/validations/userValidations.js exists
 *   3. middlewares/validations/productValidations.js exists
 *   4. public/js/validations.js exists
 *
 * Requirements: 2.1, 2.2, 2.3
 *
 * Run with: node tests/smoke/validations.smoke.test.js
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PROJECT_ROOT = path.join(__dirname, '..', '..');

function fileExists(relativePath) {
    const fullPath = path.join(PROJECT_ROOT, relativePath);
    return fs.existsSync(fullPath) && fs.statSync(fullPath).isFile();
}

// ─── Test runner ─────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log('  \u2713 ' + name);
        passed++;
    } catch (err) {
        console.log('  \u2717 ' + name);
        console.log('    ' + err.message);
        failed++;
    }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

console.log('\nSmoke Tests — Sprint 7 Validations\n');

// Requirement 2.1: express-validator en package.json
test('express-validator should be listed in package.json dependencies', () => {
    const pkgPath = path.join(PROJECT_ROOT, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    assert.ok(
        pkg.dependencies && pkg.dependencies['express-validator'],
        'express-validator is not listed in package.json dependencies'
    );
});

// Requirement 2.2: middlewares/validations/userValidations.js exists
test('middlewares/validations/userValidations.js should exist', () => {
    assert.ok(
        fileExists('middlewares/validations/userValidations.js'),
        'middlewares/validations/userValidations.js does not exist'
    );
});

// Requirement 2.2: middlewares/validations/productValidations.js exists
test('middlewares/validations/productValidations.js should exist', () => {
    assert.ok(
        fileExists('middlewares/validations/productValidations.js'),
        'middlewares/validations/productValidations.js does not exist'
    );
});

// Requirement 2.3: public/js/validations.js exists
test('public/js/validations.js should exist', () => {
    assert.ok(
        fileExists('public/js/validations.js'),
        'public/js/validations.js does not exist'
    );
});

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log('\n' + passed + ' passed, ' + failed + ' failed\n');

if (failed > 0) {
    process.exit(1);
}
