package book_exchange_platform.backend.books.service.impl;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.books.repository.BooksRepository;
import book_exchange_platform.backend.books.service.BooksService;
import book_exchange_platform.backend.books.utils.BooksEntityToDtoConverter;
import book_exchange_platform.backend.trading.data.RequestDto;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class BooksServiceImpl implements BooksService {

    private final BooksRepository booksRepository;


    public BooksServiceImpl(BooksRepository booksRepository) {this.booksRepository = booksRepository;}


    @Override
    public List<BookDto> getAllBooks() {
        return booksRepository.getAllBooks().stream().map(BooksEntityToDtoConverter::toBookDto).toList();

    }

    @Override
    public List<BookDto> getMostWantedBooks(List<RequestDto> requests, Integer amount) {

        Map<BookDto, Integer> bookRequestsCount = new HashMap<>();
        requests.forEach(request -> {
            BookDto book = request.getBook();
            bookRequestsCount.put(book, bookRequestsCount.getOrDefault(book, 0) + 1);
        });

        PriorityQueue<Map.Entry<BookDto, Integer>> topBooks =
                new PriorityQueue<>(Map.Entry.comparingByValue(Comparator.reverseOrder())
        );
        topBooks.addAll(bookRequestsCount.entrySet());

        List<BookDto> mostWantedBooks = new ArrayList<>();
        for(int i = 0; i < amount && !topBooks.isEmpty(); i++) {
            mostWantedBooks.add(topBooks.poll().getKey());
        }
        return mostWantedBooks;
    }
}

