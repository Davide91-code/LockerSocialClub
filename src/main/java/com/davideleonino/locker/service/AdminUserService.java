package com.davideleonino.locker.service;

import com.davideleonino.locker.model.AdminUser;
import com.davideleonino.locker.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminUserService {

    @Autowired
    private AdminUserRepository adminUserRepository;

    // Login amministratore - verifica username e password
    public Optional<AdminUser> login(String username, String password) {
        Optional<AdminUser> adminOpt = adminUserRepository.findByUsername(username);
        if (adminOpt.isPresent() && adminOpt.get().getPassword().equals(password)) {
            return adminOpt;
        } else {
            return Optional.empty();
        }
    }

    // Trova un admin per username
    public Optional<AdminUser> trovaPerUsername(String username) {
        return adminUserRepository.findByUsername(username);
    }

}



// attualmente sto salvando la password in chiaro, in quanto faremo un mock demo.
// ma in futuro dovremo crittografare la pass con Bcrypt e gestire il login con un token
// Ricordare per Pj giochidatavolo