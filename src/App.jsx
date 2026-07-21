import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Landing from './Landing';
import Auth from './Auth';
import ProfessionalView from './ProfessionalView';
import ClientView from './ClientView';
import './App.css';

// Componente para proteger rotas usando Clerk
const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Landing />} />
        
        {/* Usamos as páginas padrão do Clerk encapsuladas no nosso Auth.jsx */}
        <Route path="/login" element={<Auth isLogin={true} />} />
        <Route path="/cadastro" element={<Auth isLogin={false} />} />
        
        {/* Rotas Privadas (App) protegidas pelo Clerk */}
        <Route path="/app/pro" element={
          <ProtectedRoute>
            <div className="app-container">
              <ProfessionalView />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/app/cliente" element={
          <ProtectedRoute>
            <div className="app-container" style={{ backgroundColor: 'white' }}>
              <ClientView />
            </div>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
