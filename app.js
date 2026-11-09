const express        = require('express');
const path           = require('path');
const methodOverride = require('method-override');
const session        = require('express-session');
const cookieParser   = require('cookie-parser');

const productsRouter = require('./routes/products');
const usersRouter    = require('./routes/users');
const { rememberMe } = require('./middlewares/authMiddleware');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Sesiones ─────────────────────────────────────────────────────────────────
app.use(session({
    secret:            'camila_manrique_secret_2026',
    resave:            true,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 día
}));

// ─── Auto-login por cookie "Recordar usuario" ─────────────────────────────────
app.use(rememberMe);

// ─── Variables locales globales (accesibles en todas las vistas) ──────────────
app.use((req, res, next) => {
    res.locals.isLogged    = false;
    res.locals.user        = null;
    res.locals.sessionUser = null;

    if (req.session && req.session.user) {
        res.locals.isLogged    = true;
        res.locals.user        = req.session.user;
        res.locals.sessionUser = req.session.user;
    }
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

// ─── Servidor ─────────────────────────────────────────────────────────────────
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
