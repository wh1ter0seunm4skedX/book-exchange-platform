package book_exchange_platform.backend.users.manager.impl;

import book_exchange_platform.backend.users.data.UserDto;
import book_exchange_platform.backend.users.manager.UserManager;
import book_exchange_platform.backend.users.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserManagerImpl implements UserManager {

    private final UserService userService;

    public UserManagerImpl(UserService userService) {
        this.userService = userService;
    }


    @Override
    public UserDto getUser(Long userId) {
        return userService.getUser(userId);
    }

    @Override
    public UserDto getUser(String email) {
        return userService.getUser(email);
    }

    @Override
    public UserDto addUser(UserDto user) {
        return userService.addUser(user);
    }

    @Override
    public UserDto updateUser(UserDto user) {
        return userService.updateUser(user);
    }

    @Override
    public void deleteUser(Long userId) {
        userService.deleteUser(userId);
    }

    @Override
    public List<UserDto> getAll() {
        return userService.getAll();
    }
}

