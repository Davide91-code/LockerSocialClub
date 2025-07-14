import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import translations from '../translations';

export default function AnimatedButton({
  labelKey,
  children,
  onClick,
  disabled = false,
  className = '',
  style = {},
}) {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      disabled={disabled}
      className={className}
      style={{
        padding: '0.6rem 1.2rem',
        fontSize: '1rem',
        marginTop: '1rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {/* Se c'è una labelKey usala, altrimenti mostra children */}
      {labelKey ? (t[labelKey] || labelKey) : children}
    </motion.button>
  );
}