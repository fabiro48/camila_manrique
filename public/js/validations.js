/**
 * public/js/validations.js
 * Vanilla JavaScript form validation utilities.
 * Provides reusable validation functions for front-end form validation.
 * Requirements: 7.1-7.4, 8.1-8.3, 9.1-9.4
 */

// ---------------------------------------------------------------------------
// DOM Helpers: show / clear field errors
// ---------------------------------------------------------------------------

/**
 * Shows an error message in the .error-msg element within the field's
 * form-group parent and adds a red border to the input.
 * @param {HTMLElement} field - The input element that failed validation
 * @param {string} message  - The error message to display
 */
function showFieldError(field, message) {
    var formGroup = field.closest('.form-group');
    if (!formGroup) return;

    var errorDiv = formGroup.querySelector('.error-msg');
    if (errorDiv) {
        errorDiv.textContent = message;
    }

    field.style.borderColor = '#e11d48';
}

/**
 * Clears the error message from the .error-msg element within the field's
 * form-group parent and removes the red border from the input.
 * @param {HTMLElement} field - The input element to clear errors from
 */
function clearFieldError(field) {
    var formGroup = field.closest('.form-group');
    if (!formGroup) return;

    var errorDiv = formGroup.querySelector('.error-msg');
    if (errorDiv) {
        errorDiv.textContent = '';
    }

    field.style.borderColor = '';
}

// ---------------------------------------------------------------------------
// Field validation engine
// ---------------------------------------------------------------------------

/**
 * Runs an array of validation rules against a field's value.
 * Each rule is a function that receives the trimmed value and returns
 * an error message string if invalid, or null/undefined if valid.
 * Stops at the first failing rule.
 * @param {HTMLElement} field - The input element to validate
 * @param {Function[]} rules - Array of rule functions (value) => string | null
 * @returns {boolean} true if all rules pass, false if any fail
 */
function validateField(field, rules) {
    var value = field.value.trim();

    for (var i = 0; i < rules.length; i++) {
        var result = rules[i](value, field);
        if (result) {
            showFieldError(field, result);
            return false;
        }
    }

    clearFieldError(field);
    return true;
}

// ---------------------------------------------------------------------------
// Submit button toggle
// ---------------------------------------------------------------------------

/**
 * Enables or disables the submit button of a form based on whether
 * there are active validation errors.
 * @param {HTMLFormElement} form - The form element
 * @param {boolean} hasErrors - Whether there are active validation errors
 */
function toggleSubmit(form, hasErrors) {
    var submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    submitBtn.disabled = hasErrors;
    if (hasErrors) {
        submitBtn.style.opacity = '0.5';
        submitBtn.style.cursor = 'not-allowed';
    } else {
        submitBtn.style.opacity = '';
        submitBtn.style.cursor = '';
    }
}

// ---------------------------------------------------------------------------
// Built-in validators
// ---------------------------------------------------------------------------

/**
 * Validates that a value is not empty.
 * @param {string} value - The trimmed input value
 * @returns {string|null} Error message if empty, null if valid
 */
function required(value) {
    if (!value || value.length === 0) {
        return 'Este campo es obligatorio.';
    }
    return null;
}

/**
 * Factory: returns a rule function that validates minimum length.
 * @param {number} n - Minimum number of characters
 * @returns {Function} (value) => string | null
 */
function minLength(n) {
    return function (value) {
        if (value.length < n) {
            return 'Debe tener al menos ' + n + ' caracteres.';
        }
        return null;
    };
}

/**
 * Validates email format using a regex pattern.
 * @param {string} value - The trimmed input value
 * @returns {string|null} Error message if invalid, null if valid
 */
function email(value) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        return 'Debe ingresar un correo electrónico válido.';
    }
    return null;
}

/**
 * Factory: returns a rule function that validates the extension of a
 * file input against an allowed list. Only runs when the field is a
 * file input and a file is selected.
 * @param {string[]} allowedExts - Allowed extensions (without dot), e.g. ['jpg','jpeg','png','gif']
 * @returns {Function} (value, field) => string | null
 */
function fileExtension(allowedExts) {
    var lowerExts = allowedExts.map(function (e) { return e.toLowerCase(); });

    return function (value, field) {
        if (field.type !== 'file') return null;
        if (!field.files || field.files.length === 0) return null;

        var fileName = field.files[0].name;
        var ext = fileName.split('.').pop().toLowerCase();

        if (lowerExts.indexOf(ext) === -1) {
            return 'El archivo debe ser uno de los siguientes formatos: ' + allowedExts.join(', ') + '.';
        }
        return null;
    };
}

// ---------------------------------------------------------------------------
// Form validation tracker
// ---------------------------------------------------------------------------

/**
 * Creates a validation tracker for a form. Tracks which fields have
 * errors and calls toggleSubmit whenever the error state changes.
 * @param {HTMLFormElement} form - The form element to track
 * @returns {Object} Tracker with set/clear/check methods
 */
function createErrorTracker(form) {
    var errorFields = {};

    return {
        setError: function (fieldName) {
            errorFields[fieldName] = true;
            toggleSubmit(form, true);
        },
        clearError: function (fieldName) {
            delete errorFields[fieldName];
            var hasErrors = Object.keys(errorFields).length > 0;
            toggleSubmit(form, hasErrors);
        },
        hasErrors: function () {
            return Object.keys(errorFields).length > 0;
        }
    };
}

/**
 * Sets up validation for a single field. Attaches blur and input event
 * listeners and updates the error tracker accordingly.
 * @param {HTMLFormElement} form - The parent form
 * @param {string} fieldId - The id of the field element
 * @param {Function[]} rules - Validation rules for this field
 * @param {Object} tracker - Error tracker created by createErrorTracker
 * @param {boolean} validateOnInput - If true, validate on input (default: true)
 */
function setupFieldValidation(form, fieldId, rules, tracker, validateOnInput) {
    var field = form.querySelector('#' + fieldId);
    if (!field) return;

    function runValidation() {
        var isValid = validateField(field, rules);
        if (isValid) {
            tracker.clearError(fieldId);
        } else {
            tracker.setError(fieldId);
        }
    }

    field.addEventListener('blur', runValidation);

    if (validateOnInput !== false) {
        field.addEventListener('input', runValidation);
    }
}

// ---------------------------------------------------------------------------
// Form initializers — run on DOMContentLoaded
// ---------------------------------------------------------------------------

/**
 * Sets up validation for the register form (#registerForm).
 * Validates: nombre (min 2), apellido (min 2), email (format),
 * password (min 8), confirmPassword (match), image (extension).
 */
function initRegisterForm() {
    var form = document.getElementById('registerForm');
    if (!form) return;

    var tracker = createErrorTracker(form);

    // nombre — required, min 2
    setupFieldValidation(form, 'nombre', [
        required,
        minLength(2)
    ], tracker);

    // apellido — required, min 2
    setupFieldValidation(form, 'apellido', [
        required,
        minLength(2)
    ], tracker);

    // email — required, format
    setupFieldValidation(form, 'email', [
        required,
        email
    ], tracker);

    // password — required, min 8
    setupFieldValidation(form, 'password', [
        required,
        minLength(8)
    ], tracker);

    // confirmPassword — must match password
    var confirmField = form.querySelector('#confirmPassword');
    if (confirmField) {
        function validateConfirm() {
            var passwordField = form.querySelector('#password');
            var value = confirmField.value.trim();
            if (!value) {
                showFieldError(confirmField, 'Este campo es obligatorio.');
                tracker.setError('confirmPassword');
                return;
            }
            if (passwordField && value !== passwordField.value.trim()) {
                showFieldError(confirmField, 'Las contraseñas no coinciden.');
                tracker.setError('confirmPassword');
                return;
            }
            clearFieldError(confirmField);
            tracker.clearError('confirmPassword');
        }
        confirmField.addEventListener('blur', validateConfirm);
        confirmField.addEventListener('input', validateConfirm);
    }

    // image — file extension (JPG, JPEG, PNG, GIF)
    setupFieldValidation(form, 'image', [
        fileExtension(['jpg', 'jpeg', 'png', 'gif'])
    ], tracker);
}

/**
 * Sets up validation for the login form (#loginForm).
 * Validates: email (format), password (not empty).
 */
function initLoginForm() {
    var form = document.getElementById('loginForm');
    if (!form) return;

    var tracker = createErrorTracker(form);

    // email — required, format
    setupFieldValidation(form, 'email', [
        required,
        email
    ], tracker);

    // password — required (not empty)
    setupFieldValidation(form, 'password', [
        required
    ], tracker);
}

/**
 * Sets up validation for the product form (#productForm).
 * Validates: name (min 5), description (min 20), price (> 0),
 * image/imagen (extension if file input).
 */
function initProductForm() {
    var form = document.getElementById('productForm');
    if (!form) return;

    var tracker = createErrorTracker(form);

    // name — required, min 5
    setupFieldValidation(form, 'name', [
        required,
        minLength(5)
    ], tracker);

    // description — required, min 20
    setupFieldValidation(form, 'description', [
        required,
        minLength(20)
    ], tracker);

    // price — required, must be > 0
    var priceField = form.querySelector('#price');
    if (priceField) {
        function validatePrice() {
            var value = priceField.value.trim();
            if (!value) {
                showFieldError(priceField, 'El precio es obligatorio.');
                tracker.setError('price');
                return;
            }
            if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
                showFieldError(priceField, 'El precio debe ser mayor a 0.');
                tracker.setError('price');
                return;
            }
            clearFieldError(priceField);
            tracker.clearError('price');
        }
        priceField.addEventListener('blur', validatePrice);
        priceField.addEventListener('input', validatePrice);
    }

    // image/imagen — file extension if it's a file input
    var imageField = form.querySelector('#image') || form.querySelector('#imagen');
    if (imageField && imageField.type === 'file') {
        setupFieldValidation(form, imageField.id, [
            fileExtension(['jpg', 'jpeg', 'png', 'gif'])
        ], tracker);
    }
}

// ---------------------------------------------------------------------------
// Initialize on DOMContentLoaded
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    initRegisterForm();
    initLoginForm();
    initProductForm();
});
