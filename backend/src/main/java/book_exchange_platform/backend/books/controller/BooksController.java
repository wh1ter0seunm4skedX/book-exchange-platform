package book_exchange_platform.backend.books.controller;


import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.books.manager.BooksManager;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/book_exchange_platform/books")
public class BooksController {

    private final BooksManager booksManager;

    public BooksController(BooksManager booksManager) {
        this.booksManager = booksManager;
    }


    @GetMapping("/")
    @ResponseBody
    public String home() {
        return "Welcome to the Books API!";
    }

    @GetMapping("/all")
    public List<BookDto> getAllBooks() {
        return booksManager.getAllBooks();
    }

    @GetMapping("/most_wanted")
    public List<BookDto> getMostWantedBooks() {
        return booksManager.getMostWantedBooks();
    }

//    @GetMapping("/{userId}/user_wanted")
//    public List<BookDto> getUserWanted(@PathVariable Long userId) {
//        return booksManager.getUserRequests(userId);
//    }
//
//    @GetMapping("/{userId}/user_published")
//    public List<BookDto> getUserPublished(@PathVariable Long userId) {
//        return booksManager.getUserPublications(userId);
//    }

}

