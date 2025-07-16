import React, { useState } from 'react';
import api from '../services/api';
import PinForm from '../components/PinForm';
import FadeUpContainer from '../components/FadeUpContainer';
import AnimatedButton from '../components/AnimatedButton';
import FeedBackMessage from '../components/FeedBackMessage';
import BoxGrid from '../components/BoxGrid';
import BackToHomeButton from '../components/BackToHomeButton';
import BackButton from '../components/BackButton';
import { useTranslation } from 'react-i18next';

export default function Deposit() {
  const [operazioneId, setOperazioneId] = useState(null);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState('start');
  const [pin, setPin] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedBoxId, setSelectedBoxId] = useState(null);
  const [selectedNumBox, setSelectedNumBox] = useState(null);

  function renderMessage(message, t) {
  if (!message) return '';
  return typeof message === 'string' ? message : t(message.key, message.options);
}


  const { t } = useTranslation();

  const startDeposito = async () => {
    setMessage('');
    try {
      const res = await api.post('/deposit/start');
      setOperazioneId(res.data.data.id);
      setStep('selectBox');
      setSelectedBoxId(null);
      setSelectedNumBox(null);
    } catch {
      setMessage(t('startDepositError'));
    }
  };

  const selectBox = async (boxId, numBox) => {
    setMessage('');
    setSelectedBoxId(boxId);
    try {
      const res = await api.post(`/deposit/${operazioneId}/select-box`, { boxId });
      const { numBox: nb } = res.data;
      setSelectedNumBox(nb);
      setMessage({ key: 'boxReserved', options: { numBox: nb } });
      setStep('setPin');
    } catch (err) {
      setMessage(err.response?.data?.message || t('selectBoxError'));
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
        setMessage({ key: 'depositCompleted', options: { numBox: selectedNumBox } }); 
        setStep('completed');
        setRefreshKey(prev => prev + 1);
      } else {
        setMessage (t('openBoxError'));
      }
    } catch {
      setMessage (t('openBoxError'));
    }
  };

  return (
    <FadeUpContainer>
      <h1>{t('deposit')}</h1>

      {step === 'start' && (
      <div className="step-container">
        <AnimatedButton style={{
              fontSize: '2.5rem',
              padding: '2rem 1rem',
              width: '100%',
              borderRadius: '16px',
              maxWidth: 'none',
              margin: 0,
            }} onClick={startDeposito}>{t('startDeposit')}</AnimatedButton>
      </div>
      )}

      {step === 'selectBox' && operazioneId && (
      <div className="step-container">
        <BoxGrid
          key={refreshKey}
          refreshKey={refreshKey}
          onBoxSelected={selectBox}
          selectedBoxId={selectedBoxId}
          mode="deposit"
         />
        <BackButton label={t('back')} />
                </div>
      )}

      {step === 'setPin' && (
      <div className="step-container">
        <PinForm operazioneId={operazioneId} onPinSuccess={onPinSuccess} />
      <BackButton label={t('back')}/>
              </div>
      )}

      {step === 'openBox' && (
      <div className="step-container">
        <AnimatedButton style={{
              fontSize: '2.5rem',
              padding: '2rem 1rem',
              width: '100%',
              borderRadius: '16px',
              maxWidth: 'none',
              margin: 0,
            }} onClick={openBox}>{t('openBox', { numBox: selectedNumBox })}</AnimatedButton>
      <BackButton label={t('back')}/>
              </div>
      )}

      {step === 'completed' && (
  <div className="step-container">
    <FeedBackMessage text={renderMessage(message, t)} />
    <AnimatedButton style={{
              fontSize: '2.5rem',
              padding: '2rem 1rem',
              width: '100%',
              borderRadius: '16px',
              maxWidth: 'none',
              margin: 0,
            }} onClick={startDeposito}>{t('newDeposit')}</AnimatedButton>
    <BackToHomeButton label={`${t('backToHome')}`}/>
  </div>
)}


      {message && step !== 'completed' &&
        <FeedBackMessage text={renderMessage(message, t)} />
      }
    </FadeUpContainer>
  );
}
