package book_exchange_platform.backend.books.utils;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.books.data.BookEntity;

public class BooksEntityToDtoConverter {

    public static BookDto toBookDto(BookEntity bookEntity) {
        return BookDto.builder()
                .id(bookEntity.getId())
                .title(bookEntity.getTitle())
                .courseNumber(bookEntity.getCourseNumber())
                .coverImageUrl(bookEntity.getCoverImageUrl())
                .build();
    }

    public static BookDto toBookDtoWithRelations(BookEntity bookEntity) {
        return BookDto.builder()
                .id(bookEntity.getId())
                .title(bookEntity.getTitle())
                .courseNumber(bookEntity.getCourseNumber())
                .coverImageUrl(bookEntity.getCoverImageUrl())
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
}
