package com.interventions.backend.controller;

import com.interventions.backend.model.Technicien;
import com.interventions.backend.service.TechnicienService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/techniciens")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class TechnicienController {

    private final TechnicienService service;

    @GetMapping
    public List<Technicien> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Technicien getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public Technicien create(@RequestBody Technicien technicien) {
        return service.save(technicien);
    }

    @PutMapping("/{id}")
    public Technicien update(@PathVariable Long id, @RequestBody Technicien technicien) {
        return service.update(id, technicien);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}