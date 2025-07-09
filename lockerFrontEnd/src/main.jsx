/*import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import App from './App.jsx';
import Home from './pages/Home.jsx';
import Deposito from './pages/Deposito.jsx';
import Ritiro from './pages/Ritiro.jsx';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="deposit" element={<Deposito />} />
          <Route path="ritiro" element={<Ritiro />} />

         
          <Route path="admin-login" element={<AdminLogin />} />
          <Route
            path="admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/admin-login" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './styles/global.css';

import App from './App.jsx';
import Home from './pages/Home.jsx';
import Deposito from './pages/Deposito.jsx';
import Ritiro from './pages/Ritiro.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="deposit" element={<Deposito />} />
          <Route path="ritiro" element={<Ritiro />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
