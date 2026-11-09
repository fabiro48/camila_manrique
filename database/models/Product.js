'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Product = sequelize.define('Product', {
        nombre: {
            type:      DataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT
        },
        precio: {
            type:      DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        imagen: {
            type: DataTypes.STRING
        },
        stock: {
            type:         DataTypes.INTEGER,
            defaultValue: 0
        },
        inOffer: {
            type:         DataTypes.BOOLEAN,
            defaultValue: false
        },
        categoryId: {
            type:       DataTypes.INTEGER,
            references: { model: 'Categories', key: 'id' }
        }
    }, {
        tableName:  'Products',
        timestamps: true
    });

    return Product;
};
