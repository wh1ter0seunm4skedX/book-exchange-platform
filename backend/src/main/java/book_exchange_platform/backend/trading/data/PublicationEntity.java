package book_exchange_platform.backend.trading.data;

import book_exchange_platform.backend.books.data.BookEntity;
import book_exchange_platform.backend.users.data.UserEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@Builder
@Table(name = "user_books_published")
public class PublicationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private BookEntity book;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Enumerated(EnumType.STRING)
    private TradeStatus status;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "published_at")
    private Date publishedAt;

    public PublicationEntity() {
        this.id = null;
        this.book = null;
        this.user = null;
        this.status = null;
        this.publishedAt = null;
    }

    public PublicationEntity(Long id, BookEntity book, UserEntity user, TradeStatus status,  Date publishedAt) {
        this.id = id;
        this.book = book;
        this.user = user;
        this.status = status;
        this.publishedAt = publishedAt;
    }
}
