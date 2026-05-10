package com.interventions.backend.model;

import com.interventions.backend.model.enums.Statut;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "interventions")
@Data
@NoArgsConstructor
public class Intervention {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String description;
    private LocalDateTime dateIntervention;

    @Enumerated(EnumType.STRING)
    private Statut statut = Statut.EN_ATTENTE;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "technicien_id")
    private Technicien technicien;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;
}