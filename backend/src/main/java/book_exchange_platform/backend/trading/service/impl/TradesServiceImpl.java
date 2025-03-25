package book_exchange_platform.backend.trading.service.impl;

import book_exchange_platform.backend.trading.data.*;
import book_exchange_platform.backend.trading.repository.TradesRepository;
import book_exchange_platform.backend.trading.service.TradesService;
import book_exchange_platform.backend.trading.utils.TradesEntityToDtoConverter;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class TradesServiceImpl implements TradesService {

    private final TradesRepository tradesRepository;

    public TradesServiceImpl(TradesRepository tradesRepository) {
        this.tradesRepository = tradesRepository;
    }


    @Override
    public List<RequestDto> getAllRequests() {
        return tradesRepository.getAllRequests().stream().map(TradesEntityToDtoConverter::toRequestDto).toList();
    }

    @Override
    public List<PublicationDto> getAllPublications() {
        return tradesRepository.getAllPublications().stream().map(TradesEntityToDtoConverter::toPublicationDto).toList();
    }

    @Override
    public MatchDto getMatch(Long matchId) {
        return TradesEntityToDtoConverter.toMatchDto(tradesRepository.getMatchById(matchId));
    }

    @Override
    public MatchDto addMatch(MatchDto matchDto) {
        return TradesEntityToDtoConverter.toMatchDto(tradesRepository.save(TradesEntityToDtoConverter.toMatchEntity(matchDto)));
    }

    @Override
    public MatchDto updateMatch(MatchDto matchDto) {
        return TradesEntityToDtoConverter.toMatchDto(tradesRepository.save(TradesEntityToDtoConverter.toMatchEntity(matchDto)));
    }

    @Override
    public void deleteMatch(MatchDto matchDto) {
        tradesRepository.delete(TradesEntityToDtoConverter.toMatchEntity(matchDto));
    }

    @Override
    public <T extends TradeDto> List<TradeDto> searchAvailableTrades(Long bookId, List<T> allTrades) {
        List<TradeDto> availableTrades = (List<TradeDto>) allTrades.stream()
                .filter(trade -> (trade.getBook().getId().equals(bookId) && trade.getStatus().equals(TradeStatus.AVAILABLE)))
                .toList();
         return availableTrades;
    }

    @Override
    public Optional<MatchDto> findMatch(TradeDto incomingTrade, List<TradeDto> optionalTrades) {

        List<TradeDto> optionalTradesNoSelfUser = optionalTrades.stream()
                .filter(trade -> !trade.getUser().getId().equals(incomingTrade.getUser().getId()))
                .toList();

        if(optionalTradesNoSelfUser.isEmpty()){
            return Optional.empty();
        }

        TradeDto bestFitTrade = optionalTradesNoSelfUser.get(0);
        for (TradeDto candidateTrade : optionalTradesNoSelfUser) {
            if(candidateTrade.getDate().before(bestFitTrade.getDate())){
                bestFitTrade = candidateTrade;
            }
        }

        if (incomingTrade instanceof RequestDto){
            RequestDto incomingRequest = (RequestDto) incomingTrade;
            incomingRequest.setStatus(TradeStatus.MATCHED);
            tradesRepository.saveRequest(TradesEntityToDtoConverter.toRequestEntity(incomingRequest));
            PublicationDto fittedPublication = (PublicationDto) bestFitTrade;
            fittedPublication.setStatus(TradeStatus.MATCHED);
            tradesRepository.savePublication(TradesEntityToDtoConverter.toPublicationEntity(fittedPublication));

            return Optional.of(MatchDto.builder()
                                    .book(bestFitTrade.getBook())
                                    .provider(bestFitTrade.getUser())
                                    .requester(incomingTrade.getUser())
                                    .status(MatchStatus.PENDING)
                                    .build());
        }
        PublicationDto incomingPublication = (PublicationDto) incomingTrade;
        incomingPublication.setStatus(TradeStatus.MATCHED);
        tradesRepository.savePublication(TradesEntityToDtoConverter.toPublicationEntity(incomingPublication));
        RequestDto fittedRequest = (RequestDto) bestFitTrade;
        fittedRequest.setStatus(TradeStatus.MATCHED);
        tradesRepository.saveRequest(TradesEntityToDtoConverter.toRequestEntity(fittedRequest));

        return Optional.of(MatchDto.builder()
                                .book(bestFitTrade.getBook())
                                .provider(incomingTrade.getUser())
                                .requester(bestFitTrade.getUser())
                                .status(MatchStatus.PENDING)
                                .build());
    }
}

