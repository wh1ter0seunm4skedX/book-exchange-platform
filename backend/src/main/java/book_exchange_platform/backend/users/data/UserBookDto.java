package book_exchange_platform.backend.users.data;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class UserBookDto {
    private Long id;
    private String fullName;
    private String email;
    private Long phoneNumber; // Updated to Long to match UserEntity
    private String preferredExchangeLocation;
}
