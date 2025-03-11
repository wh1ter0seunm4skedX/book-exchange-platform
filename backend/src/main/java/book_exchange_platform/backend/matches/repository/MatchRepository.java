package book_exchange_platform.backend.matches.repository;


import book_exchange_platform.backend.matches.data.PublicationEntity;
import book_exchange_platform.backend.matches.data.RequestEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import book_exchange_platform.backend.matches.data.MatchEntity;
import org.springframework.data.jpa.repository.support.JpaEntityInformationSupport;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class MatchRepository extends SimpleJpaRepository<MatchEntity, Long> {

    @PersistenceContext
    private final EntityManager entityManager;

    public MatchRepository(EntityManager entityManager) {
        super(JpaEntityInformationSupport.getEntityInformation(MatchEntity.class, entityManager), entityManager);
        this.entityManager = entityManager;
    }

    public List<MatchEntity> getAllMatches() {
        String query = "SELECT r FROM MatchEntity r";
        return entityManager.createQuery(query, MatchEntity.class).getResultList();
    }

    public List<MatchEntity> getAllUserMatches(Long userId) {
        String query = "SELECT m FROM MatchEntity m WHERE (m.provider.id = :userId OR m.requester.id = :userId)";
        return entityManager.createQuery(query, MatchEntity.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    @Transactional
    public RequestEntity saveRequest(RequestEntity requestEntity) {
        if(!isExists(requestEntity)){
            entityManager.persist(requestEntity);
            return requestEntity;
        }
        return entityManager.merge(requestEntity);
    }

    public List<RequestEntity> getAllRequests() {
        String query = "SELECT r FROM RequestEntity r";
        return entityManager.createQuery(query, RequestEntity.class).getResultList();
    }

    public List<RequestEntity> getAllUserRequests(Long userId) {
        String query = "SELECT r FROM RequestEntity r WHERE r.user.id = :userId";
        return entityManager.createQuery(query, RequestEntity.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    public RequestEntity getRequest(Long userId , Long bookId) {
        String query = "SELECT r FROM RequestEntity r WHERE r.user.id = :userId AND r.book.id = :bookId";
        return entityManager.createQuery(query, RequestEntity.class)
                .setParameter("userId", userId)
                .setParameter("bookId", bookId)
                .getSingleResult();
    }

    @Transactional
    public void removeRequest(RequestEntity requestEntity) {
        if (entityManager.contains(requestEntity)) {
            entityManager.remove(requestEntity);
        } else {
            entityManager.remove(entityManager.merge(requestEntity));
        }
    }

    @Transactional
    public PublicationEntity savePublication(PublicationEntity publicationEntity) {
        if(!isExists(publicationEntity)){
            entityManager.persist(publicationEntity);
            return publicationEntity;
        }
        return entityManager.merge(publicationEntity);
    }

    public List<PublicationEntity> getAllPublications() {
        String query = "SELECT r FROM PublicationEntity r";
        return entityManager.createQuery(query, PublicationEntity.class).getResultList();
    }

    public List<PublicationEntity> getAllUserPublications(Long userId) {
        String query = "SELECT r FROM PublicationEntity r WHERE r.user.id = :userId";
        return entityManager.createQuery(query, PublicationEntity.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    public PublicationEntity getPublication(Long userId , Long bookId) {
        String query = "SELECT r FROM PublicationEntity r WHERE r.user.id = :userId AND r.book.id = :bookId";
        return entityManager.createQuery(query, PublicationEntity.class)
                .setParameter("userId", userId)
                .setParameter("bookId", bookId)
                .getSingleResult();
    }

    @Transactional
    public void removePublication(PublicationEntity publicationEntity) {
        if (entityManager.contains(publicationEntity)) {
            entityManager.remove(publicationEntity);
        } else {
            entityManager.remove(entityManager.merge(publicationEntity));
        }
    }





    private boolean isExists(RequestEntity entity) {
        String query = "SELECT COUNT(r) FROM RequestEntity r WHERE r.book.id = :bookId AND r.user.id = :userId";
        Long count = entityManager.createQuery(query, Long.class)
                .setParameter("bookId", entity.getBook().getId())
                .setParameter("userId", entity.getUser().getId())
                .getSingleResult();
        return count > 0;
    }



    private boolean isExists(PublicationEntity entity) {
        String query = "SELECT COUNT(r) FROM PublicationEntity r WHERE r.book.id = :bookId AND r.user.id = :userId";
        Long count = entityManager.createQuery(query, Long.class)
                .setParameter("bookId", entity.getBook().getId())
                .setParameter("userId", entity.getUser().getId())
                .getSingleResult();
        return count > 0;
    }

}
