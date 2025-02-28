package book_exchange_platform.backend.users.data;

import book_exchange_platform.backend.books.data.BookDto;
import book_exchange_platform.backend.matches.data.MatchDto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Builder
@Getter
@Setter
public class UserDto {

    private Long id;
    private String fullName;
    private String email;
    private String password;
    private Long phoneNumber;
    private String preferredExchangeLocation;
    private List<BookDto> booksForShare;
    private List<BookDto> requiredBooks;
    private List<MatchDto> matchesToProvide;
    private List<MatchDto> matchesToRequest;
}
