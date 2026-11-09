'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Category = sequelize.define('Category', {
        nombre: {
            type:      DataTypes.STRING,
            allowNull: false,
            unique:    true
        }
    }, {
        tableName:  'Categories',
        timestamps: true
    });

    return Category;
};
