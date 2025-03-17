package book_exchange_platform.backend.books.utils;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.books.data.BookEntity;
import book_exchange_platform.backend.trading.data.PublicationBookDto;
import book_exchange_platform.backend.trading.data.PublicationDto;
import book_exchange_platform.backend.trading.data.RequestBookDto;
import book_exchange_platform.backend.trading.data.RequestDto;
import book_exchange_platform.backend.trading.utils.TradesEntityToDtoConverter;

import java.util.Collections;
import java.util.stream.Collectors;

public class BooksEntityToDtoConverter {

    public static BookDto toBookDto(BookEntity bookEntity) {
        return BookDto.builder()
                .id(bookEntity.getId())
                .title(bookEntity.getTitle())
                .courseNumber(bookEntity.getCourseNumber())
                .coverImageUrl(bookEntity.getCoverImageUrl())
                .sharedByUsers(Collections.emptyList()) // Avoid circular reference
                .requestedByUsers(Collections.emptyList()) // Avoid circular reference
                .build();
    }

    public static BookDto toBookDtoWithRelations(BookEntity bookEntity) {
        return BookDto.builder()
                .id(bookEntity.getId())
                .title(bookEntity.getTitle())
                .courseNumber(bookEntity.getCourseNumber())
                .coverImageUrl(bookEntity.getCoverImageUrl())
                .sharedByUsers(bookEntity.getSharedByUsers().stream()
                        .map(publicationEntity -> TradesEntityToDtoConverter.toPublicationDto(publicationEntity))
                        .collect(Collectors.toList()))
                .requestedByUsers(bookEntity.getRequestedByUsers().stream()
                        .map(requestEntity -> TradesEntityToDtoConverter.toRequestDto(requestEntity))
                        .collect(Collectors.toList()))
                .build();
    }
    
    public static BookEntity toBookEntity(BookDto bookDto) {
        return BookEntity.builder()
                .id(bookDto.getId())
                .title(bookDto.getTitle())
                .courseNumber(bookDto.getCourseNumber())
                .coverImageUrl(bookDto.getCoverImageUrl())
                .build();
    }

    public static PublicationDto toPublicationDto(PublicationBookDto publicationBookDto) {
        return PublicationDto.builder()
                .id(publicationBookDto.getId())
                .book(publicationBookDto.getBook())
                .bookCondition(publicationBookDto.getBookCondition())
                .user(null) // Avoid circular reference
                .build();
    }

    public static RequestDto toRequestDto(RequestBookDto requestBookDto) {
        return RequestDto.builder()
                .id(requestBookDto.getId())
                .book(requestBookDto.getBook())
                .user(null) // Avoid circular reference
                .build();
    }
}
