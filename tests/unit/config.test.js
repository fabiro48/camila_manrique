'use strict';

describe('Config Tests — database/config/config.js', () => {

    beforeEach(() => {
        jest.resetModules();
    });

    test('Lanza error descriptivo si DB_NAME no está definida', () => {
        const oldDbName = process.env.DB_NAME;
        // Use empty string instead of delete: dotenv (override=false) will not
        // replace an existing property, and !'' is true so the error fires.
        process.env.DB_NAME = '';

        expect(() => {
            require('../../database/config/config');
        }).toThrow(/DB_NAME/);

        if (oldDbName !== undefined) process.env.DB_NAME = oldDbName;
    });

    test('Usa los valores correctos de process.env cuando están definidos', () => {
        process.env.DB_HOST     = 'testhost';
        process.env.DB_PORT     = '3307';
        process.env.DB_USER     = 'testuser';
        process.env.DB_PASSWORD = 'testpass';
        process.env.DB_NAME     = 'testdb';

        const config = require('../../database/config/config');

        expect(config.development.host).toBe('testhost');
        expect(config.development.port).toBe(3307);
        expect(config.development.username).toBe('testuser');
        expect(config.development.password).toBe('testpass');
        expect(config.development.database).toBe('testdb');
        expect(config.development.dialect).toBe('mysql');
    });
});
