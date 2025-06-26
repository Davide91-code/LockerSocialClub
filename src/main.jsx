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
          <Route path="/deposit" element={<Deposito />} />
          <Route path="/ritiro" element={<Ritiro />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
