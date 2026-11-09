# Implementation Plan: Sprint 6 — Migración a Sequelize ORM

## Overview

Migración completa de la capa de persistencia desde archivos JSON hacia MySQL con Sequelize ORM. El plan respeta el orden de dependencias técnicas: blindaje del repo → entorno → config DB → modelos → migraciones → seeders → scripts SQL → actualización de app.js → migración de controladores → migración de middleware → retrospectiva → tests. Las rutas `routes/products.js` y `routes/users.js` no se tocan en ningún paso.

## Tasks

- [x] 1. Blindaje del repositorio y archivo de entorno
  - [x] 1.1 Actualizar `.gitignore`
    - Agregar entradas: `.env`, `node_modules/`, `.kiro/`, `.DS_Store`, `Thumbs.db`, `npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`, `*.sqlite`, `*.db`
    - Verificar que `.env` quede listado como untracked tras `git status`
    - _Requirements: 1.1, 1.2_
  - [x] 1.2 Crear `.env.example`
    - Incluir variables: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `SESSION_SECRET`
    - Usar valores de plantilla (no credenciales reales)
    - Este archivo sí se commitea
    - _Requirements: 2.2_

- [x] 2. Instalación de dependencias y configuración de Sequelize
  - [x] 2.1 Instalar dependencias de producción y desarrollo
    - Instalar `sequelize`, `mysql2`, `dotenv` como dependencias de producción
    - Instalar `sequelize-cli` como dependencia de desarrollo
    - Verificar que aparecen en `package.json`
    - _Requirements: 2.1_
  - [x] 2.2 Crear `database/config/config.js`
    - Llamar a `require('dotenv').config()` al inicio
    - Leer `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` desde `process.env`
    - Si `DB_NAME` no está definida, lanzar un `Error` descriptivo antes de intentar conectar
    - Exportar objeto con entornos `development`, `test`, `production` apuntando todos a `process.env`
    - Sin credenciales hardcodeadas en ningún entorno
    - _Requirements: 2.2, 2.4, 2.5_
  - [x] 2.3 Crear archivo `.sequelizerc` en la raíz del proyecto
    - Apuntar `config`, `models-path`, `migrations-path` y `seeders-path` a la carpeta `database/`
    - Esto permite que `sequelize-cli` encuentre la estructura correcta
    - _Requirements: 2.3_

- [x] 3. Modelos Sequelize
  - [x] 3.1 Crear `database/models/Category.js`
    - Campos: `id` (PK, autoincrement), `nombre` (STRING, NOT NULL, UNIQUE), `timestamps: true`
    - Exportar como función que recibe `sequelize` como parámetro
    - `tableName: 'Categories'`
    - _Requirements: 4.1_
  - [x] 3.2 Crear `database/models/User.js`
    - Campos: `id` (PK, autoincrement), `nombre` (STRING, NOT NULL), `apellido` (STRING, NOT NULL), `email` (STRING, NOT NULL, UNIQUE), `password` (STRING, NOT NULL), `rol` (ENUM `'admin'`/`'user'`, defaultValue `'user'`), `imagen` (STRING), `timestamps: true`
    - `tableName: 'Users'`
    - _Requirements: 3.1, 3.2, 3.3_
  - [x] 3.3 Crear `database/models/Product.js`
    - Campos: `id` (PK, autoincrement), `nombre` (STRING, NOT NULL), `descripcion` (TEXT), `precio` (DECIMAL(10,2), NOT NULL), `imagen` (STRING), `stock` (INTEGER, defaultValue `0`), `inOffer` (BOOLEAN, defaultValue `false`), `categoryId` (FK → `Categories.id`), `timestamps: true`
    - `tableName: 'Products'`
    - _Requirements: 5.1_
  - [x] 3.4 Crear `database/models/index.js`
    - Instanciar Sequelize con los parámetros de `config.js` según `NODE_ENV`
    - Importar y registrar `User`, `Category`, `Product`
    - Definir asociaciones: `Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' })` y `Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' })`
    - Exportar `{ sequelize, Sequelize, User, Category, Product }`
    - _Requirements: 4.2, 5.2_

- [x] 4. Migraciones Sequelize
  - [x] 4.1 Crear migración `YYYYMMDD-create-categories.js`
    - Tabla `Categories`: `id`, `nombre` (STRING NOT NULL UNIQUE), `createdAt`, `updatedAt`
    - Método `down` elimina la tabla
    - _Requirements: 6.1_
  - [x] 4.2 Crear migración `YYYYMMDD-create-users.js`
    - Tabla `Users`: todos los campos del modelo User con sus restricciones
    - Método `down` elimina la tabla
    - _Requirements: 6.1_
  - [x] 4.3 Crear migración `YYYYMMDD-create-products.js`
    - Tabla `Products`: todos los campos del modelo Product, FK `categoryId → Categories.id` con `onUpdate: 'CASCADE'` y `onDelete: 'SET NULL'`
    - Método `down` elimina la tabla
    - _Requirements: 6.1_

- [x] 5. Checkpoint — Verificar migraciones
  - Asegúrate de que `npx sequelize-cli db:migrate` crea las 3 tablas sin errores. Pregunta al usuario si hay algún inconveniente de conexión.

- [x] 6. Seeders
  - [x] 6.1 Crear seeder `YYYYMMDD-demo-categories.js`
    - Insertar mínimo 5 categorías: `Tote`, `Bandolera`, `Mini Bag`, `Morral`, `Clutch`
    - Método `down` elimina con `DELETE FROM Categories`
    - _Requirements: 7.2_
  - [x] 6.2 Crear seeder `YYYYMMDD-demo-products.js`
    - Insertar mínimo 5 productos con `categoryId` válidos (referenciando IDs insertados por el seeder de categorías)
    - Precios en COP coherentes con la temática de marroquinería colombiana (ej. 285000, 195000)
    - Método `down` elimina con `DELETE FROM Products`
    - _Requirements: 7.2_

- [x] 7. Scripts SQL entregables
  - [x] 7.1 Crear `structure.sql`
    - `CREATE DATABASE IF NOT EXISTS camila_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; USE camila_db;`
    - `CREATE TABLE IF NOT EXISTS Categories` (sin FK) — primero
    - `CREATE TABLE IF NOT EXISTS Users` (sin FK) — segundo
    - `CREATE TABLE IF NOT EXISTS Products` (FK → Categories) — tercero
    - Incluir tipos de dato, PKs, UNIQUEs, NOT NULLs consistentes con los modelos
    - _Requirements: 7.1_
  - [x] 7.2 Crear `data.sql`
    - `INSERT INTO Categories` con mínimo 3 categorías
    - `INSERT INTO Users` con al menos 1 usuario de prueba (password como hash bcrypt)
    - `INSERT INTO Products` con mínimo 5 productos con `categoryId` coherentes
    - _Requirements: 7.2, 7.3_

- [x] 8. Actualizar `app.js`
  - [x] 8.1 Agregar `require('dotenv').config()` al inicio de `app.js`, antes de cualquier otro require
    - _Requirements: 2.2_
  - [x] 8.2 Reemplazar el secret hardcodeado de sesión por `process.env.SESSION_SECRET`
    - Usar `process.env.SESSION_SECRET || 'fallback_secret'`
    - _Requirements: 2.2_
  - [x] 8.3 Agregar bloque `sequelize.authenticate()` al inicio de la aplicación
    - Importar `sequelize` desde `./database/models`
    - Llamar a `sequelize.authenticate()` en un `.then().catch()` que haga `process.exit(1)` si falla
    - Loguear `✅ Conexión a MySQL establecida.` en caso de éxito
    - _Requirements: 2.3_

- [x] 9. Migrar `productsController.js` a Sequelize
  - [x] 9.1 Reemplazar imports de `fs` y `path` por imports de modelos Sequelize
    - Importar `{ Product, Category }` desde `../database/models`
    - Importar `{ Op }` desde `sequelize`
    - Eliminar `readDB()` y `writeDB()`
    - _Requirements: 8.1_
  - [x] 9.2 Migrar método `index` — usar `Product.findAll()` con `async/await` y `try/catch`
    - Incluir `{ include: [{ model: Category, as: 'category' }] }`
    - _Requirements: 8.1_
  - [x] 9.3 Migrar método `detail` — usar `Product.findByPk(id)` con `async/await` y `try/catch`
    - Incluir la categoría con `include`
    - Si el resultado es `null`, responder HTTP 404
    - _Requirements: 8.2, 8.3_
  - [x] 9.4 Migrar método `edit` — usar `Product.findByPk(id)` con `async/await` y `try/catch`
    - Redirigir a `/products` si `null`
    - _Requirements: 8.2_
  - [x] 9.5 Migrar método `store` — usar `Product.create(data)` con `async/await` y `try/catch`
    - Mapear campos del `req.body` a los nombres del modelo (`nombre`, `descripcion`, `precio`, `imagen`, `inOffer`, `categoryId`)
    - _Requirements: 8.4_
  - [x] 9.6 Migrar método `update` — usar `product.update(data)` con `async/await` y `try/catch`
    - Buscar primero con `findByPk`, redirigir si `null`, luego actualizar
    - _Requirements: 8.5_
  - [x] 9.7 Migrar método `destroy` — usar `Product.destroy({ where: { id } })` con `async/await` y `try/catch`
    - _Requirements: 8.6_
  - [x] 9.8 Agregar método de búsqueda con `Op.like`
    - Si existe `req.query.q`, usar `Product.findAll({ where: { [Op.or]: [{ nombre: { [Op.like]: '%q%' } }, { descripcion: { [Op.like]: '%q%' } }] } })`
    - _Requirements: 8.7_

- [x] 10. Checkpoint — Verificar CRUD de productos
  - Asegúrate de que todos los métodos del `productsController.js` funcionan con la base de datos. Prueba crear, editar y eliminar un producto. Pregunta al usuario si hay algún inconveniente.

- [x] 11. Migrar `usersController.js` a Sequelize
  - [x] 11.1 Reemplazar imports de `fs` y `path` por import del modelo `User`
    - Importar `{ User }` desde `../database/models`
    - Eliminar `readUsers()` y `writeUsers()`
    - Mantener el import de `bcryptjs`
    - _Requirements: 9.1_
  - [x] 11.2 Migrar método `store` (registro de usuario)
    - Verificar email existente con `await User.findOne({ where: { email } })`
    - Crear usuario con `await User.create({ nombre, apellido, email, password: hashedPassword, imagen })`
    - Mapear `imagen` del modelo a `image` al guardar en `req.session.user`
    - En el catch, capturar `SequelizeUniqueConstraintError` y volver a renderizar el form con error
    - _Requirements: 9.1, 9.2, 9.5_
  - [x] 11.3 Migrar método `authenticate` (login)
    - Buscar usuario con `await User.findOne({ where: { email } })`
    - Si es `null` o `bcrypt.compare` retorna `false`, renderizar login con `'Correo o contraseña incorrectos.'`
    - Guardar en `req.session.user` con campos `id`, `nombre`, `email`, `image` (mapeando `imagen` → `image`)
    - _Requirements: 9.3, 9.4, 9.5_

- [x] 12. Migrar `authMiddleware.js` a Sequelize
  - [x] 12.1 Reemplazar imports de `fs`, `path` y `readUsers()` por `User` desde los modelos
    - Importar `{ User }` desde `../database/models`
    - Eliminar `const USERS_PATH`, `readUsers()`
    - _Requirements: 10.4_
  - [x] 12.2 Convertir `rememberMe` a función `async`
    - Reemplazar `users.find(u => u.email === rememberedEmail)` por `await User.findOne({ where: { email: rememberedEmail } })`
    - Si el resultado es `null`, llamar a `next()` sin tocar la sesión
    - Mapear `usuario.imagen` → `image` al guardar en `req.session.user`
    - Envolver en `try/catch` y llamar `next()` en el catch
    - _Requirements: 10.1, 10.2_
  - [x] 12.3 Verificar que `guestOnly` y `authRequired` no requieren cambios
    - Estas funciones no acceden a la base de datos; confirmar que permanecen sin modificaciones
    - _Requirements: 10.3_

- [x] 13. Checkpoint — Verificar flujo completo de usuarios
  - Asegúrate de que registro, login, logout y remember-me funcionan contra la base de datos. Verifica que el perfil muestra los datos correctamente. Pregunta al usuario si hay algún inconveniente.

- [x] 14. Retrospectiva Sprint 6
  - [x] 14.1 Actualizar `retro.md` con sección Sprint 6
    - Agregar sección titulada `Retrospectiva Sprint 6 — Estrella de Mar`
    - Incluir las cinco dimensiones: `Start Doing`, `More of`, `Keep Doing`, `Less of`, `Stop Doing`
    - Mínimo 3 elementos por dimensión, relacionados con la migración a Sequelize
    - Conservar las secciones de sprints anteriores sin modificarlas
    - _Requirements: 11.1, 11.2, 11.3_

- [x] 15. Setup de tests y tests de humo
  - [x] 15.1 Instalar Jest y fast-check como dependencias de desarrollo
    - `npm install --save-dev jest fast-check`
    - Agregar script `"test": "jest --testEnvironment node"` en `package.json`
    - Crear carpeta `tests/` con subcarpetas `unit/` e `integration/`
    - _Requirements: (Testing Strategy del diseño)_
  - [x]* 15.2 Escribir tests de humo (smoke tests)
    - Verificar que `.gitignore` contiene `.env` y `node_modules/`
    - Verificar que `package.json` incluye `sequelize`, `sequelize-cli`, `mysql2`, `dotenv`
    - Verificar que existen los archivos en `database/config/`, `database/models/`, `database/migrations/`, `database/seeders/`
    - Verificar que `routes/products.js` y `routes/users.js` permanecen sin cambios
    - _Requirements: 1.1, 2.1, 2.3_
  - [x]* 15.3 Escribir tests unitarios de `config.js`
    - Test: lanza error descriptivo si `DB_NAME` no está definida en `process.env`
    - Test: usa los valores correctos de `process.env` cuando están definidos
    - _Requirements: 2.2, 2.5_
  - [x]* 15.4 Escribir tests unitarios de los scripts SQL
    - Test: `structure.sql` contiene `CREATE DATABASE IF NOT EXISTS`
    - Test: `data.sql` contiene al menos 3 categorías y 5 productos (contar sentencias INSERT)
    - _Requirements: 7.1, 7.2_

- [x] 16. Tests de propiedades (PBT) — Modelos y Controladores
  - [x]* 16.1 Escribir test de propiedad para creación de User con rol por defecto
    - **Property 1: Creación de usuario preserva campos y aplica valor por defecto de rol**
    - Para cualquier `{ nombre, apellido, email, password }` válidos sin especificar `rol`, `User.create(data).rol` debe ser `'user'`
    - Usar `fc.record({ nombre: fc.string({ minLength: 1 }), apellido: fc.string({ minLength: 1 }), email: fc.emailAddress(), password: fc.string({ minLength: 6 }) })`
    - **Validates: Requirements 3.1, 3.3**
  - [x]* 16.2 Escribir test de propiedad para restricción UNIQUE de email
    - **Property 2: La restricción UNIQUE de email se cumple siempre**
    - Crear un User con email `e`, luego intentar `User.create` con el mismo email → debe lanzar `SequelizeUniqueConstraintError`
    - **Validates: Requirements 3.2, 9.1**
  - [x]* 16.3 Escribir test de propiedad para CRUD completo de productos
    - **Property 3: CRUD completo de productos es consistente con la base de datos**
    - Para cualquier dato de producto válido: create → findAll incluye el producto; update → findByPk retorna datos nuevos; destroy → findByPk retorna null
    - **Validates: Requirements 8.1, 8.4, 8.5, 8.6**
  - [x]* 16.4 Escribir test de propiedad para producto no encontrado → HTTP 404
    - **Property 4: Producto no encontrado siempre devuelve HTTP 404**
    - Para cualquier `id` numérico que no exista en Products, `ProductsController.detail` responde con status 404
    - Usar `fc.integer({ min: 999999, max: 9999999 })` para IDs inexistentes
    - **Validates: Requirements 8.3**
  - [x]* 16.5 Escribir test de propiedad para búsqueda con Op.like
    - **Property 5: La búsqueda con Op.like retorna solo productos coincidentes**
    - Para cualquier término `s` y conjunto de productos, el resultado de `findAll` con `Op.like` contiene exactamente los productos cuyo `nombre` o `descripcion` contiene `s`
    - **Validates: Requirements 8.7**
  - [x]* 16.6 Escribir test de propiedad para almacenamiento seguro de password
    - **Property 6: El password nunca se almacena en texto plano**
    - Para cualquier contraseña `p`, `User.password` almacenado nunca es igual a `p`, comienza con `$2b$`, y `bcrypt.compare(p, stored)` retorna `true`
    - Usar `fc.string({ minLength: 6, maxLength: 50 })`
    - **Validates: Requirements 9.2**
  - [x]* 16.7 Escribir test de propiedad para lógica de login correcto/incorrecto
    - **Property 7: El login es correcto si y solo si las credenciales son válidas**
    - Con credenciales válidas: sesión activa + redirección exitosa
    - Con password incorrecto: renderiza login con `'Correo o contraseña incorrectos.'`
    - Con email inexistente: mismo mensaje de error
    - **Validates: Requirements 9.3, 9.4**
  - [x]* 16.8 Escribir test de propiedad para campos de sesión post-registro
    - **Property 8: La sesión post-registro contiene los campos requeridos**
    - Para cualquier registro exitoso, `req.session.user` contiene exactamente `id`, `nombre`, `email`, `image`
    - **Validates: Requirements 9.5**
  - [x]* 16.9 Escribir test de propiedad para rememberMe con usuario existente/inexistente
    - **Property 9: RememberMe establece sesión si y solo si el usuario existe en BD**
    - Cookie con email de usuario existente → sesión establecida con datos correctos
    - Cookie con email inexistente → `next()` sin modificar sesión
    - **Validates: Requirements 10.1, 10.2**
  - [x]* 16.10 Escribir test de propiedad para asociación Category-Product
    - **Property 10: La asociación Category-Product se resuelve correctamente en consultas**
    - Para cualquier producto con `categoryId` válido, `Product.findByPk(id, { include: [{ model: Category, as: 'category' }] })` retorna el campo `category` con el `id` y `nombre` exactos
    - **Validates: Requirements 4.2, 5.2, 5.3**

- [x] 17. Checkpoint final — Todos los tests deben pasar
  - Ejecuta `npm test` y asegúrate de que todos los tests pasan. Verifica que la aplicación completa funciona contra la base de datos MySQL. Pregunta al usuario si hay algún inconveniente antes de cerrar el sprint.

## Notes

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Las rutas `routes/products.js` y `routes/users.js` NO se modifican en ninguna tarea
- El campo de imagen del modelo (`imagen`) siempre se mapea como `image` al guardar en `req.session.user` para compatibilidad con las vistas EJS
- Los controladores deben usar `async/await` con `try/catch` en todos los métodos que acceden a la BD
- El orden de creación de migraciones debe respetarse: categories → users → products (por la FK)
- Usar MySQL con driver `mysql2`, no PostgreSQL
- fast-check usará 100 ejecuciones por propiedad (configuración por defecto)
- Los tests de integración (propiedades 3, 4, 5, 7, 8, 9, 10) requieren una BD MySQL de prueba (`camila_test`) definida en `.env.test`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.3"] },
    { "id": 2, "tasks": ["2.2"] },
    { "id": 3, "tasks": ["3.1", "3.2", "3.3"] },
    { "id": 4, "tasks": ["3.4"] },
    { "id": 5, "tasks": ["4.1", "4.2"] },
    { "id": 6, "tasks": ["4.3"] },
    { "id": 7, "tasks": ["6.1", "7.1"] },
    { "id": 8, "tasks": ["6.2", "7.2"] },
    { "id": 9, "tasks": ["8.1", "8.2", "8.3"] },
    { "id": 10, "tasks": ["9.1"] },
    { "id": 11, "tasks": ["9.2", "9.3", "9.4", "9.5", "9.6", "9.7", "9.8"] },
    { "id": 12, "tasks": ["11.1"] },
    { "id": 13, "tasks": ["11.2", "11.3"] },
    { "id": 14, "tasks": ["12.1"] },
    { "id": 15, "tasks": ["12.2", "12.3"] },
    { "id": 16, "tasks": ["14.1"] },
    { "id": 17, "tasks": ["15.1"] },
    { "id": 18, "tasks": ["15.2", "15.3", "15.4"] },
    { "id": 19, "tasks": ["16.1", "16.2", "16.4", "16.6"] },
    { "id": 20, "tasks": ["16.3", "16.5", "16.7", "16.8", "16.9", "16.10"] }
  ]
}
```
