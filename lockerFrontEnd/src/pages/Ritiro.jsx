import React, { useState } from 'react';
import api from '../services/api';
import AnimatedButton from '../components/AnimatedButton';
import FadeUpContainer from '../components/FadeUpContainer';
import FeedBackMessage from '../components/FeedBackMessage';
import BoxGrid from '../components/BoxGrid';
import BackToHomeButton from '../components/BackToHomeButton';
import BackButton from '../components/BackButton';
import { useTranslation } from 'react-i18next';

export default function Ritiro() {
  const [operazioneId, setOperazioneId] = useState(null);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState('start'); 
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState({ boxId: null, numBox: null, pin: '' });
  const [operazioneAggiornata, setOperazioneAggiornata] = useState(null);
  const { t } = useTranslation();


  function renderMessage(message, t) {
  if (!message) return '';
  return typeof message === 'string' ? message : t(message.key, message.options);
}

  const startRitiro = async () => {
    setMessage('');
    setLoading(true);
    try {
      const res = await api.post('/withdraw/start');
      setOperazioneId(res.data.data.id);
      setStep('selectBox');
    } catch (e) {
      setMessage(e.response?.data?.message || t('errorStartWithdraw'));
    } finally {
      setLoading(false);
    }
  };

  const selectBox = (boxId, numBox) => {
    setSelection(sel => ({ ...sel, boxId, numBox }));
    setStep('verify');
    setMessage({ key: 'boxSelectedInsertPin', options: { numBox } }); 
  };

  const verifyPinAndBox = async () => {
    const { boxId, pin } = selection;
    if (!boxId || !/^\d{6}$/.test(pin)) {
      setMessage(t('insertValidBoxPin')); 
      return;
    }
    setLoading(true);
    try {
      await api.post(`/withdraw/${operazioneId}/verify-pin-and-box`, {
        pin,
        boxId
      });
      setStep('openBox');
      setMessage({ key: 'verificationSuccessOpenBox'}); // ({ key: 'verificationSuccessOpenBox'});
    } catch (e) {
      setMessage(e.response?.data?.message || t('errorVerification'));
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
      setMessage ({ key: 'postWithdraw', options: { numBox: selection.numBox } }); //tornare ({ key: 'postWithdraw', options: { numBox: selection.numBox } }); 
      setStep('completed');
    } catch (e) {
      setMessage(e.response?.data?.message || t('errorOpenBox'));
      setStep('verify');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeUpContainer>
      <h1>{t('withdraw')}</h1>
      {step === 'start' && (
        <div className="step-container">
        <AnimatedButton style={{
              fontSize: '2.5rem',
              padding: '2rem 1rem',
              width: '100%',
              borderRadius: '16px',
              maxWidth: 'none',
              margin: 0,
            }} onClick={startRitiro} disabled={loading}>
          {loading ? '...' : t('startWithdraw')}
        </AnimatedButton>
        </div>
      )}

      {step === 'selectBox' && (
        <div className="step-container">
        <BoxGrid
          refreshKey={operazioneId}
          selectedBoxId={selection.boxId}
          onBoxSelected={selectBox}
          mode="withdrawal"
        />
        <BackButton label={`${t('back')}`} />
        </div>
      )}

      {step === 'verify' && (
        <div className="step-container">
          <p>{t('selectedBoxNumber', { numBox: selection.numBox })}</p>
          <input
            type="password"
            placeholder={t('insertPin6Digits')}
            value={selection.pin}
            maxLength={6}
            onChange={e => setSelection(sel => ({ ...sel, pin: e.target.value }))}
            disabled={loading}
          />
          <AnimatedButton onClick={verifyPinAndBox} disabled={loading}>
            {t('verifyPin')}
          </AnimatedButton>
        <BackButton label={`${t('back')}`} />
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
            }} onClick={openBox} disabled={loading}>
          {t('openBox')} #{selection.numBox}
        </AnimatedButton>
        <BackButton label={`${t('back')}`} />
        </div>
      )}

      {step === 'completed' && operazioneAggiornata && (
        <div className="step-container">
    <FeedBackMessage text={renderMessage(message, t)} />
    <AnimatedButton style={{
              fontSize: '2.5rem',
              padding: '2rem 1rem',
              width: '100%',
              borderRadius: '16px',
              maxWidth: 'none',
              margin: 0,
            }} onClick={startRitiro}>{t('newWithdraw')}</AnimatedButton>
    <BackToHomeButton label={`${t('backToHome')}`} />
        </div>
)}


      {message && step !== 'completed' &&
              <FeedBackMessage text={renderMessage(message, t)} />
            }
    </FadeUpContainer>
  );
}
