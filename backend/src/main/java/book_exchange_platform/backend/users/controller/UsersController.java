package book_exchange_platform.backend.users.controller;

import book_exchange_platform.backend.users.data.UserDto;
import book_exchange_platform.backend.users.manager.UserManager;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/book_exchange_platform/users")
public class UsersController {

    private final UserManager userManager;

    public UsersController(UserManager userManager) {
        this.userManager = userManager;
    }


    @GetMapping("/all")
    @ResponseBody
    public List<UserDto> getAllUsers() {
        return userManager.getAll();
    }

    @GetMapping("/{userId}")
    @ResponseBody
    public UserDto getUser(@PathVariable Long userId) {
        return userManager.getUser(userId);
    }

    @PostMapping("/update")
    @ResponseBody
    public UserDto updateUser(@RequestBody UserDto userDto) {
        return userManager.updateUser(userDto);
    }
}

