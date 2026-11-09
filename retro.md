# Retrospectiva Sprint 3 — Estrella de Mar

> **Proyecto:** Camila Manrique — Marroquinería & Bolsos Exclusivos (Node.js + Express)  
> **Sprint:** 3  
> **Fecha:** Septiembre 2026  
> **Equipo:** Equipo de Desarrollo Web

---

## ⭐ Estrella de Mar

La dinámica "Estrella de Mar" nos permite reflexionar sobre el trabajo del equipo desde cinco perspectivas para mejorar continuamente.

---

### 🟢 Start Doing — Empezar a hacer

- Escribir pruebas básicas para cada vista antes de considerarla terminada.
- Documentar los cambios de estructura de carpetas en el README cada vez que se reorganice el proyecto.
- Hacer revisión de código entre pares (code review) antes de mergear cambios al branch principal.
- Definir el contrato de las rutas (URL, método, parámetros esperados) antes de implementarlas.

---

### 🔵 More of — Más de esto

- Más comunicación durante la integración de partials para evitar conflictos de estilos.
- Más commits pequeños y descriptivos en lugar de commits grandes con muchos cambios juntos.
- Más uso de comentarios en el código EJS para indicar qué datos espera cada vista del controlador.
- Más planning antes de comenzar tareas para estimar mejor los tiempos.

---

### 🟡 Keep Doing — Seguir haciendo

- Mantener la separación de responsabilidades: partials reutilizables independientes del contenido de cada vista.
- Continuar organizando las vistas por dominio (`main/`, `products/`) para mantener la escalabilidad.
- Seguir usando EJS como motor de plantillas con la sintaxis estándar de includes.
- Conservar la estructura de carpetas acordada desde el inicio del sprint.
- Mantener el servidor Express limpio y bien comentado con secciones delimitadas.

---

### 🟠 Less of — Menos de esto

- Menos código repetido en las vistas: si algo se repite más de dos veces, debería ser un partial.
- Menos cambios de último momento en la estructura de archivos sin avisar al equipo.
- Menos dependencia de estilos inline en las vistas; mover estilos específicos a clases en el `head.ejs`.
- Menos ambigüedad en los nombres de variables que se pasan desde el controlador a la vista.

---

### 🔴 Stop Doing — Dejar de hacer

- Dejar de mezclar lógica de negocio dentro de las vistas EJS; eso le corresponde al controlador.
- Dejar de trabajar sobre el branch `main` directamente sin crear una rama de feature.
- Dejar de dejar comentarios con `TODO` sin asignar a nadie ni agregar a la lista de tareas.
- Dejar de ignorar los mensajes de advertencia del servidor al iniciar (`app.js` hints de ESLint).

---

*Retrospectiva facilitada por el equipo al final del Sprint 3.*

---

## Retrospectiva Sprint 7 — Estrella de Mar

> **Proyecto:** Camila Manrique — Marroquinería & Bolsos Exclusivos (Node.js + Express)
> **Sprint:** 7 — Validaciones de Formularios
> **Fecha:** Noviembre 2026
> **Equipo:** Equipo de Desarrollo Web

---

### 🟢 Start Doing — Empezar a hacer

- Escribir tests unitarios para las reglas de validación de `express-validator` desde el momento en que se crean los middlewares, no al final del sprint.
- Documentar los custom validators (unicidad de email, extensión de imagen) con un comentario que explique el caso de uso y el `req.file` que inspeccionan.
- Probar las validaciones back-end con herramientas como Postman o Insomnia además del navegador, para simular peticiones que bypaseen el front-end.
- Definir convenciones de nombres para los `id` de formularios (`registerForm`, `loginForm`, `productForm`) antes de empezar a escribir las vistas.

---

### 🔵 More of — Más de esto

- Más uso del patrón `validationResult(req)` al inicio de cada controlador para centralizar el manejo de errores y mantener la lógica de negocio limpia.
- Más repoblación de formularios con `oldData` en todos los endpoints que procesen POST/PUT, para que el usuario no pierda lo que escribió al fallar la validación.
- Más validaciones declarativas encadenadas (`notEmpty().isLength().withMessage()`) que son más legibles y mantenibles que validaciones manuales con `if`.
- Más feedback visual inmediato en el front-end con eventos `blur` e `input` para que el usuario corrija antes de enviar.

---

### 🟡 Keep Doing — Seguir haciendo

- Mantener `express-validator` como fuente de verdad en el back-end; las validaciones front-end son un complemento de UX, nunca la única capa de defensa.
- Conservar la separación de archivos de validación por dominio (`userValidations.js` y `productValidations.js`) para mantener la escalabilidad.
- Seguir excluyendo el campo `password` del patrón `oldData` por seguridad, incluso cuando la validación falla.
- Mantener el script `public/js/validations.js` en JavaScript vanilla sin dependencias externas, para que las validaciones front-end carguen rápido y sin bloquear el render.
- Conservar la estructura de middlewares en `middlewares/validations/` centralizada y reutilizable entre rutas de creación y edición.

---

### 🟠 Less of — Menos de esto

- Menos duplicación de reglas entre `createProduct` y `editProduct`: el mismo array `productValidations` ya sirve para ambos, evitar copiar lógica.
- Menos mensajes de error genéricos ("campo inválido"); cada validación debe tener un `withMessage()` específico que explique qué pasó.
- Menos dependencia de probar solo el happy path: hay que probar casos límite (campos vacíos, longitudes exactas, extensiones de archivo no permitidas) en cada formulario.
- Menos cambios de última hora en los nombres de los campos del formulario (`nombre` vs `name`) que rompen la correspondencia con las reglas de `body()`.

---

### 🔴 Stop Doing — Dejar de hacer

- Dejar de confiar solo en las validaciones del front-end: un usuario puede deshabilitar JavaScript y enviar datos inválidos directamente al servidor.
- Dejar de mezclar la lógica de validación dentro de los controladores; las reglas deben vivir en los middlewares de `express-validator` y los controladores solo consumen `validationResult`.
- Dejar de olvidar pasar `categories` al renderizar `createProduct` y `editProduct` cuando la validación falla; sin esa variable la vista se rompe.
- Dejar de posponer la verificación manual de repoblación (`oldData`) hasta el final; hay que comprobar que los campos se rellenan correctamente después de cada controlador modificado.

---

*Retrospectiva facilitada por el equipo al final del Sprint 7.*
