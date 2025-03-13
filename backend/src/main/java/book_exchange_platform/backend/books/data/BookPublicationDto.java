package book_exchange_platform.backend.books.data;

import book_exchange_platform.backend.matches.data.SharedBookCondition;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class BookPublicationDto {
    private Long id;
    private String title;
    private Long courseNumber;
    private String coverImageUrl;
    private SharedBookCondition bookCondition;
    
    // This method returns itself to be used in contexts where a BookEntity is expected
    public BookDto getBook() {
        return BookDto.builder()
                .id(this.id)
                .title(this.title)
                .courseNumber(this.courseNumber)
                .coverImageUrl(this.coverImageUrl)
                .build();
    }
}