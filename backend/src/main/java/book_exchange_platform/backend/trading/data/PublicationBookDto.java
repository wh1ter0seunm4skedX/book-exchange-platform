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
public class PublicationBookDto implements TradeDto {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private UserDto user;
    private SharedBookCondition bookCondition;
    private TradeStatus status;
    private Date date;
    
    @Override
    public BookDto getBook() {
        return BookDto.builder()
                .id(bookId)
                .title(bookTitle)
                .build();
    }
}
