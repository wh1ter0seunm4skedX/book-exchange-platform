package book_exchange_platform.backend.matches.manager.impl;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.matches.data.*;
import book_exchange_platform.backend.matches.manager.MatchesManager;
import book_exchange_platform.backend.matches.service.MatchesService;
import book_exchange_platform.backend.users.data.UserDto;
import book_exchange_platform.backend.users.service.UserService;
import book_exchange_platform.backend.users.service.UserTradingService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Implementation of the MatchesManager interface.
 */
@Service
public class MatchesManagerImpl implements MatchesManager {

    private final MatchesService matchesService;
    private final UserTradingService userTradingService;
    private final UserService userService;

    public MatchesManagerImpl(MatchesService matchesService, UserTradingService userTradingService, UserService userService) {
        this.matchesService = matchesService;
        this.userTradingService = userTradingService;
        this.userService = userService;
    }

    @Override
    public List<MatchDto> getUserMatches(Long userId) {
        return userTradingService.getUserMatches(userId);
    }

    @Override
    public MatchDto deactivateMatch(MatchDto match) {
        match.setStatus(MatchStatus.CANCELLED);
        matchesService.updateMatch(match);
        RequestDto matchedRequest = userTradingService.getRequest(match.getRequester().getId(), match.getBook().getId());
        matchedRequest.setStatus(TradeStatus.AVAILABLE);
        userTradingService.updateRequest(matchedRequest);
        PublicationDto matchedPublication = userTradingService.getPublication(match.getProvider().getId(), match.getBook().getId());
        matchedPublication.setStatus(TradeStatus.AVAILABLE);
        userTradingService.updatePublication(matchedPublication);
        List<PublicationDto> allPublications = matchesService.getAllPublications();
        allPublications.remove(matchedPublication);
        return match(matchedRequest, allPublications);
    }

    @Override
    public MatchDto completeMatch(MatchDto match) {
        RequestDto matchedRequest = userTradingService.getRequest(match.getRequester().getId(), match.getBook().getId());
        PublicationDto matchedPublication = userTradingService.getPublication(match.getProvider().getId(), match.getBook().getId());
        userTradingService.deleteRequest(matchedRequest);
        userTradingService.deletePublication(matchedPublication);
        match.setStatus(MatchStatus.COMPLETED);
        return matchesService.updateMatch(match);
    }


//    Create invalidation script


    @Override
    public List<RequestDto> getUserRequests(Long userId) { 
        return userTradingService.getUserRequests(userId);
    }

    @Override
    public MatchDto requestBook(BookDto book, Long userId) {
        UserDto user = userService.getUser(userId);
        RequestDto request = RequestDto.builder()
                                .user(user)
                                .book(book)
                                .build();
        RequestDto addedRequest = userTradingService.addRequest(book,user);
        List<PublicationDto> allPublications = matchesService.getAllPublications();
        return match(addedRequest, allPublications);
    }

    @Override
    public void deleteRequest(RequestDto requestDto) {
        userTradingService.deleteRequest(requestDto);
    }

    @Override
    public RequestDto updateRequest(RequestDto requestDto) {
        return userTradingService.updateRequest(requestDto);
    }

    @Override
    public List<PublicationDto> getUserPublications(Long userId)   { return userTradingService.getUserPublications(userId);}


    @Override
    public MatchDto publishBook(BookDto book, SharedBookCondition bookCondition, Long userId) {
        UserDto user = userService.getUser(userId);
        PublicationDto addedPublication = userTradingService.addPublication(book, bookCondition, user);
        List<RequestDto> allRequests = matchesService.getAllRequests();
        return match(addedPublication, allRequests);
    }

    @Override
    public void deletePublication(PublicationDto publicationDto) {
        userTradingService.deletePublication(publicationDto);
    }

    @Override
    public PublicationDto updatePublication(PublicationDto publicationDto) {
        return userTradingService.updatePublication(publicationDto);
    }

    private <T extends TradeDto> MatchDto match(TradeDto tradeDto, List<T> allRequests) {
        List<TradeDto> optionalTrades = matchesService.searchAvailableTrades(tradeDto.getBook().getId(), allRequests);
        Optional<MatchDto> optionalFoundMatch = matchesService.findMatch(tradeDto, optionalTrades);
        if(optionalFoundMatch.isPresent()){
            MatchDto match = optionalFoundMatch.get();
            MatchDto addedMatch = matchesService.addMatch(match);
            return addedMatch;
        }
        return MatchDto.builder().build();
    }

}
