-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS book_exchange;

-- Use the book_exchange database
USE book_exchange;

-- Create tables if they don't exist
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

CREATE TABLE IF NOT EXISTS user_books_shared (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE IF NOT EXISTS user_books_requested (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE IF NOT EXISTS matches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    provider_id BIGINT NOT NULL,
    requester_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES users(id),
    FOREIGN KEY (requester_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);
