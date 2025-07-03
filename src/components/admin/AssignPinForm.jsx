import { useState } from 'react';
import PinPad from '../PinPad';
import AnimatedButton from '../AnimatedButton';
import FadeUpContainer from '../FadeUpContainer';

export default function AssignPinForm({ boxId, onAssignPin }) {
  const [pin, setPin] = useState('');
  const handleBackspace = () => setPin(pin.slice(0, -1));
  return (
    <FadeUpContainer>
      <h3>Assegna PIN manuale</h3>
      <input readOnly value={pin} className="pin-input" />
      <PinPad pin={pin} onChange={setPin} onBackspace={handleBackspace} />
      <AnimatedButton disabled={pin.length < 4} onClick={() => onAssignPin(boxId, pin)}>
        Assegna PIN
      </AnimatedButton>
    </FadeUpContainer>
  );
}
