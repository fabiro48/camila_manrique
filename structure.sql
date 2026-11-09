-- =========================================================
-- structure.sql — Esquema completo de la base de datos
-- Proyecto: Camila Manrique — Tienda de Bolsos y Marroquinería
-- =========================================================

CREATE DATABASE IF NOT EXISTS camila_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE camila_db;

-- ---------------------------------------------------------
-- Tabla: Categories (sin FK, se crea primero)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS Categories (
    id         INT          NOT NULL AUTO_INCREMENT,
    nombre     VARCHAR(255) NOT NULL,
    createdAt  DATETIME     NOT NULL,
    updatedAt  DATETIME     NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_categories_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Tabla: Users (sin FK, se crea segundo)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS Users (
    id         INT          NOT NULL AUTO_INCREMENT,
    nombre     VARCHAR(255) NOT NULL,
    apellido   VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    rol        ENUM('admin','user') NOT NULL DEFAULT 'user',
    imagen     VARCHAR(255)     NULL,
    createdAt  DATETIME     NOT NULL,
    updatedAt  DATETIME     NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Tabla: Products (FK → Categories, se crea tercero)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS Products (
    id          INT           NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(255)  NOT NULL,
    descripcion TEXT              NULL,
    precio      DECIMAL(10,2) NOT NULL,
    imagen      VARCHAR(255)      NULL,
    stock       INT           NOT NULL DEFAULT 0,
    inOffer     TINYINT(1)    NOT NULL DEFAULT 0,
    categoryId  INT               NULL,
    createdAt   DATETIME      NOT NULL,
    updatedAt   DATETIME      NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_products_category
        FOREIGN KEY (categoryId)
        REFERENCES Categories(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
