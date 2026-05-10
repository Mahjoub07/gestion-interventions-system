package com.interventions.backend.service;

import com.interventions.backend.model.Intervention;
import com.interventions.backend.model.enums.Statut;
import com.interventions.backend.repository.InterventionRepository;
import com.interventions.backend.repository.TechnicienRepository;
import com.interventions.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterventionService {

    private final InterventionRepository repository;
    private final TechnicienRepository technicienRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<Intervention> findAll() {
        return repository.findAllWithRelations();
    }

    @Transactional(readOnly = true)
    public Intervention findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intervention non trouvée"));
    }

    @Transactional(readOnly = true)
    public List<Intervention> findByStatut(Statut statut) {
        return repository.findByStatut(statut);
    }

    @Transactional(readOnly = true)
    public List<Intervention> findByTechnicien(Long technicienId) {
        return repository.findByTechnicienId(technicienId);
    }

    @Transactional(readOnly = true)
    public List<Intervention> findByUser(Long userId) {
        return repository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<Intervention> findByTechnicienEmail(String email) {
        return repository.findByTechnicienEmail(email);
    }

    @Transactional
    public Intervention save(Intervention intervention) {
        return repository.save(intervention);
    }

    @Transactional
    public Intervention update(Long id, Intervention updated) {
        Intervention existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intervention non trouvée"));
        existing.setTitre(updated.getTitre());
        existing.setDescription(updated.getDescription());
        existing.setDateIntervention(updated.getDateIntervention());
        existing.setStatut(updated.getStatut());
        if (updated.getTechnicien() != null && updated.getTechnicien().getId() != null) {
            existing.setTechnicien(technicienRepository.findById(updated.getTechnicien().getId())
                    .orElseThrow(() -> new RuntimeException("Technicien non trouvé")));
        } else if (updated.getTechnicien() == null) {
            existing.setTechnicien(null);
        }
        if (updated.getUser() != null && updated.getUser().getId() != null) {
            existing.setUser(userRepository.findById(updated.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé")));
        } else if (updated.getUser() == null) {
            existing.setUser(null);
        }
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Intervention non trouvée");
        }
        repository.deleteById(id);
    }
}