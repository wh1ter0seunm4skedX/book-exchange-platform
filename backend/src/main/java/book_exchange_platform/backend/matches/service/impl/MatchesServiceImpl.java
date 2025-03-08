package book_exchange_platform.backend.matches.service.impl;

import book_exchange_platform.backend.matches.data.*;
import book_exchange_platform.backend.matches.repository.MatchRepository;
import book_exchange_platform.backend.matches.service.MatchesService;
import book_exchange_platform.backend.matches.utils.MatchesEntityToDtoConverter;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class MatchesServiceImpl implements MatchesService {

    private final MatchRepository matchRepository;

    public MatchesServiceImpl(MatchRepository matchRepository) {
        this.matchRepository = matchRepository;
    }


    @Override
    public List<RequestDto> getAllRequests() {
        return matchRepository.getAllRequests().stream().map(MatchesEntityToDtoConverter::toRequestDto).toList();
    }

    @Override
    public List<PublicationDto> getAllPublications() {
        return matchRepository.getAllPublications().stream().map(MatchesEntityToDtoConverter::toPublicationDto).toList();
    }

    @Override
    public MatchDto addMatch(MatchDto matchDto) {
        return MatchesEntityToDtoConverter.toMatchDto(matchRepository.save(MatchesEntityToDtoConverter.toMatchEntity(matchDto)));
    }

    @Override
    public MatchDto updateMatch(MatchDto matchDto) {
        return MatchesEntityToDtoConverter.toMatchDto(matchRepository.save(MatchesEntityToDtoConverter.toMatchEntity(matchDto)));
    }

    @Override
    public void deleteMatch(MatchDto matchDto) {
        matchRepository.delete(MatchesEntityToDtoConverter.toMatchEntity(matchDto));
    }

    @Override
    public <T extends TradeDto> List<TradeDto> searchAvailableTrades(Long bookId, List<T> allTrades) {
        List<TradeDto> availableTrades = (List<TradeDto>) allTrades.stream()
                .filter(trade -> trade.getBook().getId().equals(bookId))
                .toList();
         return availableTrades;
    }

    @Override
    public Optional<MatchDto> findMatch(TradeDto incomingTrade, List<TradeDto> optionalTrades) {

        if(optionalTrades.isEmpty()){
            return Optional.empty();
        }

        TradeDto bestFitTrade = optionalTrades.get(0);
        for (TradeDto candidateTrade : optionalTrades) {
            if(candidateTrade.getDate().before(bestFitTrade.getDate())){
                bestFitTrade = candidateTrade;
            }
        }

        if (incomingTrade instanceof RequestDto){
            return Optional.of(MatchDto.builder()
                                    .book(bestFitTrade.getBook())
                                    .provider(bestFitTrade.getUser())
                                    .requester(incomingTrade.getUser())
                                    .status(MatchStatus.PENDING)
                                    .build());
        }
        return Optional.of(MatchDto.builder()
                                .book(bestFitTrade.getBook())
                                .provider(incomingTrade.getUser())
                                .requester(bestFitTrade.getUser())
                                .status(MatchStatus.PENDING)
                                .build());
    }
}

