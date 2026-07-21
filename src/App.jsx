import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Landing from './Landing';
import Auth from './Auth';
import Onboarding from './Onboarding';
import ProfessionalView from './ProfessionalView';
import ClientView from './ClientView';
import ProPublicPage from './ProPublicPage';
import { useAppContext } from './context/AppContext';
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

const ProfileGuard = ({ children, allowedRole }) => {
  const { profile, loading } = useAppContext();
  
  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>;
  if (!profile) return <Navigate to="/onboarding" replace />;
  if (allowedRole && profile.role !== allowedRole) {
    return <Navigate to={profile.role === 'pro' ? '/app/pro' : '/app/cliente'} replace />;
  }
  
  return children;
};

function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Landing />} />
        
        {/* Usamos as páginas padrão do Clerk encapsuladas no nosso Auth.jsx */}
        <Route path="/login/*" element={<Auth isLogin={true} />} />
        <Route path="/cadastro/*" element={<Auth isLogin={false} />} />
        
        {/* Rota Pública do Perfil da Manicure (Portfólio / Link de Agendamento) */}
        <Route path="/pro/:id" element={<ProPublicPage />} />
        
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } />
        
        {/* Rotas Privadas (App) protegidas pelo Clerk e ProfileGuard */}
        <Route path="/app/pro" element={
          <ProtectedRoute>
            <ProfileGuard allowedRole="pro">
              <div className="app-container">
                <ProfessionalView />
              </div>
            </ProfileGuard>
          </ProtectedRoute>
        } />
        
        <Route path="/app/cliente" element={
          <ProtectedRoute>
            <ProfileGuard allowedRole="cliente">
              <div className="app-container" style={{ backgroundColor: 'white' }}>
                <ClientView />
              </div>
            </ProfileGuard>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
