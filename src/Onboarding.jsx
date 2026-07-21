import React, { useState } from 'react';
import { useUser, SignOutButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { insertProfile } from './services/database';
import { Sparkles, MapPin, User, ArrowRight } from 'lucide-react';
import { useAppContext } from './context/AppContext';

const Onboarding = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { setProfile } = useAppContext();
  
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.fullName || '',
    state: '',
    city: '',
    neighborhood: '',
    address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) return alert('Selecione se você é Cliente ou Manicure.');
    
    setLoading(true);
    try {
      const newProfile = {
        user_id: user.id,
        role: role,
        name: formData.name,
        state: formData.state,
        city: formData.city,
        neighborhood: formData.neighborhood,
        address: formData.address
      };
      
      const savedProfile = await insertProfile(newProfile);
      
      if (savedProfile) {
        setProfile(savedProfile); // Update global state
        if (role === 'pro') {
          navigate('/app/pro');
        } else {
          navigate('/app/cliente');
        }
      } else {
        alert("Erro ao criar perfil. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Sparkles color="var(--primary-color)" size={48} />
        </div>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Bem-vindo(a) ao My Nails!</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Para começar, precisamos de algumas informações sobre você.</p>

        {!role ? (
          <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Como você deseja usar o app?</h3>
            <button 
              className="btn btn-outline" 
              style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.1rem' }}
              onClick={() => setRole('cliente')}
            >
              Sou Cliente (Quero Agendar) <ArrowRight size={20} />
            </button>
            <button 
              className="btn btn-primary" 
              style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.1rem' }}
              onClick={() => setRole('pro')}
            >
              Sou Manicure (Quero Oferecer) <ArrowRight size={20} />
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <SignOutButton>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>Sair da Conta</button>
              </SignOutButton>
            </div>
          </div>
        ) : (
          <form className="animate-in" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', cursor: 'pointer' }} onClick={() => setRole(null)}>
              <span className="badge badge-primary">{role === 'pro' ? 'Profissional' : 'Cliente'}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textDecoration: 'underline' }}>Trocar</span>
            </div>

            <div className="input-group">
              <label><User size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }}/> Nome Completo</label>
              <input type="text" className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            <h3 style={{ fontSize: '1rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={18} /> Sua Localização</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              {role === 'pro' ? 'Para as clientes te encontrarem na região.' : 'Para encontrarmos manicures perto de você.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem' }}>
              <div className="input-group">
                <label>Estado (UF)</label>
                <input type="text" className="form-input" required maxLength={2} placeholder="SP" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value.toUpperCase()})} />
              </div>
              <div className="input-group">
                <label>Cidade</label>
                <input type="text" className="form-input" required placeholder="São Paulo" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
            </div>

            <div className="input-group">
              <label>Bairro</label>
              <input type="text" className="form-input" required value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Salvando...' : 'Concluir Perfil'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
