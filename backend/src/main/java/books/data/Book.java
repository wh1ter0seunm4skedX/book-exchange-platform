package books.data;

import jakarta.persistence.*;
import users.data.User;

import java.util.List;

@Entity
@Table(name = "books")
public class Book {

    @Id
    private Long id; // Assume ID corresponds to predefined list

    private String title;
    private String author;
    private String isbn;

    @ManyToMany(mappedBy = "booksForShare")
    private List<User> sharedByUsers;

    @ManyToMany(mappedBy = "requiredBooks")
    private List<User> requestedByUsers;

// Getters and Setters

// Constructors
}