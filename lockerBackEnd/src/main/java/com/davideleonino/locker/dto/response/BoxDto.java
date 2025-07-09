package com.davideleonino.locker.dto.response;

import com.davideleonino.locker.model.BoxStatus;

public class BoxDto {
    private Integer id;
    private Integer numBox;
    private BoxStatus status;

    public BoxDto() {}

    public BoxDto(Integer id, Integer numBox, BoxStatus status) {
        this.id = id;
        this.numBox = numBox;
        this.status = status;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getNumBox() { return numBox; }
    public void setNumBox(Integer numBox) { this.numBox = numBox; }

    public BoxStatus getStatus() { return status; }
    public void setStatus(BoxStatus status) { this.status = status; }
}
