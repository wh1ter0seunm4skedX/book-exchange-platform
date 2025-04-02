USE book_exchange;

INSERT INTO user_books_published (user_id, book_id, status, published_at) VALUES
  (1, 30, 'AVAILABLE', NOW()),
  (1, 11, 'MATCHED', NOW()),
  (1, 9, 'AVAILABLE', NOW()),

  (2, 29, 'MATCHED', NOW()),
  (2, 13, 'AVAILABLE', NOW()),
  (2, 7, 'MATCHED', NOW()),

  (3, 8, 'MATCHED', NOW()),
  (3, 14, 'MATCHED', NOW()),
  (3, 9, 'AVAILABLE', NOW()),

  (4, 2, 'AVAILABLE', NOW()),
  (4, 3, 'AVAILABLE', NOW()),
  (4, 20, 'AVAILABLE', NOW()),

  (5, 4, 'AVAILABLE', NOW()),
  (5, 10, 'AVAILABLE', NOW()),
  (5, 22, 'AVAILABLE', NOW());




INSERT INTO user_books_requested (user_id, book_id, status, requested_at) VALUES
(1, 7, 'MATCHED', NOW()),
(1, 8, 'MATCHED', NOW()),
(1, 27, 'AVAILABLE', NOW()),

(2, 1, 'AVAILABLE', NOW()),
(2, 12, 'AVAILABLE', NOW()),
(2, 28, 'AVAILABLE', NOW()),

(3, 11, 'MATCHED', NOW()),
(3, 15, 'AVAILABLE', NOW()),
(3, 23, 'AVAILABLE', NOW()),

(4, 7, 'AVAILABLE', NOW()),
(4, 8, 'AVAILABLE', NOW()),
(4, 29, 'MATCHED', NOW()),

(5, 1, 'AVAILABLE', NOW()),
(5, 7, 'AVAILABLE', NOW()),
(5, 14, 'MATCHED', NOW()),
(5, 20, 'AVAILABLE', NOW());

INSERT INTO trading (provider_id, requester_id, book_id, status, created_at, expiration_date) VALUES
(2, 1, 7, 'NEW', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY)),
(3, 1, 8, 'NEW', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY)),
(1, 3, 11, 'PENDING', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY)),

(3, 5, 14, 'PENDING', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY)),
(4, 5, 20, 'CANCELLED', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY)),
(2, 4, 29, 'PENDING', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY));
