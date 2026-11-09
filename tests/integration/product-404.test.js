'use strict';
const fc = require('fast-check');
const { Product } = require('../../database/models');

// Feature: sprint-6-sequelize-migration, Property 4: Producto no encontrado siempre devuelve HTTP 404
test('GET /products/:id con ID inexistente devuelve null de findByPk (404)', async () => {
    await fc.assert(
        fc.asyncProperty(
            fc.integer({ min: 999999, max: 9999999 }),
            async (id) => {
                const product = await Product.findByPk(id);
                expect(product).toBeNull();
            }
        ),
        { numRuns: 100 }
    );
});
