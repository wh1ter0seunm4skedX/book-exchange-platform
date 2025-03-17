package book_exchange_platform.backend.trading.data;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.users.data.UserDto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;


@Builder
@Getter
@Setter
public class MatchDto {

    private Long id;
    private UserDto provider;
    private UserDto requester;
    private BookDto book;
    private MatchStatus status;
    private Date expirationDate;
}