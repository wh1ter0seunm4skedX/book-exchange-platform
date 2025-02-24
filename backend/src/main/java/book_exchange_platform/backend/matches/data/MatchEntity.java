package book_exchange_platform.backend.matches.data;

import book_exchange_platform.backend.books.data.BookEntity;
import jakarta.persistence.*;
import book_exchange_platform.backend.users.data.UserEntity;
import lombok.Builder;
import lombok.Getter;


@Entity
@Builder
@Getter
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
    @Enumerated(EnumType.STRING)
    private MatchStatus status;

    public MatchEntity() {
        this.id = null;
        this.provider = null;
        this.requester = null;
        this.book = null;
        this.status = null;
    }

    public MatchEntity(Long id, UserEntity provider, UserEntity requester, BookEntity book, MatchStatus status) {
        this.id = id;
        this.provider = provider;
        this.requester = requester;
        this.book = book;
        this.status = status;
    }
}