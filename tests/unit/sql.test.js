'use strict';
const fs   = require('fs');
const path = require('path');

describe('SQL Scripts Tests', () => {

    test('structure.sql contiene CREATE DATABASE IF NOT EXISTS', () => {
        const sql = fs.readFileSync(path.join(__dirname, '../../structure.sql'), 'utf-8');
        expect(sql).toContain('CREATE DATABASE IF NOT EXISTS');
    });

    test('structure.sql contiene CREATE TABLE IF NOT EXISTS Categories', () => {
        const sql = fs.readFileSync(path.join(__dirname, '../../structure.sql'), 'utf-8');
        expect(sql).toContain('CREATE TABLE IF NOT EXISTS Categories');
    });

    test('structure.sql contiene CREATE TABLE IF NOT EXISTS Users', () => {
        const sql = fs.readFileSync(path.join(__dirname, '../../structure.sql'), 'utf-8');
        expect(sql).toContain('CREATE TABLE IF NOT EXISTS Users');
    });

    test('structure.sql contiene CREATE TABLE IF NOT EXISTS Products', () => {
        const sql = fs.readFileSync(path.join(__dirname, '../../structure.sql'), 'utf-8');
        expect(sql).toContain('CREATE TABLE IF NOT EXISTS Products');
    });

    test('data.sql contiene al menos 3 INSERT INTO Categories', () => {
        const sql = fs.readFileSync(path.join(__dirname, '../../data.sql'), 'utf-8');
        const matches = sql.match(/INSERT INTO Categories/g);
        expect(matches).not.toBeNull();
        expect(matches.length).toBeGreaterThanOrEqual(1);
        // Count individual category tuples
        const categoryMatches = sql.match(/INSERT INTO Categories[\s\S]*?;/);
        expect(categoryMatches).not.toBeNull();
        const tupleMatches = categoryMatches[0].match(/\(/g);
        expect(tupleMatches.length).toBeGreaterThanOrEqual(3);
    });

    test('data.sql contiene al menos 5 INSERT INTO Products', () => {
        const sql = fs.readFileSync(path.join(__dirname, '../../data.sql'), 'utf-8');
        const matches = sql.match(/INSERT INTO Products/g);
        expect(matches).not.toBeNull();
        expect(matches.length).toBeGreaterThanOrEqual(1);
        // Count individual product tuples
        const productMatches = sql.match(/INSERT INTO Products[\s\S]*?;/);
        expect(productMatches).not.toBeNull();
        const tupleMatches = productMatches[0].match(/\(/g);
        expect(tupleMatches.length).toBeGreaterThanOrEqual(5);
    });
});
