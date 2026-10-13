const express            = require('express');
const router             = express.Router();
const productsController = require('../controllers/productsController');

// GET  /products          → lista de productos
router.get('/',            productsController.index);

// GET  /products/create   → formulario de creación (DEBE ir antes de /:id)
router.get('/create',      productsController.create);

// POST /products          → guardar nuevo producto
router.post('/',           productsController.store);

// GET  /products/:id      → detalle de producto
router.get('/:id',         productsController.detail);

// GET  /products/:id/edit → formulario de edición
router.get('/:id/edit',    productsController.edit);

// PUT  /products/:id      → actualizar producto
router.put('/:id',         productsController.update);

// DELETE /products/:id    → eliminar producto
router.delete('/:id',      productsController.destroy);

module.exports = router;
