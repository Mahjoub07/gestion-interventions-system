package com.interventions.backend;

import com.interventions.backend.model.Intervention;
import com.interventions.backend.repository.InterventionRepository;
import com.interventions.backend.service.InterventionService;
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
class InterventionServiceTest {

    @Mock
    private InterventionRepository repository;

    @InjectMocks
    private InterventionService service;

    @Test
    void shouldReturnAllInterventions() {
        List<Intervention> list = List.of(new Intervention(), new Intervention());
        when(repository.findAll()).thenReturn(list);

        List<Intervention> result = service.findAll();

        assertEquals(2, result.size());
        verify(repository, times(1)).findAll();
    }

    @Test
    void shouldSaveIntervention() {
        Intervention intervention = new Intervention();
        intervention.setTitre("Test intervention");
        when(repository.save(any())).thenReturn(intervention);

        Intervention saved = service.save(intervention);

        assertEquals("Test intervention", saved.getTitre());
        verify(repository, times(1)).save(intervention);
    }

    @Test
    void shouldDeleteIntervention() {
        service.delete(1L);
        verify(repository, times(1)).deleteById(1L);
    }

    @Test
    void shouldFindById() {
        Intervention intervention = new Intervention();
        intervention.setTitre("Panne reseau");
        when(repository.findById(1L)).thenReturn(Optional.of(intervention));

        Intervention found = service.findById(1L);

        assertEquals("Panne reseau", found.getTitre());
    }
}