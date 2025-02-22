package book_exchange_platform.backend.books.controller;


import book_exchange_platform.backend.books.data.BookEntity;
import book_exchange_platform.backend.books.repository.BooksRepository;
import book_exchange_platform.backend.users.data.UserEntity;
import book_exchange_platform.backend.users.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BooksController {

    @Autowired
    private BooksRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/")
    @ResponseBody
    public String home() {
        return "Welcome to the Books API!";
    }

    @GetMapping("/available")
    @ResponseBody
    public List<UserEntity> getAvailableBooks() {
        return userRepository.findAll();
    }

    @GetMapping("/all")
    public List<BookEntity> getAllBooks() {
        return bookRepository.getAllBooks();
    }

    // Additional endpoints
}

