package book_exchange_platform.backend.matches.data;

import book_exchange_platform.backend.books.data.BookEntity;
import book_exchange_platform.backend.users.data.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "user_books_shared")
@Getter
@Setter
public class PublicationEntity {

    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private BookEntity book;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "shared_at")
    private Date sharedAt;
}
