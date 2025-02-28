package book_exchange_platform.backend.books.utils;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.books.data.BookEntity;
import book_exchange_platform.backend.matches.utils.MatchesEntityToDtoConverter;

import java.util.stream.Collectors;

public class BooksEntityToDtoConverter {

    public static BookDto toBookDto(BookEntity bookEntity){
        return BookDto.builder()
                .id(bookEntity.getId())
                .title(bookEntity.getTitle())
                .courseNumber(bookEntity.getCourseNumber())
                .coverImageUrl(bookEntity.getCoverImageUrl())
                .sharedByUsers(bookEntity.getSharedByUsers().stream().map(publicationEntity -> MatchesEntityToDtoConverter.toPublicationDto(publicationEntity)).collect(Collectors.toList()))
                .requestedByUsers(bookEntity.getRequestedByUsers().stream().map(requestEntity -> MatchesEntityToDtoConverter.toRequestDto(requestEntity)).collect(Collectors.toList()))
                .build();
    }

    public static BookEntity toBookEntity(BookDto bookDto){
        return BookEntity.builder()
                .id(bookDto.getId())
                .title(bookDto.getTitle())
                .courseNumber(bookDto.getCourseNumber())
                .coverImageUrl(bookDto.getCoverImageUrl())
                .sharedByUsers(bookDto.getSharedByUsers().stream().map(publicationDto -> MatchesEntityToDtoConverter.toPublicationEntity(publicationDto)).collect(Collectors.toList()))
                .requestedByUsers(bookDto.getRequestedByUsers().stream().map(requestDto -> MatchesEntityToDtoConverter.toRequestEntity(requestDto)).collect(Collectors.toList()))
                .build();
    }
}
