import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function AnimatedButton({
  labelKey,
  children,
  onClick,
  disabled = false,
  className = '',
  style = {},
}) {
  const { t } = useTranslation();

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
      {labelKey ? t(labelKey) : children}
    </motion.button>
  );
}