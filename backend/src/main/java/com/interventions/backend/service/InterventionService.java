package com.interventions.backend.service;

import com.interventions.backend.model.Intervention;
import com.interventions.backend.model.enums.Statut;
import com.interventions.backend.repository.InterventionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterventionService {

    private final InterventionRepository repository;

    public List<Intervention> findAll() {
        return repository.findAll();
    }

    public Intervention findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intervention non trouvée"));
    }

    public List<Intervention> findByStatut(Statut statut) {
        return repository.findByStatut(statut);
    }

    public List<Intervention> findByTechnicien(Long technicienId) {
        return repository.findByTechnicienId(technicienId);
    }

    public List<Intervention> findByUser(Long userId) {
        return repository.findByUserId(userId);
    }

    public Intervention save(Intervention intervention) {
        return repository.save(intervention);
    }

    public Intervention update(Long id, Intervention updated) {
        Intervention existing = findById(id);
        existing.setTitre(updated.getTitre());
        existing.setDescription(updated.getDescription());
        existing.setStatut(updated.getStatut());
        existing.setTechnicien(updated.getTechnicien());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}