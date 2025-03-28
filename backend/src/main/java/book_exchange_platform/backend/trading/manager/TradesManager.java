package book_exchange_platform.backend.trading.manager;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.trading.data.MatchDto;
import book_exchange_platform.backend.trading.data.MatchStatus;
import book_exchange_platform.backend.trading.data.PublicationDto;
import book_exchange_platform.backend.trading.data.RequestDto;
import java.util.List;


public interface TradesManager {


    public List<MatchDto> getUserMatches(Long userId);

    public List<MatchDto> getAllMatches();

    public void unMatch(Long matchId, MatchStatus reason);

    public MatchDto completeMatch(Long matchId);

    public MatchDto confirmMatch(Long matchId);

    public void handleMatchExpirations(List<MatchDto> matches);

    public List<RequestDto> getUserRequests(Long userId);

    public MatchDto requestBook(BookDto book, Long userId);

    public void deleteRequest(RequestDto requestDto);

    public List<PublicationDto> getUserPublications(Long userId);

    public MatchDto publishBook(BookDto bookDto, Long userId);

    public void deletePublication(PublicationDto publicationDto);

}

