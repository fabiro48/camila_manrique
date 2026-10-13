# Requirements Document

## Introduction

Este documento especifica los requisitos para completar la migración de Sprint 3, que incluye la configuración completa de EJS como motor de plantillas, la creación de componentes reutilizables (partials), la reorganización de la estructura de vistas, la implementación de formularios dinámicos para productos, y la documentación de metodologías ágiles del sprint.

## Glossary

- **Application**: La aplicación web Node.js + Express de la barbería Soberano Distrito Barber
- **EJS_Engine**: Motor de plantillas EJS (Embedded JavaScript) para renderizado de vistas dinámicas
- **Partial**: Componente reutilizable de vista que puede ser incluido en múltiples plantillas EJS
- **View**: Archivo de plantilla EJS que representa una página completa de la aplicación
- **Product_Form**: Formulario para creación o edición de productos/servicios
- **Documentation**: Archivos Markdown con registro de actividades del Sprint 3
- **Server_Configuration**: Archivo principal del servidor (app.js) que configura Express y EJS

## Requirements

### Requirement 1: Configuración del Motor de Plantillas EJS

**User Story:** Como desarrollador, quiero que el servidor esté correctamente configurado para usar EJS, de manera que pueda renderizar vistas dinámicas en toda la aplicación.

#### Acceptance Criteria

1. THE Application SHALL have the `ejs` package installed as a dependency in package.json
2. THE Server_Configuration SHALL set EJS as the view engine using `app.set('view engine', 'ejs')`
3. THE Server_Configuration SHALL define the views directory using `app.set('views', path.join(__dirname, 'views'))`
4. WHEN the server starts, THE Application SHALL be able to render .ejs files from the views directory
5. THE Server_Configuration SHALL maintain the existing Express middleware configuration (urlencoded, static files)

### Requirement 2: Creación de Componentes Reutilizables (Partials)

**User Story:** Como desarrollador, quiero componentes reutilizables extraídos del HTML, de manera que pueda mantener consistencia en el diseño y reducir duplicación de código.

#### Acceptance Criteria

1. THE Application SHALL have a `views/partials/` directory structure
2. THE Application SHALL have a `head.ejs` partial containing meta tags, CSS variables, and all stylesheet definitions
3. THE Application SHALL have a `header.ejs` partial containing the navigation bar with logo, menu links, and "Agendar horario" button
4. THE Application SHALL have a `footer.ejs` partial containing footer content with brand info, navigation links, and contact information
5. THE `head.ejs` partial SHALL include the opening `<!DOCTYPE html>`, `<html>`, and `<head>` tags with all CSS styles
6. THE `header.ejs` partial SHALL contain only the `<header>` element and its content
7. THE `footer.ejs` partial SHALL contain only the `<footer>` element and its content with modal markup and scripts

### Requirement 3: Reorganización de Estructura de Vistas

**User Story:** Como desarrollador, quiero una estructura organizada de vistas por dominio, de manera que el proyecto sea más mantenible y escalable.

#### Acceptance Criteria

1. THE Application SHALL have all HTML files converted to .ejs format
2. THE Application SHALL organize views into subdirectories within `views/` by domain (e.g., `views/products/`, `views/main/`)
3. WHEN an existing HTML file is converted, THE Application SHALL maintain all existing functionality
4. THE Views SHALL replace repeated code by including partials using `<%- include('../partials/head') %>`
5. THE Views SHALL include the header partial using `<%- include('../partials/header') %>`
6. THE Views SHALL include the footer partial using `<%- include('../partials/footer') %>`
7. THE Application SHALL have a `views/main/` subdirectory for general pages (home, about)
8. THE Application SHALL have a `views/products/` subdirectory for product-related views

### Requirement 4: Vistas de Productos con Formularios Dinámicos

**User Story:** Como desarrollador, quiero formularios dinámicos para productos, de manera que pueda crear y editar servicios de la barbería con datos renderizados dinámicamente.

#### Acceptance Criteria

1. THE Application SHALL have a `views/products/createProduct.ejs` file with a form for product creation
2. THE Application SHALL have a `views/products/editProduct.ejs` file with a form for product editing
3. THE Product_Form in createProduct.ejs SHALL include fields for product name and price
4. THE Product_Form in editProduct.ejs SHALL use EJS syntax to render product data dynamically (e.g., `<%= product.nombre %>`, `<%= product.precio %>`)
5. WHEN editProduct.ejs is rendered with product data, THE Product_Form SHALL populate form fields with existing product values
6. THE Product_Form SHALL use the POST method for data submission
7. THE Product_Form in createProduct.ejs SHALL submit to a `/productos` endpoint
8. THE Product_Form in editProduct.ejs SHALL submit to a `/productos/:id` endpoint or similar

### Requirement 5: Documentación de Metodologías Ágiles del Sprint 3

**User Story:** Como miembro del equipo, quiero documentación de las actividades ágiles del Sprint 3, de manera que tengamos registro de las retrospectivas y daily standups realizados.

#### Acceptance Criteria

1. THE Application SHALL have a `retro.md` file in the project root
2. THE `retro.md` file SHALL document the "Estrella de Mar" retrospective methodology
3. THE `retro.md` SHALL include five sections: Start doing, More of, Keep doing, Less of, Stop doing
4. WHEN the retrospective is documented, THE `retro.md` SHALL contain specific insights from Sprint 3
5. THE Application SHALL have a `daily.md` file in the project root
6. THE `daily.md` file SHALL document at least three Daily Standup meetings from Sprint 3
7. WHEN a daily standup is documented, THE `daily.md` SHALL include date, participants, and notes for each standup (what was done, what will be done, blockers)
8. THE Documentation files SHALL use proper Markdown formatting with headers and lists

### Requirement 6: Integración y Consistencia del Sistema

**User Story:** Como usuario, quiero que la aplicación funcione correctamente después de la migración, de manera que todas las funcionalidades existentes continúen operando sin interrupciones.

#### Acceptance Criteria

1. WHEN the server is started, THE Application SHALL render the home page without errors
2. WHEN a user navigates between pages, THE Application SHALL maintain consistent header and footer across all views
3. WHEN a user interacts with existing features (modal, forms, navigation), THE Application SHALL preserve all original functionality
4. THE Application SHALL serve static assets correctly from the public directory
5. WHEN EJS templates are rendered, THE Application SHALL display all content with proper styling
6. THE Application SHALL handle routing for all views (home, product creation, product editing)
