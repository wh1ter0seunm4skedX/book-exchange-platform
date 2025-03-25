package book_exchange_platform.backend.books.repository;


import book_exchange_platform.backend.books.data.BookEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.jpa.repository.support.JpaEntityInformationSupport;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BooksRepository extends SimpleJpaRepository<BookEntity, Long> {

    @PersistenceContext
    private final EntityManager entityManager;

    public BooksRepository(EntityManager entityManager) {
        super(JpaEntityInformationSupport.getEntityInformation(BookEntity.class, entityManager), entityManager);
        this.entityManager = entityManager;
    }

    public List<BookEntity> getAllBooks() {
        String query = "SELECT b FROM BookEntity b";
        return entityManager.createQuery(query, BookEntity.class)
                .getResultList();
    }

    public BookEntity getBook(Long bookId) {
        String query = "SELECT b FROM BookEntity b WHERE b.id = :bookId";
        return entityManager.createQuery(query, BookEntity.class)
                .setParameter("bookId", bookId)
                .getSingleResult();
    }

}

