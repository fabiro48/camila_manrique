require('dotenv').config();

const express        = require('express');
const path           = require('path');
const methodOverride = require('method-override');
const session        = require('express-session');
const cookieParser   = require('cookie-parser');

const productsRouter    = require('./routes/products');
const usersRouter       = require('./routes/users');
const { rememberMe }    = require('./middlewares/authMiddleware');
const { sequelize }     = require('./database/models');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Sesiones ─────────────────────────────────────────────────────────────────
app.use(session({
    secret:            process.env.SESSION_SECRET || 'fallback_secret',
    resave:            false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 día
}));

// ─── Auto-login por cookie "Recordar usuario" ─────────────────────────────────
app.use(rememberMe);

// ─── Variables locales globales (accesibles en todas las vistas) ──────────────
app.use((req, res, next) => {
    res.locals.sessionUser = req.session.user || null;
    next();
});

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

// Usuarios (auth, sesiones)
app.use('/users', usersRouter);

// ─── Conexión a la base de datos y arranque del servidor ──────────────────────
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
