USE book_exchange;

-- Predefined list of available books
INSERT INTO books (id, title, author, isbn) VALUES
                                                (1, 'Introduction to Algorithms', 'Thomas H. Cormen', '9780262033848'),
                                                (2, 'Clean Code', 'Robert C. Martin', '9780132350884'),
                                                (3, 'Design Patterns', 'Erich Gamma', '9780201633610'),
                                                (4, 'Effective Java', 'Joshua Bloch', '9780134685991'),
                                                (5, 'Java Concurrency in Practice', 'Brian Goetz', '9780321349606'),
                                                (6, 'Spring in Action', 'Craig Walls', '9781617291203'),
                                                (7, 'Spring Boot in Action', 'Craig Walls', '9781617292545'),
                                                (8, 'Spring Microservices in Action', 'John Carnell', '9781617293986'),
                                                (9, 'Spring Security in Action', 'Laurentiu Spilca', '9781617297328'),
                                                (10, 'Spring Data JPA', 'Petri Kainulainen', '9789523000029');