package book_exchange_platform.backend.matches.manager;

import book_exchange_platform.backend.matches.data.MatchDto;

import java.util.List;


public interface MatchesManager {


    public List<MatchDto> getUserMatches(Long userId);

    public MatchDto addMatch(MatchDto match);

    public MatchDto updateMatch(MatchDto match);

    public List<MatchDto> searchPublished(Long bookId);

    public List<MatchDto> searchRequested(Long bookId);





}

