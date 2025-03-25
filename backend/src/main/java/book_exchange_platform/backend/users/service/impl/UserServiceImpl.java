package book_exchange_platform.backend.users.service.impl;

import book_exchange_platform.backend.users.data.UserDto;
import book_exchange_platform.backend.users.repository.UserRepository;
import book_exchange_platform.backend.users.service.UserService;
import book_exchange_platform.backend.users.utils.UsersEntityToDtoConverter;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public UserDto getUser(Long userId) {
        return UsersEntityToDtoConverter.toUserDto(userRepository.getUser(userId));
    }

    @Override
    public UserDto getUser(String email) {
        return UsersEntityToDtoConverter.toUserDto(userRepository.findUserByEmail(email));
    }

    @Override
    public UserDto addUser(UserDto user) {
        return UsersEntityToDtoConverter.toUserDto(userRepository.save(UsersEntityToDtoConverter.toUserEntity(user)));
    }

    @Override
    public UserDto updateUser(UserDto user) {
        return UsersEntityToDtoConverter.toUserDto(userRepository.save(UsersEntityToDtoConverter.toUserEntity(user)));
    }

    @Override
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    @Override
    public List<UserDto> getAll() {
        return userRepository.findAll().stream().map(userEntity -> UsersEntityToDtoConverter.toUserDto(userEntity)).toList();
    }

    @Override
    public boolean existsByEmail(String email){
        return userRepository.existsByEmail(email);
    }
}

