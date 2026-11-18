# Camila Manrique — Marroquinería & Bolsos Exclusivos

> 📋 **Tablero de gestión del proyecto:** [https://github.com/users/fabiro48/projects/1](https://github.com/users/fabiro48/projects/1)

Aplicación web e-commerce para la tienda de marroquinería artesanal "Camila Manrique", ubicada en el Centro Comercial San Gil Plaza, Santander, Colombia.

---

## Arquitectura

Aplicación monolítica con renderizado en el servidor (SSR) y patrón MVC.

| Capa | Tecnología |
|------|-----------|
| Servidor | Node.js + Express 5 |
| Vistas | EJS |
| ORM | Sequelize 6 |
| Base de datos | MySQL 8 (Docker Compose) |
| Autenticación | `express-session`, cookie "recordar usuario", `bcryptjs` |
| Validaciones | `express-validator` (backend) + JavaScript en formularios (frontend) |
| Subida de archivos | Multer (JPG/PNG/WEBP, máx. 2 MB) |
| Pruebas | Jest + fast-check |

---

## Estructura del proyecto

```
├── app.js                         # Servidor principal
├── docker-compose.yml             # MySQL 8
├── .sequelizerc                   # Rutas de sequelize-cli
├── controllers/
│   ├── productsController.js      # CRUD de productos
│   ├── usersController.js         # Registro, login, perfil
│   └── cartController.js          # Carrito y pedidos
├── routes/
│   ├── products.js                # Rutas de productos (escritura solo admin)
│   ├── users.js                   # Rutas de usuarios
│   └── cart.js                    # Rutas de carrito y pedidos
├── middlewares/
│   ├── authMiddleware.js          # guestOnly, authRequired, rememberMe
│   └── adminMiddleware.js         # adminOnly
├── database/
│   ├── config/config.js
│   ├── migrations/                # categories, users, products, orders, order-items
│   ├── models/                    # User, Category, Product, Order, OrderItem
│   └── seeders/                   # categorías, productos, administrador
├── views/
│   ├── main/  products/  users/  cart/  errors/  partials/
├── public/
│   ├── uploads/                   # Fotos de perfil
│   └── images/products/           # Imágenes de productos
├── tests/                         # unit/ e integration/
├── structure.sql  data.sql        # Respaldo SQL independiente del ORM
├── daily.md  retro.md             # Documentación ágil
```

---

## Modelo de datos

- `Categories` 1—N `Products`
- `Users` 1—N `Orders`
- `Orders` 1—N `OrderItems` N—1 `Products`

---

## Instalación y uso

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno y ajustarlas
cp .env.example .env

# 3. Levantar MySQL
docker compose up -d

# 4. Crear tablas y datos iniciales
npx sequelize db:migrate
npx sequelize db:seed:all

# 5. Iniciar el servidor
npm start
```

Abrir [http://localhost:3000](http://localhost:3000).

**Usuario administrador (seeder):** `admin@camilamanrique.com` / `Admin2026!`  
Cambiar esta contraseña antes de cualquier uso fuera del entorno académico.

**Tests:** `npm test` (requiere MySQL activo).

---

## Rutas

### Públicas
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Home con los últimos 3 productos |
| GET | `/products` | Catálogo (admite `?q=` para buscar) |
| GET | `/products/:id` | Detalle de producto |

### Invitados
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET/POST | `/users/register` | Registro con foto de perfil |
| GET/POST | `/users/login` | Inicio de sesión |

### Usuarios autenticados
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/users/profile` | Perfil |
| POST | `/users/logout` | Cerrar sesión |
| GET | `/cart` | Ver carrito |
| POST | `/cart/add` | Agregar producto |
| POST | `/cart/remove` | Quitar producto |
| POST | `/cart/checkout` | Confirmar pedido (se guarda en BD) |
| GET | `/cart/orders` | Mis pedidos |

### Solo administrador
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/products/create` | Formulario de creación |
| POST | `/products` | Crear producto (con imagen) |
| GET | `/products/:id/edit` | Formulario de edición |
| PUT | `/products/:id` | Actualizar producto |
| DELETE | `/products/:id` | Eliminar producto |

Sin sesión se redirige a `/users/login`. Con sesión de usuario normal se responde 403.

---

## Sprints

| Sprint | Contenido |
|--------|-----------|
| 1 | Planificación y stack |
| 2 | Aplicación base HTML |
| 3 | EJS, partials, vistas por dominio |
| 4 | CRUD de productos con JSON |
| 5 | Autenticación y sesiones |
| 6 | Sequelize + MySQL, Docker, seeders, tests |
| 7 | Roles (admin), `express-validator`, validaciones frontend, imágenes de producto, carrito y pedidos, home dinámico |

---

## Documentación ágil

- [`retro.md`](./retro.md) — Retrospectivas (Sprint 3, 6 y 7)
- [`daily.md`](./daily.md) — Daily Standups (Sprint 3 y 7)

---

## Autor

Proyecto académico del curso de Desarrollo Web.  
**Institución:** SENA — San Gil, Santander, Colombia  
**Año:** 2026
