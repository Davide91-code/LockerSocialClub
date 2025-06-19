package com.davideleonino.locker.repository;

import com.davideleonino.locker.model.Box;
import com.davideleonino.locker.model.Operazione;
import com.davideleonino.locker.model.StatoOperazione;
import com.davideleonino.locker.model.TipoOperazione;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OperazioneRepository extends JpaRepository<Operazione, Integer> {

    // Cerca un'operazione attiva (IN_PROGRESS) dato un PIN, tipo operazione e stato

    Optional<Operazione> findByPinAndTipoOperazioneAndStato(
            String pin,
            TipoOperazione tipo,
            StatoOperazione stato
    );

    // Trova l'ultima operazione con un certo PIN, ordinata per data decrescente

    Optional<Operazione> findTopByPinOrderByDataOrarioDesc(String pin);

    Optional<Operazione> findTopByBoxAssociatoIdAndPinOrderByDataOrarioDesc(Integer boxId, String pin);

}
