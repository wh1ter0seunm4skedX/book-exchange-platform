package book_exchange_platform.backend.matches.repository;


import book_exchange_platform.backend.books.data.BookEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import book_exchange_platform.backend.matches.data.MatchEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.JpaEntityInformationSupport;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MatchRepository extends SimpleJpaRepository<MatchEntity, Long> {

    @PersistenceContext
    private final EntityManager entityManager;

    public MatchRepository(EntityManager entityManager) {
        super(JpaEntityInformationSupport.getEntityInformation(MatchEntity.class, entityManager), entityManager);
        this.entityManager = entityManager;
    }

    public List<MatchEntity> getAllUserMatches(Long userId) {
        String query = "SELECT m FROM MatchEntity m WHERE (m.provider.id = :userId OR m.requester.id = :userId)";
        return entityManager.createQuery(query, MatchEntity.class)
                .setParameter("userId", userId)
                .getResultList();
    }

//
}
//public List<MatchEntity> getAllUserMatches(Long userId) {
//        String query = "SELECT m FROM MatchEntity m WHERE m.status = 'Pending' AND (m.provider.id = :userId OR m.requester.id = :userId)";
//        return entityManager.createQuery(query, MatchEntity.class)
//                .setParameter("userId", userId)
//                .getResultList();
//    }
