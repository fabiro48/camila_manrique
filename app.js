const express        = require('express');
const path           = require('path');
const methodOverride = require('method-override');
const productsRouter = require('./routes/products');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Motor de plantillas EJS ──────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Rutas ────────────────────────────────────────────────────────────────────

// Home
app.get('/', (_req, res) => {
    res.render('main/index');
});

// Productos (CRUD completo)
app.use('/products', productsRouter);

// ─── Servidor ─────────────────────────────────────────────────────────────────
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
