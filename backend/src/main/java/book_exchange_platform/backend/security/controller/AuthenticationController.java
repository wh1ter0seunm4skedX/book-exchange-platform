package book_exchange_platform.backend.security.controller;

import book_exchange_platform.backend.security.data.LoginDto;
import book_exchange_platform.backend.security.utils.JwtUtil;
import book_exchange_platform.backend.users.data.UserDto;
import book_exchange_platform.backend.users.manager.UserManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/book_exchange_platform/auth")
public class AuthenticationController {

    private final UserManager userManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthenticationController(UserManager userManager, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userManager = userManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public UserDto registerUser(@RequestBody UserDto user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userManager.addUser(user);
    }

    @PostMapping("/login")
    public String loginUser(@RequestBody LoginDto userLogin) {
        UserDto foundUser = userManager.getUser(userLogin.getEmail());
        if (foundUser != null && passwordEncoder.matches(userLogin.getPassword(), foundUser.getPassword())) {
            return jwtUtil.generateToken(foundUser.getEmail());
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }
}

