import { Link } from 'react-router-dom';
import FadeUpContainer from '../components/FadeUpContainer';
import AnimatedButton from '../components/AnimatedButton';

export default function Home() {
  return (
    <FadeUpContainer>
      <h1>Benvenuto</h1>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        <Link to="/deposit">
          <AnimatedButton>Deposito</AnimatedButton>
        </Link>
        <Link to="/ritiro">
          <AnimatedButton>Ritiro</AnimatedButton>
        </Link>
      </nav>
    </FadeUpContainer>
  );
}
