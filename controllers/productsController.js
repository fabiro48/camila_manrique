const fs   = require('fs');
const path = require('path');

// Ruta absoluta al archivo JSON
const DB_PATH = path.join(__dirname, '../data/productsDataBase.json');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Lee y parsea el JSON de productos */
function readDB() {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
}

/** Serializa y escribe el array de productos en el JSON */
function writeDB(products) {
    fs.writeFileSync(DB_PATH, JSON.stringify(products, null, 2), 'utf-8');
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

const productsController = {

    /** GET /products — Lista todos los productos */
    index(_req, res) {
        const products = readDB();
        res.render('products/index', { products });
    },

    /** GET /products/create — Formulario de creación */
    create(_req, res) {
        res.render('products/createProduct');
    },

    /** POST /products — Guarda un nuevo producto */
    store(req, res) {
        const products = readDB();

        // Genera un ID único (mayor existente + 1)
        const newId = products.length > 0
            ? Math.max(...products.map(p => p.id)) + 1
            : 1;

        const newProduct = {
            id:          newId,
            name:        req.body.name        || req.body.nombre || '',
            description: req.body.description || req.body.descripcion || '',
            price:       parseFloat(req.body.price || req.body.precio) || 0,
            category:    req.body.category    || req.body.categoria || '',
            image:       req.body.image       || req.body.imagen || '',
            inOffer:     req.body.inOffer === 'true' || req.body.inOffer === 'on'
        };

        products.push(newProduct);
        writeDB(products);

        res.redirect('/products');
    },

    /** GET /products/:id — Detalle de un producto */
    detail(req, res) {
        const products = readDB();
        const product  = products.find(p => p.id === parseInt(req.params.id));

        if (!product) {
            return res.status(404).render('main/index'); // fallback al home
        }

        res.render('products/detail', { product });
    },

    /** GET /products/:id/edit — Formulario de edición */
    edit(req, res) {
        const products = readDB();
        const product  = products.find(p => p.id === parseInt(req.params.id));

        if (!product) {
            return res.redirect('/products');
        }

        res.render('products/editProduct', { product });
    },

    /** PUT /products/:id — Actualiza un producto */
    update(req, res) {
        const products = readDB();
        const index    = products.findIndex(p => p.id === parseInt(req.params.id));

        if (index === -1) {
            return res.redirect('/products');
        }

        products[index] = {
            ...products[index],
            name:        req.body.name        || req.body.nombre        || products[index].name,
            description: req.body.description || req.body.descripcion   || products[index].description,
            price:       parseFloat(req.body.price || req.body.precio)  || products[index].price,
            category:    req.body.category    || req.body.categoria     || products[index].category,
            image:       req.body.image       || req.body.imagen        || products[index].image,
            inOffer:     req.body.inOffer === 'true' || req.body.inOffer === 'on'
        };

        writeDB(products);
        res.redirect('/products');
    },

    /** DELETE /products/:id — Elimina un producto */
    destroy(req, res) {
        const products = readDB();
        const filtered = products.filter(p => p.id !== parseInt(req.params.id));

        writeDB(filtered);
        res.redirect('/products');
    }
};

module.exports = productsController;
