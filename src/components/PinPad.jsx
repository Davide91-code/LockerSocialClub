import PinButton from './PinButton';

export default function PinPad({ pin, onChange, onBackspace }) {
  const digits = ['1','2','3','4','5','6','7','8','9','0'];

  const handleClick = (digit) => {
    if (pin.length < 6) {
      onChange(pin + digit);
    }
  };

  return (
    <div className="pinpad">
      <div className="digits-grid">
        {digits.map(d => (
          <PinButton
            key={d}
            onClick={() => handleClick(d)}
            ariaLabel={`Numero ${d}`}
          >
            {d}
          </PinButton>
        ))}
        <PinButton onClick={onBackspace} ariaLabel="Cancella ultima cifra">
          ⌫
        </PinButton>
      </div>
    </div>
  );
}
