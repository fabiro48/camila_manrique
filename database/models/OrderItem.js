'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const OrderItem = sequelize.define('OrderItem', {
        orderId: {
            type:      DataTypes.INTEGER,
            allowNull: false
        },
        productId: {
            type:      DataTypes.INTEGER,
            allowNull: false
        },
        cantidad: {
            type:         DataTypes.INTEGER,
            allowNull:    false,
            defaultValue: 1
        },
        precioUnitario: {
            type:      DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }, {
        tableName:  'OrderItems',
        timestamps: true
    });

    return OrderItem;
};
