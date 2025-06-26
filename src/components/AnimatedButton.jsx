import { motion } from 'framer-motion';

export default function AnimatedButton({ children, onClick, disabled = false }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      disabled={disabled}
      style={{
        padding: '0.6rem 1.2rem',
        fontSize: '1rem',
        marginTop: '1rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1
      }}
    >
      {children}
    </motion.button>
  );
}
