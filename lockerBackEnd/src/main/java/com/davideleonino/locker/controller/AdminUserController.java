package com.davideleonino.locker.controller;

import com.davideleonino.locker.dto.request.ChangeStatusRequest;
import com.davideleonino.locker.dto.request.LoginRequest;
import com.davideleonino.locker.dto.request.AssegnaPinRequest;
import com.davideleonino.locker.dto.response.ApiResponseDto;
import com.davideleonino.locker.model.AdminUser;
import com.davideleonino.locker.model.Box;
import com.davideleonino.locker.model.Operazione;
import com.davideleonino.locker.security.JwtUtil;
import com.davideleonino.locker.service.AdminUserService;
import com.davideleonino.locker.service.BoxService;

import com.davideleonino.locker.service.OperazioneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
public class AdminUserController {

    @Autowired
    private AdminUserService adminUserService;

    @Autowired
    private BoxService boxService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private OperazioneService operazioneService;

    @GetMapping("/boxes")
    public ResponseEntity<ApiResponseDto> getAllBoxes() {
        List<Box> boxes = boxService.getAllBoxes();
        return ResponseEntity.ok(new ApiResponseDto(true, "Lista di tutti i box", boxes));
    }

    @GetMapping("/operations/{id}") //utile per verificare lo stato di operazione (spostatre in admin controller)
    public ResponseEntity<ApiResponseDto> getOperazioneById(@PathVariable Integer id) {
        Optional<Operazione> operazioneOpt = operazioneService.findById(id);
        if (operazioneOpt.isPresent()) {
            return ResponseEntity.ok(new ApiResponseDto(true, "Operazione trovata", operazioneOpt.get()));
        } else {
            return ResponseEntity.status(404).body(new ApiResponseDto(false, "Operazione non trovata", null));
        }
    }

    @GetMapping("/operations")
    public ResponseEntity<ApiResponseDto> getOperations(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate
    ) {
        List<Operazione> ops = operazioneService.search(status, fromDate, toDate);
        return ResponseEntity.ok(new ApiResponseDto(true, "Registro operazioni", ops));
    }



    @PostMapping("/login")
    public ResponseEntity<ApiResponseDto> login(@Valid @RequestBody LoginRequest request) {
        Optional<AdminUser> admin = adminUserService.login(request.getUsername(), request.getPassword());
        if (admin.isPresent()) {
            String token = jwtUtil.generateToken(request.getUsername());
            // puoi includere il token nella response
            return ResponseEntity.ok(new ApiResponseDto(true, "Login effettuato con successo.",
                    Map.of("admin", admin.get(), "token", token)));
        } else {
            return ResponseEntity.status(401).body(new ApiResponseDto(false, "Credenziali non valide.", null));
        }
    }

    @PostMapping("/libera-box/{boxId}")
    public ResponseEntity<ApiResponseDto> liberaBox(@PathVariable Integer boxId) {
        boolean esito = boxService.liberaBox(boxId);
        return esito
                ? ResponseEntity.ok(new ApiResponseDto(true, "Box liberato con successo.", null))
                : ResponseEntity.badRequest().body(new ApiResponseDto(false, "Box non trovato.", null));
    }

    @PostMapping("/disabilita-box/{boxId}")
    public ResponseEntity<ApiResponseDto> disabilitaBox(@PathVariable Integer boxId) {
        boolean esito = boxService.disabilitaBox(boxId);
        return esito
                ? ResponseEntity.ok(new ApiResponseDto(true, "Box disabilitato con successo.", null))
                : ResponseEntity.badRequest().body(new ApiResponseDto(false, "Box non trovato.", null));
    }

    @PostMapping("/assegna-pin")
    public ResponseEntity<ApiResponseDto> assegnaPinManuale(@Valid @RequestBody AssegnaPinRequest request) {
        try {
            Optional<Operazione> operazioneOpt = boxService.assegnaPinManuale(request.getBoxId(), request.getPin());
            return operazioneOpt
                    .map(op -> ResponseEntity.ok(new ApiResponseDto(true, "PIN assegnato e box occupato.", op)))
                    .orElse(ResponseEntity.badRequest()
                            .body(new ApiResponseDto(false, "Box non trovato.", null)));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponseDto(false, "PIN non valido: " + ex.getMessage(), null));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponseDto> trovaAdmin(@RequestParam String username) {
        return adminUserService.trovaPerUsername(username)
                .map(admin -> ResponseEntity.ok(new ApiResponseDto(true, "Admin trovato", admin)))
                .orElse(ResponseEntity.status(404).body(new ApiResponseDto(false, "Admin non trovato", null)));
    }


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

    @PutMapping("/boxes/{id}/status")
    public ResponseEntity<ApiResponseDto> changeBoxStatus(
            @PathVariable Integer id,
            @Valid @RequestBody ChangeStatusRequest request
    ) {
        try {
            Box updatedBox = boxService.changeBoxStatus(id, request.getStatus());
            return ResponseEntity.ok(new ApiResponseDto(true, "Stato box aggiornato", updatedBox));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponseDto(false, e.getMessage(), null));
        }
    }



}
