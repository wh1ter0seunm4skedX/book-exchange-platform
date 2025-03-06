package book_exchange_platform.backend.users.service.impl;

import book_exchange_platform.backend.users.repository.UserRepository;
import book_exchange_platform.backend.users.service.UserService;
import org.springframework.stereotype.Service;


@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }




}

