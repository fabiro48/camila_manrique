const fs     = require('fs');
const path   = require('path');
const bcrypt = require('bcryptjs');

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
        const { name, email, password, confirmPassword } = req.body;
        const errors = [];

        if (!name || name.trim().length < 2)
            errors.push('El nombre debe tener al menos 2 caracteres.');
        if (!email || !email.includes('@'))
            errors.push('El correo electrónico no es válido.');
        if (!password || password.length < 6)
            errors.push('La contraseña debe tener al menos 6 caracteres.');
        if (password !== confirmPassword)
            errors.push('Las contraseñas no coinciden.');

        const users       = readUsers();
        const emailExists = users.find(u => u.email === email);
        if (emailExists) errors.push('Ya existe una cuenta con ese correo.');

        if (errors.length > 0) {
            return res.render('users/register', { errors });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newId          = users.length > 0
            ? Math.max(...users.map(u => u.id)) + 1
            : 1;

        const imageFile = req.file ? req.file.filename : 'default-avatar.png';

        const newUser = {
            id:       newId,
            name:     name.trim(),
            email:    email.trim().toLowerCase(),
            password: hashedPassword,
            image:    imageFile,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        writeUsers(users);

        // Auto-login tras registro
        req.session.user = {
            id:    newUser.id,
            name:  newUser.name,
            email: newUser.email,
            image: newUser.image
        };

        res.redirect('/users/profile');
    },

    // GET /users/login
    login(_req, res) {
        res.render('users/login', { error: null });
    },

    // POST /users/login
    async authenticate(req, res) {
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

        // Guardar en sesión
        req.session.user = {
            id:    user.id,
            name:  user.name,
            email: user.email,
            image: user.image
        };

        // Cookie "Recordar usuario" — 7 días
        if (rememberMe === 'on') {
            res.cookie('rememberUser', user.email, {
                maxAge:   7 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });
        }

        res.redirect('/users/profile');
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
