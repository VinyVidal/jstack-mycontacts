CREATE DATABASE IF NOT EXISTS mycontacts;

CREATE TABLE IF NOT EXISTS categories (
    id CHAR(36) NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    `order` BIGINT
);

CREATE TABLE IF NOT EXISTS contacts (
    id CHAR(36) NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(255),
    category_id CHAR(36),
    `order` BIGINT,
    FOREIGN KEY(category_id) REFERENCES categories(id)
)

DELIMITER ;;
CREATE TRIGGER `contacts_before_insert`
BEFORE INSERT ON `contacts` FOR EACH ROW
BEGIN
  IF new.id IS NULL THEN
    SET new.id = uuid();
    SET @last_uuid = new.id;
    SET new.order = (SELECT IFNULL(MAX(`order`), 0) + 1 FROM `contacts`);
  END IF;
END;;
DELIMITER ;

DELIMITER ;;
CREATE TRIGGER `categories_before_insert`
BEFORE INSERT ON `categories` FOR EACH ROW
BEGIN
  IF new.id IS NULL THEN
    SET new.id = uuid();
    SET new.order = (SELECT IFNULL(MAX(`order`), 0) + 1 FROM `categories`);
  END IF;
END;;
DELIMITER ;