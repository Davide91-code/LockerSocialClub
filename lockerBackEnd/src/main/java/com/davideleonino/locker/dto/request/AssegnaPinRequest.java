package com.davideleonino.locker.dto.request;

import jakarta.validation.constraints.NotBlank;

public class AssegnaPinRequest {


    @NotBlank(message = "ID box non può essere nullo")
    private Integer boxId;

    @NotBlank(message = "PIN non può essere vuoto")
    private String pin;

    public AssegnaPinRequest() {}

    public Integer getBoxId() { return boxId; }
    public void setBoxId(Integer boxId) { this.boxId = boxId; }

    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }
}
