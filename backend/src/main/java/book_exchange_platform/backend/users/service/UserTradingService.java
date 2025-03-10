package book_exchange_platform.backend.users.service;


import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.matches.data.*;
import book_exchange_platform.backend.users.data.UserDto;

import java.util.List;

public interface UserTradingService {

    public List<MatchDto> getUserMatches(Long userId);

    public List<RequestDto> getUserRequests(Long userId);

    public RequestDto getRequest(Long userId , Long bookId);

    public List<BookDto> getUserRequestedBooks(Long userId);

    public RequestDto addRequest(BookDto bookDto, UserDto userDto);

    public void deleteRequest(RequestDto requestDto);

    public RequestDto updateRequest(RequestDto requestDto);

    public List<PublicationDto> getUserPublications(Long userId);

    public PublicationDto getPublication(Long userId , Long bookId);

    public List<BookDto> getUserPublishedBooks(Long userId);

    public PublicationDto addPublication(BookDto bookDto, SharedBookCondition bookCondition, UserDto userDto);

    public void deletePublication(PublicationDto publicationDto);

    public PublicationDto updatePublication(PublicationDto publicationDto);





}

