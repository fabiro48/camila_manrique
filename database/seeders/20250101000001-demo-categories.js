'use strict';

module.exports = {
    async up(queryInterface) {
        const now = new Date();
        await queryInterface.bulkInsert('Categories', [
            { nombre: 'Tote',      createdAt: now, updatedAt: now },
            { nombre: 'Bandolera', createdAt: now, updatedAt: now },
            { nombre: 'Mini Bag',  createdAt: now, updatedAt: now },
            { nombre: 'Morral',    createdAt: now, updatedAt: now },
            { nombre: 'Clutch',    createdAt: now, updatedAt: now }
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('Categories', null, {});
    }
};
