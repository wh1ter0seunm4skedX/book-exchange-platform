package book_exchange_platform.backend.config;

import book_exchange_platform.backend.trading.data.MatchDto;
import book_exchange_platform.backend.trading.manager.TradesManager;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

@Component
public class BootstrapMatchExpirationCheck implements ApplicationRunner {

    private final TradesManager tradesManager;

    public BootstrapMatchExpirationCheck(TradesManager tradesManager) {
        this.tradesManager = tradesManager;
    }


    @Override
    public void run(ApplicationArguments args) throws Exception {
        List<MatchDto> allMatches = tradesManager.getAllMatches();
        tradesManager.handleMatchExpirations(allMatches);
    }

}

