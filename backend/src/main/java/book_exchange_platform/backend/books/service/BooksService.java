package book_exchange_platform.backend.books.service;


import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.matches.data.MatchDto;
import book_exchange_platform.backend.matches.data.PublicationDto;
import book_exchange_platform.backend.matches.data.RequestDto;

import java.util.List;

public interface BooksService {

    public List<BookDto> getAllBooks();

    public List<BookDto> getMostWantedBooks(List<RequestDto> requests, Integer amount);








}

