package book_exchange_platform.backend.users.controller;

import book_exchange_platform.backend.config.JwtUtil;
import book_exchange_platform.backend.users.data.UserEntity;
import book_exchange_platform.backend.users.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public UserEntity registerUser(@RequestBody UserEntity user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public String loginUser(@RequestBody UserEntity user) {
        UserEntity foundUser = userRepository.findByEmail(user.getEmail());
        if (foundUser != null && passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
            return jwtUtil.generateToken(foundUser.getEmail());
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }
}

