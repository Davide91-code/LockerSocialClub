package com.davideleonino.locker.repository;

import com.davideleonino.locker.model.Box;
import com.davideleonino.locker.model.Operazione;
import com.davideleonino.locker.model.StatoOperazione;
import com.davideleonino.locker.model.TipoOperazione;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


import java.util.List;
import java.util.Optional;

@Repository
public interface OperazioneRepository extends JpaRepository<Operazione, Integer>,
        JpaSpecificationExecutor<Operazione> {

    // Cerca un'operazione attiva (IN_PROGRESS) dato un PIN, tipo operazione e stato

    Optional<Operazione> findByPinAndTipoOperazioneAndStato(
            String pin,
            TipoOperazione tipo,
            StatoOperazione stato
    );


    Optional<Operazione> findTopByBoxAssociatoIdAndPinOrderByDataOrarioDesc(Integer boxId, String pin);


}
