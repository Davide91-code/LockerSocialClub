import { Link } from 'react-router-dom';
import AnimatedButton from './AnimatedButton';

export default function BackToHomeButton({ label = "Torna alla Home" }) {
  return (
    <Link to="/">
      <AnimatedButton className="button-centered">{label}</AnimatedButton>
    </Link>
  );
}
