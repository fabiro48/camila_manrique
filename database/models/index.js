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

const User      = require('./User')(sequelize);
const Category  = require('./Category')(sequelize);
const Product   = require('./Product')(sequelize);
const Order     = require('./Order')(sequelize);
const OrderItem = require('./OrderItem')(sequelize);

// --- Asociaciones ---
Category.hasMany(Product,    { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category,  { foreignKey: 'categoryId', as: 'category' });

User.hasMany(Order,          { foreignKey: 'userId',    as: 'orders' });
Order.belongsTo(User,        { foreignKey: 'userId',    as: 'user' });

Order.hasMany(OrderItem,     { foreignKey: 'orderId',   as: 'items' });
OrderItem.belongsTo(Order,   { foreignKey: 'orderId',   as: 'order' });

OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(OrderItem,   { foreignKey: 'productId', as: 'orderItems' });

module.exports = { sequelize, Sequelize, User, Category, Product, Order, OrderItem };
