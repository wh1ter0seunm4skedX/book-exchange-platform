-- Use the book_exchange database
USE book_exchange;

-- Insert sample users
INSERT INTO users (id, full_name, email, password, phone_number, preferred_exchange_location) VALUES
(1, 'Tal Cohen', 'tal.cohen@example.com', '$2a$10$xVfAMXE8Qzq8MHm.hB0Fu.HKJKMdVB9VlzWroTHJWYeOTMUvYmQPi', 9721234567, 'Raanana Campus'),
(2, 'Noa Levi', 'noa.levi@example.com', '$2a$10$xVfAMXE8Qzq8MHm.hB0Fu.HKJKMdVB9VlzWroTHJWYeOTMUvYmQPi', 9729876543, 'Tel Aviv Campus'),
(3, 'Amit Shapira', 'amit.shapira@example.com', '$2a$10$xVfAMXE8Qzq8MHm.hB0Fu.HKJKMdVB9VlzWroTHJWYeOTMUvYmQPi', 9725551234, 'Jerusalem Campus'),
(4, 'Maya Golan', 'maya.golan@example.com', '$2a$10$xVfAMXE8Qzq8MHm.hB0Fu.HKJKMdVB9VlzWroTHJWYeOTMUvYmQPi', 9724445678, 'Haifa Campus'),
(5, 'Yoav Stern', 'yoav.stern@example.com', '$2a$10$xVfAMXE8Qzq8MHm.hB0Fu.HKJKMdVB9VlzWroTHJWYeOTMUvYmQPi', 9723332222, 'Beer Sheva Campus');

-- Note: All passwords are set to 'password123' (hashed with BCrypt)
-- The actual hash value is a placeholder and should be generated properly in a real system
