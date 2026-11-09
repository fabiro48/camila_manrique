'use strict';
const fc = require('fast-check');
const { Product, Category } = require('../../database/models');

// Feature: sprint-6-sequelize-migration, Property 3: CRUD completo de productos es consistente con la base de datos
test('CRUD de productos: create → findAll incluye, update → findByPk retorna nuevos, destroy → findByPk null', async () => {
    const [category] = await Category.findOrCreate({ where: { nombre: 'Test Category CRUD' } });

    await fc.assert(
        fc.asyncProperty(
            fc.record({
                nombre:      fc.string({ minLength: 1 }),
                precio:      fc.double({ min: 0.01, max: 999999 }),
                descripcion: fc.string({ maxLength: 200 })
            }),
            async (data) => {
                const product = await Product.create({ ...data, categoryId: category.id });
                expect(product).toBeDefined();

                const all = await Product.findAll({ where: { id: product.id } });
                expect(all.some(p => p.id === product.id)).toBe(true);

                const newName = 'Updated ' + data.nombre;
                await product.update({ nombre: newName });
                const found = await Product.findByPk(product.id);
                expect(found.nombre).toBe(newName);

                await Product.destroy({ where: { id: product.id } });
                const deleted = await Product.findByPk(product.id);
                expect(deleted).toBeNull();
            }
        ),
        { numRuns: 50 }
    );
});
