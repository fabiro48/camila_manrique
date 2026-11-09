# Requirements Document

## Introduction

Sprint 6 del proyecto integrador "Camila Manrique" — tienda online de bolsos y marroquinería. El objetivo de este sprint es migrar el 100 % de la persistencia de datos desde archivos JSON estáticos hacia una base de datos relacional, usando Sequelize ORM como capa de abstracción. La migración debe preservar todas las URLs y la funcionalidad existente sin romper el contrato con las vistas EJS ni las rutas REST actuales.

## Glossary

- **App**: la aplicación Express completa (`app.js` y sus dependencias).
- **ProductsController**: módulo `controllers/productsController.js` — gestiona el CRUD de productos.
- **UsersController**: módulo `controllers/usersController.js` — gestiona registro, login, logout y perfil.
- **AuthMiddleware**: módulo `middlewares/authMiddleware.js` — contiene `guestOnly`, `authRequired` y `rememberMe`.
- **Sequelize**: ORM para Node.js que abstrae las operaciones sobre la base de datos relacional.
- **SequelizeCLI**: herramienta de línea de comandos para generar migraciones y seeders (`sequelize-cli`).
- **Product**: modelo Sequelize que representa un producto de la tienda.
- **User**: modelo Sequelize que representa un usuario registrado.
- **Category**: modelo Sequelize que representa la categoría de un producto.
- **Migration**: archivo generado por SequelizeCLI que define la estructura de una tabla (CREATE / ALTER TABLE).
- **Seeder**: archivo generado por SequelizeCLI que inserta datos de prueba (INSERT INTO).
- **DatabaseConfig**: archivo `database/config/config.js` que exporta los parámetros de conexión leídos de variables de entorno.
- **DotEnv**: archivo `.env` en la raíz del proyecto que almacena credenciales y secretos fuera del repositorio.
- **structure.sql**: script SQL con `CREATE DATABASE` y `CREATE TABLE` (esquema completo).
- **data.sql**: script SQL con `INSERT INTO` que carga datos de prueba coherentes con marroquinería.

---

## Requirements

### Requirement 1: Blindaje del repositorio

**User Story:** Como desarrollador, quiero que los archivos sensibles y las dependencias no se suban al repositorio, para que no se expongan credenciales ni se incluyan archivos innecesarios.

#### Acceptance Criteria

1. THE App SHALL ignorar `/node_modules`, `.env`, `.kiro/`, `.DS_Store`, `Thumbs.db`, logs de npm (`npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`) y archivos temporales de bases de datos locales (`*.sqlite`, `*.db`) mediante el archivo `.gitignore`.
2. WHEN un desarrollador ejecuta `git status` después de crear el archivo `.env`, THE App SHALL mostrar ese archivo como no rastreado (untracked) y no como cambio pendiente de commit.

---

### Requirement 2: Configuración de Sequelize y la base de datos

**User Story:** Como desarrollador, quiero configurar Sequelize con una base de datos relacional, para que la aplicación pueda conectarse y operar sobre tablas en lugar de archivos JSON.

#### Acceptance Criteria

1. THE App SHALL instalar las dependencias `sequelize`, `sequelize-cli` y el driver de base de datos (`mysql2` o `pg`) listadas en `package.json`.
2. THE DatabaseConfig SHALL leer las variables `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` y `SESSION_SECRET` exclusivamente desde el archivo `.env` en todos los entornos (`development`, `test` y `production`), sin valores de conexión codificados en el código fuente en ningún entorno.
3. THE App SHALL contener la estructura de carpetas `database/config/config.js`, `database/models/index.js`, `database/migrations/` y `database/seeders/`.
4. WHEN el entorno de ejecución es `development`, THE DatabaseConfig SHALL utilizar los valores del entorno `development` definidos en `database/config/config.js`.
5. IF la variable de entorno `DB_NAME` no está definida al iniciar la App, THEN THE App SHALL lanzar un error descriptivo antes de intentar conectarse a la base de datos.

---

### Requirement 3: Modelo User

**User Story:** Como desarrollador, quiero un modelo Sequelize `User`, para que los datos de usuarios se persistan en una tabla relacional con los campos correctos.

#### Acceptance Criteria

1. THE User SHALL tener los campos: `id` (PK, autoincrement), `nombre` (STRING, NOT NULL), `apellido` (STRING, NOT NULL), `email` (STRING, NOT NULL, UNIQUE), `password` (STRING, NOT NULL), `rol` (ENUM: `'admin'`, `'user'`, valor por defecto `'user'`), `imagen` (STRING), y `timestamps` (`createdAt`, `updatedAt` gestionados por Sequelize).
2. THE User SHALL rechazar la creación de un registro cuando `email` ya exista en la tabla, retornando un error de validación único.
3. WHEN se crea un User con `rol` no especificado, THE User SHALL asignar automáticamente el valor `'user'` al campo `rol`.

---

### Requirement 4: Modelo Category

**User Story:** Como desarrollador, quiero un modelo Sequelize `Category`, para que los productos puedan clasificarse por categoría de forma normalizada.

#### Acceptance Criteria

1. THE Category SHALL tener los campos: `id` (PK, autoincrement), `nombre` (STRING, NOT NULL, UNIQUE), y `timestamps` (`createdAt`, `updatedAt`).
2. THE Category SHALL tener la asociación `Category.hasMany(Product)`, de modo que una categoría pueda contener múltiples productos.

---

### Requirement 5: Modelo Product

**User Story:** Como desarrollador, quiero un modelo Sequelize `Product`, para que los datos de productos se persistan en una tabla relacional con todos sus atributos.

#### Acceptance Criteria

1. THE Product SHALL tener los campos: `id` (PK, autoincrement), `nombre` (STRING, NOT NULL), `descripcion` (TEXT), `precio` (DECIMAL(10,2), NOT NULL), `imagen` (STRING), `stock` (INTEGER, valor por defecto `0`), `inOffer` (BOOLEAN, valor por defecto `false`), `categoryId` (FK hacia `Category`), y `timestamps` (`createdAt`, `updatedAt`).
2. THE Product SHALL tener la asociación `Product.belongsTo(Category)`; la existencia de esa asociación es la que implica que cada producto pertenece a exactamente una categoría (la unicidad se deriva de la asociación, no es una restricción adicional independiente).
3. WHEN se consulta un Product con su categoría incluida, THE ProductsController SHALL retornar el objeto `Category` anidado dentro de `Product` usando `include: [Category]` de Sequelize.

---

### Requirement 6: Migraciones SQL

**User Story:** Como desarrollador, quiero archivos de migración Sequelize, para que la estructura de la base de datos se versioné y pueda recrearse en cualquier entorno.

#### Acceptance Criteria

1. THE SequelizeCLI SHALL generar migraciones individuales para las tablas `Users`, `Categories` y `Products`, con los campos, tipos de dato, restricciones NOT NULL, UNIQUE y claves foráneas correspondientes a los modelos definidos en los Requerimientos 3, 4 y 5.
2. WHEN se ejecuta `npx sequelize-cli db:migrate`, THE SequelizeCLI SHALL crear las tres tablas en la base de datos sin errores.
3. WHEN se ejecuta `npx sequelize-cli db:migrate:undo:all`, THE SequelizeCLI SHALL eliminar las tres tablas en orden inverso sin errores.

---

### Requirement 7: Scripts SQL entregables

**User Story:** Como estudiante, quiero scripts SQL independientes del ORM, para poder presentar el esquema y los datos de prueba como entregables académicos.

#### Acceptance Criteria

1. THE structure.sql SHALL contener obligatoriamente la sentencia `CREATE DATABASE IF NOT EXISTS` seguida de `CREATE TABLE IF NOT EXISTS` para cada tabla, con tipos de dato, PKs, FKs, restricciones NOT NULL y UNIQUE, coherentes con los modelos User, Category y Product.
2. THE data.sql SHALL contener sentencias `INSERT INTO` para las tres tablas con un mínimo de 3 categorías de marroquinería y 5 productos de prueba coherentes con la temática de la tienda.
3. WHEN se ejecutan `structure.sql` y `data.sql` en orden sobre un servidor MySQL o PostgreSQL limpio, THE DatabaseConfig SHALL permitir que la App se conecte sin modificaciones adicionales.

---

### Requirement 8: Migración del CRUD de Productos

**User Story:** Como desarrollador, quiero reemplazar las operaciones de lectura/escritura sobre `productsDataBase.json` por operaciones Sequelize en el `ProductsController`, para que los productos se gestionen en la base de datos.

#### Acceptance Criteria

1. WHEN se invoca `ProductsController.index`, THE ProductsController SHALL recuperar todos los productos usando `Product.findAll()` con `async/await` y renderizar la vista con el resultado.
2. WHEN se invoca `ProductsController.detail` con un `id` válido, THE ProductsController SHALL recuperar el producto usando `Product.findByPk(id)` e incluir la categoría asociada.
3. IF `Product.findByPk(id)` retorna `null`, THEN THE ProductsController SHALL responder con código HTTP 404.
4. WHEN se invoca `ProductsController.store`, THE ProductsController SHALL crear un nuevo registro usando `Product.create(data)` con `async/await`.
5. WHEN se invoca `ProductsController.update`, THE ProductsController SHALL actualizar el registro usando `product.update(data)` o `Product.update(data, { where: { id } })` con `async/await`.
6. WHEN se invoca `ProductsController.destroy`, THE ProductsController SHALL eliminar el registro usando `Product.destroy({ where: { id } })` con `async/await`.
7. WHEN se realiza una búsqueda de productos por nombre o descripción, THE ProductsController SHALL utilizar `Product.findAll({ where: { [Op.like]: '%término%' } })` de Sequelize.
8. THE ProductsController SHALL conservar exactamente las mismas URLs del Requerimiento original sin modificar el archivo `routes/products.js`.

---

### Requirement 9: Migración del CRUD de Usuarios

**User Story:** Como desarrollador, quiero reemplazar las operaciones de lectura/escritura sobre `users.json` por operaciones Sequelize en el `UsersController`, para que los usuarios se gestionen en la base de datos.

#### Acceptance Criteria

1. WHEN se invoca `UsersController.store` (registro), THE UsersController SHALL verificar si el email ya existe usando `User.findOne({ where: { email } })` antes de crear el usuario.
2. WHEN el email no existe y los datos son válidos, THE UsersController SHALL crear el usuario usando `User.create({ ...data, password: hashedPassword })` con `async/await`, donde `hashedPassword` es el resultado de `bcrypt.hash`.
3. WHEN se invoca `UsersController.authenticate` (login), THE UsersController SHALL buscar el usuario usando `User.findOne({ where: { email } })` y comparar la contraseña con `bcrypt.compare`.
4. IF `User.findOne` retorna `null` o `bcrypt.compare` retorna `false`, THEN THE UsersController SHALL volver a renderizar la vista de login con el mensaje `'Correo o contraseña incorrectos.'`.
5. THE UsersController SHALL conservar la funcionalidad de auto-login tras registro, guardando en sesión los campos `id`, `nombre`, `email` e `imagen` del usuario creado.
6. THE UsersController SHALL conservar exactamente las mismas URLs sin modificar el archivo `routes/users.js`.

---

### Requirement 10: Migración del AuthMiddleware

**User Story:** Como desarrollador, quiero reemplazar las lecturas de `users.json` en el `AuthMiddleware` por consultas Sequelize, para que el middleware de autenticación opere sobre la base de datos.

#### Acceptance Criteria

1. WHEN `AuthMiddleware.rememberMe` encuentra la cookie `rememberUser`, THE AuthMiddleware SHALL buscar el usuario usando `await User.findOne({ where: { email: rememberedEmail } })` en lugar de leer el archivo JSON.
2. IF `User.findOne` retorna `null` en `rememberMe`, THEN THE AuthMiddleware SHALL llamar a `next()` sin establecer sesión.
3. THE AuthMiddleware SHALL mantener las funciones `guestOnly` y `authRequired` sin cambios funcionales, ya que estas no acceden a la base de datos directamente.
4. THE AuthMiddleware SHALL importar el modelo `User` desde `database/models/index.js` y no desde el archivo JSON.

---

### Requirement 11: Documentación — Retrospectiva Sprint 6

**User Story:** Como equipo de desarrollo, quiero actualizar el archivo `retro.md` con la retrospectiva del Sprint 6, para documentar las lecciones aprendidas durante la migración a base de datos.

#### Acceptance Criteria

1. THE retro.md SHALL incluir una sección titulada `Retrospectiva Sprint 6 — Estrella de Mar` con las cinco dimensiones: `Start Doing`, `More of`, `Keep Doing`, `Less of` y `Stop Doing`.
2. THE retro.md SHALL documentar al menos 3 elementos por cada dimensión, relacionados específicamente con la migración a Sequelize y base de datos relacional del Sprint 6.
3. THE retro.md SHALL conservar las secciones de sprints anteriores sin modificarlas.
