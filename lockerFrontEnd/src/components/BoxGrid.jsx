import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function BoxGrid({ onBoxSelected, refreshKey, selectedBoxId, mode = 'deposit' }) {
  const [boxes, setBoxes] = useState([]);
  const [error, setError] = useState('');

  const endpoint = mode === 'withdrawal' ? '/boxes/occupied' : '/boxes/available';
  const isClickableStatus = mode === 'withdrawal' ? 'OCCUPIED' : 'FREE';

  useEffect(() => {
    api.get(endpoint)
      .then(res => {
        console.log('BOXES from', endpoint, res.data.data);
        setBoxes(res.data.data);
        setError('');
      })
      .catch(() => setError('Errore nel caricare i box'));
  }, [refreshKey, endpoint]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="box-grid">
      <h3>{mode === 'withdrawal' ? 'Box Occupati' : 'Box Disponibili'}</h3>
      <div className="grid">
        {boxes.map(box => (
          <motion.button
            key={box.id}
            className={`
              box-button ${box.status?.toLowerCase() || 'unknown'}
              ${box.id === selectedBoxId ? 'selected' : ''}
            `}
            onClick={() => box.status === isClickableStatus && onBoxSelected(box.id, box.numBox)}
            disabled={box.status !== isClickableStatus || box.id === selectedBoxId}
            whileTap={{ scale: box.status === isClickableStatus ? 0.95 : 1 }}
            transition={{ duration: 0.1 }}
          >
            Box {box.numBox}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
