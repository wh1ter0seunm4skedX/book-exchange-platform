package book_exchange_platform.backend.users.utils;

import book_exchange_platform.backend.books.utils.BooksEntityToDtoConverter;
import book_exchange_platform.backend.matches.utils.MatchesEntityToDtoConverter;
import book_exchange_platform.backend.users.data.UserDto;
import book_exchange_platform.backend.users.data.UserEntity;

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
                .booksForShare(userEntity.getBooksForShare().stream().map(bookEntity -> BooksEntityToDtoConverter.toBookDto(bookEntity)).collect(Collectors.toList()))
                .requiredBooks(userEntity.getRequiredBooks().stream().map(bookEntity -> BooksEntityToDtoConverter.toBookDto(bookEntity)).collect(Collectors.toList()))
                .matchesToProvide(userEntity.getMatchesToProvide().stream().map(matchEntity -> MatchesEntityToDtoConverter.toMatchDto(matchEntity)).collect(Collectors.toList()))
                .matchesToRequest(userEntity.getMatchesToRequest().stream().map(matchEntity -> MatchesEntityToDtoConverter.toMatchDto(matchEntity)).collect(Collectors.toList()))
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
                .booksForShare(userDto.getBooksForShare().stream().map(bookDto -> BooksEntityToDtoConverter.toBookEntity(bookDto)).collect(Collectors.toList()))
                .requiredBooks(userDto.getRequiredBooks().stream().map(bookDto -> BooksEntityToDtoConverter.toBookEntity(bookDto)).collect(Collectors.toList()))
                .matchesToProvide(userDto.getMatchesToProvide().stream().map(matchDto -> MatchesEntityToDtoConverter.toMatchEntity(matchDto)).collect(Collectors.toList()))
                .matchesToRequest(userDto.getMatchesToRequest().stream().map(matchDto -> MatchesEntityToDtoConverter.toMatchEntity(matchDto)).collect(Collectors.toList()))
                .build();
    }
}
