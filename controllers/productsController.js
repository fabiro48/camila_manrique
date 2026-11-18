'use strict';
const { validationResult } = require('express-validator');
const { Product, Category } = require('../database/models');
const { Op }                = require('sequelize');

const productsController = {

    /** GET /products */
    async index(req, res) {
        try {
            let products;
            if (req.query.q) {
                const term = req.query.q;
                products = await Product.findAll({
                    where: {
                        [Op.or]: [
                            { nombre:      { [Op.like]: `%${term}%` } },
                            { descripcion: { [Op.like]: `%${term}%` } }
                        ]
                    },
                    include: [{ model: Category, as: 'category' }]
                });
            } else {
                products = await Product.findAll({
                    include: [{ model: Category, as: 'category' }]
                });
            }
            res.render('products/index', { products });
        } catch (err) {
            console.error('Error al listar productos:', err);
            res.status(500).send('Error interno del servidor.');
        }
    },

    /** GET /products/create */
    async create(_req, res) {
        try {
            const categories = await Category.findAll();
            res.render('products/createProduct', { categories, errors: [] });
        } catch (err) {
            console.error('Error al cargar formulario de creación:', err);
            res.status(500).send('Error interno del servidor.');
        }
    },

    /** POST /products */
    async store(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const categories = await Category.findAll();
            return res.render('products/createProduct', {
                categories,
                errors: errors.array().map(e => e.msg),
                body:   req.body
            });
        }
        try {
            await Product.create({
                nombre:      req.body.nombre.trim(),
                descripcion: req.body.descripcion.trim(),
                precio:      parseFloat(req.body.precio),
                imagen:      req.file ? `/images/products/${req.file.filename}` : (req.body.imagen || null),
                inOffer:     req.body.inOffer === 'on',
                categoryId:  req.body.categoryId || null,
                stock:       parseInt(req.body.stock) || 0
            });
            res.redirect('/products');
        } catch (err) {
            console.error('Error al crear producto:', err);
            res.status(500).send('Error interno del servidor.');
        }
    },

    /** GET /products/:id */
    async detail(req, res) {
        try {
            const product = await Product.findByPk(req.params.id, {
                include: [{ model: Category, as: 'category' }]
            });
            if (!product) return res.status(404).render('errors/403');
            res.render('products/detail', { product });
        } catch (err) {
            console.error('Error al obtener detalle del producto:', err);
            res.status(500).send('Error interno del servidor.');
        }
    },

    /** GET /products/:id/edit */
    async edit(req, res) {
        try {
            const product    = await Product.findByPk(req.params.id);
            const categories = await Category.findAll();
            if (!product) return res.redirect('/products');
            res.render('products/editProduct', { product, categories, errors: [] });
        } catch (err) {
            console.error('Error al cargar formulario de edición:', err);
            res.status(500).send('Error interno del servidor.');
        }
    },

    /** PUT /products/:id */
    async update(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const product    = await Product.findByPk(req.params.id);
            const categories = await Category.findAll();
            return res.render('products/editProduct', {
                product,
                categories,
                errors: errors.array().map(e => e.msg),
                body:   req.body
            });
        }
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) return res.redirect('/products');

            await product.update({
                nombre:      req.body.nombre.trim(),
                descripcion: req.body.descripcion.trim(),
                precio:      parseFloat(req.body.precio),
                imagen:      req.file ? `/images/products/${req.file.filename}` : (req.body.imagen || product.imagen),
                inOffer:     req.body.inOffer === 'on',
                categoryId:  req.body.categoryId || product.categoryId,
                stock:       parseInt(req.body.stock) || product.stock
            });
            res.redirect('/products');
        } catch (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).send('Error interno del servidor.');
        }
    },

    /** DELETE /products/:id */
    async destroy(req, res) {
        try {
            await Product.destroy({ where: { id: req.params.id } });
            res.redirect('/products');
        } catch (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).send('Error interno del servidor.');
        }
    }
};

module.exports = productsController;
