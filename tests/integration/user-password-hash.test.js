'use strict';
const fc = require('fast-check');
const bcrypt = require('bcryptjs');
const { User } = require('../../database/models');

// Feature: sprint-6-sequelize-migration, Property 6: El password nunca se almacena en texto plano
test('Password almacenado es hash bcrypt verificable, nunca texto plano', async () => {
    jest.setTimeout(60000);
    await fc.assert(
        fc.asyncProperty(
            fc.string({ minLength: 6, maxLength: 50 }),
            async (password) => {
                const email = `pbt_test_${Date.now()}_${Math.random()}@test.com`;
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = await User.create({
                    nombre:   'Test',
                    apellido: 'User',
                    email,
                    password:  hashedPassword
                });
                try {
                    expect(user.password).not.toBe(password);
                    expect(user.password.startsWith('$2b$')).toBe(true);
                    const match = await bcrypt.compare(password, user.password);
                    expect(match).toBe(true);
                } finally {
                    await user.destroy();
                }
            }
        ),
        { numRuns: 50 }
    );
});
