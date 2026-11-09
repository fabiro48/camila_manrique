'use strict';
require('dotenv').config();
const { Sequelize } = require('sequelize');
const config        = require('../config/config');
const env           = process.env.NODE_ENV || 'development';
const dbConfig      = config[env];

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
);

const User     = require('./User')(sequelize);
const Category = require('./Category')(sequelize);
const Product  = require('./Product')(sequelize);

// Asociaciones
Category.hasMany(Product,   { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

module.exports = { sequelize, Sequelize, User, Category, Product };
