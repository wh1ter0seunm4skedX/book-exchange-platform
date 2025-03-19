package book_exchange_platform.backend.users.data;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Builder
@Getter
@Setter
public class UserDto {

    private Long id;
    private String fullName;
    private String email;
    private String password;
    private Long phoneNumber;
    private String preferredExchangeLocation;
}
