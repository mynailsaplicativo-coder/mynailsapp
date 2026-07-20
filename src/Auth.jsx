import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { signUpUser, signInUser } from './services/auth';

const Auth = ({ isLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('type') || 'client'; // 'pro' or 'client'

  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sincroniza a aba com a URL caso mude
  useEffect(() => {
    if (queryParams.get('type')) {
      setRole(queryParams.get('type'));
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        const data = await signInUser(email, password);
        // Em um app real, você verificaria o 'role' no metadata do Supabase:
        // const userRole = data.user.user_metadata.role;
        // Para o MVP visual com roteamento, vamos usar o estado local para simular o redirecionamento:
        if (role === 'pro') navigate('/app/pro');
        else navigate('/app/cliente');
        
      } else {
        await signUpUser(email, password, role, name);
        alert('Cadastro realizado com sucesso! (Verifique seu email se necessário). Redirecionando...');
        if (role === 'pro') navigate('/app/pro');
        else navigate('/app/cliente');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao processar a autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card animate-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        
        <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={20} /> Voltar
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', width: '64px', height: '64px', borderRadius: '50%', marginBottom: '1rem' }}>
            <Sparkles size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            {isLogin ? 'Faça login para continuar no My Nails.' : 'Cadastre-se para começar a usar o aplicativo.'}
          </p>
        </div>

        {/* Role Toggle (Somente no Cadastro, ou no MVP para forçar o fluxo visual de Login) */}
        <div style={{ display: 'flex', backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '0.25rem', marginBottom: '1.5rem' }}>
          <button 
            type="button"
            onClick={() => setRole('client')}
            style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', fontWeight: 500, backgroundColor: role === 'client' ? 'white' : 'transparent', boxShadow: role === 'client' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', border: 'none', cursor: 'pointer' }}
          >
            Sou Cliente
          </button>
          <button 
            type="button"
            onClick={() => setRole('pro')}
            style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', fontWeight: 500, backgroundColor: role === 'pro' ? 'white' : 'transparent', boxShadow: role === 'pro' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', border: 'none', cursor: 'pointer' }}
          >
            Sou Profissional
          </button>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>Nome Completo</label>
              <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div className="input-group">
            <label>E-mail</label>
            <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Senha</label>
            <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {isLogin ? (
            <p>Ainda não tem conta? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/cadastro?type=' + role); }} style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Cadastre-se</a></p>
          ) : (
            <p>Já tem uma conta? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login?type=' + role); }} style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Faça Login</a></p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Auth;
