package book_exchange_platform.backend.matches.service.impl;

import book_exchange_platform.backend.matches.data.MatchDto;
import book_exchange_platform.backend.matches.data.PublicationDto;
import book_exchange_platform.backend.matches.data.RequestDto;
import book_exchange_platform.backend.matches.data.TradeDto;
import book_exchange_platform.backend.matches.repository.MatchRepository;
import book_exchange_platform.backend.matches.service.MatchesService;
import book_exchange_platform.backend.matches.utils.MatchesEntityToDtoConverter;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class MatchesServiceImpl implements MatchesService {

    private final MatchRepository matchRepository;


    public MatchesServiceImpl(MatchRepository matchRepository) {
        this.matchRepository = matchRepository;
    }


    @Override
    public RequestDto addRequest(RequestDto requestDto) {
        return MatchesEntityToDtoConverter.toRequestDto(matchRepository.saveRequest(MatchesEntityToDtoConverter.toRequestEntity(requestDto)));
    }

    @Override
    public RequestDto updateRequest(RequestDto requestDto) {
        return MatchesEntityToDtoConverter.toRequestDto(matchRepository.saveRequest(MatchesEntityToDtoConverter.toRequestEntity(requestDto)));
    }

    @Override
    public void deleteRequest(RequestDto requestDto) {
        matchRepository.removeRequest(MatchesEntityToDtoConverter.toRequestEntity(requestDto));
    }

    @Override
    public List<RequestDto> getAllRequests() {
        return matchRepository.getAllRequests().stream().map(MatchesEntityToDtoConverter::toRequestDto).toList();
    }

    @Override
    public PublicationDto addPublication(PublicationDto publicationDto) {
        return MatchesEntityToDtoConverter.toPublicationDto(matchRepository.savePublication(MatchesEntityToDtoConverter.toPublicationEntity(publicationDto)));
    }

    @Override
    public PublicationDto updatePublication(PublicationDto publicationDto) {
        return MatchesEntityToDtoConverter.toPublicationDto(matchRepository.savePublication(MatchesEntityToDtoConverter.toPublicationEntity(publicationDto)));
    }

    @Override
    public void deletePublication(PublicationDto publicationDto) {
        matchRepository.removePublication(MatchesEntityToDtoConverter.toPublicationEntity(publicationDto));
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
    public List<TradeDto> searchAvailableTrades(Long bookId, List<TradeDto> allTrades) {
        List<TradeDto> availableTrades = allTrades.stream()
                .filter(trade -> trade.getBook().getId().equals(bookId))
                .toList();
         return availableTrades;
    }

    @Override
    public MatchDto findBestMatch(TradeDto incomingTrade, List<TradeDto> allTrades) {

        List<TradeDto> relevantTrades = allTrades.stream()
                .filter(trade -> trade.getBook().getId().equals(incomingTrade.getBook().getId()))
                .toList();

        if(relevantTrades.isEmpty()){
            return null;
        }

        TradeDto bestFitTrade = relevantTrades.get(0);
        for (TradeDto relevantTrade : relevantTrades) {
            if(relevantTrade.getDate().before(bestFitTrade.getDate())){
                bestFitTrade = relevantTrade;
            }
        }

        if (incomingTrade instanceof RequestDto){
            return MatchDto.builder()
                    .book(bestFitTrade.getBook())
                    .provider(bestFitTrade.getUser())
                    .requester(incomingTrade.getUser())
                    .build();
        }
        return MatchDto.builder()
                .book(bestFitTrade.getBook())
                .provider(incomingTrade.getUser())
                .requester(bestFitTrade.getUser())
                .build();
    }
}

