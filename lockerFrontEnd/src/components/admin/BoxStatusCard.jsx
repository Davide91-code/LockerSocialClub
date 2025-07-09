import AnimatedButton from '../AnimatedButton';
import FadeUpContainer from '../FadeUpContainer';

export default function BoxStatusCard({ box, onChangeStatus }) {
  const statuses = ['FREE', 'OCCUPIED', 'DISABLED', 'DISABLED_TEMP', 'RESERVED'];
  return (
    <FadeUpContainer>
      <h3>Box {box.numBox}</h3>
      <p>Stato attuale: {box.status}</p>
      {statuses.map(s =>
        <AnimatedButton
          key={s}
          onClick={() => onChangeStatus(box.id, s)}
          disabled={box.status === s}
        >
          {s}
        </AnimatedButton>
      )}
    </FadeUpContainer>
  );
}
