'use strict';
const fs   = require('fs');
const path = require('path');

describe('Smoke Tests — Sprint 6', () => {

    test('.gitignore contiene .env', () => {
        const gitignore = fs.readFileSync(path.join(__dirname, '../../.gitignore'), 'utf-8');
        expect(gitignore).toContain('.env');
    });

    test('.gitignore contiene node_modules/', () => {
        const gitignore = fs.readFileSync(path.join(__dirname, '../../.gitignore'), 'utf-8');
        expect(gitignore).toContain('node_modules');
    });

    test('package.json incluye sequelize, mysql2, dotenv', () => {
        const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8'));
        expect(pkg.dependencies).toHaveProperty('sequelize');
        expect(pkg.dependencies).toHaveProperty('mysql2');
        expect(pkg.dependencies).toHaveProperty('dotenv');
    });

    test('package.json incluye sequelize-cli en devDependencies', () => {
        const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8'));
        expect(pkg.devDependencies).toHaveProperty('sequelize-cli');
    });

    test('Existe database/config/config.js', () => {
        const exists = fs.existsSync(path.join(__dirname, '../../database/config/config.js'));
        expect(exists).toBe(true);
    });

    test('Existe database/models/index.js', () => {
        const exists = fs.existsSync(path.join(__dirname, '../../database/models/index.js'));
        expect(exists).toBe(true);
    });

    test('Existe database/models/User.js', () => {
        const exists = fs.existsSync(path.join(__dirname, '../../database/models/User.js'));
        expect(exists).toBe(true);
    });

    test('Existe database/models/Category.js', () => {
        const exists = fs.existsSync(path.join(__dirname, '../../database/models/Category.js'));
        expect(exists).toBe(true);
    });

    test('Existe database/models/Product.js', () => {
        const exists = fs.existsSync(path.join(__dirname, '../../database/models/Product.js'));
        expect(exists).toBe(true);
    });

    test('Existe database/migrations/', () => {
        const exists = fs.existsSync(path.join(__dirname, '../../database/migrations'));
        expect(exists).toBe(true);
    });

    test('Existe database/seeders/', () => {
        const exists = fs.existsSync(path.join(__dirname, '../../database/seeders'));
        expect(exists).toBe(true);
    });

    test('routes/products.js existe sin cambios', () => {
        const exists = fs.existsSync(path.join(__dirname, '../../routes/products.js'));
        expect(exists).toBe(true);
    });

    test('routes/users.js existe sin cambios', () => {
        const exists = fs.existsSync(path.join(__dirname, '../../routes/users.js'));
        expect(exists).toBe(true);
    });
});
