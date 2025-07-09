package com.davideleonino.locker.service;

import com.davideleonino.locker.dto.response.ApiResponseDto;
import com.davideleonino.locker.model.*;
import com.davideleonino.locker.repository.BoxRepository;
import com.davideleonino.locker.repository.OperazioneRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class OperazioneService {

    @Autowired
    private OperazioneRepository operazioneRepository;

    @Autowired
    private BoxRepository boxRepository;

    @Autowired
    private BoxService boxService;


    public Optional<Operazione> trovaOperazioneAttivaPerPin(String pin, TipoOperazione tipo) {
        validaPin(pin);
        return operazioneRepository.findByPinAndTipoOperazioneAndStato(
                pin,
                tipo,
                StatoOperazione.IN_PROGRESS
        );
    }


    public Optional<Operazione> findById(Integer id) {
        return operazioneRepository.findById(id);
    }

    private void validaPin(String pin) {
        if (pin == null || !pin.matches("\\d{6}")) {
            throw new IllegalArgumentException("Il PIN deve essere composto esattamente da 6 cifre numeriche.");
        }
    }

    // LOGICA DEPOSITO IN 4 FASI

    public Operazione creaOperazioneDepositoVuota() {
        Operazione op = new Operazione();
        op.setTipoOperazione(TipoOperazione.DEPOSIT);
        op.setStato(StatoOperazione.IN_PROGRESS);
        op.setDataOrario(LocalDateTime.now());
        return operazioneRepository.save(op);
    }

    public Operazione assegnaBoxAOperazione(Integer operazioneId, Integer boxId) {
        Operazione op = operazioneRepository.findById(operazioneId)
                .orElseThrow(() -> new IllegalArgumentException("Operazione non trovata"));

        if (op.getStato() != StatoOperazione.IN_PROGRESS) {
            throw new IllegalStateException("Operazione già conclusa");
        }
        if (op.getBoxAssociato() != null) throw new IllegalStateException("Box già assegnato");

        Box box = boxService.getBoxById(boxId)
                .orElseThrow(() -> new IllegalArgumentException("Box non trovato"));

        if (box.getStatus() != BoxStatus.FREE) {
            throw new IllegalStateException("Box non disponibile");
        }

        boxService.changeBoxStatus(boxId, BoxStatus.RESERVED);
        op.setBoxAssociato(box);
        return operazioneRepository.save(op);
    }

    public Operazione impostaPinOperazione(Integer operazioneId, String pin) {
        validaPin(pin);
        Operazione op = operazioneRepository.findById(operazioneId)
                .orElseThrow(() -> new IllegalArgumentException("Operazione non trovata"));

        if (op.getStato() != StatoOperazione.IN_PROGRESS) {
            throw new IllegalStateException("Operazione già conclusa");
        }
        if (op.getPin() != null) throw new IllegalStateException("PIN già impostato");
        op.setPin(pin);
        return operazioneRepository.save(op);
    }


    public Operazione apriBox(Integer operazioneId, String pin, boolean aperturaSuccesso) {
        Operazione op = operazioneRepository.findById(operazioneId)
                .orElseThrow(() -> new IllegalArgumentException("Operazione non trovata"));

        if (op.getStato() != StatoOperazione.IN_PROGRESS) {
            throw new IllegalStateException("Operazione già conclusa");
        }

        if (pin == null || !pin.equals(op.getPin())) {
            throw new IllegalArgumentException("PIN errato");
        }
        if (!pin.equals(op.getPin())) {
            op.setTentativiPin(op.getTentativiPin() + 1);

            if (op.getTentativiPin() >= 3) {
                op.setStato(StatoOperazione.FAILED);
                operazioneRepository.save(op);
                throw new IllegalStateException("Troppi tentativi falliti. Operazione bloccata.");
            }

            operazioneRepository.save(op);
            throw new IllegalArgumentException("PIN errato");
        }


        Box box = op.getBoxAssociato();
        if (box == null) throw new IllegalStateException("Nessun box assegnato");

        if (aperturaSuccesso) {
            // Caso successo: chiudo operazione e setto stato box a OCCUPIED
            boxService.changeBoxStatus(box.getId(), BoxStatus.OCCUPIED);
            op.setStato(StatoOperazione.SUCCESS);
            return operazioneRepository.save(op);
        } else {
            // Caso fallimento: disabilito temporaneamente box e chiudo operazione con FAILED
            boxService.changeBoxStatus(box.getId(), BoxStatus.DISABLED_TEMP);
            op.setStato(StatoOperazione.FAILED);
            operazioneRepository.save(op);

            // Creo nuova operazione IN_PROGRESS con lo stesso PIN
            Operazione nuova = new Operazione();
            nuova.setTipoOperazione(TipoOperazione.DEPOSIT);
            nuova.setStato(StatoOperazione.IN_PROGRESS);
            nuova.setPin(pin);
            nuova.setDataOrario(LocalDateTime.now());
            return operazioneRepository.save(nuova);
        }
    }


    // LOGICA RITIRO IN 3 FASI

    public Operazione creaOperazioneRitiroVuota() {
        Operazione operazione = new Operazione();
        operazione.setTipoOperazione(TipoOperazione.WITHDRAW);
        operazione.setStato(StatoOperazione.IN_PROGRESS);
        operazione.setDataOrario(LocalDateTime.now());
        // PIN e box associato rimangono null finché non vengono impostati
        return operazioneRepository.save(operazione);
    }



    /*public boolean verificaPinEBox(Integer operazioneRitiroId, String pin, Integer boxId) {
        Operazione operazioneRitiro = operazioneRepository.findById(operazioneRitiroId)
                .orElseThrow(() -> new IllegalArgumentException("Operazione di ritiro non trovata con id: " + operazioneRitiroId));

        if (operazioneRitiro.getTipoOperazione() != TipoOperazione.WITHDRAW) {
            throw new IllegalStateException("Operazione non è di tipo ritiro");
        }
        if (operazioneRitiro.getStato() != StatoOperazione.IN_PROGRESS) {
            throw new IllegalStateException("Operazione di ritiro non è nello stato corretto");
        }



        Box box = boxService.getBoxById(boxId)
                .orElseThrow(() -> new IllegalArgumentException("Box non trovato"));

        // Qui cercare un'operazione di DEPOSITO corrispondente a pin e box
        Optional<Operazione> operazioneDepositoOpt = operazioneRepository.findTopByBoxAssociatoIdAndPinOrderByDataOrarioDesc(boxId, pin)
                .filter(op -> op.getTipoOperazione() == TipoOperazione.DEPOSIT && op.getStato() == StatoOperazione.SUCCESS);

        if (operazioneDepositoOpt.isEmpty()) {
            throw new IllegalArgumentException("Nessuna operazione di deposito trovata corrispondente a PIN e Box");
        }

        // Se tutto ok, associare box e pin all'operazione di ritiro (che è ancora vuota)
        if (operazioneRitiro.getBoxAssociato() != null || operazioneRitiro.getPin() != null) {
            throw new IllegalStateException("Operazione di ritiro ha già box o pin associato");
        }

        operazioneRitiro.setBoxAssociato(box);
        operazioneRitiro.setPin(pin);
        operazioneRepository.save(operazioneRitiro);

        return true;
    }

     */

    public boolean verificaPinEBox(Integer operazioneRitiroId, String pin, Integer boxId) {
        System.out.println("DEBUG Service: INIZIO verificaPinEBox con ritiroId=" + operazioneRitiroId + ", pin=" + pin + ", boxId=" + boxId);

        Operazione operazioneRitiro = operazioneRepository.findById(operazioneRitiroId)
                .orElseThrow(() -> new IllegalArgumentException("Operazione di ritiro non trovata con id: " + operazioneRitiroId));

        if (operazioneRitiro.getTipoOperazione() != TipoOperazione.WITHDRAW) {
            throw new IllegalStateException("Operazione non è di tipo ritiro");
        }

        if (operazioneRitiro.getStato() != StatoOperazione.IN_PROGRESS) {
            throw new IllegalStateException("Operazione di ritiro non è nello stato corretto");
        }

        Box box = boxService.getBoxById(boxId)
                .orElseThrow(() -> new IllegalArgumentException("Box non trovato"));

        // Usa il tuo metodo esistente
        Optional<Operazione> operazioneDepositoOpt = operazioneRepository.findTopByBoxAssociatoIdAndPinOrderByDataOrarioDesc(boxId, pin);

        if (operazioneDepositoOpt.isEmpty()) {
            System.out.println("DEBUG: Nessuna operazione trovata per quel boxId e pin");
            throw new IllegalArgumentException("Nessuna operazione trovata per quel boxId e pin");
        }

        Operazione operazioneDeposito = operazioneDepositoOpt.get();

        System.out.println("DEBUG: Operazione trovata: ID=" + operazioneDeposito.getId()
                + ", tipo=" + operazioneDeposito.getTipoOperazione()
                + ", stato=" + operazioneDeposito.getStato());

        // Verifica tipo e stato
        if (operazioneDeposito.getTipoOperazione() != TipoOperazione.DEPOSIT ||
                operazioneDeposito.getStato() != StatoOperazione.SUCCESS) {
            throw new IllegalArgumentException("Nessuna operazione di deposito valida trovata con PIN e Box");
        }

        if (operazioneRitiro.getBoxAssociato() != null || operazioneRitiro.getPin() != null) {
            throw new IllegalStateException("Operazione di ritiro ha già box o pin associato");
        }

        operazioneRitiro.setBoxAssociato(box);
        operazioneRitiro.setPin(pin);
        operazioneRepository.save(operazioneRitiro);

        System.out.println("DEBUG: Operazione di ritiro aggiornata con PIN e box");

        return true;
    }




    public Operazione apriBoxRitiro(Integer operazioneId, String pin, boolean aperturaSuccesso) {
        Operazione operazione = operazioneRepository.findById(operazioneId)
                .orElseThrow(() -> new IllegalArgumentException("Operazione non trovata"));

        if (operazione.getStato() != StatoOperazione.IN_PROGRESS) {
            throw new IllegalStateException("Operazione già conclusa");
        }
        if (!operazione.getPin().equals(pin)) {
            throw new IllegalArgumentException("PIN errato");
        }

        Box box = operazione.getBoxAssociato();
        if (box == null || box.getStatus() != BoxStatus.OCCUPIED) {
            throw new IllegalStateException("Box non è occupato");
        }

        if (aperturaSuccesso) {
            box.setStatus(BoxStatus.FREE);
            operazione.setStato(StatoOperazione.SUCCESS);
        } else {
            operazione.setStato(StatoOperazione.FAILED);
        }

        boxRepository.save(box);
        return operazioneRepository.save(operazione);
    }


    //Logica relativa all admin

    public List<Operazione> search(String stato, String fromDate, String toDate) {
        Specification<Operazione> spec = Specification.where(null);

        if (stato != null && !stato.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("stato"), StatoOperazione.valueOf(stato))
            );
        }

        if (fromDate != null && !fromDate.isBlank()) {
            LocalDateTime from = LocalDate.parse(fromDate).atStartOfDay();
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("dataOrario"), from)
            );
        }

        if (toDate != null && !toDate.isBlank()) {
            LocalDateTime to = LocalDate.parse(toDate).atTime(LocalTime.MAX);
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("dataOrario"), to)
            );
        }

        return operazioneRepository.findAll(spec);
    }
}

