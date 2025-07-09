export const containerVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

export const buttonTapAnimation = {
  whileTap: { scale: 0.9 },
  transition: { duration: 0.1 },
};

export const submitButtonVariants = (enabled) => ({
  style: {
    opacity: enabled ? 1 : 0.5,
    cursor: enabled ? 'pointer' : 'not-allowed',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    marginTop: '1rem',
  },
  whileTap: enabled ? { scale: 0.95 } : {},
});
