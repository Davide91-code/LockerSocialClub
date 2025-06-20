package com.davideleonino.locker.controller;

import com.davideleonino.locker.dto.request.ApriBoxRequest;
import com.davideleonino.locker.dto.request.ChangeStatusRequest;
import com.davideleonino.locker.dto.request.StartDepositoRequest;
import com.davideleonino.locker.dto.request.PinRequest;
import com.davideleonino.locker.dto.request.UpdateOperazioneStatusRequest;

import com.davideleonino.locker.dto.response.ApiResponseDto;
import com.davideleonino.locker.model.Box;
import com.davideleonino.locker.model.BoxStatus;
import com.davideleonino.locker.model.Operazione;
import com.davideleonino.locker.service.BoxService;
import com.davideleonino.locker.service.OperazioneService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/locker")
public class LockerController {

    @Autowired
    private BoxService boxService;

    @Autowired
    private OperazioneService operazioneService;

    // Tutte le GET confermate


    @GetMapping("/boxes")
    public ResponseEntity<ApiResponseDto> getAllBoxes() {
        List<Box> boxes = boxService.getAllBoxes();
        return ResponseEntity.ok(new ApiResponseDto(true, "Lista di tutti i box", boxes));
    }

    @GetMapping("/boxes/available")
    public ResponseEntity<ApiResponseDto> getAvailableBoxes() {
        List<Box> boxes = boxService.getAvailableBoxes();
        return ResponseEntity.ok(new ApiResponseDto(true, "Lista box disponibili", boxes));
    }

    @GetMapping("/boxes/{id}")
    public ResponseEntity<ApiResponseDto> getBoxById(@PathVariable Integer id) {
        return boxService.getBoxById(id)
                .map(box -> ResponseEntity.ok(new ApiResponseDto(true, "Box trovato", box)))
                .orElse(ResponseEntity.status(404).body(new ApiResponseDto(false, "Box non trovato", null)));
    }

    // Unica PUT

    @PutMapping("/boxes/{id}/status")
    public ResponseEntity<ApiResponseDto> changeBoxStatus(
            @PathVariable Integer id,
            @Valid @RequestBody ChangeStatusRequest request
    ) {
        return boxService.changeBoxStatus(id, request.getStatus())
                .map(box -> ResponseEntity.ok(new ApiResponseDto(true, "Stato box aggiornato", box)))
                .orElse(ResponseEntity.status(404).body(new ApiResponseDto(false, "Box non trovato", null)));
    }

    //  OPERAZIONI
    // DEPOSITO IN 4 FASI

    @PostMapping("/deposit/start")
    public ResponseEntity<ApiResponseDto> startDeposito() {
        Operazione operazione = operazioneService.creaOperazioneDepositoVuota();
        return ResponseEntity.ok(new ApiResponseDto(true, "Operazione creata", operazione));
    }

    @PostMapping("/deposit/{id}/select-box")
    public ResponseEntity<ApiResponseDto> selezionaBox(@PathVariable Integer id, @RequestBody Map<String, Integer> body) {
        Integer boxId = body.get("boxId");
        Operazione opAggiornata = operazioneService.assegnaBoxAOperazione(id, boxId);
        return ResponseEntity.ok(new ApiResponseDto(true, "Box assegnato", opAggiornata));
    }


    @PostMapping("/deposit/{id}/set-pin")
    public ResponseEntity<ApiResponseDto> setPin(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String pin = body.get("pin");

        Optional<Operazione> opOpt = operazioneService.findById(id);
        if (opOpt.isEmpty()) {
            return ResponseEntity.status(404).body(new ApiResponseDto(false, "Operazione non trovata", null));
        }

        Operazione operazione = opOpt.get();
        if (operazione.getPin() != null && !operazione.getPin().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponseDto(false, "PIN già impostato", operazione));
        }

        Operazione op = operazioneService.impostaPinOperazione(id, pin);
        return ResponseEntity.ok(new ApiResponseDto(true, "PIN salvato", op));
    }

    @PostMapping("/deposit/{id}/open-box")
    public ResponseEntity<ApiResponseDto> apriBox(
            @PathVariable Integer id,
            @Valid @RequestBody ApriBoxRequest request) {
        try {
            Operazione nuovaOp = operazioneService.apriBox(id, request.getPin(), request.getAperturaSuccesso());

            String msg = request.getAperturaSuccesso()
                    ? "Apertura box completata con successo"
                    : "Apertura fallita: nuova operazione creata";

            return ResponseEntity.ok(new ApiResponseDto(true, msg, nuovaOp));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponseDto(false, "Errore: " + e.getMessage(), null));
        } catch (Exception e) {
            e.printStackTrace();  // Log completo in console per debug
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponseDto(false, "Errore interno del server", null));
        }
    }


    // RITIRO IN 3 FASI

    @PostMapping("/withdraw/start")
    public ResponseEntity<ApiResponseDto> startRitiro() {
        Operazione operazione = operazioneService.creaOperazioneRitiroVuota();
        return ResponseEntity.ok(new ApiResponseDto(true, "Operazione di ritiro creata", operazione));
    }

    @PostMapping("/withdraw/{id}/set-pin-and-box")
    public ResponseEntity<ApiResponseDto> setPinAndBoxRitiro(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> body) {

        String pin = (String) body.get("pin");
        Integer boxId;
        try {
            boxId = (Integer) body.get("boxId");
        } catch (ClassCastException e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto(false, "BoxId deve essere un intero", null));
        }

        try {
            Operazione operazioneAggiornata = operazioneService.impostaPinEBoxRitiro(id, pin, boxId);
            return ResponseEntity.ok(new ApiResponseDto(true, "PIN e box associati correttamente", operazioneAggiornata));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto(false, e.getMessage(), null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponseDto(false, "Errore interno del server", null));
        }
    }

    @PostMapping("/withdraw/{id}/open-box")
    public ResponseEntity<ApiResponseDto> apriBoxRitiro(
            @PathVariable Integer id,
            @Valid @RequestBody ApriBoxRequest request) {
        try {
            Operazione operazioneAggiornata = operazioneService.apriBoxRitiro(id, request.getPin(), request.getAperturaSuccesso());

            String msg = request.getAperturaSuccesso()
                    ? "Apertura box riuscita, ritiro completato"
                    : "Apertura fallita, contattare assistenza";

            return ResponseEntity.ok(new ApiResponseDto(true, msg, operazioneAggiornata));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponseDto(false, "Errore: " + e.getMessage(), null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponseDto(false, "Errore interno del server", null));
        }
    }


}
