package com.interventions.backend;

import com.interventions.backend.model.User;
import com.interventions.backend.model.enums.Role;
import com.interventions.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    CommandLineRunner initAdmin(UserRepository userRepository) {
        return args -> {
            userRepository.findByEmail("admin@company.ma").ifPresentOrElse(
                user -> {},
                () -> {
                    User admin = new User();
                    admin.setNom("Admin");
                    admin.setPrenom("System");
                    admin.setEmail("admin@company.ma");
                    admin.setPassword("admin123");
                    admin.setRole(Role.ADMIN);
                    userRepository.save(admin);
                }
            );
        };
    }

}
