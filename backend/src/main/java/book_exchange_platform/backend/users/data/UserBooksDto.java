package book_exchange_platform.backend.users.data;

import book_exchange_platform.backend.books.data.BookDto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@Getter
@Setter
public class UserBooksDto {
    private List<BookDto> booksForShare;
    private List<BookDto> requiredBooks;
} 