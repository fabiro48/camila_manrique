'use strict';
const express        = require('express');
const router         = express.Router();
const cartController = require('../controllers/cartController');
const { authRequired } = require('../middlewares/authMiddleware');
const { customerOnly } = require('../middlewares/adminMiddleware');

// GET  /cart              → ver carrito (autenticado)
router.get('/',          authRequired, customerOnly, cartController.index);

// POST /cart/add          → agregar producto al carrito
router.post('/add',      authRequired, customerOnly, cartController.add);

// POST /cart/remove       → quitar un item del carrito
router.post('/remove',   authRequired, customerOnly, cartController.remove);

// POST /cart/checkout     → confirmar pedido y guardar en BD
router.post('/checkout', authRequired, customerOnly, cartController.checkout);

// GET  /cart/orders       → mis pedidos
router.get('/orders',    authRequired, customerOnly, cartController.orders);

module.exports = router;
