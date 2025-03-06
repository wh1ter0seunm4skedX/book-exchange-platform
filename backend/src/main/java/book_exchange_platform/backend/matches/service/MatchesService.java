package book_exchange_platform.backend.matches.service;

import book_exchange_platform.backend.matches.data.MatchDto;
import book_exchange_platform.backend.matches.data.PublicationDto;
import book_exchange_platform.backend.matches.data.RequestDto;
import book_exchange_platform.backend.matches.data.TradeDto;

import java.util.List;


public interface MatchesService {


    public List<RequestDto> getAllRequests();

    public List<PublicationDto> getAllPublications();

    public MatchDto addMatch(MatchDto match);

    public MatchDto updateMatch(MatchDto match);

    public void deleteMatch(MatchDto match);

    public List<TradeDto> searchAvailableTrades(Long bookId, List<TradeDto> allTrades);

    public MatchDto findMatch(TradeDto incomingTrade, List<TradeDto> allTrades);

}

