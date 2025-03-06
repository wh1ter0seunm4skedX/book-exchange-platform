package book_exchange_platform.backend.books.manager.impl;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.books.manager.BooksManager;
import book_exchange_platform.backend.books.repository.BooksRepository;
import book_exchange_platform.backend.books.service.BooksService;
import book_exchange_platform.backend.books.utils.BooksEntityToDtoConverter;
import book_exchange_platform.backend.matches.service.MatchesService;
import book_exchange_platform.backend.users.service.UserTradingService;
import com.fasterxml.jackson.databind.deser.DataFormatReaders;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;


@Service
public class BooksManagerImpl implements BooksManager {

    private final BooksService booksService;
    private final MatchesService matchesService;
    private final UserTradingService userTradingService;


    public BooksManagerImpl(BooksService booksService, MatchesService matchesService,UserTradingService userTradingService) {
        this.booksService = booksService;
        this.matchesService = matchesService;
        this.userTradingService = userTradingService;
    }


    @Override
    public List<BookDto> getAllBooks() {
        return booksService.getAllBooks();

    }

    @Override
    public List<BookDto> getMostWantedBooks() {
        return booksService.getMostWantedBooks(matchesService.getAllRequests(), 5);
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

