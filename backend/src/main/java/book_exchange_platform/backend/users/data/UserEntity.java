package book_exchange_platform.backend.users.data;

import book_exchange_platform.backend.books.data.BookEntity;
import jakarta.persistence.*;
import book_exchange_platform.backend.matches.data.MatchEntity;
import lombok.Builder;
import lombok.Getter;
import org.hibernate.annotations.Formula;

import java.util.List;

@Entity
@Builder
@Getter
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String password;
    private Long phoneNumber;

    @Enumerated(EnumType.STRING)
    private ContactMethod preferredContactMethod;

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
}