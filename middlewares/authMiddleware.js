const fs     = require('fs');
const path   = require('path');

const USERS_PATH = path.join(__dirname, '../data/users.json');

function readUsers() {
    const raw = fs.readFileSync(USERS_PATH, 'utf-8');
    return JSON.parse(raw);
}

/**
 * guestOnly — Solo invitados pueden pasar (login / registro).
 * Si ya hay sesión activa, redirige al perfil.
 */
function guestOnly(req, res, next) {
    if (req.session && req.session.user) {
        return res.redirect('/users/profile');
    }
    next();
}

/**
 * authRequired — Solo usuarios autenticados pueden pasar.
 * Si no hay sesión, redirige al login.
 */
function authRequired(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/users/login');
}

/**
 * adminRequired — Solo administradores pueden pasar.
 * Si no hay sesión → redirige al login.
 * Si hay sesión pero no es admin → 403.
 */
function adminRequired(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.redirect('/users/login');
    }
    if (req.session.user.role !== 'admin') {
        return res.status(403).send('<h1>403 — Acceso denegado</h1><p>Solo los administradores pueden realizar esta acción.</p><a href="/products">← Volver al catálogo</a>');
    }
    next();
}

/**
 * rememberMe — Middleware global que auto-loguea al usuario
 * si existe la cookie "rememberUser" y no hay sesión activa.
 */
function rememberMe(req, res, next) {
    if (req.session && req.session.user) {
        return next(); // ya está logueado
    }

    const rememberedEmail = req.cookies && req.cookies.rememberUser;
    if (!rememberedEmail) {
        return next();
    }

    const users = readUsers();
    const user  = users.find(u => u.email === rememberedEmail);
    if (user) {
        req.session.user = {
            id:    user.id,
            name:  user.name,
            email: user.email,
            image: user.image,
            role:  user.role || 'user'
        };
    }

    next();
}

module.exports = { guestOnly, authRequired, adminRequired, rememberMe };
