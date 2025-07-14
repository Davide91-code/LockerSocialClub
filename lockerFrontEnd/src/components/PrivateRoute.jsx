import { Navigate } from 'react-router-dom';

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (e) {
    return true;
  }
}

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  if (!token || isTokenExpired(token)) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
}