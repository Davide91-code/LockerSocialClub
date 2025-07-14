import { useState } from 'react';
import AnimatedButton from '../AnimatedButton';
import FeedBackMessage from '../FeedBackMessage';
import adminApi from '../../services/adminApi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminLogin() {
  const [u, setU] = useState(''), [p, setP] = useState(''), [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Sto inviando login con:", { username: u, password: p });
    try {
      const res = await axios.post('http://localhost:8080/api/admin/login', { username: u, password: p });
      console.log("Risposta dal backend:", res.data); // LOG AGGIUNTO
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.data.token);
        console.log("Token salvato:", res.data.data.token);
        navigate('/admin');
      } else {
        setErr(res.data.message);
      }
    } catch {
      console.error("Errore nella richiesta login:", err); // LOG AGGIUNTO
      setErr('Errore durante login.');
    }
  };

  return (
    <div>
      <h2>Accesso Amministratore</h2>
      <input value={u} onChange={e => setU(e.target.value)} placeholder="Username" />
      <input type="password" value={p} onChange={e => setP(e.target.value)} placeholder="Password" />
      <AnimatedButton onClick={handleLogin}>Login</AnimatedButton>
      {err && <FeedBackMessage text={err} type="error" />}
    </div>
  );
}
