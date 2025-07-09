package com.davideleonino.locker.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ApriBoxRequest {

    @NotBlank(message = "Il PIN non può essere vuoto")
    private String pin;

    @NotNull(message = "Il flag aperturaSuccesso è obbligatorio")
    private Boolean aperturaSuccesso;

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    public Boolean getAperturaSuccesso() {
        return aperturaSuccesso;
    }

    public void setAperturaSuccesso(Boolean aperturaSuccesso) {
        this.aperturaSuccesso = aperturaSuccesso;
    }
}

