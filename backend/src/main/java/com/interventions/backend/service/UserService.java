package com.interventions.backend.service;

import com.interventions.backend.model.User;
import com.interventions.backend.model.enums.Role;
import com.interventions.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;

    @Transactional(readOnly = true)
    public List<User> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("L'ID utilisateur est requis");
        }
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    @Transactional
    public User create(User user) {
        validateNewUser(user);
        return repository.save(user);
    }

    @Transactional
    public User update(Long id, User updated) {
        if (id == null) {
            throw new IllegalArgumentException("L'ID utilisateur est requis");
        }
        User existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (updated.getNom() != null && !updated.getNom().trim().isEmpty()) {
            existing.setNom(updated.getNom().trim());
        }
        if (updated.getPrenom() != null && !updated.getPrenom().trim().isEmpty()) {
            existing.setPrenom(updated.getPrenom().trim());
        }
        if (updated.getPassword() != null && !updated.getPassword().trim().isEmpty()) {
            existing.setPassword(updated.getPassword());
        }
        if (updated.getEmail() != null && !updated.getEmail().trim().isEmpty()) {
            String newEmail = updated.getEmail().trim();
            if (!newEmail.equalsIgnoreCase(existing.getEmail())) {
                if (!newEmail.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
                    throw new IllegalArgumentException("L'email n'est pas valide");
                }
                repository.findByEmail(newEmail).ifPresent(u -> {
                    throw new IllegalArgumentException("Un utilisateur avec cet email existe déjà");
                });
                existing.setEmail(newEmail);
            }
        }
        if (updated.getRole() != null) {
            if (existing.getRole() == Role.ADMIN && existing.getEmail().equalsIgnoreCase("admin@company.ma") && updated.getRole() != Role.ADMIN) {
                throw new IllegalStateException("Le rôle de l'admin principal ne peut pas être modifié");
            }
            existing.setRole(updated.getRole());
        }

        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("L'ID utilisateur est requis");
        }
        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        if (user.getRole() == Role.ADMIN && user.getEmail().equalsIgnoreCase("admin@company.ma")) {
            throw new IllegalStateException("L'utilisateur admin principal ne peut pas être supprimé");
        }
        repository.deleteById(id);
    }

    private void validateNewUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("Les données utilisateur sont requises");
        }
        if (user.getNom() == null || user.getNom().trim().isEmpty()) {
            throw new IllegalArgumentException("Le nom est requis");
        }
        if (user.getPrenom() == null || user.getPrenom().trim().isEmpty()) {
            throw new IllegalArgumentException("Le prénom est requis");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("L'email est requis");
        }
        if (!user.getEmail().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new IllegalArgumentException("L'email n'est pas valide");
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Le mot de passe est requis");
        }
        if (user.getRole() == null) {
            throw new IllegalArgumentException("Le rôle est requis");
        }

        repository.findByEmail(user.getEmail().trim()).ifPresent(u -> {
            throw new IllegalArgumentException("Un utilisateur avec cet email existe déjà");
        });
    }
}