package book_exchange_platform.backend.users.repository;


import book_exchange_platform.backend.books.data.BookEntity;
import book_exchange_platform.backend.matches.data.MatchEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.JpaEntityInformationSupport;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Repository;
import book_exchange_platform.backend.users.data.UserEntity;

import java.util.List;

@Repository
public class UserRepository extends SimpleJpaRepository<UserEntity, Long> {

    @PersistenceContext
    private final EntityManager entityManager;

    public UserRepository(EntityManager entityManager) {
        super(JpaEntityInformationSupport.getEntityInformation(UserEntity.class, entityManager), entityManager);
        this.entityManager = entityManager;
    }

    public List<UserEntity> getAllUsers() {
        String query = "SELECT u FROM UserEntity u";
        return entityManager.createQuery(query, UserEntity.class)
                .getResultList();
    }

    public List<BookEntity> getUsersRequestedList(Long userId) {
        String query = "SELECT b FROM UserEntity u JOIN u.requiredBooks b WHERE u.id = :userId";
        return entityManager.createQuery(query, BookEntity.class)
                .setParameter("userId", userId)
                .getResultList();
    }


    public List<UserEntity> getBookPublishers(Long bookId) {
        String query = "SELECT u FROM UserEntity u JOIN u.booksForShare b WHERE b.id = :bookId";
        return entityManager.createQuery(query, UserEntity.class)
                .setParameter("bookId", bookId)
                .getResultList();
    }

    public List<UserEntity> getBookRequests(Long bookId) {
        String query = "SELECT u FROM UserEntity u JOIN u.requiredBooks b WHERE b.id = :bookId";
        return entityManager.createQuery(query, UserEntity.class)
                .setParameter("bookId", bookId)
                .getResultList();
    }


    public UserEntity findByEmail(String email) {
        String query = "SELECT u FROM UserEntity u WHERE u.email = :email";
        return entityManager.createQuery(query, UserEntity.class)
                .setParameter("email", email)
                .getSingleResult();
    }

}

