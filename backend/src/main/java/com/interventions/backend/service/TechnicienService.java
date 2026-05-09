package com.interventions.backend.service;

import com.interventions.backend.model.Technicien;
import com.interventions.backend.repository.TechnicienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TechnicienService {

    private final TechnicienRepository repository;

    public List<Technicien> findAll() {
        return repository.findAll();
    }

    public Technicien findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Technicien non trouvé"));
    }

    public Technicien save(Technicien technicien) {
        return repository.save(technicien);
    }

    public Technicien update(Long id, Technicien updated) {
        Technicien existing = findById(id);
        existing.setNom(updated.getNom());
        existing.setPrenom(updated.getPrenom());
        existing.setEmail(updated.getEmail());
        existing.setSpecialite(updated.getSpecialite());
        existing.setTelephone(updated.getTelephone());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}