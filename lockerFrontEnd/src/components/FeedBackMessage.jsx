import { motion } from 'framer-motion';

export default function FeedbackMessage({ text, type = 'info' }) {
  const color = type === 'error' ? 'red' : type === 'success' ? 'green' : 'black';

  return (
    <motion.p
      style={{ color, marginTop: '1rem', fontWeight: 'bold' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {text}
    </motion.p>
  );
}
