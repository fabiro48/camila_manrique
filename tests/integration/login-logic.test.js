'use strict';
const fc = require('fast-check');
const bcrypt = require('bcryptjs');
const { User } = require('../../database/models');

// Feature: sprint-6-sequelize-migration, Property 7: El login es correcto si y solo si las credenciales son válidas
test('Login con credenciales correctas encuentra usuario; password incorrecto falla bcrypt.compare', async () => {
    jest.setTimeout(60000);
    await fc.assert(
        fc.asyncProperty(
            fc.record({
                nombre:   fc.string({ minLength: 1 }),
                apellido: fc.string({ minLength: 1 }),
                email:    fc.emailAddress(),
                password:  fc.string({ minLength: 6, maxLength: 50 })
            }),
            async (data) => {
                const hashedPassword = await bcrypt.hash(data.password, 10);
                const user = await User.create({ ...data, password: hashedPassword });
                try {
                    const found = await User.findOne({ where: { email: data.email } });
                    expect(found).not.toBeNull();
                    const valid = await bcrypt.compare(data.password, found.password);
                    expect(valid).toBe(true);

                    const invalid = await bcrypt.compare('wrongpassword123', found.password);
                    expect(invalid).toBe(false);

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
