package book_exchange_platform.backend.matches.controller;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.books.data.BookPublicationDto;
import book_exchange_platform.backend.matches.data.MatchDto;
import book_exchange_platform.backend.matches.data.PublicationDto;
import book_exchange_platform.backend.matches.data.RequestDto;
import book_exchange_platform.backend.matches.manager.MatchesManager;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/book_exchange_platform/Matches")
public class MatchesController {

    private final MatchesManager matchesManager;

    public MatchesController(MatchesManager matchesManager) {
        this.matchesManager = matchesManager;
    }

    @GetMapping("/{userId}")
    public List<MatchDto> getUserMatches(@PathVariable Long userId) {
        return matchesManager.getUserMatches(userId);
    }

    @GetMapping("/{userId}/request")
    public List<RequestDto> getUserRequests(@PathVariable Long userId) {
        return matchesManager.getUserRequests(userId);
    }

    @PostMapping("/{userId}/request")
    public MatchDto addUserRequest(@PathVariable Long userId, @RequestBody BookDto book) {
        return matchesManager.requestBook(book, userId);
    }

    @PostMapping("/update_request")
    public RequestDto updateRequest(@RequestBody RequestDto requestDto) {
        return matchesManager.updateRequest(requestDto);
    }

    @DeleteMapping("/request")
    public void deleteRequest(@RequestBody RequestDto requestDto){
        matchesManager.deleteRequest(requestDto);
    }

    @GetMapping("/{userId}/publication")
    public List<PublicationDto> getUserPublications(@PathVariable Long userId) {
        return matchesManager.getUserPublications(userId);
    }


    @PostMapping("/{userId}/publish")
    public MatchDto addUserPublication(@PathVariable Long userId, @RequestBody BookPublicationDto bookPublication) {
        return matchesManager.publishBook(bookPublication.getBook(), bookPublication.getBookCondition(), userId);
    }

    @PostMapping("/update_publication")
    public PublicationDto updatePublication(@RequestBody PublicationDto publicationDto) {
        return matchesManager.updatePublication(publicationDto);
    }

    @DeleteMapping("/publication")
    public void deletePublication(@RequestBody PublicationDto publicationDto){
        matchesManager.deletePublication(publicationDto);
    }


}

