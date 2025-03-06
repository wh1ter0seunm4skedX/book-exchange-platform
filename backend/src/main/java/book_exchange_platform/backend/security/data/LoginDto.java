package book_exchange_platform.backend.security.data;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Builder
@Getter
@Setter
public class LoginDto {

    private String email;
    private String password;
    private Long phoneNumber;
}
