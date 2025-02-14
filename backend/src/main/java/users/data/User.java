package users.data;

import books.data.Book;
import jakarta.persistence.*;
import matches.data.Match;


import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String password;
    private String phoneNumber;
    private String preferredContactMethod;

    @ManyToMany
    @JoinTable(
            name = "user_books_shared",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "book_id")
    )
    private List<Book> booksForShare;

    @ManyToMany
    @JoinTable(
            name = "user_books_requested",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "book_id")
    )
    private List<Book> requiredBooks;

    @OneToMany(mappedBy = "user")
    private List<Match> matches;

// Getters and Setters

// Constructors
}