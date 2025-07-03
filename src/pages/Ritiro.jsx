import { useState } from 'react';
import api from '../services/api';
import AnimatedButton from '../components/AnimatedButton';
import FeedbackMessage from '../components/FeedBackMessage';

export default function Ritiro() {
  const [operazioneId, setOperazioneId] = useState(null);
  const [pin, setPin] = useState('');
  const [boxId, setBoxId] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState('start'); // start, verify, openBox, completed
  const [loading, setLoading] = useState(false);
  const [operazioneAggiornata, setOperazioneAggiornata] = useState(null); // <-- nuovo stato

  const isValidPin = (pin) => /^\d{6}$/.test(pin);

  const startRitiro = async () => {
    setLoading(true);
    try {
      const res = await api.post('/withdraw/start');
      if (res.data.success) {
        setOperazioneId(res.data.data.id);
        setStep('verify');
        setMessage('');
        setPin('');
        setBoxId('');
        setOperazioneAggiornata(null);
      } else {
        setMessage(res.data.message || 'Errore inizio ritiro');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Errore inizio ritiro');
    } finally {
      setLoading(false);
    }
  };

  const verifyPinAndBox = async () => {
    if (!pin || !boxId) {
      setMessage('Inserisci PIN e Box ID');
      return;
    }
    if (!isValidPin(pin)) {
      setMessage('Il PIN deve essere composto da 6 cifre');
      return;
    }

    

  console.log('operazioneId:', operazioneId);
  console.log('pin:', pin);
  console.log('boxId:', boxId, 'parsed:', parseInt(boxId, 10));

    setLoading(true);
    try {
      const res = await api.post(`/withdraw/${operazioneId}/verify-pin-and-box`, {
        pin,
        boxId: parseInt(boxId, 10),
      });
      if (res.data.success) {
        setStep('openBox');
        setMessage('PIN e Box verificati correttamente');
      } else {
        setMessage(res.data.message || 'Errore durante la verifica');
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message
          ? `Errore: ${error.response.data.message}`
          : error.message
          ? `Errore: ${error.message}`
          : 'Errore durante la comunicazione con il server'
      );
    } finally {
      setLoading(false);
    }
  };

  const openBox = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/withdraw/${operazioneId}/open-box`, {
        pin,
        aperturaSuccesso: true,
      });
      if (res.data.success) {
        setOperazioneAggiornata(res.data.data); // salva i dati aggiornati
        setMessage(res.data.message);
        setStep('completed');
      } else {
        setMessage(res.data.message || 'Contattare assistenza');
      }
    } catch (err) {
      setMessage(
        err.response?.data?.message
          ? `Errore: ${err.response.data.message}`
          : err.message
          ? `Errore: ${err.message}`
          : 'Errore apertura box'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Ritiro</h1>

      {step === 'start' && (
        <AnimatedButton onClick={startRitiro} disabled={loading}>
          {loading ? 'Caricamento...' : 'Inizia Ritiro'}
        </AnimatedButton>
      )}

      {step === 'verify' && (
        <>
          <input
            type="number"
            placeholder="Box ID"
            value={boxId}
            onChange={(e) => setBoxId(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            disabled={loading}
          />
          <AnimatedButton onClick={verifyPinAndBox} disabled={loading}>
            {loading ? 'Verifica in corso...' : 'Verifica PIN e Box'}
          </AnimatedButton>
        </>
      )}

      {step === 'openBox' && (
        <AnimatedButton onClick={openBox} disabled={loading}>
          {loading ? 'Apertura in corso...' : 'Apri Box'}
        </AnimatedButton>
      )}

      {step === 'completed' && operazioneAggiornata && (
        <div>
          <p>{message}</p>
          <p>
            Box ID: {operazioneAggiornata.boxAssociato.id} (Num: {operazioneAggiornata.boxAssociato.numBox}) - Stato:{' '}
            {operazioneAggiornata.boxAssociato.status}
          </p>
          <AnimatedButton onClick={startRitiro} disabled={loading}>
            Nuovo Ritiro
          </AnimatedButton>
        </div>
      )}

      {message && step !== 'completed' && <FeedbackMessage text={message} />}
    </div>
  );
}
