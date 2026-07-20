import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Landing from './Landing';
import Auth from './Auth';
import ProfessionalView from './ProfessionalView';
import ClientView from './ClientView';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth isLogin={true} />} />
        <Route path="/cadastro" element={<Auth isLogin={false} />} />
        
        {/* Rotas Privadas (App) */}
        <Route path="/app/pro" element={
          <div className="app-container">
            <ProfessionalView />
          </div>
        } />
        
        <Route path="/app/cliente" element={
          <div className="app-container" style={{ backgroundColor: 'white' }}>
            <ClientView />
          </div>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
