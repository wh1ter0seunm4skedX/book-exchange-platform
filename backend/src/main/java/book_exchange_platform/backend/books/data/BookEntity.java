package book_exchange_platform.backend.books.data;

import book_exchange_platform.backend.matches.data.PublicationEntity;
import book_exchange_platform.backend.matches.data.RequestEntity;
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

    @OneToMany(mappedBy = "book")
    private List<PublicationEntity> sharedByUsers;

    @OneToMany(mappedBy = "book")
    private List<RequestEntity> requestedByUsers;

    public BookEntity() {
        this.id = null;
        this.title = null;
        this.courseNumber  = null;
        this.coverImageUrl  = null;
        this.sharedByUsers = null;
        this.requestedByUsers = null;
    }

    public BookEntity(Long id, String title, Long courseNumber, String coverImageUrl, List<PublicationEntity> sharedByUsers, List<RequestEntity> requestedByUsers) {
        this.id = id;
        this.title = title;
        this.courseNumber = courseNumber;
        this.coverImageUrl = coverImageUrl;
        this.sharedByUsers = sharedByUsers;
        this.requestedByUsers = requestedByUsers;
    }
}