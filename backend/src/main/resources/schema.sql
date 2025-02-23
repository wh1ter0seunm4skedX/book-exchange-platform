USE book_exchange;

-- Create 'users' table
CREATE TABLE IF NOT EXISTS users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       full_name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       phone_number BIGINT,
                       preferred_contact_method ENUM('email', 'phone') NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create 'books' table
CREATE TABLE IF NOT EXISTS books (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       title VARCHAR(255) NOT NULL,
                       author VARCHAR(255),
                       isbn VARCHAR(20) UNIQUE,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create 'user_books_shared' join table
CREATE TABLE IF NOT EXISTS user_books_shared (
                                id BIGINT,
                                user_id BIGINT NOT NULL,
                                book_id BIGINT NOT NULL,
                                shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                PRIMARY KEY (user_id, book_id),
                                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Create 'user_books_requested' join table
CREATE TABLE IF NOT EXISTS user_books_requested (
                                    id BIGINT,
                                    user_id BIGINT NOT NULL,
                                    book_id BIGINT NOT NULL,
                                    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    PRIMARY KEY (user_id, book_id),
                                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Create 'matches' table
CREATE TABLE IF NOT EXISTS matches (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         provider_id BIGINT NOT NULL,
                         requester_id BIGINT NOT NULL,
                         book_id BIGINT NOT NULL,
                         status ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
                         matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
                         FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
                         FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);
