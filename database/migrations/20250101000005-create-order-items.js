'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('OrderItems', {
            id: {
                type:          Sequelize.INTEGER,
                primaryKey:    true,
                autoIncrement: true,
                allowNull:     false
            },
            orderId: {
                type:       Sequelize.INTEGER,
                allowNull:  false,
                references: { model: 'Orders', key: 'id' },
                onDelete:   'CASCADE'
            },
            productId: {
                type:       Sequelize.INTEGER,
                allowNull:  false,
                references: { model: 'Products', key: 'id' },
                onDelete:   'CASCADE'
            },
            cantidad: {
                type:      Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            precioUnitario: {
                type:      Sequelize.DECIMAL(10, 2),
                allowNull: false
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
        await queryInterface.dropTable('OrderItems');
    }
};
