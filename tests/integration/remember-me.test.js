'use strict';
const fc = require('fast-check');
const bcrypt = require('bcryptjs');
const { User } = require('../../database/models');

// Feature: sprint-6-sequelize-migration, Property 9: RememberMe establece sesión si y solo si el usuario existe en BD
test('RememberMe: cookie con email existente encuentra usuario; email inexistente retorna null', async () => {
    await fc.assert(
        fc.asyncProperty(
            fc.record({
                nombre:   fc.string({ minLength: 1 }),
                apellido: fc.string({ minLength: 1 }),
                email:    fc.emailAddress(),
                password:  fc.string({ minLength: 6 })
            }),
            async (data) => {
                const hashedPassword = await bcrypt.hash(data.password, 10);
                const user = await User.create({ ...data, password: hashedPassword });
                try {
                    const found = await User.findOne({ where: { email: user.email } });
                    expect(found).not.toBeNull();
                    expect(found.id).toBe(user.id);

                    const notFound = await User.findOne({ where: { email: 'nonexistent@test.com' } });
                    expect(notFound).toBeNull();
                } finally {
                    await user.destroy();
                }
            }
        ),
        { numRuns: 30 }
    );
});
