'use strict';
const { Product, Order, OrderItem } = require('../database/models');

/**
 * El carrito se guarda en sesión como:
 * req.session.cart = [{ productId, nombre, precio, imagen, cantidad }]
 */

const cartController = {

    /** GET /cart — Ver carrito */
    async index(req, res) {
        const cart  = req.session.cart || [];
        const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        res.render('cart/index', { cart, total });
    },

    /** POST /cart/add — Agregar producto */
    async add(req, res) {
        const { productId, cantidad } = req.body;
        const qty = parseInt(cantidad) || 1;

        try {
            const product = await Product.findByPk(productId);
            if (!product) return res.redirect('/products');

            if (!req.session.cart) req.session.cart = [];

            const existing = req.session.cart.find(i => i.productId === product.id);
            if (existing) {
                existing.cantidad += qty;
            } else {
                req.session.cart.push({
                    productId:  product.id,
                    nombre:     product.nombre,
                    precio:     parseFloat(product.precio),
                    imagen:     product.imagen || null,
                    cantidad:   qty
                });
            }

            res.redirect('/cart');
        } catch (err) {
            console.error('Error al agregar al carrito:', err);
            res.redirect('/products');
        }
    },

    /** POST /cart/remove — Quitar un item */
    remove(req, res) {
        const productId = parseInt(req.body.productId);
        if (req.session.cart) {
            req.session.cart = req.session.cart.filter(i => i.productId !== productId);
        }
        res.redirect('/cart');
    },

    /** POST /cart/checkout — Confirmar pedido y guardar en BD */
    async checkout(req, res) {
        const cart = req.session.cart || [];
        if (cart.length === 0) return res.redirect('/cart');

        const userId = req.session.user.id;
        const total  = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

        try {
            const order = await Order.create({ userId, total, estado: 'pendiente' });

            const items = cart.map(item => ({
                orderId:        order.id,
                productId:      item.productId,
                cantidad:       item.cantidad,
                precioUnitario: item.precio,
                createdAt:      new Date(),
                updatedAt:      new Date()
            }));

            await OrderItem.bulkCreate(items);

            // Limpiar carrito de la sesión
            req.session.cart = [];

            res.redirect('/cart/orders');
        } catch (err) {
            console.error('Error al confirmar pedido:', err);
            res.redirect('/cart');
        }
    },

    /** GET /cart/orders — Mis pedidos */
    async orders(req, res) {
        try {
            const orders = await Order.findAll({
                where:   { userId: req.session.user.id },
                include: [{
                    model: OrderItem,
                    as:    'items',
                    include: [{ model: Product, as: 'product' }]
                }],
                order: [['createdAt', 'DESC']]
            });
            res.render('cart/orders', { orders });
        } catch (err) {
            console.error('Error al obtener pedidos:', err);
            res.status(500).send('Error interno del servidor.');
        }
    }
};

module.exports = cartController;
