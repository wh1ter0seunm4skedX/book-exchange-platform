package book_exchange_platform.backend.users.utils;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.books.data.BookEntity;
import book_exchange_platform.backend.books.data.BookPublicationDto;
import book_exchange_platform.backend.books.utils.BooksEntityToDtoConverter;
import book_exchange_platform.backend.matches.utils.MatchesEntityToDtoConverter;
import book_exchange_platform.backend.users.data.UserBookDto;
import book_exchange_platform.backend.users.data.UserDto;
import book_exchange_platform.backend.users.data.UserEntity;

import java.util.Collections;
import java.util.stream.Collectors;

public class UsersEntityToDtoConverter {

    public static UserDto toUserDto(UserEntity userEntity){
        return UserDto.builder()
                .id(userEntity.getId())
                .fullName(userEntity.getFullName())
                .email(userEntity.getEmail())
                .password(userEntity.getPassword())
                .phoneNumber(userEntity.getPhoneNumber())
                .preferredExchangeLocation(userEntity.getPreferredExchangeLocation())
                .booksForShare(Collections.emptyList()) // Avoid circular reference
                .requiredBooks(Collections.emptyList()) // Avoid circular reference
                .matchesToProvide(Collections.emptyList()) // Avoid circular reference
                .matchesToRequest(Collections.emptyList()) // Avoid circular reference
                .build();
    }
    
    public static UserBookDto toUserBookDto(UserEntity userEntity){
        return UserBookDto.builder()
                .id(userEntity.getId())
                .fullName(userEntity.getFullName())
                .email(userEntity.getEmail())
                .phoneNumber(userEntity.getPhoneNumber()) // Using Long type now
                .preferredExchangeLocation(userEntity.getPreferredExchangeLocation())
                .build();
    }

    public static UserEntity toUserEntity(UserDto userDto){
        return UserEntity.builder()
                .id(userDto.getId())
                .fullName(userDto.getFullName())
                .email(userDto.getEmail())
                .password(userDto.getPassword())
                .phoneNumber(userDto.getPhoneNumber())
                .preferredExchangeLocation(userDto.getPreferredExchangeLocation())
                .booksForShare(userDto.getBooksForShare() != null ? 
                    userDto.getBooksForShare().stream()
                        .map(BooksEntityToDtoConverter::toBookEntity)
                        .collect(Collectors.toList()) : 
                    Collections.emptyList())
                .requiredBooks(userDto.getRequiredBooks() != null ? 
                    userDto.getRequiredBooks().stream()
                        .map(BooksEntityToDtoConverter::toBookEntity)
                        .collect(Collectors.toList()) : 
                    Collections.emptyList())
                .matchesToProvide(userDto.getMatchesToProvide() != null ? 
                    userDto.getMatchesToProvide().stream()
                        .map(MatchesEntityToDtoConverter::toMatchEntity)
                        .collect(Collectors.toList()) : 
                    Collections.emptyList())
                .matchesToRequest(userDto.getMatchesToRequest() != null ? 
                    userDto.getMatchesToRequest().stream()
                        .map(MatchesEntityToDtoConverter::toMatchEntity)
                        .collect(Collectors.toList()) : 
                    Collections.emptyList())
                .build();
    }
}
