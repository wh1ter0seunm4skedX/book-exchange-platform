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
//@Builder
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
}