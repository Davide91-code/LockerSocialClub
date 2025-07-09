import React, { useState } from 'react';
import api from '../services/api';
import PinForm from '../components/PinForm';
import FadeUpContainer from '../components/FadeUpContainer';
import AnimatedButton from '../components/AnimatedButton';
import FeedBackMessage from '../components/FeedBackMessage';
import BoxGrid from '../components/BoxGrid';

export default function Deposit() {
  const [operazioneId, setOperazioneId] = useState(null);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState('start');
  const [pin, setPin] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedBoxId, setSelectedBoxId] = useState(null);
  const [selectedNumBox, setSelectedNumBox] = useState(null);

  const startDeposito = async () => {
    setMessage('');
    try {
      const res = await api.post('/deposit/start');
      setOperazioneId(res.data.data.id);
      setStep('selectBox');
      setSelectedBoxId(null);
      setSelectedNumBox(null);
    } catch {
      setMessage('Errore nel creare operazione deposito');
    }
  };

  const selectBox = async (boxId, numBox) => {
    setMessage('');
    setSelectedBoxId(boxId);
    try {
      const res = await api.post(`/deposit/${operazioneId}/select-box`, { boxId });
      const { numBox: nb } = res.data;
      setSelectedNumBox(nb);
      setMessage(`Box #${nb} selezionato e riservato`);
      setStep('setPin');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Errore nella selezione box');
      setSelectedBoxId(null);
    }
  };

  const onPinSuccess = enteredPin => {
    setPin(enteredPin);
    setStep('openBox');
  };

  const openBox = async () => {
    setMessage('');
    try {
      const res = await api.post(`/deposit/${operazioneId}/open-box`, {
        pin,
        aperturaSuccesso: true
      });
      if (res.data.success) {
        setMessage(`Deposito completato nel Box #${selectedNumBox}!`);
        setStep('completed');
        setRefreshKey(prev => prev + 1);
      } else {
        setMessage(res.data.message || "Errore nell'apertura box");
      }
    } catch {
      setMessage("Errore nell'apertura box");
    }
  };

  return (
    <FadeUpContainer>
      <h1>Deposito</h1>

      {step === 'start' &&
        <AnimatedButton onClick={startDeposito}>Inizia Deposito</AnimatedButton>
      }

      {step === 'selectBox' && operazioneId &&
        <BoxGrid
          key={refreshKey}
          refreshKey={refreshKey}
          onBoxSelected={selectBox}
          selectedBoxId={selectedBoxId}
          mode="deposit"
        />
      }

      {step === 'setPin' &&
        <PinForm operazioneId={operazioneId} onPinSuccess={onPinSuccess} />
      }

      {step === 'openBox' &&
        <AnimatedButton onClick={openBox}>Apri Box #{selectedNumBox}</AnimatedButton>
      }

      {step === 'completed' &&
        <>
          <FeedBackMessage text={message} />
          <AnimatedButton onClick={startDeposito}>Nuovo Deposito</AnimatedButton>
        </>
      }

      {message && step !== 'completed' &&
        <FeedBackMessage text={message} />
      }
    </FadeUpContainer>
  );
}
