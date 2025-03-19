package book_exchange_platform.backend.users.data;

import book_exchange_platform.backend.books.data.BookEntity;
import jakarta.persistence.*;
import book_exchange_platform.backend.trading.data.MatchEntity;
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


    public UserEntity() {
        this.id = null;
        this.fullName = null;
        this.email = null;
        this.password = null;
        this.phoneNumber = null;
        this.preferredExchangeLocation = null;
    }

    public UserEntity(Long id, String fullName, String email, String password, Long phoneNumber, String preferredExchangeLocation) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.preferredExchangeLocation = preferredExchangeLocation;
    }
}