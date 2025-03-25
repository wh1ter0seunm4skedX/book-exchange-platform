package book_exchange_platform.backend.trading.service;

import book_exchange_platform.backend.trading.data.MatchDto;
import book_exchange_platform.backend.trading.data.PublicationDto;
import book_exchange_platform.backend.trading.data.RequestDto;
import book_exchange_platform.backend.trading.data.TradeDto;

import java.util.List;
import java.util.Optional;


public interface TradesService {


    public List<RequestDto> getAllRequests();

    public List<PublicationDto> getAllPublications();

    public MatchDto getMatch(Long matchId);

    public MatchDto addMatch(MatchDto match);

    public MatchDto updateMatch(MatchDto match);

    public void deleteMatch(MatchDto match);

    public <T extends TradeDto> List<TradeDto> searchAvailableTrades(Long bookId, List<T> allTrades);

    public Optional<MatchDto> findMatch(TradeDto incomingTrade, List<TradeDto> optionalTrades);

}

