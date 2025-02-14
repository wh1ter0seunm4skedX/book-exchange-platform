package matches.data;

import books.data.Book;
import jakarta.persistence.*;
import users.data.User;


@Entity
@Table(name = "matches")
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User who has the book
    @ManyToOne
    @JoinColumn(name = "provider_id")
    private User provider;

    // User who wants the book
    @ManyToOne
    @JoinColumn(name = "requester_id")
    private User requester;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    // Status of the match (e.g., Pending, Completed)
    private String status;

// Getters and Setters

// Constructors
}