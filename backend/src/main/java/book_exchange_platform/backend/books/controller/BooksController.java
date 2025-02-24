package book_exchange_platform.backend.books.controller;


import book_exchange_platform.backend.books.data.BookEntity;
import book_exchange_platform.backend.books.repository.BooksRepository;
import book_exchange_platform.backend.users.data.UserEntity;
import book_exchange_platform.backend.users.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/book_exchange_platform/books")
public class BooksController {


    private final BooksRepository bookRepository;
    private final UserRepository userRepository;

    public BooksController(BooksRepository bookRepository, UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/")
    @ResponseBody
    public String home() {
        return "Welcome to the Books API!";
    }

    @GetMapping("/all")
    public List<BookEntity> getAllBooks() {
        return bookRepository.getAllBooks();
    }

    // Additional endpoints
}

