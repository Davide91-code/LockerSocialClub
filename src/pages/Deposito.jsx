import { useState } from 'react';
import api from '../services/api';
import PinForm from '../components/PinForm';
import FadeUpContainer from '../components/FadeUpContainer';
import AnimatedButton from '../components/AnimatedButton';
import FeedbackMessage from '../components/FeedBackMessage';
import BoxGrid from '../components/BoxGrid';

export default function Deposit() {
  const [operazioneId, setOperazioneId] = useState(null);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState('start');
  const [pin, setPin] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const startDeposito = async () => {
    try {
      const res = await api.post('/deposit/start');
      if (res.data.success) {
        setOperazioneId(res.data.data.id);
        setStep('selectBox');
      }
    } catch {
      setMessage('Errore nel creare operazione deposito');
    }
  };

  const selectBox = async (box) => {
    try {
      const res = await api.post(`/deposit/${operazioneId}/select-box`, { boxId: box.id });
      if (res.data.success) {
        setPin(''); // reset pin per sicurezza
        setStep('setPin');
      } else {
        setMessage(res.data.message);
      }
    } catch {
      setMessage('Errore nella selezione box');
    }
  };

  const onPinSuccess = (enteredPin) => {
    setPin(enteredPin);
    setStep('openBox');
  };

  const openBox = async () => {
    try {
      const res = await api.post(`/deposit/${operazioneId}/open-box`, {
        pin,
        aperturaSuccesso: true,
      });
      if (res.data.success) {
        setMessage('Box aperto con successo');
        setStep('completed');
        setRefreshKey(prev => prev + 1); // forza refresh della griglia
      } else {
        setMessage(res.data.message);
      }
    } catch {
      setMessage("Errore nell'apertura box");
    }
  };

  return (
    <FadeUpContainer>
      <h1>Deposito</h1>
      {step === 'start' &&
        <AnimatedButton onClick={startDeposito}>Inizia Deposito</AnimatedButton>}
      {step === 'selectBox' && operazioneId &&
        <BoxGrid
          operazioneId={operazioneId}
          refreshKey={refreshKey}
          onBoxSelected={selectBox}
        />}
      {step === 'setPin' && operazioneId &&
        <PinForm operazioneId={operazioneId} onPinSuccess={onPinSuccess} />}
      {step === 'openBox' &&
        <AnimatedButton onClick={openBox}>Apri Box</AnimatedButton>}
      {message && <FeedbackMessage text={message} />}
    </FadeUpContainer>
  );
}

