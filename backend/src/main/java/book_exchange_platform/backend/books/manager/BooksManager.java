package book_exchange_platform.backend.books.manager;


import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.matches.data.PublicationDto;
import book_exchange_platform.backend.matches.data.RequestDto;

import java.util.List;

public interface BooksManager {

    public List<BookDto> getAllBooks();

    public List<BookDto> getMostWantedBooks();

    public List<BookDto> getUserRequests(Long userId);

    public List<BookDto> getUserPublications(Long userId);








}

