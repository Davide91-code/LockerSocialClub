package com.davideleonino.locker.repository;

import com.davideleonino.locker.model.Box;
import com.davideleonino.locker.model.BoxStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoxRepository extends JpaRepository<Box, Integer> {

    // Trova un box specifico per numero
    Optional<Box> findByNumBox(Integer numBox);

    // Trova tutti i box con uno specifico stato
    List<Box> findByStatus(BoxStatus status);

    // Trova i box con uno stato contenuto nella lista (es. [FREE, DISABLED_TEMP])
    List<Box> findByStatusIn(List<BoxStatus> statuses);
}
