package com.davideleonino.locker.service;

import com.davideleonino.locker.model.*;
import com.davideleonino.locker.repository.BoxRepository;
import com.davideleonino.locker.repository.OperazioneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BoxService {

    @Autowired
    private BoxRepository boxRepository;

    @Autowired
    private OperazioneRepository operazioneRepository;

    // -------------------- METODI REPOSITORY-ALIGNED --------------------

    public List<Box> getAllBoxes() {
        return boxRepository.findAll();
    }

    public List<Box> getAvailableBoxes() {
        return boxRepository.findByStatus(BoxStatus.FREE);
    }

    public Optional<Box> getBoxById(Integer id) {
        return boxRepository.findById(id);
    }

    public Optional<Box> getBoxByNumBox(Integer numBox) {
        return boxRepository.findByNumBox(numBox);
    }

    public List<Box> getBoxesByStatus(BoxStatus status) {
        return boxRepository.findByStatus(status);
    }

    public List<Box> getBoxesByMultipleStatuses(List<BoxStatus> statuses) {
        return boxRepository.findByStatusIn(statuses);
    }

    public Optional<Box> changeBoxStatus(Integer boxId, BoxStatus newStatus) {
        return boxRepository.findById(boxId).map(box -> {

            if (box.getStatus() == BoxStatus.DISABLED && newStatus == BoxStatus.OCCUPIED) {
                throw new IllegalStateException("Non puoi occupare un box disabilitato");
            }

            if (box.getStatus() == BoxStatus.OCCUPIED && newStatus == BoxStatus.RESERVED) {
                throw new IllegalStateException("Box già occupato, non può essere riservato");
            }
            box.setStatus(newStatus);
            return boxRepository.save(box);
        });
    }

    // Libera un box manualmente (lo imposta a FREE)

    public boolean liberaBox(Integer boxId) {
        return boxRepository.findById(boxId).map(box -> {
            box.setStatus(BoxStatus.FREE);
            boxRepository.save(box);
            return true;
        }).orElse(false);
    }

    // Disabilita manualmente un box (lo imposta a DISABLED)

    public boolean disabilitaBox(Integer boxId) {
        return boxRepository.findById(boxId).map(box -> {
            box.setStatus(BoxStatus.DISABLED);
            boxRepository.save(box);
            return true;
        }).orElse(false);
    }

    // Assegna manualmente un PIN e occupa il box con un'operazione completata

    public Optional<Operazione> assegnaPinManuale(Integer boxId, String pin) {
        if (pin == null || !pin.matches("\\d{6}")) {
            throw new IllegalArgumentException("Il PIN deve essere esattamente di 6 cifre numeriche.");
        }

        Optional<Box> boxOpt = boxRepository.findById(boxId);
        if (boxOpt.isEmpty()) return Optional.empty();

        Box box = boxOpt.get();
        box.setStatus(BoxStatus.OCCUPIED);
        boxRepository.save(box);

        Operazione operazione = new Operazione();
        operazione.setBoxAssociato(box);
        operazione.setPin(pin);
        operazione.setTipoOperazione(TipoOperazione.DEPOSIT);
        operazione.setStato(StatoOperazione.SUCCESS);
        operazione.setDataOrario(LocalDateTime.now());

        operazioneRepository.save(operazione);
        return Optional.of(operazione);
    }

    public Optional<Box> assegnaBoxLibero() {
        List<Box> freeBoxes = boxRepository.findByStatus(BoxStatus.FREE);
        if (freeBoxes.isEmpty()) {
            return Optional.empty();
        }
        Box box = freeBoxes.get(0);
        box.setStatus(BoxStatus.OCCUPIED);
        boxRepository.save(box);
        return Optional.of(box);
    }

    public Optional<Box> setBoxStatus(Integer boxId, BoxStatus newStatus) {
        return boxRepository.findById(boxId).map(box -> {
            box.setStatus(newStatus);
            return boxRepository.save(box);
        });
    }
}
