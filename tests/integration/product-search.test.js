'use strict';
const fc = require('fast-check');
const { Product, Category } = require('../../database/models');
const { Op } = require('sequelize');

// Escapa caracteres especiales de LIKE (% y _) para que la comparación sea exacta
function escapeLike(str) {
    return str.replace(/[%_\\]/g, '\\$&');
}

// Feature: sprint-6-sequelize-migration, Property 5: La búsqueda con Op.like retorna solo productos coincidentes
test('Op.like retorna solo productos cuyo nombre o descripcion contiene el término', async () => {
    await Category.findOrCreate({ where: { nombre: 'Test Category Search' } });

    await fc.assert(
        fc.asyncProperty(
            fc.string({ minLength: 2, maxLength: 10 }).filter(s => !/[%_]/.test(s)),
            async (term) => {
                const products = await Product.findAll({
                    where: {
                        [Op.or]: [
                            { nombre:      { [Op.like]: `%${term}%` } },
                            { descripcion: { [Op.like]: `%${term}%` } }
                        ]
                    }
                });
                products.forEach(p => {
                    const inNombre = p.nombre.toLowerCase().includes(term.toLowerCase());
                    const inDesc   = (p.descripcion || '').toLowerCase().includes(term.toLowerCase());
                    expect(inNombre || inDesc).toBe(true);
                });
            }
        ),
        { numRuns: 50 }
    );
});
