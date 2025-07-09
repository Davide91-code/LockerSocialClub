import { useState } from 'react';
import PinPad from './PinPad';
import FadeUpContainer from './FadeUpContainer';

export default function PinFormRitiro({ pin, onChange }) {
  const [error, setError] = useState('');

  const handleBackspace = () => {
    onChange(pin.slice(0, -1));
    setError('');
  };

  const handlePinChange = (newPin) => {
    onChange(newPin);
    setError('');
  };

  return (
    <FadeUpContainer>
      <input
        type="password"
        readOnly
        value={pin}
        aria-label="PIN inserito"
        className="pin-input"
      />
      <PinPad
        pin={pin}
        onChange={handlePinChange}
        onBackspace={handleBackspace}
      />
      {error && <p className="error-msg">{error}</p>}
    </FadeUpContainer>
  );
}
