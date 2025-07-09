package com.davideleonino.locker.repository;

import com.davideleonino.locker.model.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminUserRepository extends JpaRepository<AdminUser, Integer> {

    /**
     * Cerca un utente admin per username
     */
    Optional<AdminUser> findByUsername(String username);
}
