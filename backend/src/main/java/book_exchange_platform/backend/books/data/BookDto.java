package book_exchange_platform.backend.books.data;

import book_exchange_platform.backend.matches.data.PublicationDto;
import book_exchange_platform.backend.matches.data.PublicationEntity;
import book_exchange_platform.backend.matches.data.RequestDto;
import book_exchange_platform.backend.matches.data.RequestEntity;
import jakarta.persistence.Entity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Builder
@Getter
@Setter
public class BookDto {

    private Long id;
    private String title;
    private Long courseNumber;
    private String coverImageUrl;
    private List<PublicationDto> sharedByUsers;
    private List<RequestDto> requestedByUsers;
}