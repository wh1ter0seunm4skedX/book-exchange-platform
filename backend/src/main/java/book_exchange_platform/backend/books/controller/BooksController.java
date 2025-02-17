package book_exchange_platform.backend.books.controller;


import book_exchange_platform.backend.books.data.BookEntity;
import book_exchange_platform.backend.books.repository.BooksRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BooksController {

    @Autowired
    private BooksRepository bookRepository;

    @GetMapping("/")
    public String home() {
        return "Welcome to the Books API!";
    }

    @GetMapping("/available")
    public List<BookEntity> getAvailableBooks() {
        return bookRepository.findAll();
    }

    @GetMapping("/all")
    public List<BookEntity> getAllBooks() {
        return bookRepository.getAllBooks();
    }

    // Additional endpoints
}

