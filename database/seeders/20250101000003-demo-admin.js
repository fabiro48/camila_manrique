'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
    async up(queryInterface) {
        const existing = await queryInterface.sequelize.query(
            `SELECT id FROM Users WHERE email = 'admin@camilamanrique.com' LIMIT 1`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        if (existing.length > 0) return;

        const hashed = await bcrypt.hash('Admin2026!', 10);
        await queryInterface.bulkInsert('Users', [{
            nombre:    'Admin',
            apellido:  'Camila',
            email:     'admin@camilamanrique.com',
            password:  hashed,
            rol:       'admin',
            imagen:    null,
            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('Users', { email: 'admin@camilamanrique.com' });
    }
};
