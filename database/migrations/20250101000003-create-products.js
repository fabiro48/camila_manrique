'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Products', {
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
            descripcion: {
                type:      Sequelize.TEXT,
                allowNull: true
            },
            precio: {
                type:      Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            imagen: {
                type:      Sequelize.STRING,
                allowNull: true
            },
            stock: {
                type:         Sequelize.INTEGER,
                defaultValue: 0
            },
            inOffer: {
                type:         Sequelize.BOOLEAN,
                defaultValue: false
            },
            categoryId: {
                type:       Sequelize.INTEGER,
                allowNull:  true,
                references: {
                    model: 'Categories',
                    key:   'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
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
        await queryInterface.dropTable('Products');
    }
};
