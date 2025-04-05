USE book_exchange;

-- Clear existing data (if any)
TRUNCATE TABLE trading;
TRUNCATE TABLE user_books_published;
TRUNCATE TABLE user_books_requested;

-- 1. Published books (books that users offer)
INSERT INTO user_books_published (user_id, book_id, status, published_at) VALUES
  -- User 1 (Tal Cohen) published books
  (1, 1, 'AVAILABLE', NOW()), -- Discrete Mathematics
  (1, 2, 'AVAILABLE', NOW()), -- Linear Algebra I
  (1, 3, 'MATCHED', NOW()),   -- Infinitesimal Calculus I (matched)
  
  -- User 2 (Noa Levi) published books
  (2, 7, 'MATCHED', NOW()),   -- Java (matched)
  (2, 8, 'MATCHED', NOW()),   -- Data Structures (matched)
  (2, 9, 'AVAILABLE', NOW()), -- Algorithms
  
  -- User 3 (Amit Shapira) published books
  (3, 10, 'AVAILABLE', NOW()), -- Automata Theory
  (3, 11, 'MATCHED', NOW()),   -- System Programming (matched)
  (3, 12, 'MATCHED', NOW()),   -- Theory of Computation (matched)
  
  -- User 4 (Maya Golan) published books
  (4, 17, 'AVAILABLE', NOW()),  -- Database Systems
  (4, 18, 'MATCHED', NOW()),    -- Information Systems (matched)
  (4, 19, 'MATCHED', NOW()),    -- Algorithmics (matched)
  
  -- User 5 (Yoav Stern) published books
  (5, 24, 'AVAILABLE', NOW()),  -- Intro to AI
  (5, 25, 'MATCHED', NOW()),    -- Biological Computation (matched)
  (5, 26, 'MATCHED', NOW());    -- Computer Networks (matched)

-- 2. Requested books (books that users want)
INSERT INTO user_books_requested (user_id, book_id, status, requested_at) VALUES
  -- User 1 (Tal Cohen) requested books
  (1, 7, 'MATCHED', NOW()),     -- Java (matched with User 2)
  (1, 11, 'MATCHED', NOW()),    -- System Programming (matched with User 3)
  (1, 26, 'MATCHED', NOW()),    -- Computer Networks (matched with User 5)
  (1, 17, 'AVAILABLE', NOW()),  -- Database Systems (available)
  
  -- User 2 (Noa Levi) requested books
  (2, 3, 'MATCHED', NOW()),     -- Infinitesimal Calculus (matched with User 1)
  (2, 19, 'MATCHED', NOW()),    -- Algorithmics (matched with User 4)
  (2, 10, 'AVAILABLE', NOW()),  -- Automata Theory (available)
  
  -- User 3 (Amit Shapira) requested books
  (3, 18, 'MATCHED', NOW()),    -- Information Systems (matched with User 4)
  (3, 25, 'MATCHED', NOW()),    -- Biological Computation (matched with User 5)
  (3, 1, 'AVAILABLE', NOW()),   -- Discrete Mathematics (available)
  
  -- User 4 (Maya Golan) requested books
  (4, 8, 'MATCHED', NOW()),     -- Data Structures (matched with User 2)
  (4, 12, 'MATCHED', NOW()),    -- Theory of Computation (matched with User 3)
  (4, 24, 'AVAILABLE', NOW()),  -- Intro to AI (available)
  
  -- User 5 (Yoav Stern) requested books
  (5, 2, 'AVAILABLE', NOW()),   -- Linear Algebra (available)
  (5, 9, 'AVAILABLE', NOW());   -- Algorithms (available)

-- 3. Trading matches with different statuses

-- NEW matches (just created, not confirmed yet)
INSERT INTO trading (provider_id, requester_id, book_id, status, created_at, expiration_date) VALUES
  -- User 1 provides book 1 to User 3
  (1, 3, 1, 'NEW', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY)),
  
  -- User 2 provides book 9 to User 5
  (2, 5, 9, 'NEW', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY));

-- PENDING matches (confirmed but not completed yet)
INSERT INTO trading (provider_id, requester_id, book_id, status, created_at, expiration_date) VALUES
  -- User 1 provides book 3 to User 2
  (1, 2, 3, 'PENDING', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 12 DAY)),
  
  -- User 2 provides book 7 to User 1
  (2, 1, 7, 'PENDING', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 11 DAY));

-- COMPLETED matches (exchange has been completed)
INSERT INTO trading (provider_id, requester_id, book_id, status, created_at, expiration_date) VALUES
  -- User 3 provides book 11 to User 1
  (3, 1, 11, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_ADD(NOW(), INTERVAL 4 DAY)),
  
  -- User 4 provides book 18 to User 3
  (4, 3, 18, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY));

-- CANCELLED matches (exchange was cancelled)
INSERT INTO trading (provider_id, requester_id, book_id, status, created_at, expiration_date) VALUES
  -- User 3 provides book 12 to User 4 (cancelled)
  (3, 4, 12, 'CANCELLED', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 9 DAY)),
  
  -- User 4 provides book 19 to User 2 (cancelled)
  (4, 2, 19, 'CANCELLED', DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_ADD(NOW(), INTERVAL 8 DAY));

-- EXPIRED matches (exchange expired without completion)
INSERT INTO trading (provider_id, requester_id, book_id, status, created_at, expiration_date) VALUES
  -- User 2 provides book 8 to User 4 (expired)
  (2, 4, 8, 'EXPIRED', DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
  
  -- User 5 provides book 25 to User 3 (expired)
  (5, 3, 25, 'EXPIRED', DATE_SUB(NOW(), INTERVAL 21 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
  
  -- User 5 provides book 26 to User 1 (expired)
  (5, 1, 26, 'EXPIRED', DATE_SUB(NOW(), INTERVAL 22 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY));
