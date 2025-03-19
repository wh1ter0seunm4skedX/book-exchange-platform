package book_exchange_platform.backend.books.data;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Builder
@Getter
@Setter
public class BookDto {

    private Long id;
    private String title;
    private Long courseNumber;
    private String coverImageUrl;
}