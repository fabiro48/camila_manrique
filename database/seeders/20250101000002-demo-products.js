'use strict';

module.exports = {
    async up(queryInterface) {
        const now = new Date();
        await queryInterface.bulkInsert('Products', [
            {
                nombre:      'Tote Bag Cuero Natural',
                descripcion: 'Bolso tote fabricado en cuero natural colombiano, con capacidad amplia y costuras reforzadas.',
                precio:      285000.00,
                imagen:      null,
                stock:       10,
                inOffer:     false,
                categoryId:  1,
                createdAt:   now,
                updatedAt:   now
            },
            {
                nombre:      'Bandolera Artesanal Wayuu',
                descripcion: 'Bandolera tejida a mano con motivos Wayuu, correa ajustable y cierre de cremallera.',
                precio:      195000.00,
                imagen:      null,
                stock:       15,
                inOffer:     true,
                categoryId:  2,
                createdAt:   now,
                updatedAt:   now
            },
            {
                nombre:      'Mini Bag Charol Negro',
                descripcion: 'Mini bolso en charol negro, diseño compacto ideal para salidas nocturnas.',
                precio:      165000.00,
                imagen:      null,
                stock:       8,
                inOffer:     false,
                categoryId:  3,
                createdAt:   now,
                updatedAt:   now
            },
            {
                nombre:      'Morral Aventurero Lona',
                descripcion: 'Morral en lona resistente al agua, múltiples compartimentos y asas acolchadas.',
                precio:      220000.00,
                imagen:      null,
                stock:       12,
                inOffer:     false,
                categoryId:  4,
                createdAt:   now,
                updatedAt:   now
            },
            {
                nombre:      'Clutch Dorado Fiesta',
                descripcion: 'Clutch dorado con cadena removible, perfecto para eventos formales.',
                precio:      135000.00,
                imagen:      null,
                stock:       20,
                inOffer:     true,
                categoryId:  5,
                createdAt:   now,
                updatedAt:   now
            },
            {
                nombre:      'Tote Cáñamo Ecológico',
                descripcion: 'Bolso tote sustentable en cáñamo orgánico, con bolsillo interior con cremallera.',
                precio:      145000.00,
                imagen:      null,
                stock:       25,
                inOffer:     false,
                categoryId:  1,
                createdAt:   now,
                updatedAt:   now
            }
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('Products', null, {});
    }
};
