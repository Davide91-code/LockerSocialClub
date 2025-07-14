// src/components/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import FadeUpContainer from '../FadeUpContainer';
import AdminBoxGrid from './AdminBoxGrid';
import BoxStatusCard from './BoxStatusCard';
import AssignPinForm from './AssignPinForm';
import adminApi from '../../services/adminApi';

export default function AdminDashboard() {
  const [selectedBox, setSelectedBox] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [ops, setOps] = useState([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const fetchBoxes = async () => {
    try {
      const res = await adminApi.get('/boxes');
      console.log('Boxes ricevuti:', res.data.data);
      setBoxes(res.data.data);
    } catch (error) {
      console.error('Errore fetchBoxes:', error);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await adminApi.put(`/boxes/${id}/status`, { status });
      fetchBoxes();
    } catch (error) {
      console.error('Errore changeStatus:', error);
    }
  };

  const assignPin = async (boxId, pin) => {
    try {
      const res = await adminApi.post('/assegna-pin', { boxId, pin });
      alert(res.data.message);
      fetchBoxes();
    } catch (error) {
      console.error('Errore assignPin:', error);
    }
  };

  const fetchOperations = async () => {
    try {
      const res = await adminApi.get('/operations');
      console.log('Operations ricevute:', res.data.data);
      console.log('Esempio operazione:', res.data.data[0]);
      setOps(res.data.data);
    } catch (error) {
      console.error('Errore fetchOperations:', error);
    }
  };

  useEffect(() => {
    fetchBoxes();
    fetchOperations();
  }, []);

  return (
    <FadeUpContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Pannello Admin</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <AdminBoxGrid onBoxClick={setSelectedBox} boxes={boxes} />

      {selectedBox && (
        <>
          <BoxStatusCard box={selectedBox} onChangeStatus={changeStatus} />
          <AssignPinForm boxId={selectedBox.id} onAssignPin={assignPin} />
        </>
      )}

      <h3>Registro Operazioni</h3>
<table style={{ width: '100%', borderCollapse: 'collapse' }}>
  <thead>
    <tr>
      <th>ID</th>
      <th>Box</th>
      <th>Tipo</th>
      <th>Stato</th>
      <th>Data</th>
    </tr>
  </thead>
  <tbody>
    {ops.map((o) => (
      <tr key={o.id}>
        <td>{o.id}</td>
        <td>{o.boxAssociato?.numBox ?? 'N/A'}</td>
        <td>{o.tipoOperazione}</td>
        <td>{o.stato}</td>
        <td>{new Date(o.dataOrario).toLocaleString()}</td>
      </tr>
    ))}
  </tbody>
</table>
    </FadeUpContainer>
  );
}
