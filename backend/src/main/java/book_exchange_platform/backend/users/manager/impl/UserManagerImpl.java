package book_exchange_platform.backend.users.manager.impl;

import book_exchange_platform.backend.users.manager.UserManager;
import book_exchange_platform.backend.users.service.UserService;
import org.springframework.stereotype.Service;


@Service
public class UserManagerImpl implements UserManager {

    private final UserService userService;

    public UserManagerImpl(UserService userService) {
        this.userService = userService;
    }




}

