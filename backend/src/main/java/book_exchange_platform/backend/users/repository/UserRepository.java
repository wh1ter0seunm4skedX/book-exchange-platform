package book_exchange_platform.backend.users.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.data.jpa.repository.support.JpaEntityInformationSupport;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Repository;
import book_exchange_platform.backend.users.data.UserEntity;

import java.util.List;
import java.util.Optional;

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

//    public List<BookEntity> getUsersRequestedList(Long userId) {
//        String query = "SELECT b FROM UserEntity u JOIN u.requiredBooks b WHERE u.id = :userId";
//        return entityManager.createQuery(query, BookEntity.class)
//                .setParameter("userId", userId)
//                .getResultList();
//    }


   public List<UserEntity> getBookPublishers(Long bookId) {
       String query = "SELECT u FROM UserEntity u JOIN PublicationEntity p ON u.id = p.user.id WHERE p.book.id = :bookId";
       return entityManager.createQuery(query, UserEntity.class)
               .setParameter("bookId", bookId)
               .getResultList();
   }

   public List<UserEntity> getBookRequesters(Long bookId) {
       String query = "SELECT u FROM UserEntity u JOIN RequestEntity r ON u.id = r.user.id WHERE r.book.id = :bookId";
       return entityManager.createQuery(query, UserEntity.class)
               .setParameter("bookId", bookId)
               .getResultList();
   }


    public UserEntity findUserByEmail(String email) {
        String query = "SELECT u FROM UserEntity u WHERE u.email = :email";
        TypedQuery<UserEntity> typedQuery = entityManager.createQuery(query, UserEntity.class)
                .setParameter("email", email)
                .setMaxResults(1);
        
        try {
            return typedQuery.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public UserEntity getUser(Long userId) {
        Optional<UserEntity> optionalUser = super.findById(userId);
        if (optionalUser.isEmpty())
            throw new IllegalArgumentException("User with id " + userId + " not found");
        return optionalUser.get();
    }

    public boolean existsByEmail(String email) {
        String query = "SELECT COUNT(u) FROM UserEntity u WHERE u.email = :email";
        Long count = entityManager.createQuery(query, Long.class)
                .setParameter("email", email)
                .getSingleResult();
        return count > 0;
    }
}
