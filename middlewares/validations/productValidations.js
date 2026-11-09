const { body } = require('express-validator');
const path = require('path');

const productValidations = [
    body('name')
        .notEmpty().withMessage('El nombre del producto es obligatorio.')
        .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres.'),

    body('description')
        .isLength({ min: 20 }).withMessage('La descripción debe tener al menos 20 caracteres.'),

    body('price')
        .notEmpty().withMessage('El precio es obligatorio.')
        .isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor a 0.'),

    body('imagen').custom((value, { req }) => {
        if (!req.file) return true; // Imagen opcional en edición
        const allowed = /jpeg|jpg|png|gif/;
        const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '');
        const mime = req.file.mimetype.split('/')[1];
        if (!allowed.test(ext) || !allowed.test(mime)) {
            throw new Error('La imagen debe ser JPG, JPEG, PNG o GIF.');
        }
        return true;
    })
];

module.exports = { productValidations };
