const express            = require('express');
const router             = express.Router();
const productsController = require('../controllers/productsController');
const { productValidations } = require('../middlewares/validations/productValidations');
const { adminRequired } = require('../middlewares/authMiddleware');

// GET  /products          → lista de productos (público)
router.get('/',            productsController.index);

// GET  /products/create   → formulario de creación (solo admin)
router.get('/create',      adminRequired, productsController.create);

// POST /products          → guardar nuevo producto (solo admin)
router.post('/',           adminRequired, productValidations, productsController.store);

// GET  /products/:id      → detalle de producto (público)
router.get('/:id',         productsController.detail);

// GET  /products/:id/edit → formulario de edición (solo admin)
router.get('/:id/edit',    adminRequired, productsController.edit);

// PUT  /products/:id      → actualizar producto (solo admin)
router.put('/:id',         adminRequired, productValidations, productsController.update);

// DELETE /products/:id    → eliminar producto (solo admin)
router.delete('/:id',      adminRequired, productsController.destroy);

module.exports = router;
