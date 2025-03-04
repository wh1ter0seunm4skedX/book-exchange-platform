package book_exchange_platform.backend.matches.utils;

import book_exchange_platform.backend.books.utils.BooksEntityToDtoConverter;
import book_exchange_platform.backend.matches.data.*;
import book_exchange_platform.backend.users.utils.UsersEntityToDtoConverter;

public class MatchesEntityToDtoConverter {

    public static MatchDto toMatchDto(MatchEntity matchEntity){
        return MatchDto.builder()
                .id(matchEntity.getId())
                .provider(UsersEntityToDtoConverter.toUserDto(matchEntity.getProvider()))
                .requester(UsersEntityToDtoConverter.toUserDto(matchEntity.getRequester()))
                .book(BooksEntityToDtoConverter.toBookDto(matchEntity.getBook()))
                .status(matchEntity.getStatus())
                .expirationDate(matchEntity.getExpirationDate())
                .build();
    }

    public static MatchEntity toMatchEntity(MatchDto matchDto){
        return MatchEntity.builder()
                .id(matchDto.getId())
                .provider(UsersEntityToDtoConverter.toUserEntity(matchDto.getProvider()))
                .requester(UsersEntityToDtoConverter.toUserEntity(matchDto.getRequester()))
                .book(BooksEntityToDtoConverter.toBookEntity(matchDto.getBook()))
                .status(matchDto.getStatus())
                .expirationDate(matchDto.getExpirationDate())
                .build();
    }

    public static PublicationDto toPublicationDto(PublicationEntity publicationEntity){
        return PublicationDto.builder()
                .id(publicationEntity.getId())
                .book(BooksEntityToDtoConverter.toBookDto(publicationEntity.getBook()))
                .user(UsersEntityToDtoConverter.toUserDto(publicationEntity.getUser()))
                .date(publicationEntity.getSharedAt())
                .build();
    }

    public static PublicationEntity toPublicationEntity(PublicationDto publicationDto){
        return PublicationEntity.builder()
                .id(publicationDto.getId())
                .book(BooksEntityToDtoConverter.toBookEntity(publicationDto.getBook()))
                .user(UsersEntityToDtoConverter.toUserEntity(publicationDto.getUser()))
                .sharedAt(publicationDto.getDate())
                .build();
    }

    public static RequestDto toRequestDto(RequestEntity requestEntity){
        return RequestDto.builder()
                .id(requestEntity.getId())
                .book(BooksEntityToDtoConverter.toBookDto(requestEntity.getBook()))
                .user(UsersEntityToDtoConverter.toUserDto(requestEntity.getUser()))
                .date(requestEntity.getRequestedAt())
                .build();
    }

    public static RequestEntity toRequestEntity(RequestDto requestDto){
        return RequestEntity.builder()
                .id(requestDto.getId())
                .book(BooksEntityToDtoConverter.toBookEntity(requestDto.getBook()))
                .user(UsersEntityToDtoConverter.toUserEntity(requestDto.getUser()))
                .requestedAt(requestDto.getDate())
                .build();
    }
}
