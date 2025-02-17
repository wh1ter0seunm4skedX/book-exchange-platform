package book_exchange_platform.backend.matches.data;

import book_exchange_platform.backend.books.data.BookEntity;
import jakarta.persistence.*;
import book_exchange_platform.backend.users.data.UserEntity;


@Entity
@Table(name = "matches")
public class MatchEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User who has the book
    @ManyToOne
    @JoinColumn(name = "provider_id")
    private UserEntity provider;

    // User who wants the book
    @ManyToOne
    @JoinColumn(name = "requester_id")
    private UserEntity requester;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private BookEntity book;

    // Status of the match (e.g., Pending, Completed)
    private String status;

// Getters and Setters

// Constructors
}