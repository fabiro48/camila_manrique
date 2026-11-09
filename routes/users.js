const express         = require('express');
const router          = express.Router();
const multer          = require('multer');
const path            = require('path');
const usersController = require('../controllers/usersController');
const { guestOnly, authRequired } = require('../middlewares/authMiddleware');
const { registerValidations, loginValidations } = require('../middlewares/validations/userValidations');

// ─── Configuración de Multer ──────────────────────────────────────────────────

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
    const extOk   = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk  = allowed.test(file.mimetype);
    if (extOk && mimeOk) return cb(null, true);
    cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP.'));
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2 MB máximo
});

// ─── Rutas ────────────────────────────────────────────────────────────────────

// GET  /users/register  — solo invitados
router.get('/register',  guestOnly, usersController.register);

// POST /users/register  — solo invitados, con subida de imagen
router.post('/register', guestOnly, upload.single('image'), registerValidations, usersController.store);

// GET  /users/login     — solo invitados
router.get('/login',     guestOnly, usersController.login);

// POST /users/login     — solo invitados
router.post('/login',    guestOnly, loginValidations, usersController.authenticate);

// GET  /users/profile   — solo autenticados
router.get('/profile',   authRequired, usersController.profile);

// POST /users/logout
router.post('/logout',   usersController.logout);

module.exports = router;
