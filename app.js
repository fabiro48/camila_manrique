const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Rutas principales ────────────────────────────────────────────────────────

// Home → views/main/index.ejs
app.get('/', (_req, res) => {
    res.render('main/index');
});

// ─── Rutas de Productos ───────────────────────────────────────────────────────

// Formulario para crear producto
app.get('/productos/nuevo', (_req, res) => {
    res.render('products/createProduct');
});

// Guardar nuevo producto (POST)
app.post('/productos', (req, res) => {
    const { nombre, precio, descripcion } = req.body;
    // TODO: persistir en base de datos
    console.log('Nuevo producto:', { nombre, precio, descripcion });
    res.redirect('/');
});

// Formulario para editar producto
app.get('/productos/:id/editar', (req, res) => {
    const { id } = req.params;
    // TODO: obtener producto real desde base de datos
    const product = {
        id,
        nombre: 'Corte de cabello clásico',
        precio: 25000,
        descripcion: 'Corte tradicional con tijeras y máquina'
    };
    res.render('products/editProduct', { product });
});

// Actualizar producto (POST con _method override o POST directo)
app.post('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, descripcion } = req.body;
    // TODO: actualizar en base de datos
    console.log(`Actualizar producto ${id}:`, { nombre, precio, descripcion });
    res.redirect('/');
});

// ─── Servidor ─────────────────────────────────────────────────────────────────
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
