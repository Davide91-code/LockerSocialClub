import { useEffect, useState } from 'react';
import api from '../services/api';

export default function BoxGrid({ operazioneId, onBoxSelected }) {
  const [boxes, setBoxes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const response = await api.get('/locker/boxes');
        setBoxes(response.data.data); // accediamo alla vera lista
      } catch (err) {
        console.error(err);
        setError('Errore nel caricare i box');
      }
    };

    fetchBoxes();
  }, []);

  const handleSelectBox = async (boxId) => {
    try {
      const response = await api.post(`/locker/deposit/${operazioneId}/select-box`, {
        boxId,
      });
      onBoxSelected(response.data.data); // Passiamo i dati aggiornati al parent
    } catch (err) {
      console.error(err);
      setError('Errore nella selezione del box');
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="box-grid">
      <h3>Seleziona un box</h3>
      <div className="grid">
        {boxes.map((box) => (
          <button
            key={box.id}
            className={`box-button ${box.status.toLowerCase()}`}
            onClick={() => handleSelectBox(box.id)}
            disabled={box.status !== 'FREE'}
          >
            Box {box.numBox}
          </button>
        ))}
      </div>
    </div>
  );
}
