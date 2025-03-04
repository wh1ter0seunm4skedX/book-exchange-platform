package book_exchange_platform.backend.matches.service;

import book_exchange_platform.backend.matches.data.MatchDto;
import book_exchange_platform.backend.matches.data.PublicationDto;
import book_exchange_platform.backend.matches.data.RequestDto;
import book_exchange_platform.backend.matches.data.TradeDto;

import java.util.List;


public interface MatchesService {

    public RequestDto addRequest(RequestDto requestDto);

    public void deleteRequest(RequestDto requestDto);

    public RequestDto updateRequest(RequestDto requestDto);

    public List<RequestDto> getAllRequests();

    public PublicationDto addPublication(PublicationDto publicationDto);

    public void deletePublication(PublicationDto publicationDto);

    public PublicationDto updatePublication(PublicationDto publicationDto);

    public List<PublicationDto> getAllPublications();

    public MatchDto addMatch(MatchDto match);

    public MatchDto updateMatch(MatchDto match);

    public void deleteMatch(MatchDto match);

    public List<TradeDto> searchAvailableTrades(Long bookId, List<TradeDto> allTrades);

    public MatchDto findBestMatch(TradeDto incomingTrade, List<TradeDto> allTrades);





}

