package book_exchange_platform.backend.users.data;

import book_exchange_platform.backend.books.data.BookEntity;
import jakarta.persistence.*;
import book_exchange_platform.backend.matches.data.MatchEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Builder
@Getter
@Setter
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String password;
    private Long phoneNumber;
    private String preferredExchangeLocation;

    @ManyToMany
    @JoinTable( name = "user_books_shared",
                joinColumns = @JoinColumn(name = "user_id"),
                inverseJoinColumns = @JoinColumn(name = "book_id"))
    private List<BookEntity> booksForShare;

    @ManyToMany
    @JoinTable( name = "user_books_requested",
                joinColumns = @JoinColumn(name = "user_id"),
                inverseJoinColumns = @JoinColumn(name = "book_id"))
    private List<BookEntity> requiredBooks;

    @OneToMany(mappedBy = "provider")
    private List<MatchEntity> matchesToProvide;

    @OneToMany(mappedBy = "requester")
    private List<MatchEntity> matchesToRequest;

    public UserEntity() {
        this.id = null;
        this.fullName = null;
        this.email = null;
        this.password = null;
        this.phoneNumber = null;
        this.preferredExchangeLocation = null;
        this.booksForShare = null;
        this.requiredBooks = null;
        this.matchesToProvide = null;
        this.matchesToRequest = null;
    }

    public UserEntity(Long id, String fullName, String email, String password, Long phoneNumber, String preferredExchangeLocation, List<BookEntity> booksForShare, List<BookEntity> requiredBooks, List<MatchEntity> matchesToProvide, List<MatchEntity> matchesToRequest) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.preferredExchangeLocation = preferredExchangeLocation;
        this.booksForShare = booksForShare;
        this.requiredBooks = requiredBooks;
        this.matchesToProvide = matchesToProvide;
        this.matchesToRequest = matchesToRequest;
    }
}