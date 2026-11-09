'use strict';
const fc = require('fast-check');
const { User } = require('../../database/models');

// Feature: sprint-6-sequelize-migration, Property 2: La restricción UNIQUE de email se cumple siempre
test('Email duplicado lanza SequelizeUniqueConstraintError', async () => {
    await fc.assert(
        fc.asyncProperty(
            fc.record({
                nombre:   fc.string({ minLength: 1 }),
                apellido: fc.string({ minLength: 1 }),
                email:    fc.emailAddress(),
                password:  fc.string({ minLength: 6 })
            }),
            async (data) => {
                const user1 = await User.create(data);
                try {
                    await expect(User.create(data)).rejects.toThrow(/SequelizeUniqueConstraintError|Validation error/);
                } finally {
                    await user1.destroy();
                }
            }
        ),
        { numRuns: 50 }
    );
});
