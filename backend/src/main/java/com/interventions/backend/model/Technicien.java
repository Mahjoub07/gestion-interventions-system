package com.interventions.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @OneToMany(mappedBy = "technicien", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Intervention> interventions;
}