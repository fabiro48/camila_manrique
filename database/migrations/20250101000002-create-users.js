'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                type:          Sequelize.INTEGER,
                primaryKey:    true,
                autoIncrement: true,
                allowNull:     false
            },
            nombre: {
                type:      Sequelize.STRING,
                allowNull: false
            },
            apellido: {
                type:      Sequelize.STRING,
                allowNull: false
            },
            email: {
                type:      Sequelize.STRING,
                allowNull: false,
                unique:    true
            },
            password: {
                type:      Sequelize.STRING,
                allowNull: false
            },
            rol: {
                type:         Sequelize.ENUM('admin', 'user'),
                allowNull:    false,
                defaultValue: 'user'
            },
            imagen: {
                type:      Sequelize.STRING,
                allowNull: true
            },
            createdAt: {
                type:      Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type:      Sequelize.DATE,
                allowNull: false
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('Users');
    }
};
