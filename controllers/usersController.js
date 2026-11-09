const fs     = require('fs');
const path   = require('path');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const USERS_PATH = path.join(__dirname, '../data/users.json');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readUsers() {
    const raw = fs.readFileSync(USERS_PATH, 'utf-8');
    return JSON.parse(raw);
}

function writeUsers(users) {
    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2), 'utf-8');
}

// ─── Controlador ─────────────────────────────────────────────────────────────

const usersController = {

    // GET /users/register
    register(_req, res) {
        res.render('users/register', { errors: [] });
    },

    // POST /users/register
    async store(req, res) {
        // Capturar errores de validación de express-validator
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render('users/register', {
                errors: errors.array(),
                oldData: req.body
            });
        }

        const { nombre, apellido, email, password, confirmPassword } = req.body;
        const localErrors = [];

        if (!nombre || nombre.trim().length < 2)
            localErrors.push('El nombre debe tener al menos 2 caracteres.');
        if (!email || !email.includes('@'))
            localErrors.push('El correo electrónico no es válido.');
        if (!password || password.length < 6)
            localErrors.push('La contraseña debe tener al menos 6 caracteres.');
        if (password !== confirmPassword)
            localErrors.push('Las contraseñas no coinciden.');

        const users       = readUsers();
        const emailExists = users.find(u => u.email === email);
        if (emailExists) localErrors.push('Ya existe una cuenta con ese correo.');

        if (localErrors.length > 0) {
            return res.render('users/register', { errors: localErrors });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newId          = users.length > 0
            ? Math.max(...users.map(u => u.id)) + 1
            : 1;

        const imageFile = req.file ? req.file.filename : 'default-avatar.png';

        const newUser = {
            id:        newId,
            name:      (nombre.trim() + ' ' + (apellido ? apellido.trim() : '')).trim(),
            email:     email.trim().toLowerCase(),
            password:  hashedPassword,
            image:     imageFile,
            role:      'user',   // los usuarios del formulario público NUNCA son admin
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        writeUsers(users);

        req.session.user = {
            id:    newUser.id,
            name:  newUser.name,
            email: newUser.email,
            image: newUser.image,
            role:  newUser.role
        };

        // Forzar guardado de sesión antes del redirect
        req.session.save((err) => {
            if (err) console.error('Error guardando sesión:', err);
            res.redirect('/users/profile');
        });
    },

    // GET /users/login
    login(_req, res) {
        res.render('users/login', { error: null });
    },

    // POST /users/login
    async authenticate(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render('users/login', {
                errors: errors.array(),
                oldData: req.body
            });
        }

        const { email, password, rememberMe } = req.body;

        const users = readUsers();
        const user  = users.find(u => u.email === email.trim().toLowerCase());

        if (!user) {
            return res.render('users/login', { error: 'Correo o contraseña incorrectos.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.render('users/login', { error: 'Correo o contraseña incorrectos.' });
        }

        // Guardar en sesión (incluye role)
        req.session.user = {
            id:    user.id,
            name:  user.name,
            email: user.email,
            image: user.image,
            role:  user.role || 'user'
        };

        // Forzar guardado de sesión antes del redirect (necesario en Express 5)
        req.session.save((err) => {
            if (err) {
                console.error('Error guardando sesión:', err);
                return res.render('users/login', { error: 'Error interno. Intenta de nuevo.' });
            }

            // Cookie "Recordar usuario" — 7 días
            if (rememberMe === 'on') {
                res.cookie('rememberUser', user.email, {
                    maxAge:   7 * 24 * 60 * 60 * 1000,
                    httpOnly: true
                });
            }

            res.redirect('/users/profile');
        });
    },

    // GET /users/profile
    profile(req, res) {
        res.render('users/profile', { user: req.session.user });
    },

    // POST /users/logout
    logout(req, res) {
        req.session.destroy(() => {
            res.clearCookie('rememberUser');
            res.clearCookie('connect.sid'); // cookie de la sesión de express-session
            res.redirect('/');
        });
    }
};

module.exports = usersController;
