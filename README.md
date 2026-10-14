# Camila Manrique — Marroquinería & Bolsos Exclusivos

Aplicación web e-commerce desarrollada con **Node.js**, **Express** y **EJS** para la tienda de marroquinería artesanal "Camila Manrique", ubicada en el Centro Comercial San Gil Plaza, Santander — Colombia.

---

## Tecnologías utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/) v5
- [EJS](https://ejs.co/) — Motor de plantillas
- [method-override](https://github.com/expressjs/method-override) — Soporte para PUT y DELETE desde formularios HTML

---

## Estructura del proyecto

```
├── app.js                        # Servidor principal
├── package.json
├── README.md
│
├── controllers/
│   └── productsController.js     # Lógica CRUD de productos
│
├── routes/
│   └── products.js               # Rutas RESTful de productos
│
├── data/
│   └── productsDataBase.json     # Base de datos en JSON
│
├── views/
│   ├── main/
│   │   └── index.ejs             # Página principal (home)
│   ├── products/
│   │   ├── index.ejs             # Lista de productos
│   │   ├── detail.ejs            # Detalle de producto
│   │   ├── createProduct.ejs     # Formulario de creación
│   │   └── editProduct.ejs       # Formulario de edición
│   └── partials/
│       ├── head.ejs              # Metadatos y estilos globales
│       ├── header.ejs            # Barra de navegación
│       └── footer.ejs            # Pie de página
│
├── retro.md                      # Retrospectiva Sprint 3 — Estrella de Mar
└── daily.md                      # Daily Standups Sprint 3
```

---

## Instalación y uso

```bash
# Clonar el repositorio
git clone https://github.com/fabiro48/camila_manrique.git
cd camila_manrique

# Instalar dependencias
npm install

# Iniciar el servidor
npm start
```

Luego abre el navegador en: [http://localhost:3000](http://localhost:3000)

---

## Rutas disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Página principal |
| GET | `/products` | Lista de todos los productos |
| GET | `/products/create` | Formulario para crear producto |
| POST | `/products` | Guarda un nuevo producto |
| GET | `/products/:id` | Detalle de un producto |
| GET | `/products/:id/edit` | Formulario para editar producto |
| PUT | `/products/:id` | Actualiza un producto |
| DELETE | `/products/:id` | Elimina un producto |

---

## Sprints del proyecto

### Sprint 2
- Estructura base de la aplicación en Node.js + Express
- Página principal estática en HTML

### Sprint 3
- Integración de EJS como motor de plantillas
- Creación de componentes reutilizables: `head`, `header` y `footer` (partials)
- Reorganización de vistas en subcarpetas por dominio (`main/`, `products/`)
- Documentación ágil: retrospectiva (Estrella de Mar) y Daily Standups

### Sprint 4
- Arquitectura MVC: controladores y rutas separados
- CRUD completo de productos usando el módulo `fs` de Node.js y JSON como base de datos
- Soporte para métodos PUT y DELETE desde formularios HTML con `method-override`
- Vistas: listado, detalle, creación y edición de productos

---

## Documentación ágil

- [`retro.md`](./retro.md) — Retrospectiva Sprint 3 con la dinámica Estrella de Mar
- [`daily.md`](./daily.md) — Registro de Daily Standups del Sprint 3

---

## Autor

Proyecto académico desarrollado como parte del curso de Desarrollo Web.  
**Institución:** SENA / Universidad — San Gil, Santander, Colombia  
**Año:** 2026
