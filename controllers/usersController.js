'use strict';
const bcrypt        = require('bcryptjs');
const { User }      = require('../database/models');

const usersController = {

    // GET /users/register
    register(_req, res) {
        res.render('users/register', { errors: [] });
    },

    // POST /users/register
    async store(req, res) {
        const { nombre, apellido, name, email, password, confirmPassword } = req.body;
        const nombreFinal   = (nombre || name || '').trim();
        const apellidoFinal = (apellido || '').trim();
        const errors = [];

        if (!nombreFinal || nombreFinal.length < 2)
            errors.push('El nombre debe tener al menos 2 caracteres.');
        if (!email || !email.includes('@'))
            errors.push('El correo electrónico no es válido.');
        if (!password || password.length < 6)
            errors.push('La contraseña debe tener al menos 6 caracteres.');
        if (password !== confirmPassword)
            errors.push('Las contraseñas no coinciden.');

        if (errors.length > 0) {
            return res.render('users/register', { errors });
        }

        try {
            const emailExists = await User.findOne({ where: { email: email.trim().toLowerCase() } });
            if (emailExists) {
                return res.render('users/register', { errors: ['Ya existe una cuenta con ese correo.'] });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const imageFile      = req.file ? req.file.filename : null;

            const newUser = await User.create({
                nombre:   nombreFinal,
                apellido: apellidoFinal,
                email:    email.trim().toLowerCase(),
                password: hashedPassword,
                imagen:   imageFile
            });

            // Auto-login tras registro
            req.session.user = {
                id:     newUser.id,
                nombre: newUser.nombre,
                email:  newUser.email,
                image:  newUser.imagen
            };

            res.redirect('/users/profile');

        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                return res.render('users/register', { errors: ['Ya existe una cuenta con ese correo.'] });
            }
            console.error('Error al registrar usuario:', err);
            res.status(500).send('Error interno del servidor.');
        }
    },

    // GET /users/login
    login(_req, res) {
        res.render('users/login', { error: null });
    },

    // POST /users/login
    async authenticate(req, res) {
        const { email, password, rememberMe } = req.body;

        try {
            const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });

            if (!user) {
                return res.render('users/login', { error: 'Correo o contraseña incorrectos.' });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.render('users/login', { error: 'Correo o contraseña incorrectos.' });
            }

            // Guardar en sesión
            req.session.user = {
                id:     user.id,
                nombre: user.nombre,
                email:  user.email,
                image:  user.imagen
            };

            // Cookie "Recordar usuario" — 7 días
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
