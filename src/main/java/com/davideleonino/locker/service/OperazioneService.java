package com.davideleonino.locker.service;

import com.davideleonino.locker.dto.response.ApiResponseDto;
import com.davideleonino.locker.model.*;
import com.davideleonino.locker.repository.BoxRepository;
import com.davideleonino.locker.repository.OperazioneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OperazioneService {

    @Autowired
    private OperazioneRepository operazioneRepository;

    @Autowired
    private BoxRepository boxRepository;

    @Autowired
    private BoxService boxService;



    public Operazione aggiornaStatoOperazione(Operazione operazione, StatoOperazione nuovoStato) {
        operazione.setStato(nuovoStato);
        operazione.setDataOrario(LocalDateTime.now());
        return operazioneRepository.save(operazione);
    }

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


    // LOGICA RITIRO IN 2 FASI

    public Operazione creaOperazioneRitiroVuota() {
        Operazione operazione = new Operazione();
        operazione.setTipoOperazione(TipoOperazione.WITHDRAW);
        operazione.setStato(StatoOperazione.IN_PROGRESS);
        operazione.setDataOrario(LocalDateTime.now());
        // PIN e box associato rimangono null finché non vengono impostati
        return operazioneRepository.save(operazione);
    }

    public Operazione impostaPinEBoxRitiro(Integer operazioneId, String pin, Integer boxId) {
        validaPin(pin);

        Operazione operazione = operazioneRepository.findById(operazioneId)
                .orElseThrow(() -> new IllegalArgumentException("Operazione non trovata"));

        if (operazione.getPin() != null && !operazione.getPin().isEmpty()) {
            throw new IllegalStateException("PIN già impostato");
        }

        if (operazione.getBoxAssociato() != null) {
            throw new IllegalStateException("Box già assegnato");
        }

        Box box = boxService.getBoxById(boxId)
                .orElseThrow(() -> new IllegalArgumentException("Box non trovato"));

        if (box.getStatus() != BoxStatus.OCCUPIED) {
            throw new IllegalStateException("Box non è occupato e quindi non può essere ritirato");
        }

        operazione.setPin(pin);
        operazione.setBoxAssociato(box);
        return operazioneRepository.save(operazione);
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
        if (box == null) {
            throw new IllegalStateException("Box non associato all'operazione");
        }

        if (box.getStatus() != BoxStatus.OCCUPIED) {
            throw new IllegalStateException("Box non occupato");
        }

        if (aperturaSuccesso) {
            // Apertura box riuscita: cambio stato box a AVAILABLE e operazione a SUCCESS
            box.setStatus(BoxStatus.AVAILABLE);
            operazione.setStato(StatoOperazione.SUCCESS);
        } else {
            // Apertura fallita: operazione chiusa con FAILED, box rimane OCCUPIED
            operazione.setStato(StatoOperazione.FAILED);
        }

        boxRepository.save(box);
        return operazioneRepository.save(operazione);
    }


}

