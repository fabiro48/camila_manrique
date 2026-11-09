# Design Document — Sprint 7: Validaciones de Formularios

## Overview

Este sprint implementa validaciones de formularios en dos capas: back-end con `express-validator` (validación de servidor, fuente de verdad) y front-end con JavaScript vanilla (validación de cliente, mejora de UX). Las validaciones back-end son obligatorias — nunca se puede confiar solo en el front-end. Las validaciones front-end son un complemento para evitar envíos innecesarios y dar feedback inmediato.

El stack técnico:

- **Runtime**: Node.js + Express (CommonJS)
- **ORM**: Sequelize 6 con MySQL
- **Validación back-end**: `express-validator` (basado en `validator.js`)
- **Validación front-end**: JavaScript vanilla (sin librerías externas)
- **Plantillas**: EJS

---

## Architecture

### Diagrama de flujo de validación

```
Cliente (navegador)
  │
  ├── JS vanilla valida en tiempo real (UX)
  │     └── Si hay errores → muestra mensajes, bloquea submit
  │
  ▼
POST /users/register (Express)
  │
  ├── express-validator (middleware de ruta)
  │     ├── body('nombre').notEmpty().isLength({ min: 2 })
  │     ├── body('email').isEmail().custom(async ...)
  │     └── body('password').isLength({ min: 8 })
  │
  ├── validationResult(req) → ¿hay errores?
  │     ├── Sí → render('register', { errors, oldData })
  │     └── No → usersController.store()
  │
  ▼
Sequelize → MySQL (persistencia)
```

### Estructura de archivos nueva

```
proyecto/
├── middlewares/
│   └── validations/
│       ├── userValidations.js     ← Reglas para registro y login
│       └── productValidations.js  ← Reglas para create y edit de productos
├── controllers/
│   ├── usersController.js         ← Modificado: usa validationResult, repuebla oldData
│   └── productsController.js      ← Modificado: usa validationResult, repuebla oldData
├── routes/
│   ├── users.js                   ← Modificado: aplica validaciones antes del controller
│   └── products.js                ← Modificado: aplica validaciones antes del controller
├── views/
│   ├── users/
│   │   ├── register.ejs           ← Modificado: repuebla oldData, incluye script JS
│   │   └── login.ejs              ← Modificado: incluye script JS
│   └── products/
│       ├── createProduct.ejs      ← Modificado: repuebla oldData, incluye script JS
│       └── editProduct.ejs        ← Modificado: repuebla oldData, incluye script JS
└── public/
    └── js/
        └── validations.js         ← Nuevo: validaciones front-end reutilizables
```

---

## Components and Interfaces

### `middlewares/validations/userValidations.js`

```js
const { body } = require('express-validator');
const path = require('path');
const { User } = require('../../database/models');

const registerValidations = [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.'),

    body('apellido')
        .notEmpty().withMessage('El apellido es obligatorio.')
        .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres.'),

    body('email')
        .notEmpty().withMessage('El correo electrónico es obligatorio.')
        .isEmail().withMessage('Debe ingresar un correo electrónico válido.')
        .custom(async (value) => {
            const existing = await User.findOne({ where: { email: value } });
            if (existing) throw new Error('Ya existe una cuenta con este correo electrónico.');
            return true;
        }),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria.')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.'),

    body('imagen').custom((value, { req }) => {
        if (!req.file) return true; // Imagen opcional
        const allowed = /jpeg|jpg|png|gif/;
        const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '');
        const mime = req.file.mimetype.split('/')[1];
        if (!allowed.test(ext) || !allowed.test(mime)) {
            throw new Error('La imagen debe ser JPG, JPEG, PNG o GIF.');
        }
        return true;
    })
];

const loginValidations = [
    body('email')
        .notEmpty().withMessage('El correo electrónico es obligatorio.')
        .isEmail().withMessage('Debe ingresar un correo electrónico válido.'),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria.')
];

module.exports = { registerValidations, loginValidations };
```

### `middlewares/validations/productValidations.js`

```js
const { body } = require('express-validator');
const path = require('path');

const productValidations = [
    body('nombre')
        .notEmpty().withMessage('El nombre del producto es obligatorio.')
        .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres.'),

    body('descripcion')
        .isLength({ min: 20 }).withMessage('La descripción debe tener al menos 20 caracteres.'),

    body('precio')
        .notEmpty().withMessage('El precio es obligatorio.')
        .isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor a 0.'),

    body('imagen').custom((value, { req }) => {
        if (!req.file) return true; // Imagen opcional en edición
        const allowed = /jpeg|jpg|png|gif/;
        const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '');
        const mime = req.file.mimetype.split('/')[1];
        if (!allowed.test(ext) || !allowed.test(mime)) {
            throw new Error('La imagen debe ser JPG, JPEG, PNG o GIF.');
        }
        return true;
    })
];

module.exports = { productValidations };
```

### Integración en `routes/users.js`

```js
const { registerValidations, loginValidations } = require('../middlewares/validations/userValidations');

// POST /users/register — con validación
router.post('/register', guestOnly, upload.single('imagen'), registerValidations, usersController.store);

// POST /users/login — con validación
router.post('/login', guestOnly, loginValidations, usersController.authenticate);
```

### Integración en `routes/products.js`

```js
const { productValidations } = require('../middlewares/validations/productValidations');
const upload = require('../middlewares/upload'); // Si se usa multer para productos

// POST /products — con validación
router.post('/', upload.single('imagen'), productValidations, productsController.store);

// PUT /products/:id — con validación
router.put('/:id', upload.single('imagen'), productValidations, productsController.update);
```

### Patrón en controladores: `validationResult`

```js
const { validationResult } = require('express-validator');

// Ejemplo en usersController.store
async store(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('users/register', {
            errors: errors.array(),
            oldData: req.body
        });
    }
    // ... resto del controlador (crear usuario)
}
```

### Repoblación en vistas EJS — `register.ejs`

```html
<input type="text" id="nombre" name="nombre"
    value="<%= oldData ? oldData.nombre : '' %>"
    placeholder="Ej: Laura Martínez" required>
```

### Validaciones front-end — `public/js/validations.js`

Script vanilla que:
1. Se ejecuta en `DOMContentLoaded`
2. Detecta qué formulario está activo por su `id`
3. Valida cada campo en el evento `input` / `blur`
4. Muestra/oculta mensajes de error en un `<div class="error-msg">` debajo de cada campo
5. Habilita/deshabilita el botón de submit según haya errores o no

```js
// Ejemplo simplificado
function validateField(field, rules) {
    const value = field.value.trim();
    for (const rule of rules) {
        const result = rule(value);
        if (result) {
            showFieldError(field, result);
            return false;
        }
    }
    clearFieldError(field);
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    if (!form) return;
    // ... validaciones por campo
});
```

---

## Data Models

No hay cambios en los modelos Sequelize del Sprint 6. Las validaciones operan sobre los campos existentes:

- **User**: `nombre`, `apellido`, `email`, `password`, `imagen`
- **Product**: `nombre`, `descripcion`, `precio`, `imagen`, `categoryId`

---

## Error Handling

### Errores de validación back-end

| Origen | Error | Manejo |
|---|---|---|
| `express-validator` | Campo vacío, formato inválido, longitud insuficiente | `validationResult` captura errores → render con `errors` y `oldData` |
| Custom validator | Email duplicado en BD | Lanza `Error` con mensaje → capturado por `validationResult` |
| Custom validator | Extensión de imagen inválida | Lanza `Error` con mensaje → capturado por `validationResult` |
| Controlador | `SequelizeUniqueConstraintError` (race condition) | Catch → render con error genérico |

### Errores de validación front-end

| Origen | Error | Manejo |
|---|---|---|
| JS vanilla | Campo vacío, formato inválido | `showFieldError()` muestra mensaje en DOM |
| JS vanilla | Extensión de imagen inválida | `showFieldError()` en el campo file |
| JS vanilla | Contraseñas no coinciden | `showFieldError()` en `confirmPassword` |

---

## Testing Strategy

### Tests unitarios

| Módulo | Qué testear | Tipo |
|---|---|---|
| `userValidations.js` | Reglas de validación exportadas correctamente | Unit |
| `productValidations.js` | Reglas de validación exportadas correctamente | Unit |
| `validationResult` | Captura errores cuando los datos son inválidos | Unit |
| `validationResult` | No captura errores cuando los datos son válidos | Unit |

### Tests de integración

| Módulo | Qué testear | Tipo |
|---|---|---|
| `POST /users/register` | Email duplicado retorna error de validación | Integration |
| `POST /users/register` | Datos válidos crean usuario correctamente | Integration |
| `POST /users/login` | Email inválido retorna error de validación | Integration |
| `POST /products` | Nombre < 5 caracteres retorna error | Integration |
| `PUT /products/:id` | Descripción < 20 caracteres retorna error | Integration |

### Smoke tests

| Test | Tipo |
|---|---|
| `express-validator` está en `package.json` | Smoke |
| `middlewares/validations/` existe con sus archivos | Smoke |
| `public/js/validations.js` existe | Smoke |
