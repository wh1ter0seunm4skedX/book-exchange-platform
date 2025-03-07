package book_exchange_platform.backend.security.manager;

import book_exchange_platform.backend.users.data.UserDto;
import book_exchange_platform.backend.users.service.UserService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class AuthenticationManager implements UserDetailsService {

    private UserService userService;

    public AuthenticationManager(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserDto user = userService.getUser(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        return new User(user.getEmail(), user.getPassword(), new ArrayList<>());
    }
}