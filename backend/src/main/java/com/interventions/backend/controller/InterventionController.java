package com.interventions.backend.controller;

import com.interventions.backend.model.Intervention;
import com.interventions.backend.model.enums.Statut;
import com.interventions.backend.service.InterventionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/interventions")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class InterventionController {

    private final InterventionService service;

    @GetMapping
    public List<Intervention> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Intervention getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/statut/{statut}")
    public List<Intervention> getByStatut(@PathVariable Statut statut) {
        return service.findByStatut(statut);
    }

    @GetMapping("/technicien/{id}")
    public List<Intervention> getByTechnicien(@PathVariable Long id) {
        return service.findByTechnicien(id);
    }

    @GetMapping("/user/{id}")
    public List<Intervention> getByUser(@PathVariable Long id) {
        return service.findByUser(id);
    }

    @PostMapping
    public Intervention create(@RequestBody Intervention intervention) {
        return service.save(intervention);
    }

    @PutMapping("/{id}")
    public Intervention update(@PathVariable Long id, @RequestBody Intervention intervention) {
        return service.update(id, intervention);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}