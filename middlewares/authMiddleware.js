'use strict';
const { User } = require('../database/models');

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
 * rememberMe — Middleware global que auto-loguea al usuario
 * si existe la cookie "rememberUser" y no hay sesión activa.
 */
async function rememberMe(req, res, next) {
    if (req.session && req.session.user) {
        return next(); // ya está logueado
    }

    const rememberedEmail = req.cookies && req.cookies.rememberUser;
    if (!rememberedEmail) {
        return next();
    }

    try {
        const user = await User.findOne({ where: { email: rememberedEmail } });
        if (user) {
            req.session.user = {
                id:     user.id,
                nombre: user.nombre,
                email:  user.email,
                image:  user.imagen
            };
        }
    } catch (err) {
        console.error('Error en rememberMe middleware:', err);
    }

    next();
}

module.exports = { guestOnly, authRequired, rememberMe };
