USE book_exchange;

INSERT INTO user_books_published (user_id, book_id, status, shared_at) VALUES
(1, 1, 'AVAILABLE', NOW()), 
(1, 2, 'AVAILABLE', NOW()),
(1, 6, 'AVAILABLE', NOW()),
(1, 12, 'AVAILABLE', NOW()),

(2, 3, 'AVAILABLE', NOW()),
(2, 7, 'AVAILABLE', NOW()),
(2, 9, 'AVAILABLE', NOW()),
(2, 16, 'AVAILABLE', NOW()),

(3, 4, 'AVAILABLE', NOW()),
(3, 5, 'AVAILABLE', NOW()),
(3, 8, 'AVAILABLE', NOW()),
(3, 11, 'AVAILABLE', NOW()),

(4, 10, 'AVAILABLE', NOW()),
(4, 14, 'AVAILABLE', NOW()),
(4, 22, 'AVAILABLE', NOW()),
(4, 27, 'AVAILABLE', NOW()),

(5, 13, 'AVAILABLE', NOW()),
(5, 20, 'AVAILABLE', NOW()),
(5, 23, 'AVAILABLE', NOW()),
(5, 28, 'AVAILABLE', NOW());

INSERT INTO user_books_requested (user_id, book_id, status, requested_at) VALUES
(1, 7, 'AVAILABLE', NOW()),
(1, 8, 'AVAILABLE', NOW()),
(1, 27, 'AVAILABLE', NOW()),

(2, 1, 'AVAILABLE', NOW()),
(2, 12, 'AVAILABLE', NOW()),
(2, 28, 'AVAILABLE', NOW()),

(3, 9, 'AVAILABLE', NOW()),
(3, 14, 'AVAILABLE', NOW()),
(3, 23, 'AVAILABLE', NOW()),

(4, 2, 'AVAILABLE', NOW()),
(4, 3, 'AVAILABLE', NOW()),
(4, 20, 'AVAILABLE', NOW()),

(5, 4, 'AVAILABLE', NOW()),
(5, 10, 'AVAILABLE', NOW()),
(5, 22, 'AVAILABLE', NOW());

INSERT INTO trading (provider_id, requester_id, book_id, status, created_at, expiration_date) VALUES
(1, 2, 1, 'PENDING', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY)),
(2, 3, 9, 'PENDING', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY)),
(3, 5, 4, 'COMPLETED', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY)),

(4, 1, 27, 'PENDING', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY)),

(5, 3, 23, 'PENDING', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY));
