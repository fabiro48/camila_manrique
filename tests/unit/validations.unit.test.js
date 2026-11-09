/**
 * Unit tests for Sprint 7 — Validaciones de Formularios
 *
 * Verifies that the validation rule arrays exist and contain the expected
 * number of middleware elements, and that each element is a usable
 * express-validator chain (function or object with a `run` method).
 *
 * Requirements: 3.1-3.5, 4.1-4.2, 5.1-5.4, 6.1
 *
 * Run with: node tests/unit/validations.unit.test.js
 */

const assert = require('assert');
const { registerValidations, loginValidations } = require('../../middlewares/validations/userValidations');
const { productValidations } = require('../../middlewares/validations/productValidations');

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * express-validator chains are created by body() and returned as functions
 * decorated with additional methods. They are typeof 'function' and also
 * expose a `.run` method. Either check is sufficient to confirm the element
 * is a valid middleware.
 */
function isMiddleware(element) {
    return typeof element === 'function' || (element && typeof element.run === 'function');
}

function allAreMiddlewares(arr) {
    return arr.every(isMiddleware);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

console.log('\nUnit Tests — Sprint 7 Validations\n');

// Register validations — Requirements 3.1-3.5
test('registerValidations should be an array with at least 5 elements', () => {
    assert.ok(Array.isArray(registerValidations), 'registerValidations is not an array');
    assert.ok(registerValidations.length >= 5,
        'registerValidations has ' + registerValidations.length + ' elements, expected at least 5');
});

test('registerValidations elements should all be valid middleware chains', () => {
    assert.ok(allAreMiddlewares(registerValidations),
        'At least one element of registerValidations is not a valid middleware chain');
});

// Login validations — Requirements 4.1-4.2
test('loginValidations should be an array with at least 2 elements', () => {
    assert.ok(Array.isArray(loginValidations), 'loginValidations is not an array');
    assert.ok(loginValidations.length >= 2,
        'loginValidations has ' + loginValidations.length + ' elements, expected at least 2');
});

test('loginValidations elements should all be valid middleware chains', () => {
    assert.ok(allAreMiddlewares(loginValidations),
        'At least one element of loginValidations is not a valid middleware chain');
});

// Product validations — Requirements 5.1-5.4, 6.1
test('productValidations should be an array with at least 4 elements', () => {
    assert.ok(Array.isArray(productValidations), 'productValidations is not an array');
    assert.ok(productValidations.length >= 4,
        'productValidations has ' + productValidations.length + ' elements, expected at least 4');
});

test('productValidations elements should all be valid middleware chains', () => {
    assert.ok(allAreMiddlewares(productValidations),
        'At least one element of productValidations is not a valid middleware chain');
});

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log('\n' + passed + ' passed, ' + failed + ' failed\n');

if (failed > 0) {
    process.exit(1);
}
