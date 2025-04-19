USE book_exchange;

TRUNCATE TABLE trading;
TRUNCATE TABLE user_books_published;
TRUNCATE TABLE user_books_requested;

INSERT INTO user_books_published (user_id, book_id, status, published_at) VALUES
  (1, 1, 'AVAILABLE', NOW()),
  (1, 2, 'AVAILABLE', NOW()),
  (1, 3, 'MATCHED', NOW()),
  (2, 7, 'MATCHED', NOW()),
  (2, 8, 'MATCHED', NOW()),
  (2, 9, 'AVAILABLE', NOW()),
  (3, 10, 'AVAILABLE', NOW()),
  (3, 11, 'MATCHED', NOW()),
  (3, 12, 'MATCHED', NOW()),
  (4, 17, 'AVAILABLE', NOW()),
  (4, 18, 'MATCHED', NOW()),
  (4, 19, 'MATCHED', NOW()),
  (5, 24, 'AVAILABLE', NOW()),
  (5, 25, 'MATCHED', NOW()),
  (5, 26, 'MATCHED', NOW());

INSERT INTO user_books_requested (user_id, book_id, status, requested_at) VALUES
  (1, 7, 'MATCHED', NOW()),
  (1, 11, 'MATCHED', NOW()),
  (1, 26, 'MATCHED', NOW()),
  (1, 17, 'AVAILABLE', NOW()),
  (2, 3, 'MATCHED', NOW()),
  (2, 19, 'MATCHED', NOW()),
  (2, 10, 'AVAILABLE', NOW()),
  (3, 18, 'MATCHED', NOW()),
  (3, 25, 'MATCHED', NOW()),
  (3, 1, 'AVAILABLE', NOW()),
  (4, 8, 'MATCHED', NOW()),
  (4, 12, 'MATCHED', NOW()),
  (4, 24, 'AVAILABLE', NOW()),
  (5, 2, 'AVAILABLE', NOW()),
  (5, 9, 'AVAILABLE', NOW());

INSERT INTO trading (provider_id, requester_id, book_id, status, expiration_date) VALUES
  (1, 3, 20, 'COMPLETED', DATE_ADD(NOW(), INTERVAL 14 DAY)),
  (2, 5, 15, 'COMPLETED', DATE_ADD(NOW(), INTERVAL 14 DAY)),
  (1, 2, 3, 'NEW', DATE_ADD(NOW(), INTERVAL 12 DAY)),
  (2, 1, 7, 'NEW', DATE_ADD(NOW(), INTERVAL 11 DAY)),
  (3, 4, 12, 'NEW', DATE_ADD(NOW(), INTERVAL 9 DAY)),
  (3, 1, 11, 'PENDING', DATE_ADD(NOW(), INTERVAL 4 DAY)),
  (4, 3, 18, 'PENDING', DATE_ADD(NOW(), INTERVAL 3 DAY)),
  (2, 4, 8, 'PENDING', DATE_ADD(NOW(), INTERVAL 12 DAY)),
  (4, 2, 19, 'PENDING', DATE_ADD(NOW(), INTERVAL 8 DAY)),
  (5, 3, 25, 'PENDING', DATE_SUB(NOW(), INTERVAL 7 DAY)),
  (5, 1, 26, 'PENDING', DATE_SUB(NOW(), INTERVAL 8 DAY)),
  (2, 5, 2, 'CANCELLED', DATE_ADD(NOW(), INTERVAL 9 DAY)),
  (4, 1, 17, 'CANCELLED', DATE_ADD(NOW(), INTERVAL 9 DAY));
