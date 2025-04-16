package book_exchange_platform.backend.users.utils;

import book_exchange_platform.backend.users.data.UserDto;
import book_exchange_platform.backend.users.data.UserEntity;

public class UsersEntityToDtoConverter {

    public static UserDto toUserDto(UserEntity userEntity){
        return UserDto.builder()
                .id(userEntity.getId())
                .fullName(userEntity.getFullName())
                .email(userEntity.getEmail())
                .password(userEntity.getPassword())
                .phoneNumber(userEntity.getPhoneNumber())
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
                .build();
    }
}
