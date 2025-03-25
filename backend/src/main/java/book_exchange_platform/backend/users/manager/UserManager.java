package book_exchange_platform.backend.users.manager;


import book_exchange_platform.backend.users.data.UserDto;

import java.util.List;

public interface UserManager {

    public UserDto getUser(Long userId);

    public UserDto getUser(String email);

    public UserDto addUser(UserDto user);

    public UserDto updateUser(UserDto user);

    public void deleteUser(Long userId);

    public List<UserDto> getAll();

    public boolean existsByEmail(String email);

}

