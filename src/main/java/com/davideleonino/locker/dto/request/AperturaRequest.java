package com.davideleonino.locker.dto.request;
import jakarta.validation.constraints.NotNull;

public class AperturaRequest { // dto fittizio utile per test interno al caso, ma non impiegato dai metodi ufficiali

    @NotNull(message = "Il flag aperturaSuccesso è obbligatorio")

    private Boolean aperturaSuccesso;

    public Boolean getAperturaSuccesso() {
        return aperturaSuccesso;
    }

    public void setAperturaSuccesso(Boolean aperturaSuccesso) {
        this.aperturaSuccesso = aperturaSuccesso;
    }
}
