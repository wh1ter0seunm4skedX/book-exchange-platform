package book_exchange_platform.backend.matches.utils;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.books.utils.BooksEntityToDtoConverter;
import book_exchange_platform.backend.matches.data.*;
import book_exchange_platform.backend.users.data.UserDto;
import book_exchange_platform.backend.users.utils.UsersEntityToDtoConverter;

public class MatchesEntityToDtoConverter {

    public static MatchDto toMatchDto(MatchEntity matchEntity) {
        // Use simplified Book DTO without relations
        BookDto bookDto = BooksEntityToDtoConverter.toBookDto(matchEntity.getBook());
        
        // Convert UserEntity to UserDto
        UserDto providerDto = UsersEntityToDtoConverter.toUserDto(matchEntity.getProvider());
        UserDto requesterDto = UsersEntityToDtoConverter.toUserDto(matchEntity.getRequester());
        
        return MatchDto.builder()
                .id(matchEntity.getId())
                .provider(providerDto)
                .requester(requesterDto)
                .book(bookDto)
                .status(matchEntity.getStatus())
                .expirationDate(matchEntity.getExpirationDate())
                .build();
    }

    public static MatchEntity toMatchEntity(MatchDto matchDto) {
        return MatchEntity.builder()
                .id(matchDto.getId())
                .provider(UsersEntityToDtoConverter.toUserEntity(matchDto.getProvider()))
                .requester(UsersEntityToDtoConverter.toUserEntity(matchDto.getRequester()))
                .book(BooksEntityToDtoConverter.toBookEntity(matchDto.getBook()))
                .status(matchDto.getStatus())
                .expirationDate(matchDto.getExpirationDate())
                .build();
    }

    public static PublicationDto toPublicationDto(PublicationEntity publicationEntity) {
        // Use simplified Book DTO without relations
        BookDto bookDto = BooksEntityToDtoConverter.toBookDto(publicationEntity.getBook());
        
        // Convert UserEntity to UserDto
        UserDto userDto = UsersEntityToDtoConverter.toUserDto(publicationEntity.getUser());
        
        return PublicationDto.builder()
                .id(publicationEntity.getId())
                .book(bookDto)
                .user(userDto)
                .bookCondition(publicationEntity.getBookCondition())
                .status(publicationEntity.getStatus())
                .date(publicationEntity.getSharedAt())
                .build();
    }

    public static PublicationEntity toPublicationEntity(PublicationDto publicationDto) {
        return PublicationEntity.builder()
                .id(publicationDto.getId())
                .book(BooksEntityToDtoConverter.toBookEntity(publicationDto.getBook()))
                .user(UsersEntityToDtoConverter.toUserEntity(publicationDto.getUser()))
                .bookCondition(publicationDto.getBookCondition())
                .status(publicationDto.getStatus())
                .sharedAt(publicationDto.getDate())
                .build();
    }

    public static RequestDto toRequestDto(RequestEntity requestEntity) {
        // Use simplified Book DTO without relations
        BookDto bookDto = BooksEntityToDtoConverter.toBookDto(requestEntity.getBook());
        
        // Convert UserEntity to UserDto
        UserDto userDto = UsersEntityToDtoConverter.toUserDto(requestEntity.getUser());
        
        return RequestDto.builder()
                .id(requestEntity.getId())
                .book(bookDto)
                .user(userDto)
                .status(requestEntity.getStatus())
                .date(requestEntity.getRequestedAt())
                .build();
    }

    public static RequestEntity toRequestEntity(RequestDto requestDto) {
        return RequestEntity.builder()
                .id(requestDto.getId())
                .book(BooksEntityToDtoConverter.toBookEntity(requestDto.getBook()))
                .user(UsersEntityToDtoConverter.toUserEntity(requestDto.getUser()))
                .status(requestDto.getStatus())
                .requestedAt(requestDto.getDate())
                .build();
    }

    public static PublicationBookDto toPublicationBookDto(PublicationEntity publicationEntity) {
        return PublicationBookDto.builder()
                .id(publicationEntity.getId())
                .bookId(publicationEntity.getBook().getId())
                .bookTitle(publicationEntity.getBook().getTitle())
                .user(UsersEntityToDtoConverter.toUserDto(publicationEntity.getUser()))
                .bookCondition(publicationEntity.getBookCondition())
                .status(publicationEntity.getStatus())
                .date(publicationEntity.getSharedAt())
                .build();
    }

    public static RequestBookDto toRequestBookDto(RequestEntity requestEntity) {
        return RequestBookDto.builder()
                .id(requestEntity.getId())
                .bookId(requestEntity.getBook().getId())
                .bookTitle(requestEntity.getBook().getTitle())
                .user(UsersEntityToDtoConverter.toUserDto(requestEntity.getUser()))
                .status(requestEntity.getStatus())
                .date(requestEntity.getRequestedAt())
                .build();
    }
}
