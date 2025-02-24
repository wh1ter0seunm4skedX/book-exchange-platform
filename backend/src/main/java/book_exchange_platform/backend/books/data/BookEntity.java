package book_exchange_platform.backend.books.data;

import book_exchange_platform.backend.matches.data.PublicationEntity;
import book_exchange_platform.backend.matches.data.RequestEntity;
import jakarta.persistence.*;
import book_exchange_platform.backend.users.data.UserEntity;
import lombok.Builder;
import lombok.Getter;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Entity
@Builder
@Getter
@Table(name = "books")
public class BookEntity {

    @Id
    private Long id; // Assume ID corresponds to predefined list



    private String title;
    private String author;
    private String isbn;

    @OneToMany(mappedBy = "book")
    private List<PublicationEntity> sharedByUsers;

    @OneToMany(mappedBy = "book")
    private List<RequestEntity> requestedByUsers;

    public BookEntity() {
        this.id = null;
        this.title = null;
        this.author = null;
        this.isbn = null;
        this.sharedByUsers = null;
        this.requestedByUsers = null;
    }

    public BookEntity(Long id, String title, String author, String isbn, List<PublicationEntity> sharedByUsers, List<RequestEntity> requestedByUsers) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.sharedByUsers = sharedByUsers;
        this.requestedByUsers = requestedByUsers;
    }
}