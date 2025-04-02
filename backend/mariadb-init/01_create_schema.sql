CREATE DATABASE IF NOT EXISTS book_exchange;

USE book_exchange;

CREATE TABLE IF NOT EXISTS books (
    id BIGINT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    course_number BIGINT,
    cover_image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number BIGINT,
    preferred_exchange_location VARCHAR(255)
);


CREATE TABLE IF NOT EXISTS user_books_published (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    status ENUM('AVAILABLE', 'MATCHED') DEFAULT 'AVAILABLE',
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);


CREATE TABLE IF NOT EXISTS user_books_requested (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    status ENUM('AVAILABLE', 'MATCHED') DEFAULT 'AVAILABLE',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE IF NOT EXISTS trading (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    provider_id BIGINT NOT NULL,
    requester_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    status ENUM('NEW','PENDING', 'COMPLETED', 'CANCELLED', 'EXPIRED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    expiration_date TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES users(id),
    FOREIGN KEY (requester_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

DELIMITER //

CREATE TRIGGER set_expiration_date
    BEFORE INSERT ON trading
    FOR EACH ROW
BEGIN
    IF NEW.expiration_date IS NULL THEN
        SET NEW.expiration_date = CURRENT_TIMESTAMP() + INTERVAL 14 DAY;
    END IF;
END //

DELIMITER ;