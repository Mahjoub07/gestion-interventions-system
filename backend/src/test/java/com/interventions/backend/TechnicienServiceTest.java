package com.interventions.backend;

import com.interventions.backend.model.Technicien;
import com.interventions.backend.repository.TechnicienRepository;
import com.interventions.backend.service.TechnicienService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TechnicienServiceTest {

    @Mock
    private TechnicienRepository repository;

    @InjectMocks
    private TechnicienService service;

    @Test
    void shouldReturnAllTechniciens() {
        List<Technicien> list = List.of(new Technicien(), new Technicien());
        when(repository.findAll()).thenReturn(list);

        assertEquals(2, service.findAll().size());
        verify(repository, times(1)).findAll();
    }

    @Test
    void shouldSaveTechnicien() {
        Technicien technicien = new Technicien();
        technicien.setNom("Alami");
        when(repository.save(any())).thenReturn(technicien);

        Technicien saved = service.save(technicien);

        assertEquals("Alami", saved.getNom());
    }

    @Test
    void shouldDeleteTechnicien() {
        service.delete(1L);
        verify(repository, times(1)).deleteById(1L);
    }

    @Test
    void shouldFindTechnicienById() {
        Technicien technicien = new Technicien();
        technicien.setNom("Benali");
        when(repository.findById(1L)).thenReturn(Optional.of(technicien));

        Technicien found = service.findById(1L);

        assertEquals("Benali", found.getNom());
    }
}