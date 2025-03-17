package book_exchange_platform.backend.books.manager.impl;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.books.manager.BooksManager;
import book_exchange_platform.backend.books.service.BooksService;
import book_exchange_platform.backend.trading.service.TradesService;
import book_exchange_platform.backend.users.service.UserTradingService;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class BooksManagerImpl implements BooksManager {

    private final BooksService booksService;
    private final TradesService tradesService;
    private final UserTradingService userTradingService;


    public BooksManagerImpl(BooksService booksService, TradesService tradesService, UserTradingService userTradingService) {
        this.booksService = booksService;
        this.tradesService = tradesService;
        this.userTradingService = userTradingService;
    }


    @Override
    public List<BookDto> getAllBooks() {
        return booksService.getAllBooks();

    }

    @Override
    public List<BookDto> getMostWantedBooks() {
        return booksService.getMostWantedBooks(tradesService.getAllRequests(), 5);
    }

    @Override
    public List<BookDto> getUserRequests(Long userId) {
        return userTradingService.getUserRequestedBooks(userId);
    }

    @Override
    public List<BookDto> getUserPublications(Long userId) {
        return userTradingService.getUserPublishedBooks(userId);
    }
}

