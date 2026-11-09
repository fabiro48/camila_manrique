# Requirements Document — Sprint 7: Validaciones de Formularios

## Introduction

Sprint 7 del proyecto integrador "Camila Manrique" — tienda online de bolsos y marroquinería. El objetivo de este sprint es implementar un sistema completo de validaciones de formularios en el back-end (con `express-validator`) y en el front-end (con JavaScript vanilla) para blindar la base de datos contra datos inválidos o malintencionados, mejorando la UX y garantizando la integridad de los datos.

## Glossary

- **Express Validator**: Middleware de validación para Express basado en `validator.js`, permite definir reglas de validación declarativas en las rutas.
- **Validation Chain**: Secuencia de validaciones encadenadas que `express-validator` aplica a cada campo del `req.body`, `req.params` o `req.files`.
- **Validation Result**: Objeto `Result<ValidationError>` retornado por `validationResult(req)` que contiene los errores de validación acumulados.
- **Front-end Validation**: Validación ejecutada en el navegador mediante JavaScript antes de enviar el formulario al servidor.
- **Old Data**: Datos previamente ingresados que se reenvían a la vista para repoblar el formulario cuando la validación falla (patrón "old input").
- **Custom Validator**: Validador personalizado de `express-validator` que ejecuta lógica asíncrona (ej. consultar la BD para verificar unicidad de email).

---

## Requirements

### Requirement 1: Metodología Ágil — Retrospectiva

**User Story:** Como equipo, quiero actualizar la retrospectiva del sprint, para documentar las lecciones aprendidas durante la implementación de validaciones.

#### Acceptance Criteria

1. THE `retro.md` SHALL incluir una sección titulada `Retrospectiva Sprint 7 — Estrella de Mar` con las cinco dimensiones: `Start Doing`, `More of`, `Keep Doing`, `Less of` y `Stop Doing`.
2. THE `retro.md` SHALL documentar al menos 3 elementos por cada dimensión, relacionados específicamente con la implementación de validaciones back-end y front-end del Sprint 7.
3. THE `retro.md` SHALL conservar las secciones de sprints anteriores sin modificarlas.

---

### Requirement 2: Instalación y configuración de express-validator

**User Story:** Como desarrollador, quiero instalar y configurar `express-validator`, para que las rutas puedan validar los datos de entrada antes de llegar a los controladores.

#### Acceptance Criteria

1. THE App SHALL instalar `express-validator` como dependencia de producción y listarla en `package.json`.
2. THE App SHALL crear un middleware `middlewares/validations/` que centralice todas las reglas de validación por formulario.
3. THE App SHALL crear archivos de validación separados: `userValidations.js` (registro y login) y `productValidations.js` (creación y edición).

---

### Requirement 3: Validaciones de Back-end — Registro de Usuario

**User Story:** Como desarrollador, quiero validar los datos del formulario de registro en el servidor, para que no se persistan datos inválidos en la tabla `Users`.

#### Acceptance Criteria

1. THE `POST /users/register` SHALL validar el campo `nombre` con `body('nombre').notEmpty().isLength({ min: 2 })` y retornar un mensaje descriptivo si falla.
2. THE `POST /users/register` SHALL validar el campo `apellido` con `body('apellido').notEmpty().isLength({ min: 2 })` y retornar un mensaje descriptivo si falla.
3. THE `POST /users/register` SHALL validar el campo `email` con `body('email').isEmail()` y un custom validator que verifique unicidad consultando `User.findOne({ where: { email } })`.
4. THE `POST /users/register` SHALL validar el campo `password` con `body('password').isLength({ min: 8 })` y retornar un mensaje descriptivo si falla.
5. THE `POST /users/register` SHALL validar el campo `imagen` (cuando se sube un archivo) aceptando solo extensiones JPG, JPEG, PNG y GIF mediante un custom validator que inspeccione `req.file.mimetype`.
6. WHEN la validación falla, THE `usersController.store` SHALL volver a renderizar `users/register` con los errores de validación y los datos antiguos (`oldData`) para repoblar el formulario.
7. WHEN la validación pasa, THE `usersController.store` SHALL proceder con la creación del usuario en la base de datos sin cambios respecto al Sprint 6.

---

### Requirement 4: Validaciones de Back-end — Login de Usuario

**User Story:** Como desarrollador, quiero validar las credenciales de login en el servidor, para que solo se procesen intentos con formato válido.

#### Acceptance Criteria

1. THE `POST /users/login` SHALL validar el campo `email` con `body('email').isEmail()` y retornar un mensaje descriptivo si falla.
2. THE `POST /users/login` SHALL validar el campo `password` con `body('password').notEmpty()` y retornar un mensaje descriptivo si falla.
3. WHEN la validación falla, THE `usersController.authenticate` SHALL volver a renderizar `users/login` con los errores de validación.
4. WHEN la validación pasa pero las credenciales no coinciden con un usuario en la base de datos, THE `usersController.authenticate` SHALL renderizar `users/login` con el mensaje `'Correo o contraseña incorrectos.'`.

---

### Requirement 5: Validaciones de Back-end — Creación de Producto

**User Story:** Como desarrollador, quiero validar los datos del formulario de creación de productos, para que no se persistan productos con datos incompletos o inválidos.

#### Acceptance Criteria

1. THE `POST /products` SHALL validar el campo `nombre` con `body('nombre').notEmpty().isLength({ min: 5 })` y retornar un mensaje descriptivo si falla.
2. THE `POST /products` SHALL validar el campo `descripcion` con `body('descripcion').isLength({ min: 20 })` y retornar un mensaje descriptivo si falla.
3. THE `POST /products` SHALL validar el campo `precio` con `body('precio').isFloat({ min: 0.01 })` y retornar un mensaje descriptivo si falla.
4. THE `POST /products` SHALL validar el campo `imagen` (cuando se sube un archivo) aceptando solo extensiones JPG, JPEG, PNG y GIF mediante un custom validator.
5. WHEN la validación falla, THE `productsController.store` SHALL volver a renderizar `products/createProduct` con los errores de validación, los datos antiguos y la lista de categorías.
6. WHEN la validación pasa, THE `productsController.store` SHALL proceder con la creación del producto sin cambios respecto al Sprint 6.

---

### Requirement 6: Validaciones de Back-end — Edición de Producto

**User Story:** Como desarrollador, quiero validar los datos del formulario de edición de productos, para que las actualizaciones mantengan la integridad de los datos.

#### Acceptance Criteria

1. THE `PUT /products/:id` SHALL aplicar las mismas validaciones que la creación (nombre mín. 5 caracteres, descripción mín. 20 caracteres, precio mín. 0.01, imagen válida).
2. WHEN la validación falla, THE `productsController.update` SHALL volver a renderizar `products/editProduct` con los errores, los datos antiguos y la lista de categorías.
3. WHEN la validación pasa, THE `productsController.update` SHALL proceder con la actualización del producto sin cambios respecto al Sprint 6.

---

### Requirement 7: Validaciones de Front-end — Registro de Usuario

**User Story:** Como usuario, quiero ver los errores de validación en tiempo real mientras completo el formulario de registro, para corregirlos antes de enviar el formulario.

#### Acceptance Criteria

1. THE vista `users/register.ejs` SHALL incluir un script JavaScript que valide en tiempo real: nombre (mín. 2 caracteres), email (formato válido), contraseña (mín. 8 caracteres) y confirmación de contraseña (coincidencia).
2. THE script SHALL mostrar mensajes de error debajo de cada campo cuando la validación falla, sin enviar el formulario al servidor.
3. THE script SHALL deshabilitar el botón de envío cuando hay errores de validación activos.
4. THE script SHALL validar el tipo de archivo de imagen antes de subir (JPG, JPEG, PNG, GIF).

---

### Requirement 8: Validaciones de Front-end — Login de Usuario

**User Story:** Como usuario, quiero ver los errores de validación mientras completo el formulario de login, para corregirlos antes de enviar.

#### Acceptance Criteria

1. THE vista `users/login.ejs` SHALL incluir un script JavaScript que valide: email (formato válido) y contraseña (no vacía).
2. THE script SHALL mostrar mensajes de error debajo de cada campo cuando la validación falla.
3. THE script SHALL deshabilitar el botón de envío cuando hay errores activos.

---

### Requirement 9: Validaciones de Front-end — Creación y Edición de Producto

**User Story:** Como usuario, quiero ver los errores de validación mientras completo el formulario de producto, para corregirlos antes de enviar.

#### Acceptance Criteria

1. THE vista `products/createProduct.ejs` SHALL incluir un script JavaScript que valide en tiempo real: nombre (mín. 5 caracteres), descripción (mín. 20 caracteres) y precio (mayor a 0).
2. THE vista `products/editProduct.ejs` SHALL incluir el mismo script JavaScript de validación.
3. THE script SHALL validar el tipo de archivo de imagen antes de subir (JPG, JPEG, PNG, GIF).
4. THE script SHALL mostrar mensajes de error debajo de cada campo y deshabilitar el botón de envío cuando haya errores activos.

---

### Requirement 10: Repoblación de formularios (Old Data)

**User Story:** Como usuario, quiero que los datos que ingresé se mantengan en el formulario cuando la validación falla, para no tener que volver a escribir todo.

#### Acceptance Criteria

1. WHEN la validación back-end falla en el registro de usuario, THE vista `users/register.ejs` SHALL mostrar los valores previamente ingresados en los campos `nombre`, `apellido` y `email` (no así `password` por seguridad).
2. WHEN la validación back-end falla en la creación de producto, THE vista `products/createProduct.ejs` SHALL mostrar los valores previamente ingresados en todos los campos.
3. WHEN la validación back-end falla en la edición de producto, THE vista `products/editProduct.ejs` SHALL mostrar los valores previamente ingresados.

---

### Requirement 11: Rutas — Integración de middleware de validación

**User Story:** Como desarrollador, quiero integrar los middlewares de validación en las rutas, para que se ejecuten antes de los controladores.

#### Acceptance Criteria

1. THE `routes/users.js` SHALL importar y aplicar las validaciones de registro antes de `usersController.store`.
2. THE `routes/users.js` SHALL importar y aplicar las validaciones de login antes de `usersController.authenticate`.
3. THE `routes/products.js` SHALL importar y aplicar las validaciones de creación antes de `productsController.store`.
4. THE `routes/products.js` SHALL importar y aplicar las validaciones de edición antes de `productsController.update`.
5. THE `routes/users.js` y `routes/products.js` NO SHALL modificar las URLs existentes ni los métodos HTTP de ninguna ruta.
