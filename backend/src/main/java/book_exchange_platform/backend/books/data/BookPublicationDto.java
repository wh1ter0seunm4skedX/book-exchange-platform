package book_exchange_platform.backend.books.data;

import book_exchange_platform.backend.matches.data.SharedBookCondition;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Builder
@Getter
@Setter
public class BookPublicationDto {

    private BookDto book;
    private SharedBookCondition bookCondition;
}