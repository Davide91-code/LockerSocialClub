package com.davideleonino.locker.dto.request;

import com.davideleonino.locker.model.BoxStatus;
import jakarta.validation.constraints.NotNull;

public class ChangeStatusRequest {

    @NotNull(message = "Lo stato non può essere nullo")
    private BoxStatus status;

    public ChangeStatusRequest() {}

    public BoxStatus getStatus() { return status; }
    public void setStatus(BoxStatus status) { this.status = status; }
}
