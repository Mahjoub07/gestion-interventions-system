package com.interventions.backend.repository;

import com.interventions.backend.model.Technicien;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TechnicienRepository extends JpaRepository<Technicien, Long> {
}