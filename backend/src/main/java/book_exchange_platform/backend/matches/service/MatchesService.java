package book_exchange_platform.backend.matches.service;

import book_exchange_platform.backend.matches.data.MatchDto;
import book_exchange_platform.backend.matches.data.PublicationDto;
import book_exchange_platform.backend.matches.data.RequestDto;
import book_exchange_platform.backend.matches.data.TradeDto;

import java.util.List;
import java.util.Optional;


public interface MatchesService {


    public List<RequestDto> getAllRequests();

    public List<PublicationDto> getAllPublications();

    public MatchDto addMatch(MatchDto match);

    public MatchDto updateMatch(MatchDto match);

    public void deleteMatch(MatchDto match);

    public <T extends TradeDto> List<TradeDto> searchAvailableTrades(Long bookId, List<T> allTrades);

    public Optional<MatchDto> findMatch(TradeDto incomingTrade, List<TradeDto> optionalTrades);

}

