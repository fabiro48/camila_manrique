'use strict';
const express            = require('express');
const router             = express.Router();
const multer             = require('multer');
const path               = require('path');
const { body }           = require('express-validator');
const productsController = require('../controllers/productsController');
const { adminOnly }      = require('../middlewares/adminMiddleware');

// --- Multer para imágenes de productos ---
const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, path.join(__dirname, '../public/images/products'));
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

// --- Validaciones de producto ---
const productValidations = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres.'),
    body('descripcion')
        .trim()
        .notEmpty().withMessage('La descripción es obligatoria.')
        .isLength({ max: 500 }).withMessage('La descripción no puede superar 500 caracteres.'),
    body('precio')
        .notEmpty().withMessage('El precio es obligatorio.')
        .isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor a 0.')
        .custom(val => val <= 9999999).withMessage('El precio excede el máximo permitido.'),
    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('El stock no puede ser negativo.'),
    body('categoryId')
        .notEmpty().withMessage('Debes seleccionar una categoría.')
];

// GET  /products          → lista (público)
router.get('/',            productsController.index);

// GET  /products/create   → formulario (solo admin)
router.get('/create',      adminOnly, productsController.create);

// POST /products          → guardar (solo admin + validaciones)
router.post('/',           adminOnly, upload.single('imagen'), productValidations, productsController.store);

// GET  /products/:id      → detalle (público)
router.get('/:id',         productsController.detail);

// GET  /products/:id/edit → formulario edición (solo admin)
router.get('/:id/edit',    adminOnly, productsController.edit);

// PUT  /products/:id      → actualizar (solo admin + validaciones)
router.put('/:id',         adminOnly, upload.single('imagen'), productValidations, productsController.update);

// DELETE /products/:id    → eliminar (solo admin)
router.delete('/:id',      adminOnly, productsController.destroy);

module.exports = router;
