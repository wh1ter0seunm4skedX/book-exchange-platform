package book_exchange_platform.backend.matches.data;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.users.data.UserDto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Builder
@Getter
@Setter
public class PublicationDto implements TradeDto {

    private Long id;
    private BookDto book;
    private UserDto user;
    private SharedBookCondition bookCondition;
    private TradeStatus status;
    private Date date;
}
