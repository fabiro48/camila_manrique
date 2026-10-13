# Daily Standups — Sprint 3

> **Proyecto:** Soberano Distrito Barber — Aplicación Web Node.js + Express  
> **Sprint:** 3  
> **Duración del sprint:** 2 semanas — Septiembre 2026

---

## Daily #1 — Lunes 7 de Septiembre, 2026

**Participantes:** Equipo completo (3 integrantes)  
**Duración:** 15 minutos

### ¿Qué hicimos ayer?
- Revisamos la estructura del proyecto proveniente del Sprint 2.
- Confirmamos que `ejs` ya estaba listado como dependencia en `package.json`.
- Acordamos la estructura de carpetas: `views/main/`, `views/products/`, `views/partials/`.

### ¿Qué haremos hoy?
- Crear los partials `head.ejs`, `header.ejs` y `footer.ejs` extrayendo el código de `SPRINT-2/index.html`.
- Configurar `app.js` para apuntar el motor de plantillas a la carpeta `views/`.
- Crear el archivo `views/main/index.ejs` usando los partials.

### ¿Hay algún bloqueo?
- Ninguno. El equipo tiene claridad sobre las tareas del día.

---

## Daily #2 — Miércoles 9 de Septiembre, 2026

**Participantes:** Equipo completo (3 integrantes)  
**Duración:** 15 minutos

### ¿Qué hicimos ayer?
- Se crearon los tres partials (`head.ejs`, `header.ejs`, `footer.ejs`) con éxito.
- `views/main/index.ejs` ya renderiza correctamente usando los includes de partials.
- El servidor responde en `http://localhost:3000` sin errores de renderizado.

### ¿Qué haremos hoy?
- Crear las vistas `views/products/createProduct.ejs` y `views/products/editProduct.ejs`.
- Implementar las rutas GET y POST para productos en `app.js`.
- Verificar que `editProduct.ejs` reciba y renderice correctamente el objeto `product` desde el controlador.

### ¿Hay algún bloqueo?
- Duda sobre el manejo del método PUT para la edición: se decidió usar `POST /productos/:id` directamente para mantener compatibilidad sin necesidad de `method-override`.

---

## Daily #3 — Viernes 11 de Septiembre, 2026

**Participantes:** Equipo completo (3 integrantes)  
**Duración:** 15 minutos

### ¿Qué hicimos ayer?
- Se completaron `createProduct.ejs` y `editProduct.ejs` con formularios funcionales y validación de campos requeridos.
- Las rutas de productos están definidas en `app.js` (`GET /productos/nuevo`, `POST /productos`, `GET /productos/:id/editar`, `POST /productos/:id`).
- Se realizó una prueba manual de cada formulario confirmando que los datos llegan al servidor por `req.body`.

### ¿Qué haremos hoy?
- Crear los archivos de documentación ágil: `retro.md` y `daily.md`.
- Hacer revisión final de toda la estructura de vistas para asegurar que todos los includes apuntan a rutas correctas.
- Cerrar el Sprint 3 y preparar el resumen de entregables.

### ¿Hay algún bloqueo?
- Ninguno. Todas las tareas técnicas del sprint están completadas. Pendiente solo la documentación.

---

*Registros elaborados por el equipo al cierre del Sprint 3.*
