// DepositoRequest.java
package com.davideleonino.locker.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class StartDepositoRequest {

    @NotNull
    private Integer boxId;

    @NotNull
    @Pattern(regexp = "\\d{6}", message = "Il PIN deve essere esattamente di 6 cifre numeriche.")
    private String pin;

    public Integer getBoxId() {
        return boxId;
    }

    public void setBoxId(Integer boxId) {
        this.boxId = boxId;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }
}

