import React, { useState } from 'react';
import api from '../services/api';
import AnimatedButton from '../components/AnimatedButton';
import FadeUpContainer from '../components/FadeUpContainer';
import FeedBackMessage from '../components/FeedBackMessage';
import BoxGrid from '../components/BoxGrid';

export default function Ritiro() {
  const [operazioneId, setOperazioneId] = useState(null);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState('start'); // start, selectBox, verify, openBox, completed
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState({ boxId: null, numBox: null, pin: '' });
  const [operazioneAggiornata, setOperazioneAggiornata] = useState(null);

  const startRitiro = async () => {
    setMessage('');
    setLoading(true);
    try {
      const res = await api.post('/withdraw/start');
      setOperazioneId(res.data.data.id);
      setStep('selectBox');
    } catch (e) {
      setMessage(e.response?.data?.message || 'Errore inizio ritiro');
    } finally {
      setLoading(false);
    }
  };

  const selectBox = (boxId, numBox) => {
    setSelection(sel => ({ ...sel, boxId, numBox }));
    setStep('verify');
    setMessage(`Box #${numBox} selezionato, inserisci PIN`);
  };

  const verifyPinAndBox = async () => {
    const { boxId, pin } = selection;
    if (!boxId || !/^\d{6}$/.test(pin)) {
      setMessage('Inserisci Box e PIN validi (6 cifre)');
      return;
    }
    setLoading(true);
    try {
      await api.post(`/withdraw/${operazioneId}/verify-pin-and-box`, {
        pin,
        boxId
      });
      setStep('openBox');
      setMessage('Verifica riuscita — ora apri il box');
    } catch (e) {
      setMessage(e.response?.data?.message || 'Errore verifica');
      setStep('verify');
    } finally {
      setLoading(false);
    }
  };

  const openBox = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/withdraw/${operazioneId}/open-box`, {
        pin: selection.pin,
        aperturaSuccesso: true
      });
      setOperazioneAggiornata(res.data.data);
      setMessage(res.data.message || 'Ritiro completato');
      setStep('completed');
    } catch (e) {
      setMessage(e.response?.data?.message || 'Errore apertura box');
      setStep('verify');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeUpContainer>
      <h1>Ritiro</h1>
      {step === 'start' && (
        <AnimatedButton onClick={startRitiro} disabled={loading}>
          {loading ? '...' : 'Inizia Ritiro'}
        </AnimatedButton>
      )}

      {step === 'selectBox' && (
        <BoxGrid
          refreshKey={operazioneId}
          selectedBoxId={selection.boxId}
          onBoxSelected={selectBox}
          mode="withdrawal"
        />
      )}

      {step === 'verify' && (
        <>
          <p>Box selezionato: #{selection.numBox}</p>
          <input
            type="password"
            placeholder="Inserisci PIN (6 cifre)"
            value={selection.pin}
            maxLength={6}
            onChange={e => setSelection(sel => ({ ...sel, pin: e.target.value }))}
            disabled={loading}
          />
          <AnimatedButton onClick={verifyPinAndBox} disabled={loading}>
            Verifica PIN
          </AnimatedButton>
        </>
      )}

      {step === 'openBox' && (
        <AnimatedButton onClick={openBox} disabled={loading}>
          Apri Box #{selection.numBox}
        </AnimatedButton>
      )}

      {step === 'completed' && operazioneAggiornata && (
        <>
          <FeedBackMessage text={`Ritiro completato nel Box #${selection.numBox}!`} />
          <AnimatedButton onClick={startRitiro} disabled={loading}>
            Nuovo Ritiro
          </AnimatedButton>
        </>
      )}

      {message && <FeedBackMessage text={message} />}
    </FadeUpContainer>
  );
}
