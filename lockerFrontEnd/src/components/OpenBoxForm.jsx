import { useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function OpenBoxForm({ operazioneId, pin, onOpenSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOpenBox = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post(`/deposit/${operazioneId}/open-box`, {
        pin,
        aperturaSuccesso: true,  // qui indichiamo che proviamo ad aprire con successo
      });

      if (response.data.success) {
        onOpenSuccess(response.data.data);  // passa la nuova operazione aggiornata al genitore
      } else {
        setError(response.data.message || 'Errore sconosciuto');
      }
    } catch (err) {
      console.error(err);
      setError('Errore nella richiesta di apertura box');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <motion.button onClick={handleOpenBox} disabled={loading}>
        {loading ? 'Apertura in corso...' : 'Apri Box'}
      </motion.button>
    </motion.div>
  );
}
