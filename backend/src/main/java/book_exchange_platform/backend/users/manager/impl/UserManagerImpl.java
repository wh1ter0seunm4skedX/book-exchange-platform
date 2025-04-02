package book_exchange_platform.backend.users.manager.impl;

import book_exchange_platform.backend.users.data.UserDto;
import book_exchange_platform.backend.users.manager.UserManager;
import book_exchange_platform.backend.users.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserManagerImpl implements UserManager {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserManagerImpl(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
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
    public UserDto updateUser(UserDto userToUpdate) {
        if (userToUpdate.getPassword() == null || userToUpdate.getPassword().isEmpty()) {
            userToUpdate.setPassword(getUser(userToUpdate.getId()).getPassword());
        } else {
            userToUpdate.setPassword(passwordEncoder.encode(userToUpdate.getPassword()));
        }
        return userService.updateUser(userToUpdate);
    }

    @Override
    public void deleteUser(Long userId) {
        userService.deleteUser(userId);
    }

    @Override
    public List<UserDto> getAll() {
        return userService.getAll();
    }

    @Override
    public boolean existsByEmail(String email){
        return userService.existsByEmail(email);
    }
}

