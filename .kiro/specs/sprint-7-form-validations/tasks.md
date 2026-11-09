# Implementation Plan: Sprint 7 — Validaciones de Formularios

## Overview

Implementación de validaciones en dos capas: back-end con `express-validator` (middleware de ruta, fuente de verdad) y front-end con JavaScript vanilla (UX, feedback inmediato). El sprint respeta el orden: instalación → validaciones back-end → integración en rutas → modificación de controladores → repoblación de vistas → validaciones front-end → retrospectiva.

## Tasks

- [x] 1. Instalar express-validator y crear estructura de validaciones
  - [x] 1.1 Instalar `express-validator` como dependencia de producción
    - Ejecutar `npm install express-validator`
    - Verificar que aparece en `package.json` bajo `dependencies`
    - _Requirements: 2.1_
  - [x] 1.2 Crear `middlewares/validations/userValidations.js`
    - Exportar `registerValidations` (array de middlewares con `body()`)
    - Exportar `loginValidations` (array de middlewares con `body()`)
    - Registro: validar `nombre` (notEmpty, min 2), `apellido` (notEmpty, min 2), `email` (isEmail + custom async uniqueness), `password` (notEmpty, min 8), `imagen` (custom validator de extensión)
    - Login: validar `email` (notEmpty, isEmail), `password` (notEmpty)
    - _Requirements: 3.1-3.5, 4.1-4.2_
  - [x] 1.3 Crear `middlewares/validations/productValidations.js`
    - Exportar `productValidations` (array de middlewares con `body()`)
    - Validar `nombre` (notEmpty, min 5), `descripcion` (min 20), `precio` (isFloat min 0.01), `imagen` (custom validator de extensión)
    - _Requirements: 5.1-5.4, 6.1_

- [x] 2. Integrar validaciones en rutas
  - [x] 2.1 Modificar `routes/users.js`
    - Importar `registerValidations` y `loginValidations` desde `../middlewares/validations/userValidations`
    - Aplicar `registerValidations` en `POST /users/register` después de `upload.single('imagen')` y antes de `usersController.store`
    - Aplicar `loginValidations` en `POST /users/login` antes de `usersController.authenticate`
    - NO cambiar URLs ni métodos HTTP existentes
    - _Requirements: 11.1, 11.2, 11.5_
  - [x] 2.2 Modificar `routes/products.js`
    - Importar `productValidations` desde `../middlewares/validations/productValidations`
    - Aplicar `productValidations` en `POST /products` antes de `productsController.store`
    - Aplicar `productValidations` en `PUT /products/:id` antes de `productsController.update`
    - NO cambiar URLs ni métodos HTTP existentes
    - _Requirements: 11.3, 11.4, 11.5_

- [x] 3. Modificar controladores para usar validationResult
  - [x] 3.1 Modificar `usersController.store` (registro)
    - Importar `validationResult` desde `express-validator`
    - Al inicio del método, capturar `const errors = validationResult(req)`
    - Si `!errors.isEmpty()`, renderizar `users/register` con `errors: errors.array()` y `oldData: req.body`
    - Si pasa la validación, continuar con la lógica existente (crear usuario, auto-login)
    - _Requirements: 3.6, 3.7, 10.1_
  - [x] 3.2 Modificar `usersController.authenticate` (login)
    - Importar `validationResult` desde `express-validator`
    - Al inicio del método, capturar `const errors = validationResult(req)`
    - Si `!errors.isEmpty()`, renderizar `users/login` con `errors: errors.array()` y `oldData: req.body`
    - Si pasa la validación, continuar con la lógica existente
    - _Requirements: 4.3, 4.4_
  - [x] 3.3 Modificar `productsController.store` (creación)
    - Importar `validationResult` desde `express-validator`
    - Al inicio del método, capturar `const errors = validationResult(req)`
    - Si `!errors.isEmpty()`, renderizar `products/createProduct` con `errors: errors.array()`, `oldData: req.body` y `categories`
    - Si pasa la validación, continuar con la lógica existente
    - _Requirements: 5.5, 5.6, 10.2_
  - [x] 3.4 Modificar `productsController.update` (edición)
    - Importar `validationResult` desde `express-validator`
    - Al inicio del método, capturar `const errors = validationResult(req)`
    - Si `!errors.isEmpty()`, renderizar `products/editProduct` con `errors: errors.array()`, `oldData: req.body`, `product` y `categories`
    - Si pasa la validación, continuar con la lógica existente
    - _Requirements: 6.2, 6.3, 10.3_

- [x] 4. Actualizar vistas para repoblación y errores de validación
  - [x] 4.1 Actualizar `views/users/register.ejs`
    - Repoblar campos `nombre` y `email` con `oldData` cuando exista
    - Mostrar errores de validación de `express-validator` (formato `errors.array()`) además de los existentes
    - Agregar `id="registerForm"` al form para el script JS
    - Agregar `<div class="error-msg">` debajo de cada campo para errores de JS
    - _Requirements: 10.1, 7.1_
  - [x] 4.2 Actualizar `views/users/login.ejs`
    - Repoblar campo `email` con `oldData` cuando exista
    - Mostrar errores de `express-validator` además de los existentes
    - Agregar `id="loginForm"` al form
    - Agregar `<div class="error-msg">` debajo de cada campo
    - _Requirements: 8.1_
  - [x] 4.3 Actualizar `views/products/createProduct.ejs`
    - Repoblar todos los campos con `oldData` cuando exista
    - Mostrar errores de `express-validator`
    - Agregar `id="productForm"` al form
    - Agregar `<div class="error-msg">` debajo de cada campo
    - _Requirements: 10.2, 9.1_
  - [x] 4.4 Actualizar `views/products/editProduct.ejs`
    - Repoblar campos con `oldData` cuando exista (fallback a `product`)
    - Mostrar errores de `express-validator`
    - Agregar `id="productForm"` al form
    - Agregar `<div class="error-msg">` debajo de cada campo
    - _Requirements: 10.3, 9.2_

- [x] 5. Validaciones de Front-end (JavaScript vanilla)
  - [x] 5.1 Crear `public/js/validations.js`
    - Función `showFieldError(field, message)` que muestra mensaje en `.error-msg` del campo
    - Función `clearFieldError(field)` que oculta el mensaje
    - Función `validateField(field, rules)` que ejecuta array de reglas
    - Función `toggleSubmit(form, hasErrors)` que habilita/deshabilita el botón
    - Validador de email (regex), longitud mínima, no vacío, tipo de archivo
    - _Requirements: 7.1-7.4, 8.1-8.3, 9.1-9.4_
  - [x] 5.2 Agregar validación JS a `register.ejs`
    - Incluir `<script src="/js/validations.js"></script>` antes de `</body>`
    - Validar en `blur` e `input`: nombre (min 2), email (formato), password (min 8), confirmPassword (coincidencia), imagen (extensión)
    - Deshabilitar submit si hay errores
    - _Requirements: 7.1-7.4_
  - [x] 5.3 Agregar validación JS a `login.ejs`
    - Incluir `<script src="/js/validations.js"></script>`
    - Validar en `blur` e `input`: email (formato), password (no vacío)
    - Deshabilitar submit si hay errores
    - _Requirements: 8.1-8.3_
  - [x] 5.4 Agregar validación JS a `createProduct.ejs`
    - Incluir `<script src="/js/validations.js"></script>`
    - Validar: nombre (min 5), descripcion (min 20), precio (mayor a 0), imagen (extensión)
    - Deshabilitar submit si hay errores
    - _Requirements: 9.1, 9.3, 9.4_
  - [x] 5.5 Agregar validación JS a `editProduct.ejs`
    - Incluir `<script src="/js/validations.js"></script>`
    - Mismas validaciones que createProduct
    - _Requirements: 9.2-9.4_

- [x] 6. Checkpoint — Verificar validaciones back-end
  - Probar registro con datos inválidos (nombre corto, email mal formato, password corto)
  - Probar registro con email ya existente
  - Probar login con email inválido
  - Probar creación de producto con nombre < 5 caracteres y descripcion < 20
  - Verificar repoblación de formularios (oldData) al fallar la validación
  - Preguntar al usuario si hay algún inconveniente

- [x] 7. Checkpoint — Verificar validaciones front-end
  - Abrir formularios en el navegador y verificar feedback en tiempo real
  - Verificar que el botón de submit se deshabilita con errores
  - Verificar validación de tipo de imagen en el navegador
  - Preguntar al usuario si hay algún inconveniente

- [x] 8. Retrospectiva Sprint 7
  - [x] 8.1 Actualizar `retro.md` con sección Sprint 7
    - Agregar sección titulada `Retrospectiva Sprint 7 — Estrella de Mar`
    - Incluir las cinco dimensiones: `Start Doing`, `More of`, `Keep Doing`, `Less of`, `Stop Doing`
    - Mínimo 3 elementos por dimensión, relacionados con las validaciones back-end y front-end
    - Conservar las secciones de sprints anteriores sin modificarlas
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 9. Tests de humo y unitarios
  - [x] 9.1 Escribir smoke tests de validaciones
    - Verificar que `express-validator` está en `package.json`
    - Verificar que existen `middlewares/validations/userValidations.js` y `productValidations.js`
    - Verificar que existe `public/js/validations.js`
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 9.2 Escribir tests unitarios de las reglas de validación
    - Test: `registerValidations` es un array con al menos 5 elementos
    - Test: `loginValidations` es un array con al menos 2 elementos
    - Test: `productValidations` es un array con al menos 4 elementos
    - _Requirements: 3.1-3.5, 4.1-4.2, 5.1-5.4, 6.1_

- [x] 10. Checkpoint final — Todos los tests deben pasar
  - Ejecutar `npm test` y asegurar que todos los tests (Sprint 6 + Sprint 7) pasan
  - Verificar que la aplicación completa funciona con las validaciones activas
  - Preguntar al usuario si hay algún inconveniente antes de cerrar el sprint

## Notes

- Las rutas `routes/products.js` y `routes/users.js` NO cambian sus URLs ni métodos HTTP — solo se agregan middlewares de validación en la cadena
- `express-validator` es la fuente de verdad; las validaciones front-end son complementarias
- `oldData` se pasa solo cuando la validación falla (no en GET inicial)
- El campo `password` nunca se repuebla en `oldData` por seguridad
- El script `public/js/validations.js` es vanilla (sin dependencias externas)
- Los campos del formulario de registro usan `nombre` y `apellido` (no `name` solo) para alinear con el modelo Sequelize del Sprint 6

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["2.1", "2.2"] },
    { "id": 3, "tasks": ["3.1", "3.2", "3.3", "3.4"] },
    { "id": 4, "tasks": ["4.1", "4.2", "4.3", "4.4"] },
    { "id": 5, "tasks": ["5.1"] },
    { "id": 6, "tasks": ["5.2", "5.3", "5.4", "5.5"] },
    { "id": 7, "tasks": ["6"] },
    { "id": 8, "tasks": ["7"] },
    { "id": 9, "tasks": ["8.1"] },
    { "id": 10, "tasks": ["9.1", "9.2"] },
    { "id": 11, "tasks": ["10"] }
  ]
}
```
