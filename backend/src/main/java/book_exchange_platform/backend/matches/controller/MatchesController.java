package book_exchange_platform.backend.matches.controller;

import book_exchange_platform.backend.matches.data.MatchDto;
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
    public List<MatchDto> getUserMatches(@RequestBody Long userId) {
        return matchesManager.getUserMatches(userId);
    }

}

