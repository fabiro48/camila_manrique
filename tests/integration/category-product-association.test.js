'use strict';
const fc = require('fast-check');
const { Product, Category } = require('../../database/models');

// Feature: sprint-6-sequelize-migration, Property 10: La asociación Category-Product se resuelve correctamente en consultas
test('Product.findByPk con include retorna category con id y nombre correctos', async () => {
    const [category] = await Category.findOrCreate({ where: { nombre: 'Test Category Assoc' } });

    await fc.assert(
        fc.asyncProperty(
            fc.record({
                nombre: fc.string({ minLength: 1 }),
                precio: fc.double({ min: 0.01, max: 999999 })
            }),
            async (data) => {
                const product = await Product.create({
                    ...data,
                    categoryId: category.id
                });
                try {
                    const found = await Product.findByPk(product.id, {
                        include: [{ model: Category, as: 'category' }]
                    });
                    expect(found).not.toBeNull();
                    expect(found.category).not.toBeNull();
                    expect(found.category.id).toBe(category.id);
                    expect(found.category.nombre).toBe(category.nombre);
                } finally {
                    await product.destroy();
                }
            }
        ),
        { numRuns: 50 }
    );
});
