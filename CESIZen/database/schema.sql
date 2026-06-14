-- =============================================================
-- CESIZen – Modèle Logique de Données (MLD)
-- Base de données : MySQL 8.x / utf8mb4
-- =============================================================

CREATE DATABASE IF NOT EXISTS cesizen
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cesizen;

-- -------------------------------------------------------------
-- Table : users
-- Comptes utilisateurs (rôles : user | admin)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            INT            NOT NULL AUTO_INCREMENT,
  email         VARCHAR(255)   NOT NULL,
  password_hash VARCHAR(255)   NOT NULL,
  first_name    VARCHAR(100)   NOT NULL,
  last_name     VARCHAR(100)   NOT NULL,
  role          ENUM('user','admin') NOT NULL DEFAULT 'user',
  is_active     TINYINT(1)     NOT NULL DEFAULT 1,
  created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE  KEY uq_users_email  (email),
  INDEX   idx_users_role      (role),
  INDEX   idx_users_active    (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Comptes utilisateurs de la plateforme CESIZen';

-- -------------------------------------------------------------
-- Table : pages
-- Module Informations – pages et menus de contenu
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pages (
  id           INT          NOT NULL AUTO_INCREMENT,
  title        VARCHAR(255) NOT NULL,
  slug         VARCHAR(255) NOT NULL,
  content      LONGTEXT,
  excerpt      VARCHAR(500),
  is_published TINYINT(1)   NOT NULL DEFAULT 1,
  parent_id    INT                   DEFAULT NULL,
  position     INT          NOT NULL DEFAULT 0,
  created_by   INT                   DEFAULT NULL,
  updated_by   INT                   DEFAULT NULL,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE  KEY uq_pages_slug      (slug),
  INDEX   idx_pages_parent       (parent_id),
  INDEX   idx_pages_published    (is_published),
  INDEX   idx_pages_position     (position),
  CONSTRAINT fk_pages_parent
    FOREIGN KEY (parent_id)  REFERENCES pages(id) ON DELETE SET NULL,
  CONSTRAINT fk_pages_created_by
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_pages_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Pages de contenu informatif (module Informations)';

-- -------------------------------------------------------------
-- Table : breathing_exercises
-- Module Exercices de respiration – cohérence cardiaque
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS breathing_exercises (
  id              INT          NOT NULL AUTO_INCREMENT,
  name            VARCHAR(100) NOT NULL,
  label           VARCHAR(50)  NOT NULL,
  inhale_duration INT          NOT NULL COMMENT 'Durée inspiration (secondes)',
  hold_duration   INT          NOT NULL DEFAULT 0
                               COMMENT 'Durée apnée (secondes)',
  exhale_duration INT          NOT NULL COMMENT 'Durée expiration (secondes)',
  description     TEXT,
  is_active       TINYINT(1)   NOT NULL DEFAULT 1,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_breathing_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Exercices de respiration et cohérence cardiaque';

-- -------------------------------------------------------------
-- Table : password_resets
-- Tokens de réinitialisation de mot de passe
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS password_resets (
  id         INT          NOT NULL AUTO_INCREMENT,
  user_id    INT          NOT NULL,
  token      VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP    NOT NULL,
  used       TINYINT(1)   NOT NULL DEFAULT 0,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_resets_token  (token),
  INDEX idx_resets_user   (user_id),
  CONSTRAINT fk_resets_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Tokens de réinitialisation de mot de passe';
