# Retrospectiva Sprint 3 — Estrella de Mar

> **Proyecto:** Camila Manrique — Marroquinería & Bolsos Exclusivos (Node.js + Express)  
> **Sprint:** 3  
> **Fecha:** Septiembre 2026  
> **Equipo:** Equipo de Desarrollo Web

---

## ⭐ Estrella de Mar

La dinámica "Estrella de Mar" nos permite reflexionar sobre el trabajo del equipo desde cinco perspectivas para mejorar continuamente.

---

### 🟢 Start Doing — Empezar a hacer

- Escribir pruebas básicas para cada vista antes de considerarla terminada.
- Documentar los cambios de estructura de carpetas en el README cada vez que se reorganice el proyecto.
- Hacer revisión de código entre pares (code review) antes de mergear cambios al branch principal.
- Definir el contrato de las rutas (URL, método, parámetros esperados) antes de implementarlas.

---

### 🔵 More of — Más de esto

- Más comunicación durante la integración de partials para evitar conflictos de estilos.
- Más commits pequeños y descriptivos en lugar de commits grandes con muchos cambios juntos.
- Más uso de comentarios en el código EJS para indicar qué datos espera cada vista del controlador.
- Más planning antes de comenzar tareas para estimar mejor los tiempos.

---

### 🟡 Keep Doing — Seguir haciendo

- Mantener la separación de responsabilidades: partials reutilizables independientes del contenido de cada vista.
- Continuar organizando las vistas por dominio (`main/`, `products/`) para mantener la escalabilidad.
- Seguir usando EJS como motor de plantillas con la sintaxis estándar de includes.
- Conservar la estructura de carpetas acordada desde el inicio del sprint.
- Mantener el servidor Express limpio y bien comentado con secciones delimitadas.

---

### 🟠 Less of — Menos de esto

- Menos código repetido en las vistas: si algo se repite más de dos veces, debería ser un partial.
- Menos cambios de último momento en la estructura de archivos sin avisar al equipo.
- Menos dependencia de estilos inline en las vistas; mover estilos específicos a clases en el `head.ejs`.
- Menos ambigüedad en los nombres de variables que se pasan desde el controlador a la vista.

---

### 🔴 Stop Doing — Dejar de hacer

- Dejar de mezclar lógica de negocio dentro de las vistas EJS; eso le corresponde al controlador.
- Dejar de trabajar sobre el branch `main` directamente sin crear una rama de feature.
- Dejar de dejar comentarios con `TODO` sin asignar a nadie ni agregar a la lista de tareas.
- Dejar de ignorar los mensajes de advertencia del servidor al iniciar (`app.js` hints de ESLint).

---

*Retrospectiva facilitada por el equipo al final del Sprint 3.*


---

# Retrospectiva Sprint 6 — Estrella de Mar

> **Proyecto:** Camila Manrique — Marroquinería & Bolsos Exclusivos (Node.js + Express + Sequelize + MySQL)  
> **Sprint:** 6 — Migración a Sequelize ORM  
> **Fecha:** Noviembre 2026  
> **Equipo:** Equipo de Desarrollo Web

---

## ⭐ Estrella de Mar

La dinámica "Estrella de Mar" nos permite reflexionar sobre el trabajo del equipo desde cinco perspectivas para mejorar continuamente.

---

### 🟢 Start Doing — Empezar a hacer

- Escribir tests de propiedad (PBT con fast-check) desde el Sprint 1 para detectar bugs en modelos y controladores lo antes posible.
- Crear el archivo `.env` y verificar la conexión a la base de datos antes de escribir cualquier modelo o migración.
- Usar Docker Compose desde el inicio del sprint para estandarizar el entorno de desarrollo entre todos los miembros del equipo.
- Documentar el mapeo de campos entre el modelo Sequelize (`nombre`, `precio`, `imagen`) y las vistas EJS (`name`, `price`, `image`) para evitar el mismatch que rompió la aplicación.

---

### 🔵 More of — Más de esto

- Más uso de `try/catch` con `async/await` en todos los métodos de controladores que acceden a la base de datos.
- Más verificación de tipos entre la capa de datos y las vistas antes de considerar una migración completa.
- Más uso de `include` en las consultas Sequelize para resolver asociaciones (Category-Product) en una sola query.
- Más scripts SQL entregables (`structure.sql`, `data.sql`) como respaldo independiente del ORM para presentaciones académicas.

---

### 🟡 Keep Doing — Seguir haciendo

- Mantener las rutas (`routes/products.js`, `routes/users.js`) sin modificaciones durante la migración de la capa de persistencia.
- Conservar el mapeo `imagen → image` al guardar en `req.session.user` para no romper la compatibilidad con las vistas EJS.
- Seguir usando `sequelize-cli` para generar migraciones y seeders con orden de dependencias respetado (categories → users → products).
- Mantener la convención de `tableName` en español consistente entre modelos y migraciones.
- Continuar separando la configuración de entornos (`development`, `test`, `production`) leyendo siempre de `process.env`.

---

### 🟠 Less of — Menos de esto

- Menos credenciales hardcodeadas en el código; usar siempre variables de entorno con `dotenv`.
- Menos dependencia de archivos JSON estáticos para persistencia; la base de datos relacional es la fuente de verdad.
- Menos cambios simultáneos en controladores y vistas sin verificar la aplicación end-to-end después de cada bloque.
- Menos asunciones sobre nombres de campos entre capas; verificar el contrato modelo → vista explícitamente.

---

### 🔴 Stop Doing — Dejar de hacer

- Dejar de usar `fs.readFileSync`/`fs.writeFileSync` para operaciones CRUD; reemplazar completamente por llamadas Sequelize.
- Dejar de generar IDs manualmente con `Math.max(...array.map(p => p.id)) + 1`; el autoincrement de la BD lo maneja.
- Dejar de commitear el archivo `.env` con credenciales reales; solo `.env.example` va al repositorio.
- Dejar de lanzar la aplicación sin verificar que la conexión a MySQL esté activa (`sequelize.authenticate()` al arranque).

---

*Retrospectiva facilitada por el equipo al final del Sprint 6 — Migración a Sequelize ORM.*
