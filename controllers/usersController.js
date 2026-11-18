'use strict';
const bcrypt               = require('bcryptjs');
const { validationResult } = require('express-validator');
const { User }             = require('../database/models');

const usersController = {

    // GET /users/register
    register(_req, res) {
        res.render('users/register', { errors: [], body: {} });
    },

    // POST /users/register
    async store(req, res) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.render('users/register', {
                errors: result.array().map(e => e.msg),
                body:   req.body
            });
        }

        const { nombre, apellido, email, password } = req.body;

        try {
            const emailExists = await User.findOne({ where: { email: email.trim().toLowerCase() } });
            if (emailExists) {
                return res.render('users/register', {
                    errors: ['Ya existe una cuenta con ese correo.'],
                    body:   req.body
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const imageFile      = req.file ? req.file.filename : null;

            const newUser = await User.create({
                nombre:   nombre.trim(),
                apellido: apellido.trim(),
                email:    email.trim().toLowerCase(),
                password: hashedPassword,
                imagen:   imageFile
            });

            req.session.user = {
                id:     newUser.id,
                nombre: newUser.nombre,
                email:  newUser.email,
                rol:    newUser.rol,
                image:  newUser.imagen
            };

            res.redirect('/users/profile');

        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                return res.render('users/register', {
                    errors: ['Ya existe una cuenta con ese correo.'],
                    body:   req.body
                });
            }
            console.error('Error al registrar usuario:', err);
            res.status(500).send('Error interno del servidor.');
        }
    },

    // GET /users/login
    login(_req, res) {
        res.render('users/login', { errors: [], body: {} });
    },

    // POST /users/login
    async authenticate(req, res) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.render('users/login', {
                errors: result.array().map(e => e.msg),
                body:   req.body
            });
        }

        const { email, password, rememberMe } = req.body;

        try {
            const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.render('users/login', {
                    errors: ['Correo o contraseña incorrectos.'],
                    body:   req.body
                });
            }

            req.session.user = {
                id:     user.id,
                nombre: user.nombre,
                email:  user.email,
                rol:    user.rol,
                image:  user.imagen
            };

            if (rememberMe === 'on') {
                res.cookie('rememberUser', user.email, {
                    maxAge:   7 * 24 * 60 * 60 * 1000,
                    httpOnly: true
                });
            }

            res.redirect('/users/profile');

        } catch (err) {
            console.error('Error al autenticar usuario:', err);
            res.status(500).send('Error interno del servidor.');
        }
    },

    // GET /users/profile
    profile(req, res) {
        res.render('users/profile', { user: req.session.user });
    },

    // POST /users/logout
    logout(req, res) {
        req.session.destroy(() => {
            res.clearCookie('rememberUser');
            res.redirect('/users/login');
        });
    }
};

module.exports = usersController;
