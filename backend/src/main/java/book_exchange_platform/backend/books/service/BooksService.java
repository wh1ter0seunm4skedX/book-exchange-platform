package book_exchange_platform.backend.books.service;


import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.books.data.BookEntity;
import book_exchange_platform.backend.trading.data.RequestDto;

import java.util.List;

public interface BooksService {

    public List<BookDto> getAllBooks();

    public List<BookDto> getMostWantedBooks(List<RequestDto> requests, Integer amount);

    public BookDto getBook(Long bookId);








}

