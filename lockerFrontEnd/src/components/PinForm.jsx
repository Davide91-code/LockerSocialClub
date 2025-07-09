import { useState } from 'react';
import api from '../services/api';
import PinPad from './PinPad';
import FadeUpContainer from './FadeUpContainer';

export default function PinForm({ operazioneId, onPinSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pin.length < 6) {
      setError('Il PIN deve essere almeno di 6 cifre');
      return;
    }

    try {
      const response = await api.post(`/deposit/${operazioneId}/set-pin`, { pin });
      
      if (response.data.success) {
        setSuccess('Box aperto con successo!');
        setError('');
        onPinSuccess(pin);  // <-- qui chiami onPinSuccess passando il pin inserito
      } else {
        setError(response.data.message || "Errore nel salvataggio pin");
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
          aria-label="PIN inserito"
          className="pin-input"
        />
        <PinPad pin={pin} onChange={handlePinChange} onBackspace={handleBackspace} />
        <button
          type="submit"
          disabled={pin.length < 6}
          className="submit-btn"
        >
          Imposta PIN
        </button>
      </form>
      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}
    </FadeUpContainer>
  );
}
