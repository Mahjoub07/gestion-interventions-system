package com.interventions.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "techniciens")
@Data
@NoArgsConstructor
public class Technicien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String email;
    private String specialite;
    private String telephone;

    @OneToMany(mappedBy = "technicien", cascade = CascadeType.ALL)
    private List<Intervention> interventions;
}