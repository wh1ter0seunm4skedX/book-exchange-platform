package book_exchange_platform.backend.matches.manager;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.matches.data.MatchDto;
import book_exchange_platform.backend.matches.data.PublicationDto;
import book_exchange_platform.backend.matches.data.RequestDto;
import book_exchange_platform.backend.users.data.UserDto;

import java.util.List;


public interface MatchesManager {


    public List<MatchDto> getUserMatches(Long userId);

    //public MatchDto addMatch(MatchDto match);

    public MatchDto invalidateMatch(MatchDto match);

    public List<RequestDto> getUserRequests(Long userId);

    public RequestDto requestBook(BookDto book, Long userId);

    public void deleteRequest(BookDto bookDto, Long userId);

    public RequestDto updateRequest(RequestDto requestDto);

    public List<PublicationDto> getUserPublications(Long userId);

    public PublicationDto publishBook(BookDto bookDto, Long userId);

    public void deletePublication(BookDto bookDto, Long userId);

    public PublicationDto updatePublication(PublicationDto publicationDto);

    //public List<MatchDto> searchRequested(Long bookId);

    //public List<MatchDto> searchPublished(Long bookId);

}

