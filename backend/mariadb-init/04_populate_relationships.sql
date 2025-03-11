-- Use the book_exchange database
USE book_exchange;

-- Insert books that users are sharing
INSERT INTO user_books_shared (user_id, book_id, shared_at) VALUES
-- Tal Cohen is sharing these books
(1, 1, NOW()), -- Introduction to Computer Science Using Java
(1, 2, NOW()), -- Data Structures and Introduction to Algorithms
(1, 6, NOW()), -- Algorithms
(1, 12, NOW()), -- Introduction to Artificial Intelligence

-- Noa Levi is sharing these books
(2, 3, NOW()), -- Automata Theory and Formal Languages
(2, 7, NOW()), -- Operating Systems
(2, 9, NOW()), -- Database Systems
(2, 16, NOW()), -- Discrete Mathematics

-- Amit Shapira is sharing these books
(3, 4, NOW()), -- Assembly Language
(3, 5, NOW()), -- Computer Organization
(3, 8, NOW()), -- Computer Networks
(3, 11, NOW()), -- Advanced Programming with Java

-- Maya Golan is sharing these books
(4, 10, NOW()), -- Software Engineering
(4, 14, NOW()), -- Computer Graphics
(4, 22, NOW()), -- Computer Security
(4, 27, NOW()), -- Machine Learning

-- Yoav Stern is sharing these books
(5, 13, NOW()), -- Logic Programming
(5, 20, NOW()), -- Compilation
(5, 23, NOW()), -- Workshop: Web Application Development
(5, 28, NOW()); -- Deep Learning

-- Insert books that users are requesting
INSERT INTO user_books_requested (user_id, book_id, requested_at) VALUES
-- Tal Cohen is requesting these books
(1, 7, NOW()), -- Operating Systems
(1, 8, NOW()), -- Computer Networks
(1, 27, NOW()), -- Machine Learning

-- Noa Levi is requesting these books
(2, 1, NOW()), -- Introduction to Computer Science Using Java
(2, 12, NOW()), -- Introduction to Artificial Intelligence
(2, 28, NOW()), -- Deep Learning

-- Amit Shapira is requesting these books
(3, 9, NOW()), -- Database Systems
(3, 14, NOW()), -- Computer Graphics
(3, 23, NOW()), -- Workshop: Web Application Development

-- Maya Golan is requesting these books
(4, 2, NOW()), -- Data Structures and Introduction to Algorithms
(4, 3, NOW()), -- Automata Theory and Formal Languages
(4, 20, NOW()), -- Compilation

-- Yoav Stern is requesting these books
(5, 4, NOW()), -- Assembly Language
(5, 10, NOW()), -- Software Engineering
(5, 22, NOW()); -- Computer Security

-- Create some matches between users
INSERT INTO matches (provider_id, requester_id, book_id, status, created_at) VALUES
-- Tal Cohen providing books to others
(1, 2, 1, 'PENDING', NOW()), -- Tal providing Introduction to CS to Noa

-- Noa Levi providing books to others
(2, 3, 9, 'ACCEPTED', NOW()), -- Noa providing Database Systems to Amit

-- Amit Shapira providing books to others
(3, 5, 4, 'COMPLETED', NOW()), -- Amit providing Assembly Language to Yoav

-- Maya Golan providing books to others
(4, 1, 27, 'PENDING', NOW()), -- Maya providing Machine Learning to Tal

-- Yoav Stern providing books to others
(5, 3, 23, 'ACCEPTED', NOW()); -- Yoav providing Web App Development to Amit
