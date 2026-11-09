'use strict';

module.exports = async function() {
    try {
        const { sequelize } = require('../database/models');
        await sequelize.close();
    } catch (e) {
        // Si no hay conexión, no hay problema
    }
};
