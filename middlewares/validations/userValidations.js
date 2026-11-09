const { body } = require('express-validator');
const path = require('path');
const fs = require('fs');

// ─── Helper: leer usuarios desde JSON ─────────────────────────────────────────
// No existe un modelo Sequelize (User); el proyecto usa data/users.json.
// Este helper replica el patrón usado en usersController.js.

const USERS_PATH = path.join(__dirname, '../../data/users.json');

function readUsers() {
    const raw = fs.readFileSync(USERS_PATH, 'utf-8');
    return JSON.parse(raw);
}

// ─── Validaciones de Registro ──────────────────────────────────────────────────

const registerValidations = [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.'),

    body('apellido')
        .notEmpty().withMessage('El apellido es obligatorio.')
        .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres.'),

    body('email')
        .notEmpty().withMessage('El correo electrónico es obligatorio.')
        .isEmail().withMessage('Debe ingresar un correo electrónico válido.')
        .custom(async (value) => {
            const users = readUsers();
            const existing = users.find(u => u.email === value.trim().toLowerCase());
            if (existing) throw new Error('Ya existe una cuenta con este correo electrónico.');
            return true;
        }),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria.')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.'),

    body('imagen').custom((value, { req }) => {
        if (!req.file) return true; // Imagen opcional
        const allowed = /jpeg|jpg|png|gif/;
        const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '');
        const mime = req.file.mimetype.split('/')[1];
        if (!allowed.test(ext) || !allowed.test(mime)) {
            throw new Error('La imagen debe ser JPG, JPEG, PNG o GIF.');
        }
        return true;
    })
];

// ─── Validaciones de Login ────────────────────────────────────────────────────

const loginValidations = [
    body('email')
        .notEmpty().withMessage('El correo electrónico es obligatorio.')
        .isEmail().withMessage('Debe ingresar un correo electrónico válido.'),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria.')
];

module.exports = { registerValidations, loginValidations };
