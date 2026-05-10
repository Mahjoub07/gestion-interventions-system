package com.interventions.backend.repository;

import com.interventions.backend.model.Technicien;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TechnicienRepository extends JpaRepository<Technicien, Long> {
    Optional<Technicien> findByEmail(String email);
}