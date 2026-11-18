'use strict';
const express         = require('express');
const router          = express.Router();
const multer          = require('multer');
const path            = require('path');
const { body }        = require('express-validator');
const usersController = require('../controllers/usersController');
const { guestOnly, authRequired } = require('../middlewares/authMiddleware');

// --- Multer para foto de perfil ---
const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename(_req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});
const fileFilter = (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase()) &&
               allowed.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP.'));
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });

// --- Validaciones de registro ---
const registerValidations = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres.')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras.'),
    body('apellido')
        .trim()
        .notEmpty().withMessage('El apellido es obligatorio.')
        .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres.')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El apellido solo puede contener letras.'),
    body('email')
        .trim()
        .notEmpty().withMessage('El correo es obligatorio.')
        .isEmail().withMessage('El correo no tiene un formato válido.')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria.')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número.'),
    body('confirmPassword')
        .custom((val, { req }) => val === req.body.password)
        .withMessage('Las contraseñas no coinciden.')
];

// --- Validaciones de login ---
const loginValidations = [
    body('email')
        .trim()
        .notEmpty().withMessage('El correo es obligatorio.')
        .isEmail().withMessage('El correo no tiene un formato válido.')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria.')
];

// GET  /users/register
router.get('/register',  guestOnly, usersController.register);
// POST /users/register
router.post('/register', guestOnly, upload.single('image'), registerValidations, usersController.store);

// GET  /users/login
router.get('/login',     guestOnly, usersController.login);
// POST /users/login
router.post('/login',    guestOnly, loginValidations, usersController.authenticate);

// GET  /users/profile
router.get('/profile',   authRequired, usersController.profile);

// POST /users/logout
router.post('/logout',   usersController.logout);

module.exports = router;
