import { useNavigate } from 'react-router-dom';
import AnimatedButton from './AnimatedButton';

export default function BackButton({ label = "Indietro" }) {
  const navigate = useNavigate();

  return (
    <AnimatedButton className="button-centered" onClick={() => navigate(-1)}>
      {label}
    </AnimatedButton>
  );
}