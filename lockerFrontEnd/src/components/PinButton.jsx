import { motion } from 'framer-motion';

export default function PinButton({ children, onClick, ariaLabel }) {
  return (
    <motion.button
      type="button"
      className="pin-button"
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.1 }}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  );
}
