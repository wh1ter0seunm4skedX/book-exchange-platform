package book_exchange_platform.backend.matches.data;

import book_exchange_platform.backend.books.data.BookEntity;
import book_exchange_platform.backend.users.data.UserEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Builder
@Getter
@Setter
@Table(name = "user_books_requested")
public class RequestEntity {

    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private BookEntity book;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "requested_at")
    private Date requestedAt;

    public RequestEntity() {
        this.id = null;
        this.book = null;
        this.user = null;
        this.requestedAt = null;
    }

    public RequestEntity(Long id, BookEntity book, UserEntity user, Date requestedAt) {
        this.id = id;
        this.book = book;
        this.user = user;
        this.requestedAt = requestedAt;
    }
}
