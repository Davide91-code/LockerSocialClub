import { useState } from 'react';
import api from '../services/api';
import FadeUpContainer from '../components/FadeUpContainer';
import AnimatedButton from '../components/AnimatedButton';
import FeedbackMessage from '../components/FeedBackMessage';
import PinFormRitiro from '../components/PinFormRitiro';
import BoxGrid from '../components/BoxGrid';

export default function Ritiro() {
  const [operazioneId, setOperazioneId] = useState(null);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState('start');
  const [pin, setPin] = useState('');
  const [boxSelected, setBoxSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const startRitiro = async () => {
    setLoading(true);
    try {
      const res = await api.post('/withdraw/start');
      if (res.data.success) {
        setOperazioneId(res.data.data.id);
        setStep('selectBox');
        setMessage('');
      }
    } catch {
      setMessage('Errore inizio ritiro');
    } finally {
      setLoading(false);
    }
  };

  const onBoxSelected = (box) => {
    setBoxSelected(box);
    setStep('setPinBox');
    setMessage(`Selezionato Box ${box.numBox}`);
  };

  const setPinAndBox = async () => {
    if (!pin || !boxSelected) {
      setMessage('Inserisci PIN e seleziona un box');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post(`/withdraw/${operazioneId}/set-pin-and-box`, {
        pin,
        boxId: boxSelected.id,
      });
      if (res.data.success) {
        setStep('openBox');
        setMessage('PIN e Box associati correttamente');
      } else {
        setMessage(res.data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Errore nell'associazione PIN e Box");
    } finally {
      setLoading(false);
    }
  };

  const openBox = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/withdraw/${operazioneId}/open-box`, {
        pin,
        aperturaSuccesso: true
      });
      if (res.data.success) {
        setMessage('Sportello aperto, ritira il contenuto');
        setStep('completed');
        setRefreshKey(prev => prev + 1);
      } else {
        setMessage('Contattare assistenza');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Errore apertura box');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeUpContainer>
      <h1>Ritiro</h1>
      {step === 'start' &&
        <AnimatedButton onClick={startRitiro} disabled={loading}>
          {loading ? 'Caricamento...' : 'Inizia Ritiro'}
        </AnimatedButton>}
      {step === 'selectBox' && operazioneId &&
        <BoxGrid
          operazioneId={operazioneId}
          refreshKey={refreshKey}
          onBoxSelected={onBoxSelected}
        />}
      {step === 'setPinBox' && boxSelected &&
        <>
          <p>Hai selezionato: Box {boxSelected.numBox}</p>
          <PinFormRitiro pin={pin} onChange={setPin} />
          <AnimatedButton onClick={setPinAndBox} disabled={loading}>
            {loading ? 'Associazione in corso...' : 'Associa PIN e Box'}
          </AnimatedButton>
        </>}
      {step === 'openBox' &&
        <AnimatedButton onClick={openBox} disabled={loading}>
          {loading ? 'Apertura in corso...' : 'Apri Box'}
        </AnimatedButton>}
      {message && <FeedbackMessage text={message} />}
    </FadeUpContainer>
  );
}
