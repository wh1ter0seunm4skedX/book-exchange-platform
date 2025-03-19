-- Use the book_exchange database
USE book_exchange;

-- Insert books that users are sharing
INSERT INTO user_books_shared (user_id, book_id, status, shared_at) VALUES
-- Tal Cohen is sharing these books
(1, 1, 'AVAILABLE', NOW()), -- Introduction to Computer Science Using Java
(1, 2, 'AVAILABLE', NOW()), -- Data Structures and Introduction to Algorithms
(1, 6, 'AVAILABLE', NOW()), -- Algorithms
(1, 12, 'AVAILABLE', NOW()), -- Introduction to Artificial Intelligence

-- Noa Levi is sharing these books
(2, 3, 'AVAILABLE', NOW()), -- Automata Theory and Formal Languages
(2, 7, 'AVAILABLE', NOW()), -- Operating Systems
(2, 9, 'AVAILABLE', NOW()), -- Database Systems
(2, 16, 'AVAILABLE', NOW()), -- Discrete Mathematics

-- Amit Shapira is sharing these books
(3, 4, 'AVAILABLE', NOW()), -- Assembly Language
(3, 5, 'AVAILABLE', NOW()), -- Computer Organization
(3, 8, 'AVAILABLE', NOW()), -- Computer Networks
(3, 11, 'AVAILABLE', NOW()), -- Advanced Programming with Java

-- Maya Golan is sharing these books
(4, 10, 'AVAILABLE', NOW()), -- Software Engineering
(4, 14, 'AVAILABLE', NOW()), -- Computer Graphics
(4, 22, 'AVAILABLE', NOW()), -- Computer Security
(4, 27, 'AVAILABLE', NOW()), -- Machine Learning

-- Yoav Stern is sharing these books
(5, 13, 'AVAILABLE', NOW()), -- Logic Programming
(5, 20, 'AVAILABLE', NOW()), -- Compilation
(5, 23, 'AVAILABLE', NOW()), -- Workshop: Web Application Development
(5, 28, 'AVAILABLE', NOW()); -- Deep Learning

-- Insert books that users are requesting
INSERT INTO user_books_requested (user_id, book_id, status, requested_at) VALUES
-- Tal Cohen is requesting these books
(1, 7, 'AVAILABLE', NOW()), -- Operating Systems
(1, 8, 'AVAILABLE', NOW()), -- Computer Networks
(1, 27, 'AVAILABLE', NOW()), -- Machine Learning

-- Noa Levi is requesting these books
(2, 1, 'AVAILABLE', NOW()), -- Introduction to Computer Science Using Java
(2, 12, 'AVAILABLE', NOW()), -- Introduction to Artificial Intelligence
(2, 28, 'AVAILABLE', NOW()), -- Deep Learning

-- Amit Shapira is requesting these books
(3, 9, 'AVAILABLE', NOW()), -- Database Systems
(3, 14, 'AVAILABLE', NOW()), -- Computer Graphics
(3, 23, 'AVAILABLE', NOW()), -- Workshop: Web Application Development

-- Maya Golan is requesting these books
(4, 2, 'AVAILABLE', NOW()), -- Data Structures and Introduction to Algorithms
(4, 3, 'AVAILABLE', NOW()), -- Automata Theory and Formal Languages
(4, 20, 'AVAILABLE', NOW()), -- Compilation

-- Yoav Stern is requesting these books
(5, 4, 'AVAILABLE', NOW()), -- Assembly Language
(5, 10, 'AVAILABLE', NOW()), -- Software Engineering
(5, 22, 'AVAILABLE', NOW()); -- Computer Security

-- Create some matches between users
INSERT INTO trading (provider_id, requester_id, book_id, status, created_at, matched_at, expiration_date) VALUES
-- Tal Cohen providing books to others
(1, 2, 1, 'PENDING', NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY)), -- Tal providing Introduction to CS to Noa

-- Noa Levi providing books to others
(2, 3, 9, 'PENDING', NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY)), -- Noa providing Database Systems to Amit

-- Amit Shapira providing books to others
(3, 5, 4, 'COMPLETED', NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY)), -- Amit providing Assembly Language to Yoav

-- Maya Golan providing books to others
(4, 1, 27, 'PENDING', NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY)), -- Maya providing Machine Learning to Tal

-- Yoav Stern providing books to others
(5, 3, 23, 'PENDING', NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY)); -- Yoav providing Web App Development to Amit
