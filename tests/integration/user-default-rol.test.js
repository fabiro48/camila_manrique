'use strict';
const fc = require('fast-check');
const { User } = require('../../database/models');

// Feature: sprint-6-sequelize-migration, Property 1: Creación de usuario preserva campos y aplica valor por defecto de rol
test('User.create sin rol asigna "user" por defecto', async () => {
    await fc.assert(
        fc.asyncProperty(
            fc.record({
                nombre:   fc.string({ minLength: 1 }),
                apellido: fc.string({ minLength: 1 }),
                email:    fc.emailAddress(),
                password:  fc.string({ minLength: 6 })
            }),
            async (data) => {
                const user = await User.create(data);
                expect(user.rol).toBe('user');
                await user.destroy();
            }
        ),
        { numRuns: 100 }
    );
});
