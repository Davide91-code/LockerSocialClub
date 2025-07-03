import { motion } from 'framer-motion';

export default function AdminBoxGrid({ boxes = [], onBoxClick }) {
  return (
    <div className="admin-box-grid">
      <div className="grid">
        {boxes.map(box => (
          <motion.button
            key={box.id}
            className={`box-button ${box.status?.toLowerCase()}`}
            onClick={() => onBoxClick(box)}
            whileTap={{ scale: 0.95 }}
          >
            Box {box.numBox} — {box.status}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
