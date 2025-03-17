package book_exchange_platform.backend.trading.data;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.users.data.UserDto;

import java.util.Date;


public interface TradeDto {

    public UserDto getUser();

    public BookDto getBook();

    public TradeStatus getStatus();

    public Date getDate();
}
