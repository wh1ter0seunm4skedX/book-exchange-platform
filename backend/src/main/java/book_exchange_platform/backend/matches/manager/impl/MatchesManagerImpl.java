package book_exchange_platform.backend.matches.manager.impl;

import book_exchange_platform.backend.matches.data.MatchDto;
import book_exchange_platform.backend.matches.manager.MatchesManager;
import book_exchange_platform.backend.matches.service.MatchesService;
import book_exchange_platform.backend.users.service.UserTradingService;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class MatchesManagerImpl implements MatchesManager {

    private final MatchesService matchesService;
    private final UserTradingService userTradingService;

    public MatchesManagerImpl(MatchesService matchesService, UserTradingService userTradingService) {
        this.matchesService = matchesService;
        this.userTradingService = userTradingService;
    }


    @Override
    public List<MatchDto> getUserMatches(Long userId) {
        return userTradingService.getUserMatches(userId);
    }

//    @Override
//    public MatchDto addMatch(MatchDto match) {
//        return null;
//    }
//
//    @Override
//    public MatchDto updateMatch(MatchDto match) {
//        return null;
//    }
//
//    @Override
//    public List<MatchDto> searchPublished(Long bookId) {
//        return List.of();
//    }
//
//    @Override
//    public List<MatchDto> searchRequested(Long bookId) {
//        return List.of();
//    }

}

