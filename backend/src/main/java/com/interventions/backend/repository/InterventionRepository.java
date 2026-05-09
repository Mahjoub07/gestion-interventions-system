package com.interventions.backend.repository;

import com.interventions.backend.model.Intervention;
import com.interventions.backend.model.enums.Statut;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterventionRepository extends JpaRepository<Intervention, Long> {
    List<Intervention> findByStatut(Statut statut);
    List<Intervention> findByTechnicienId(Long technicienId);
    List<Intervention> findByUserId(Long userId);
}