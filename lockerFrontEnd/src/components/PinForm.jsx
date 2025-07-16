import { useState } from 'react';
import api from '../services/api';
import PinPad from './PinPad';
import FadeUpContainer from './FadeUpContainer';
import { useTranslation } from 'react-i18next';

export default function PinForm({ operazioneId, onPinSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pin.length < 6) {
      setError(t('pinMinLengthError'));
      return;
    }

    try {
      const response = await api.post(`/deposit/${operazioneId}/set-pin`, { pin });
      
      if (response.data.success) {
        setSuccess(t('boxOpenedSuccess'));
        setError('');
        onPinSuccess(pin);  // <-- qui chiami onPinSuccess passando il pin inserito
      } else {
        setError(response.data.message || t('pinSaveError'));
        setSuccess('');
      }
    } catch (err) {
      console.error(err);
      setError('Errore nella richiesta PIN');
      setSuccess('');
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError('');
    setSuccess('');
  };

  const handlePinChange = (newPin) => {
    setPin(newPin);
    setError('');
    setSuccess('');
  };

  return (
    <FadeUpContainer>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          readOnly
          value={pin}
          aria-label={t('pinEntered')}
          className="pin-input"
        />
        <PinPad pin={pin} onChange={handlePinChange} onBackspace={handleBackspace} />
        <button
          type="submit"
          disabled={pin.length < 6}
          className="submit-btn"
        >
          {t('setPin')}
        </button>
      </form>
      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}
    </FadeUpContainer>
  );
}
