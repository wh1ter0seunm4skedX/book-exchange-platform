package book_exchange_platform.backend.security.controller;

import book_exchange_platform.backend.security.data.LoginDto;
import book_exchange_platform.backend.security.utils.JwtUtil;
import book_exchange_platform.backend.users.data.UserDto;
import book_exchange_platform.backend.users.manager.UserManager;
import book_exchange_platform.backend.users.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/book_exchange_platform/auth")
public class AuthenticationController {

    private final UserManager userManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public AuthenticationController(UserManager userManager, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, UserRepository userRepository) {
        this.userManager = userManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDto user) {
        // Check if user with the same email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "User with this email already exists");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
        
        // Initialize empty lists to avoid NullPointerException
        if (user.getBooksForShare() == null) {
            user.setBooksForShare(new ArrayList<>());
        }
        if (user.getRequiredBooks() == null) {
            user.setRequiredBooks(new ArrayList<>());
        }
        if (user.getMatchesToProvide() == null) {
            user.setMatchesToProvide(new ArrayList<>());
        }
        if (user.getMatchesToRequest() == null) {
            user.setMatchesToRequest(new ArrayList<>());
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        UserDto savedUser = userManager.addUser(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginDto userLogin) {
        UserDto foundUser = userManager.getUser(userLogin.getEmail());
        if (foundUser != null && passwordEncoder.matches(userLogin.getPassword(), foundUser.getPassword())) {
            Map<String, String> response = new HashMap<>();
            response.put("token", jwtUtil.generateToken(foundUser.getEmail()));
            response.put("email", foundUser.getEmail());
            response.put("userId", String.valueOf(foundUser.getId()));
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Invalid credentials");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }
}
