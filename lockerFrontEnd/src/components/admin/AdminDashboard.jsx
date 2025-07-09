import { useState, useEffect } from 'react';
import FadeUpContainer from '../FadeUpContainer';
import AdminBoxGrid from './AdminBoxGrid';
import BoxStatusCard from './BoxStatusCard';
import AssignPinForm from './AssignPinForm';
import api from '../../services/api';

export default function AdminDashboard() {
  const [selectedBox, setSelectedBox] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [ops, setOps] = useState([]);

  const fetchBoxes = async () => {
    const res = await api.get('/admin/boxes');
    setBoxes(res.data.data);
  };

  const changeStatus = async (id, status) => {
    await api.put(`/admin/boxes/${id}/status`, { status });
    fetchBoxes();
  };

  const assignPin = async (boxId, pin) => {
    const res = await api.post('/admin/assegna-pin', { boxId, pin });
    alert(res.data.message);
    fetchBoxes();
  };

  const fetchOperations = async () => {
    const res = await api.get('/admin/operations');
    setOps(res.data.data);
  };

  useEffect(() => {
    fetchBoxes(); fetchOperations();
  }, []);

  return (
    <FadeUpContainer>
      <h2>Pannello Admin</h2>
      <AdminBoxGrid onBoxClick={setSelectedBox} boxes={boxes} />
      {selectedBox && (
        <BoxStatusCard box={selectedBox} onChangeStatus={changeStatus} />
      )}
      {selectedBox && (
        <AssignPinForm boxId={selectedBox.id} onAssignPin={assignPin} />
      )}
      {/* mostra anche la lista operazioni */}
      <h3>Registro Operazioni</h3>
      <ul>
        {ops.map(o => (
          <li key={o.id}>
            #{o.id} - Box {o.boxId} - {o.type} - {o.status} - {o.timestamp}
          </li>
        ))}
      </ul>
    </FadeUpContainer>
  );
}
