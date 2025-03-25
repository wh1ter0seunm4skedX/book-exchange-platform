package book_exchange_platform.backend.trading.controller;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.trading.data.MatchDto;
import book_exchange_platform.backend.trading.data.PublicationDto;
import book_exchange_platform.backend.trading.data.RequestDto;
import book_exchange_platform.backend.trading.manager.TradesManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("book_exchange_platform/trades")
@Slf4j
public class TradesController {

    private final TradesManager tradesManager;

    public TradesController(TradesManager tradesManager) {
        this.tradesManager = tradesManager;
    }

    @GetMapping("/{userId}/match")
    public List<MatchDto> getUserMatches(@PathVariable Long userId) {
        return tradesManager.getUserMatches(userId);
    }

    @PostMapping("/{matchId}/cancel_match")
    public void cancelMatch(@PathVariable Long matchId) {tradesManager.unMatch(matchId);}

    @PostMapping("/{matchId}/confirm_match")
    public MatchDto confirmMatch(@PathVariable Long matchId) {
        return tradesManager.completeMatch(matchId);
    }

    @GetMapping("/{userId}/request")
    public List<RequestDto> getUserRequests(@PathVariable Long userId) {
        return tradesManager.getUserRequests(userId);
    }

    @PostMapping("/{userId}/request")
    public MatchDto addUserRequest(@PathVariable Long userId, @RequestBody BookDto book) {
        return tradesManager.requestBook(book, userId);
    }

    @DeleteMapping("/request")
    public void deleteRequest(@RequestBody RequestDto requestDto){
        tradesManager.deleteRequest(requestDto);
    }

    @GetMapping("/{userId}/publication")
    public List<PublicationDto> getUserPublications(@PathVariable Long userId) {
        return tradesManager.getUserPublications(userId);
    }

    @PostMapping("/{userId}/publication")
    public MatchDto addUserPublication(@PathVariable Long userId, @RequestBody BookDto book) {
        // Using the methods we added to the BookPublicationDto class
        return tradesManager.publishBook(book, userId);
    }

    @DeleteMapping("/publication")
    public void deletePublication(@RequestBody PublicationDto publicationDto){
        tradesManager.deletePublication(publicationDto);
    }
}
