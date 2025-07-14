import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './styles/global.css';

import App from './App.jsx';
import Home from './pages/Home.jsx';
import Deposito from './pages/Deposito.jsx';
import Ritiro from './pages/Ritiro.jsx';
import './i18n';
import { LanguageProvider } from './context/LanguageContext';


import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
    <BrowserRouter>
      <Routes>
        {/* Rotte pubbliche */}
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="deposit" element={<Deposito />} />
          <Route path="ritiro" element={<Ritiro />} />
        </Route>

        {/* Rotte admin (fuori da App/Layout) */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
);


