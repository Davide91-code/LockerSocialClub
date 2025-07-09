package com.davideleonino.locker.dto.request;

import jakarta.validation.constraints.NotBlank;

public class PinRequest {

    @NotBlank(message = "Il PIN non può essere vuoto")
    private String pin;

    public PinRequest() {}

    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }
}
