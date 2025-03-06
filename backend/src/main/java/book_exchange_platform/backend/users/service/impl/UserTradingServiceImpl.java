package book_exchange_platform.backend.users.service.impl;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.matches.data.MatchDto;
import book_exchange_platform.backend.matches.data.PublicationDto;
import book_exchange_platform.backend.matches.data.RequestDto;
import book_exchange_platform.backend.matches.repository.MatchRepository;
import book_exchange_platform.backend.matches.utils.MatchesEntityToDtoConverter;
import book_exchange_platform.backend.users.data.UserDto;
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
    public List<BookDto> getUserRequestedBooks(Long userId) {
        return getUserRequests(userId).stream().map(request -> request.getBook()).toList();
    }

    @Override
    public RequestDto addRequest(BookDto bookDto, UserDto userDto) {
        RequestDto requestDto = RequestDto.builder()
                .user(userDto)
                .book(bookDto)
                .build();
        return MatchesEntityToDtoConverter.toRequestDto(matchRepository.saveRequest(MatchesEntityToDtoConverter.toRequestEntity(requestDto)));
    }

    @Override
    public void deleteRequest(BookDto bookDto, UserDto userDto) {
        RequestDto requestDto = RequestDto.builder()
                .user(userDto)
                .book(bookDto)
                .build();
        matchRepository.removeRequest(MatchesEntityToDtoConverter.toRequestEntity(requestDto));
    }

    @Override
    public RequestDto updateRequest(RequestDto requestDto) {
        return MatchesEntityToDtoConverter.toRequestDto(matchRepository.saveRequest(MatchesEntityToDtoConverter.toRequestEntity(requestDto)));
    }

    @Override
    public List<PublicationDto> getUserPublications(Long userId) {
        return matchRepository.getAllUserPublications(userId).stream().map(MatchesEntityToDtoConverter::toPublicationDto).toList();
    }

    @Override
    public List<BookDto> getUserPublishedBooks(Long userId) {
        return getUserPublications(userId).stream().map(publication -> publication.getBook()).toList();
    }

    @Override
    public PublicationDto addPublication(BookDto bookDto, UserDto userDto) {
        PublicationDto publicationDto = PublicationDto.builder()
                .user(userDto)
                .book(bookDto)
                .build();
        return MatchesEntityToDtoConverter.toPublicationDto(matchRepository.savePublication(MatchesEntityToDtoConverter.toPublicationEntity(publicationDto)));
    }

    @Override
    public void deletePublication(BookDto bookDto, UserDto userDto) {
        PublicationDto publicationDto = PublicationDto.builder()
                .user(userDto)
                .book(bookDto)
                .build();
        matchRepository.removePublication(MatchesEntityToDtoConverter.toPublicationEntity(publicationDto));
    }

    @Override
    public PublicationDto updatePublication(PublicationDto publicationDto) {
        return MatchesEntityToDtoConverter.toPublicationDto(matchRepository.savePublication(MatchesEntityToDtoConverter.toPublicationEntity(publicationDto)));
    }

}

