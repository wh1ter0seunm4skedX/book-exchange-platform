USE book_exchange;

-- Predefined list of available books
REPLACE INTO books (id, title, course_number, cover_image_url) VALUES
                                                                   (1, 'Introduction to Algorithms', 101, 'https://example.com/images/9780262033848.jpg'),
                                                                   (2, 'Clean Code', 102, 'https://example.com/images/9780132350884.jpg'),
                                                                   (3, 'Design Patterns', 103, 'https://example.com/images/9780201633610.jpg'),
                                                                   (4, 'Effective Java', 104, 'https://example.com/images/9780134685991.jpg'),
                                                                   (5, 'Java Concurrency in Practice', 105, 'https://example.com/images/9780321349606.jpg'),
                                                                   (6, 'Spring in Action', 106, 'https://example.com/images/9781617291203.jpg'),
                                                                   (7, 'Spring Boot in Action', 107, 'https://example.com/images/9781617292545.jpg'),
                                                                   (8, 'Spring Microservices in Action', 108, 'https://example.com/images/9781617293986.jpg'),
                                                                   (9, 'Spring Security in Action', 109, 'https://example.com/images/9781617297328.jpg'),
                                                                   (10, 'Spring Data JPA', 110, 'https://example.com/images/9789523000029.jpg');

INSERT IGNORE INTO users (full_name, email, password, phone_number, preferred_exchange_location) VALUES
                                                                                                     ('John Doe', 'john.doe@example.com', 'password123', 1234567890, 'New York'),
                                                                                                     ('Jane Smith', 'jane.smith@example.com', 'password123', 2345678901, 'Los Angeles'),
                                                                                                     ('Alice Johnson', 'alice.johnson@example.com', 'password123', 3456789012, 'Chicago'),
                                                                                                     ('Bob Brown', 'bob.brown@example.com', 'password123', 4567890123, 'Houston'),
                                                                                                     ('Charlie Davis', 'charlie.davis@example.com', 'password123', 5678901234, 'Phoenix');