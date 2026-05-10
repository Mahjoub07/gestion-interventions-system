package com.interventions.backend.repository;

import com.interventions.backend.model.Intervention;
import com.interventions.backend.model.enums.Statut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface InterventionRepository extends JpaRepository<Intervention, Long> {
    List<Intervention> findByStatut(Statut statut);
    List<Intervention> findByTechnicienId(Long technicienId);
    List<Intervention> findByUserId(Long userId);

    @Query("SELECT DISTINCT i FROM Intervention i LEFT JOIN FETCH i.technicien LEFT JOIN FETCH i.user")
    List<Intervention> findAllWithRelations();

    @Query("SELECT DISTINCT i FROM Intervention i LEFT JOIN FETCH i.technicien t LEFT JOIN FETCH i.user WHERE t.email = :email")
    List<Intervention> findByTechnicienEmail(String email);
}