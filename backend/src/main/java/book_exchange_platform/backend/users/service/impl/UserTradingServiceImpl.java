package book_exchange_platform.backend.users.service.impl;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.trading.data.*;
import book_exchange_platform.backend.trading.repository.TradesRepository;
import book_exchange_platform.backend.trading.utils.TradesEntityToDtoConverter;
import book_exchange_platform.backend.users.data.UserDto;
import book_exchange_platform.backend.users.service.UserTradingService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class UserTradingServiceImpl implements UserTradingService {

    private final TradesRepository tradesRepository;

    public UserTradingServiceImpl(TradesRepository tradesRepository) {
        this.tradesRepository = tradesRepository;
    }


    @Override
    public List<MatchDto> getUserMatches(Long userId) {
        return tradesRepository.getAllUserMatches(userId).stream().map(TradesEntityToDtoConverter::toMatchDto).toList();
    }

    @Override
    public List<RequestDto> getUserRequests(Long userId) {
        return tradesRepository.getAllUserRequests(userId).stream().map(TradesEntityToDtoConverter::toRequestDto).toList();
    }

    @Override
    public RequestDto getRequest(Long userId, Long bookId) {
        return TradesEntityToDtoConverter.toRequestDto(tradesRepository.getRequest(userId,bookId));
    }

    @Override
    public List<BookDto> getUserRequestedBooks(Long userId) {
        return getUserRequests(userId).stream().map(request -> request.getBook()).toList();
    }

    @Override
    public RequestDto addRequest(BookDto bookDto, UserDto userDto) {
        RequestDto requestDto = RequestDto.builder()
                .user(userDto)
                .book(bookDto)
                .status(TradeStatus.AVAILABLE)
                .build();
        if(isRequestsAlreadyExists(requestDto)){
            throw new IllegalArgumentException("Request already exists");
        }
        return TradesEntityToDtoConverter.toRequestDto(tradesRepository.saveRequest(TradesEntityToDtoConverter.toRequestEntity(requestDto)));
    }

    @Override
    public void deleteRequest(RequestDto requestDto) {
        if(requestDto.getStatus().equals(TradeStatus.MATCHED)){
            throw new IllegalArgumentException("Cannot delete a matched request");
        }
        tradesRepository.removeRequest(TradesEntityToDtoConverter.toRequestEntity(requestDto));
    }

    @Override
    public RequestDto updateRequest(RequestDto requestDto) {
        return TradesEntityToDtoConverter.toRequestDto(tradesRepository.saveRequest(TradesEntityToDtoConverter.toRequestEntity(requestDto)));
    }

    @Override
    public List<PublicationDto> getUserPublications(Long userId) {
        return tradesRepository.getAllUserPublications(userId).stream().map(TradesEntityToDtoConverter::toPublicationDto).toList();
    }

    @Override
    public PublicationDto getPublication(Long userId, Long bookId) {
        return TradesEntityToDtoConverter.toPublicationDto(tradesRepository.getPublication(userId,bookId));
    }

    @Override
    public List<BookDto> getUserPublishedBooks(Long userId) {
        return getUserPublications(userId).stream().map(publication -> publication.getBook()).toList();
    }

    @Override
    public PublicationDto addPublication(BookDto bookDto, SharedBookCondition bookCondition, UserDto userDto) {
        PublicationDto publicationDto = PublicationDto.builder()
                .user(userDto)
                .book(bookDto)
                .status(TradeStatus.AVAILABLE)
                .bookCondition(bookCondition)
                .build();
        if(isPublicationAlreadyExists(publicationDto)){
            throw new IllegalArgumentException("Publication already exists");
        }
        return TradesEntityToDtoConverter.toPublicationDto(tradesRepository.savePublication(TradesEntityToDtoConverter.toPublicationEntity(publicationDto)));
    }

    @Override
    public void deletePublication(PublicationDto publicationDto) {
        if(publicationDto.getStatus().equals(TradeStatus.MATCHED)){
            throw new IllegalArgumentException("Cannot delete a matched publication");
        }
        tradesRepository.removePublication(TradesEntityToDtoConverter.toPublicationEntity(publicationDto));
    }

    @Override
    public PublicationDto updatePublication(PublicationDto publicationDto) {
        return TradesEntityToDtoConverter.toPublicationDto(tradesRepository.savePublication(TradesEntityToDtoConverter.toPublicationEntity(publicationDto)));
    }

    private boolean isRequestsAlreadyExists(RequestDto currentRequest){
        List<RequestDto> allUserRequests = getUserRequests(currentRequest.getUser().getId());
        return allUserRequests.stream().anyMatch(request -> currentRequest.getBook().getId().equals(request.getBook().getId()));
    }


    private boolean isPublicationAlreadyExists(PublicationDto currentPublication){
        List<PublicationDto> allUserPublications = getUserPublications(currentPublication.getUser().getId());
        return allUserPublications.stream().anyMatch(publictaion -> currentPublication.getBook().getId().equals(publictaion.getBook().getId()));
    }

}

