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


    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        BookDto bookDto = (BookDto) obj;
        return id.equals(bookDto.id) && this.title.equals(bookDto.title) && courseNumber.equals(bookDto.courseNumber) && coverImageUrl.equals(bookDto.coverImageUrl);
    }
}
