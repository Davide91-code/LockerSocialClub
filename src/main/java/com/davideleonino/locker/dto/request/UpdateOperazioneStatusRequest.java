package com.davideleonino.locker.dto.request;

import com.davideleonino.locker.model.StatoOperazione;
import jakarta.validation.constraints.NotNull;

public class UpdateOperazioneStatusRequest {

    @NotNull(message = "Lo stato dell'operazione non può essere nullo")
    private StatoOperazione status;

    public UpdateOperazioneStatusRequest() {}

    public StatoOperazione getStatus() { return status; }
    public void setStatus(StatoOperazione status) { this.status = status; }
}
