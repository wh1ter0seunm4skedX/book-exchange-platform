package book_exchange_platform.backend.books.data;

import book_exchange_platform.backend.trading.data.PublicationEntity;
import book_exchange_platform.backend.trading.data.RequestEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Entity
@Builder
@Getter
@Table(name = "books")
public class BookEntity {

    @Id
    private Long id;

    private String title;
    private Long courseNumber;
    private String coverImageUrl;

    public BookEntity() {
        this.id = null;
        this.title = null;
        this.courseNumber  = null;
        this.coverImageUrl  = null;
    }

    public BookEntity(Long id, String title, Long courseNumber, String coverImageUrl) {
        this.id = id;
        this.title = title;
        this.courseNumber = courseNumber;
        this.coverImageUrl = coverImageUrl;
    }
}