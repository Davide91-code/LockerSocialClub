import { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function BoxGrid({ operazioneId, onBoxSelected, refreshKey }) {
  const [boxes, setBoxes] = useState([]);
  const [error, setError] = useState('');

   useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const response = await api.get('/boxes'); // o '/boxes/available' in base al contesto
        setBoxes(response.data.data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Errore nel caricare i box');
      }
    };

    fetchBoxes();
  }, [operazioneId, refreshKey]); // ricarica ogni volta che cambia

  

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="box-grid">
      <h3>Seleziona un box</h3>
      <div className="grid">
        {boxes.map((box) => (
          <motion.button
            key={box.id}
            className={`box-button ${box.status?.toLowerCase() || 'unknown'}`}
            onClick={() => onBoxSelected(box.id)}
            disabled={box.status !== 'FREE'}
            whileTap={{ scale: box.status === 'FREE' ? 0.95 : 1 }}
            transition={{ duration: 0.1 }}
          >
            Box {box.numBox}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
