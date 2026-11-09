'use strict';
require('dotenv').config();

if (!process.env.DB_NAME) {
    throw new Error('La variable de entorno DB_NAME no está definida. Crea un archivo .env basado en .env.example');
}

const base = {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    dialect:  'mysql',
    logging:  false,
};

module.exports = {
    development: base,
    test:        base,
    production:  base,
};
