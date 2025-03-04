package book_exchange_platform.backend.users.service;


import book_exchange_platform.backend.matches.data.MatchDto;
import book_exchange_platform.backend.matches.data.PublicationDto;
import book_exchange_platform.backend.matches.data.RequestDto;
import book_exchange_platform.backend.matches.utils.MatchesEntityToDtoConverter;

import java.util.List;

public interface UserTradingService {

    public List<MatchDto> getUserMatches(Long userId);

    public List<RequestDto> getUserRequests(Long userId);

    public List<PublicationDto> getUserPublications(Long userId);







}

