'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Order = sequelize.define('Order', {
        userId: {
            type:      DataTypes.INTEGER,
            allowNull: false
        },
        estado: {
            type:         DataTypes.ENUM('pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'),
            allowNull:    false,
            defaultValue: 'pendiente'
        },
        total: {
            type:         DataTypes.DECIMAL(12, 2),
            allowNull:    false,
            defaultValue: 0
        }
    }, {
        tableName:  'Orders',
        timestamps: true
    });

    return Order;
};
