package com.davideleonino.locker.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "statusbox")
public class Operazione {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = true) // avendo reso il pin nullable, il rischio di debolezza aumenta in caso di distrazione:
    // ricordare di usare valida.pin in ogni metodo successivo. Inoltre ho modificato il valore nel DB MYSQL da shell, in maniera tale che accetti null all'inizio.
    private String pin; // ex codiceAccesso

    @ManyToOne
    @JoinColumn(name = "box_id")
    private Box boxAssociato;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoOperazione tipoOperazione;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatoOperazione stato;

    @Column(nullable = false)
    private LocalDateTime dataOrario;

    public Operazione() {}

    public Operazione(Integer id, String pin, Box boxAssociato, TipoOperazione tipoOperazione, StatoOperazione stato, LocalDateTime dataOrario) {
        this.id = id;
        this.pin = pin;
        this.boxAssociato = boxAssociato;
        this.tipoOperazione = tipoOperazione;
        this.stato = stato;
        this.dataOrario = dataOrario;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    public Box getBoxAssociato() {
        return boxAssociato;
    }

    public void setBoxAssociato(Box boxAssociato) {
        this.boxAssociato = boxAssociato;
    }

    public TipoOperazione getTipoOperazione() {
        return tipoOperazione;
    }

    public void setTipoOperazione(TipoOperazione tipoOperazione) {
        this.tipoOperazione = tipoOperazione;
    }

    public StatoOperazione getStato() {
        return stato;
    }

    public void setStato(StatoOperazione stato) {
        this.stato = stato;
    }

    public LocalDateTime getDataOrario() {
        return dataOrario;
    }

    public void setDataOrario(LocalDateTime dataOrario) {
        this.dataOrario = dataOrario;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Operazione)) return false;
        Operazione that = (Operazione) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
