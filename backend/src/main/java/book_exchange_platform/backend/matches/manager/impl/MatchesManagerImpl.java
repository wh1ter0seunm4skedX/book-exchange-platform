package book_exchange_platform.backend.matches.manager.impl;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.matches.data.MatchDto;
import book_exchange_platform.backend.matches.data.PublicationDto;
import book_exchange_platform.backend.matches.data.RequestDto;
import book_exchange_platform.backend.matches.data.TradeDto;
import book_exchange_platform.backend.matches.manager.MatchesManager;
import book_exchange_platform.backend.matches.service.MatchesService;
import book_exchange_platform.backend.users.data.UserDto;
import book_exchange_platform.backend.users.service.UserService;
import book_exchange_platform.backend.users.service.UserTradingService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


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

//    @Override
//    public MatchDto invalidateMatch(MatchDto match) {
//        return null;
//    }
//


//    @Override
//    Create invalidation script
//

    @Override
    public List<RequestDto> getUserRequests(Long userId)  { return userTradingService.getUserRequests(userId);}

    @Override
    public MatchDto requestBook(BookDto book, Long userId) {
        UserDto user = userService.getUser(userId);
        RequestDto request = RequestDto.builder()
                                .user(user)
                                .book(book)
                                .build();
        RequestDto addedRequest = userTradingService.updateRequest(request);
        List<PublicationDto> allPublications = matchesService.getAllPublications();
        List<TradeDto> optionalTrades = matchesService.searchAvailableTrades(addedRequest.getBook().getId(), allPublications);
        Optional<MatchDto> optionalFoundMatch = matchesService.findMatch(addedRequest, optionalTrades);
        if(optionalFoundMatch.isPresent()){
            MatchDto match = optionalFoundMatch.get();
            matchesService.addMatch(match);
            return match;
        }
        return MatchDto.builder().build();
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


//    @Override
//    public PublicationDto publishBook(BookDto bookDto, Long userId) {
//        return null;
//    }

    @Override
    public void deletePublication(PublicationDto publicationDto) {
        userTradingService.deletePublication(publicationDto);
    }

    @Override
    public PublicationDto updatePublication(PublicationDto publicationDto) {
        return userTradingService.updatePublication(publicationDto);
    }

}

