import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Auth = ({ isLogin }) => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', alignSelf: 'center', maxWidth: '400px', width: '100%' }}
      >
        <ArrowLeft size={20} /> Voltar para o início
      </button>

      {/* 
        Após o login, redirecionamos para /app/pro por padrão. 
        Em um app real, poderíamos ler publicMetadata para direcionar clientes vs pros.
      */}
      {isLogin ? (
        <SignIn routing="path" path="/login" signUpUrl="/cadastro" fallbackRedirectUrl="/app/pro" />
      ) : (
        <SignUp routing="path" path="/cadastro" signInUrl="/login" fallbackRedirectUrl="/app/pro" />
      )}
    </div>
  );
};

export default Auth;
