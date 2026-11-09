'use strict';
const { Product, Category } = require('../database/models');
const { Op }                = require('sequelize');

const productsController = {

    /** GET /products — Lista todos los productos */
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

    /** GET /products/create — Formulario de creación */
    async create(_req, res) {
        try {
            const categories = await Category.findAll();
            res.render('products/createProduct', { categories });
        } catch (err) {
            console.error('Error al cargar formulario de creación:', err);
            res.status(500).send('Error interno del servidor.');
        }
    },

    /** POST /products — Guarda un nuevo producto */
    async store(req, res) {
        try {
            await Product.create({
                nombre:      req.body.nombre      || req.body.name        || '',
                descripcion: req.body.descripcion || req.body.description || '',
                precio:      parseFloat(req.body.precio || req.body.price) || 0,
                imagen:      req.file ? req.file.filename : (req.body.imagen || req.body.image || null),
                inOffer:     req.body.inOffer === 'true' || req.body.inOffer === 'on',
                categoryId:  req.body.categoryId  || null,
                stock:       parseInt(req.body.stock) || 0
            });
            res.redirect('/products');
        } catch (err) {
            console.error('Error al crear producto:', err);
            res.status(500).send('Error interno del servidor.');
        }
    },

    /** GET /products/:id — Detalle de un producto */
    async detail(req, res) {
        try {
            const product = await Product.findByPk(req.params.id, {
                include: [{ model: Category, as: 'category' }]
            });

            if (!product) {
                return res.status(404).render('main/index');
            }

            res.render('products/detail', { product });
        } catch (err) {
            console.error('Error al obtener detalle del producto:', err);
            res.status(500).send('Error interno del servidor.');
        }
    },

    /** GET /products/:id/edit — Formulario de edición */
    async edit(req, res) {
        try {
            const product    = await Product.findByPk(req.params.id);
            const categories = await Category.findAll();

            if (!product) {
                return res.redirect('/products');
            }

            res.render('products/editProduct', { product, categories });
        } catch (err) {
            console.error('Error al cargar formulario de edición:', err);
            res.status(500).send('Error interno del servidor.');
        }
    },

    /** PUT /products/:id — Actualiza un producto */
    async update(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);

            if (!product) {
                return res.redirect('/products');
            }

            await product.update({
                nombre:      req.body.nombre      || req.body.name        || product.nombre,
                descripcion: req.body.descripcion || req.body.description || product.descripcion,
                precio:      parseFloat(req.body.precio || req.body.price) || product.precio,
                imagen:      req.file ? req.file.filename : (req.body.imagen || req.body.image || product.imagen),
                inOffer:     req.body.inOffer === 'true' || req.body.inOffer === 'on',
                categoryId:  req.body.categoryId  || product.categoryId,
                stock:       parseInt(req.body.stock) || product.stock
            });

            res.redirect('/products');
        } catch (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).send('Error interno del servidor.');
        }
    },

    /** DELETE /products/:id — Elimina un producto */
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
