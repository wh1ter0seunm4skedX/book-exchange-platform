package book_exchange_platform.backend.users.service.impl;

import book_exchange_platform.backend.matches.data.MatchDto;
import book_exchange_platform.backend.matches.data.PublicationDto;
import book_exchange_platform.backend.matches.data.RequestDto;
import book_exchange_platform.backend.matches.data.TradeDto;
import book_exchange_platform.backend.matches.repository.MatchRepository;
import book_exchange_platform.backend.matches.utils.MatchesEntityToDtoConverter;
import book_exchange_platform.backend.users.service.UserTradingService;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserTradingServiceImpl implements UserTradingService {

    private final MatchRepository matchRepository;


    public UserTradingServiceImpl(MatchRepository matchRepository) {
        this.matchRepository = matchRepository;
    }

    @Override
    public List<MatchDto> getUserMatches(Long userId) {
        return matchRepository.getAllUserMatches(userId).stream().map(MatchesEntityToDtoConverter::toMatchDto).toList();
    }

    @Override
    public List<RequestDto> getUserRequests(Long userId) {
        return matchRepository.getAllUserRequests(userId).stream().map(MatchesEntityToDtoConverter::toRequestDto).toList();
    }

    @Override
    public List<PublicationDto> getUserPublications(Long userId) {
        return matchRepository.getAllUserPublications(userId).stream().map(MatchesEntityToDtoConverter::toPublicationDto).toList();
    }

}

