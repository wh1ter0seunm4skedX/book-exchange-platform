package book_exchange_platform.backend.books.data;

import jakarta.persistence.*;
import book_exchange_platform.backend.users.data.UserEntity;

import java.util.List;

@Entity
@Table(name = "books")
public class BookEntity {

    @Id
    private Long id; // Assume ID corresponds to predefined list

    private String title;
    private String author;
    private String isbn;

    @ManyToMany(mappedBy = "booksForShare")
    private List<UserEntity> sharedByUsers;

    @ManyToMany(mappedBy = "requiredBooks")
    private List<UserEntity> requestedByUsers;

// Getters and Setters

// Constructors
}