import { useState } from 'react';
import AnimatedButton from '../AnimatedButton';
import FeedBackMessage from '../FeedBackMessage';
import api from '../../services/api';

export default function AdminLogin({ onLoginSuccess }) {
  const [u, setU] = useState(''), [p, setP] = useState(''), [err, setErr] = useState('');
  const handleLogin = async () => {
    try {
      const res = await api.post('/admin/login', { username: u, password: p });
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.data.token);
        onLoginSuccess();
      } else setErr(res.data.message);
    } catch {
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
