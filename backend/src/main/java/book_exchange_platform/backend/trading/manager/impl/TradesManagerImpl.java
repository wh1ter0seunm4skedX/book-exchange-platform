package book_exchange_platform.backend.trading.manager.impl;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.trading.data.*;
import book_exchange_platform.backend.trading.manager.TradesManager;
import book_exchange_platform.backend.trading.service.TradesService;
import book_exchange_platform.backend.users.data.UserDto;
import book_exchange_platform.backend.users.service.UserService;
import book_exchange_platform.backend.users.service.UserTradingService;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Implementation of the MatchesManager interface.
 */
@Service
public class TradesManagerImpl implements TradesManager {

    private final TradesService tradesService;
    private final UserTradingService userTradingService;
    private final UserService userService;

    public TradesManagerImpl(TradesService tradesService, UserTradingService userTradingService, UserService userService) {
        this.tradesService = tradesService;
        this.userTradingService = userTradingService;
        this.userService = userService;
    }

    @Override
    public List<MatchDto> getUserMatches(Long userId) {
        handleMatchExpirations(getAllMatches());
        return userTradingService.getUserMatches(userId);
    }

    @Override
    public List<MatchDto> getAllMatches(){
        return tradesService.getAllMatches();
    }

    @Override
    public void unMatch(Long matchId, MatchStatus reason) {
        MatchDto match = tradesService.getMatch(matchId);
        match.setStatus(reason);
        tradesService.updateMatch(match);
        RequestDto matchedRequest = userTradingService.getRequest(match.getRequester().getId(), match.getBook().getId());
        matchedRequest.setStatus(TradeStatus.AVAILABLE);
        userTradingService.updateRequest(matchedRequest);
        PublicationDto matchedPublication = userTradingService.getPublication(match.getProvider().getId(), match.getBook().getId());
        matchedPublication.setStatus(TradeStatus.AVAILABLE);
        userTradingService.updatePublication(matchedPublication);
        List<PublicationDto> allPublications = tradesService.getAllPublications();
        allPublications.removeIf(publication -> publication.getId().equals(matchedPublication.getId()));
        match(matchedRequest, allPublications);
        List<RequestDto> allRequests = tradesService.getAllRequests();
        allRequests.removeIf(request -> request.getId().equals(matchedRequest.getId()));
        match(matchedPublication, allRequests);
    }

    @Override
    public MatchDto completeMatch(Long matchId) {
        MatchDto match = tradesService.getMatch(matchId);
        RequestDto matchedRequest = userTradingService.getRequest(match.getRequester().getId(), match.getBook().getId());
        PublicationDto matchedPublication = userTradingService.getPublication(match.getProvider().getId(), match.getBook().getId());
        matchedRequest.setStatus(TradeStatus.AVAILABLE);
        userTradingService.updateRequest(matchedRequest);
        userTradingService.deleteRequest(matchedRequest);
        matchedPublication.setStatus(TradeStatus.AVAILABLE);
        userTradingService.updatePublication(matchedPublication);
        userTradingService.deletePublication(matchedPublication);
        match.setStatus(MatchStatus.COMPLETED);
        return tradesService.updateMatch(match);
    }

    public MatchDto confirmMatch(Long matchId){
        MatchDto match = tradesService.getMatch(matchId);
        match.setStatus(MatchStatus.PENDING);
        return tradesService.updateMatch(match);
    }


    @Override
    public void handleMatchExpirations(List<MatchDto> matches){
        matches.forEach((match) -> {
            if (match.getExpirationDate().before(new Date()) && (match.getStatus().equals(MatchStatus.PENDING) || match.getStatus().equals(MatchStatus.NEW))) {
                unMatch(match.getId(), MatchStatus.EXPIRED);
            }});
    }


    @Override
    public List<RequestDto> getUserRequests(Long userId) { 
        return userTradingService.getUserRequests(userId);
    }

    @Override
    public MatchDto requestBook(BookDto book, Long userId) {
        UserDto user = userService.getUser(userId);
        RequestDto addedRequest = userTradingService.addRequest(book,user);
        List<PublicationDto> allPublications = tradesService.getAllPublications();
        return match(addedRequest, allPublications);
    }

    @Override
    public void deleteRequest(Long requestId) {
        RequestDto requestDto = tradesService.getRequest(requestId);
        userTradingService.deleteRequest(requestDto);
    }

    @Override
    public List<PublicationDto> getUserPublications(Long userId)   { return userTradingService.getUserPublications(userId);}


    @Override
    public MatchDto publishBook(BookDto book, Long userId) {
        UserDto user = userService.getUser(userId);
        PublicationDto addedPublication = userTradingService.addPublication(book, user);
        List<RequestDto> allRequests = tradesService.getAllRequests();
        return match(addedPublication, allRequests);
    }

    @Override
    public void deletePublication(Long publicationId) {
        PublicationDto publicationDto = tradesService.getPublication(publicationId);
        userTradingService.deletePublication(publicationDto);
    }

    private <T extends TradeDto> MatchDto match(TradeDto tradeDto, List<T> allTrades) {
        List<TradeDto> optionalTrades = tradesService.searchAvailableTrades(tradeDto.getBook().getId(), allTrades);
        Optional<MatchDto> optionalFoundMatch = tradesService.findMatch(tradeDto, optionalTrades);
        if(optionalFoundMatch.isPresent()){
            MatchDto match = optionalFoundMatch.get();
            MatchDto addedMatch = tradesService.addMatch(match);
            return addedMatch;
        }
        return MatchDto.builder().build();
    }

}
