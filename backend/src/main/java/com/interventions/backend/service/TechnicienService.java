package com.interventions.backend.service;

import com.interventions.backend.model.Technicien;
import com.interventions.backend.repository.TechnicienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TechnicienService {

    private final TechnicienRepository repository;

    @Transactional(readOnly = true)
    public List<Technicien> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Technicien findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Technicien non trouvé"));
    }

    @Transactional
    public Technicien save(Technicien technicien) {
        return repository.save(technicien);
    }

    @Transactional
    public Technicien update(Long id, Technicien updated) {
        Technicien existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Technicien non trouvé"));
        existing.setNom(updated.getNom());
        existing.setPrenom(updated.getPrenom());
        existing.setEmail(updated.getEmail());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Technicien non trouvé");
        }
        repository.deleteById(id);
    }
}