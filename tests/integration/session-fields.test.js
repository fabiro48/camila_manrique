'use strict';
const fc = require('fast-check');
const bcrypt = require('bcryptjs');
const { User } = require('../../database/models');

// Feature: sprint-6-sequelize-migration, Property 8: La sesión post-registro contiene los campos requeridos
test('Sesión post-registro contiene id, nombre, email, image', async () => {
    jest.setTimeout(60000);
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
                    const sessionUser = {
                        id:     user.id,
                        nombre: user.nombre,
                        email:  user.email,
                        image:  user.imagen
                    };
                    expect(sessionUser).toHaveProperty('id');
                    expect(sessionUser).toHaveProperty('nombre');
                    expect(sessionUser).toHaveProperty('email');
                    expect(sessionUser).toHaveProperty('image');
                    expect(typeof sessionUser.id).toBe('number');
                } finally {
                    await user.destroy();
                }
            }
        ),
        { numRuns: 50 }
    );
});
