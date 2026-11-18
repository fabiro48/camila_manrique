require('dotenv').config();
const express        = require('express');
const path           = require('path');
const methodOverride = require('method-override');
const session        = require('express-session');
const cookieParser   = require('cookie-parser');

const productsRouter = require('./routes/products');
const usersRouter    = require('./routes/users');
const cartRouter     = require('./routes/cart');

const { rememberMe }  = require('./middlewares/authMiddleware');
const { sequelize, Product } = require('./database/models');

const app = express();

// --- Middleware ---
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --- Sesiones ---
app.use(session({
    secret:            process.env.SESSION_SECRET || 'fallback_secret',
    resave:            false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// --- Auto-login por cookie "Recordar usuario" ---
app.use(rememberMe);

// --- Variables locales globales ---
app.use((req, res, next) => {
    res.locals.sessionUser = req.session.user || null;
    res.locals.cartCount   = (req.session.cart || []).reduce((s, i) => s + i.cantidad, 0);
    next();
});

// --- Motor de plantillas EJS ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Rutas ---

// Home con productos reales (últimos 3)
app.get('/', async (_req, res) => {
    try {
        const featuredProducts = await Product.findAll({
            limit: 3,
            order: [['createdAt', 'DESC']]
        });
        res.render('main/index', { featuredProducts });
    } catch (err) {
        console.error('Error en home:', err);
        res.render('main/index', { featuredProducts: [] });
    }
});

app.use('/products', productsRouter);
app.use('/users',    usersRouter);
app.use('/cart',     cartRouter);

// --- Conexión a BD y arranque ---
sequelize.authenticate()
    .then(() => {
        console.log('✅ Conexión a MySQL establecida.');
        app.listen(3000, () => {
            console.log('Servidor corriendo en http://localhost:3000');
        });
    })
    .catch(err => {
        console.error('❌ No se pudo conectar a la base de datos:', err.message);
        process.exit(1);
    });
