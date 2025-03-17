package book_exchange_platform.backend.trading.manager;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.trading.data.MatchDto;
import book_exchange_platform.backend.trading.data.PublicationDto;
import book_exchange_platform.backend.trading.data.RequestDto;
import book_exchange_platform.backend.trading.data.SharedBookCondition;

import java.util.List;


public interface TradesManager {


    public List<MatchDto> getUserMatches(Long userId);

    public MatchDto unMatch(MatchDto match);

    public MatchDto completeMatch(MatchDto match);

    public List<RequestDto> getUserRequests(Long userId);

    public MatchDto requestBook(BookDto book, Long userId);

    public void deleteRequest(RequestDto requestDto);

    public List<PublicationDto> getUserPublications(Long userId);

    public MatchDto publishBook(BookDto bookDto, SharedBookCondition bookCondition, Long userId);

    public void deletePublication(PublicationDto publicationDto);

    //public List<MatchDto> searchRequested(Long bookId);

    //public List<MatchDto> searchPublished(Long bookId);

}

