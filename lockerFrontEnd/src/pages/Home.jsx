import { Link } from 'react-router-dom';
import FadeUpContainer from '../components/FadeUpContainer';
import AnimatedButton from '../components/AnimatedButton';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <FadeUpContainer>
      <h1>{t('welcome')}</h1>
      <nav
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          gap: '1.5rem',
          marginTop: '2rem',
          width: '80vw',
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Link to="/deposit" style={{ flex: 1 }}>
          <AnimatedButton
            labelKey="deposit"
            className="button-centered"
            style={{
              fontSize: '2.5rem',
              padding: '2rem 1rem',
              width: '100%',
              borderRadius: '16px',
              maxWidth: 'none',
              margin: 0,
            }}
          />
        </Link>
        <Link to="/ritiro" style={{ flex: 1 }}>
          <AnimatedButton
            labelKey="withdraw"
            className="button-centered"
            style={{
              fontSize: '2.5rem',
              padding: '2rem 1rem',
              width: '100%',
              borderRadius: '16px',
              maxWidth: 'none',
              margin: 0,
            }}
          />
        </Link>
      </nav>
    </FadeUpContainer>
  );
}


