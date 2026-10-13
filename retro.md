# Retrospectiva Sprint 3 — Estrella de Mar

> **Proyecto:** Soberano Distrito Barber — Aplicación Web Node.js + Express  
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
