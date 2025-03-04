package book_exchange_platform.backend.books.manager;


import book_exchange_platform.backend.books.data.BookDto;

import java.util.List;

public interface BooksManager {

    public List<BookDto> getAllBooks();

    public List<BookDto> getMostWantedBooks();








}

