package book_exchange_platform.backend.books.repository;


import book_exchange_platform.backend.books.data.BookEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BooksRepository extends SimpleJpaRepository<BookEntity, Long> {

    @PersistenceContext
    private EntityManager entityManager;

    public BooksRepository(JpaEntityInformation<BookEntity, ?> entityInformation, EntityManager entityManager) {
        super(entityInformation, entityManager);
    }

    public List<BookEntity> getAllBooks() {
        String query = "SELECT b FROM BookEntity b";
        return entityManager.createQuery(query, BookEntity.class)
                .getResultList();
    }

    public List<BookEntity> getUsersRequestedList(Long userId) {
        String query = "SELECT b FROM BookEntity b JOIN b.requestedByUsers u WHERE u.id = :userId";
        return entityManager.createQuery(query, BookEntity.class)
                .setParameter("userId", userId)
                .getResultList();
    }


}

