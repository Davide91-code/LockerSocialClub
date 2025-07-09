package com.davideleonino.locker.dto.response;

import com.davideleonino.locker.model.StatoOperazione;
import com.davideleonino.locker.model.TipoOperazione;

import java.time.LocalDateTime;

public class OperazioneDto {
    private Integer id;
    private String pin;
    private TipoOperazione tipoOperazione;
    private StatoOperazione stato;
    private LocalDateTime dataOrario;

    public OperazioneDto() {}

    public OperazioneDto(Integer id, String pin, TipoOperazione tipoOperazione, StatoOperazione stato, LocalDateTime dataOrario) {
        this.id = id;
        this.pin = pin;
        this.tipoOperazione = tipoOperazione;
        this.stato = stato;
        this.dataOrario = dataOrario;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }

    public TipoOperazione getTipoOperazione() { return tipoOperazione; }
    public void setTipoOperazione(TipoOperazione tipoOperazione) { this.tipoOperazione = tipoOperazione; }

    public StatoOperazione getStato() { return stato; }
    public void setStato(StatoOperazione stato) { this.stato = stato; }

    public LocalDateTime getDataOrario() { return dataOrario; }
    public void setDataOrario(LocalDateTime dataOrario) { this.dataOrario = dataOrario; }
}
