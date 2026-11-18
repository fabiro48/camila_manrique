'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Orders', {
            id: {
                type:          Sequelize.INTEGER,
                primaryKey:    true,
                autoIncrement: true,
                allowNull:     false
            },
            userId: {
                type:       Sequelize.INTEGER,
                allowNull:  false,
                references: { model: 'Users', key: 'id' },
                onDelete:   'CASCADE'
            },
            estado: {
                type:         Sequelize.ENUM('pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'),
                allowNull:    false,
                defaultValue: 'pendiente'
            },
            total: {
                type:         Sequelize.DECIMAL(12, 2),
                allowNull:    false,
                defaultValue: 0
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
        await queryInterface.dropTable('Orders');
    }
};
