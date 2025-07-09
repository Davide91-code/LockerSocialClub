package com.davideleonino.locker.exception;

import com.davideleonino.locker.dto.response.ApiResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Gestione eccezioni Runtime, usate spesso nel service per errori di logica
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponseDto> handleRuntimeException(RuntimeException ex) {
        ApiResponseDto response = new ApiResponseDto(false, ex.getMessage(), null);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Gestione errori di validazione delle annotazioni jakarta.validation (@NotNull, @Min, ecc)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponseDto> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.joining("; "));

        ApiResponseDto response = new ApiResponseDto(false, "Errore di validazione: " + errors, null);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Gestione generica di tutte le altre eccezioni non previste (500). Volendo potremmo crearne di più personalizzate, ma in questo caso non ha senso
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseDto> handleGeneralException(Exception ex) {
        ApiResponseDto response = new ApiResponseDto(false, "Errore interno del server", null);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
