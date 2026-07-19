import React, { useState } from 'react';
import ProfessionalView from './ProfessionalView';
import ClientView from './ClientView';
import { AppProvider } from './context/AppContext';

function App() {
  const [role, setRole] = useState('professional');

  return (
    <AppProvider>
      <div className="app-layout">
        
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100 }}>
          <div className="role-switcher">
            <button 
              className={role === 'professional' ? 'active' : ''} 
              onClick={() => setRole('professional')}
            >
              Visão da Profissional
            </button>
            <button 
              className={role === 'client' ? 'active' : ''} 
              onClick={() => setRole('client')}
            >
              Visão da Cliente
            </button>
          </div>
        </div>

        {role === 'professional' ? <ProfessionalView /> : <ClientView />}
      </div>
    </AppProvider>
  );
}

export default App;
