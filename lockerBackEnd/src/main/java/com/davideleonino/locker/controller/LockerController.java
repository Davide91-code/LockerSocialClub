package com.davideleonino.locker.controller;

import com.davideleonino.locker.dto.request.ApriBoxRequest;
import com.davideleonino.locker.dto.request.ChangeStatusRequest;
import com.davideleonino.locker.dto.request.StartDepositoRequest;
import com.davideleonino.locker.dto.request.PinRequest;
import com.davideleonino.locker.dto.request.UpdateOperazioneStatusRequest;

import com.davideleonino.locker.dto.response.ApiResponseDto;
import com.davideleonino.locker.dto.response.BoxDto;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/locker")
public class LockerController {

    @Autowired
    private BoxService boxService;

    @Autowired
    private OperazioneService operazioneService;

    // Tutte le GET confermate



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

    /*
    @PutMapping("/boxes/{id}/status")
    public ResponseEntity<ApiResponseDto> changeBoxStatus(
            @PathVariable Integer id,
            @Valid @RequestBody ChangeStatusRequest request
    ) {
        return boxService.changeBoxStatus(id, request.getStatus())
                .map(box -> ResponseEntity.ok(new ApiResponseDto(true, "Stato box aggiornato", box)))
                .orElse(ResponseEntity.status(404).body(new ApiResponseDto(false, "Box non trovato", null)));
    }

     */

    @GetMapping("/boxes/occupied")
    public ResponseEntity<ApiResponseDto> getOccupiedBoxes() {
        List<Box> occupiedBoxes = boxService.getBoxesByStatus(BoxStatus.OCCUPIED);
        List<BoxDto> boxDtos = occupiedBoxes.stream()
                .map(box -> new BoxDto(box.getId(), box.getNumBox(), box.getStatus()))
                .collect(Collectors.toList());

        ApiResponseDto response = new ApiResponseDto(true, "Box occupati", boxDtos);
        return ResponseEntity.ok(response);
    }



    //  OPERAZIONI
    // DEPOSITO IN 4 FASI

    @PostMapping("/deposit/start")
    public ResponseEntity<ApiResponseDto> startDeposito() {
        Operazione operazione = operazioneService.creaOperazioneDepositoVuota();
        return ResponseEntity.ok(new ApiResponseDto(true, "Operazione creata", operazione));
    }

    /*

    @PostMapping("/deposit/{id}/select-box")
    public ResponseEntity<ApiResponseDto> selezionaBox(@PathVariable Integer id, @RequestBody Map<String, Integer> body) {
        Integer boxId = body.get("boxId");
        if (boxId == null) {
            return ResponseEntity.badRequest().body(new ApiResponseDto(false, "boxId mancante", null));
        }

        Operazione opAggiornata = operazioneService.assegnaBoxAOperazione(id, boxId);
        return ResponseEntity.ok(new ApiResponseDto(true, "Box assegnato", opAggiornata));
    }

     */

    @PostMapping("/deposit/{operazioneId}/select-box")
    public ResponseEntity<Object> selectBox(
            @PathVariable Integer operazioneId,
            @RequestBody Map<String, Integer> body
    ) {
        try {
            Integer boxId = body.get("boxId");
            Operazione op = operazioneService.assegnaBoxAOperazione(operazioneId, boxId);
            Box b = op.getBoxAssociato();

            Map<String, Object> dto = Map.of(
                    "operazioneId", op.getId(),
                    "boxId", b.getId(),
                    "numBox", b.getNumBox(),
                    "boxStatus", b.getStatus()
            );
            return ResponseEntity.ok(dto);

        } catch (IllegalArgumentException | IllegalStateException e) {
            Map<String, String> error = Map.of("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
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




    /*
    @PostMapping("/withdraw/{id}/verify-pin-and-box")
    public ResponseEntity<ApiResponseDto> verificaPinEBox(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> body) {



        String pin = (String) body.get("pin");
        Object boxIdObj = body.get("boxId");
        Integer boxId;

        System.out.println("DEBUG verificaPinEBox: id=" + id + ", pin=" + pin + ", boxId=" + boxIdObj);

        if (boxIdObj instanceof Number) {
            boxId = ((Number) boxIdObj).intValue();
        } else {
            return ResponseEntity.badRequest().body(new ApiResponseDto(false, "BoxId deve essere un numero intero", null));
        }

        try {
            System.out.println("DEBUG before verificaPinEBox call with id=" + id + ", pin=" + pin + ", boxId=" + boxId);
            operazioneService.verificaPinEBox(id, pin, boxId);
            System.out.println("DEBUG verificaPinEBox succeeded");
            return ResponseEntity.ok(new ApiResponseDto(true, "PIN e Box verificati correttamente", null));
        } catch (IllegalArgumentException | IllegalStateException e) {
            System.out.println("DEBUG verificaPinEBox error: " + e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponseDto(false, e.getMessage(), null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponseDto(false, "Errore interno del server", null));
        }

    }

     */

    @PostMapping("/withdraw/{id}/verify-pin-and-box")
    public ResponseEntity<ApiResponseDto> verificaPinEBox(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> body) {

        String pin = null;
        Integer boxId = null;

        try {
            pin = (String) body.get("pin");
            Object boxIdObj = body.get("boxId");

            System.out.println("DEBUG verificaPinEBox: id=" + id + ", pin=" + pin + ", boxId=" + boxIdObj);

            if (pin == null || pin.isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponseDto(false, "PIN è obbligatorio", null));
            }

            if (boxIdObj instanceof Number) {
                boxId = ((Number) boxIdObj).intValue();
            } else {
                return ResponseEntity.badRequest().body(new ApiResponseDto(false, "BoxId deve essere un numero intero", null));
            }
        } catch (ClassCastException e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto(false, "Formato dati non valido", null));
        }

        try {
            System.out.println("DEBUG before verificaPinEBox call with id=" + id + ", pin=" + pin + ", boxId=" + boxId);
            operazioneService.verificaPinEBox(id, pin, boxId);
            System.out.println("DEBUG verificaPinEBox succeeded");
            return ResponseEntity.ok(new ApiResponseDto(true, "PIN e Box verificati correttamente", null));
        } catch (IllegalArgumentException | IllegalStateException e) {
            System.out.println("DEBUG verificaPinEBox error: " + e.getMessage());
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
