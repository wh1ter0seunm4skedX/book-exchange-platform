package book_exchange_platform.backend.users.data;

import book_exchange_platform.backend.trading.data.MatchDto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@Getter
@Setter
public class UserTradesDto {
    private List<MatchDto> matchesToProvide;
    private List<MatchDto> matchesToRequest;
} 