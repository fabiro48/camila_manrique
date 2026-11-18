'use strict';

/**
 * adminOnly — Solo usuarios con rol 'admin' pueden pasar.
 * Si no hay sesión, redirige al login.
 * Si hay sesión pero no es admin, devuelve 403.
 */
function adminOnly(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.redirect('/users/login');
    }
    if (req.session.user.rol !== 'admin') {
        return res.status(403).render('errors/403');
    }
    next();
}

/**
 * customerOnly - El administrador no usa carrito ni pedidos.
 * Debe ir despues de authRequired.
 */
function customerOnly(req, res, next) {
    if (req.session && req.session.user && req.session.user.rol === 'admin') {
        return res.status(403).render('errors/403');
    }
    next();
}

module.exports = { adminOnly, customerOnly };
