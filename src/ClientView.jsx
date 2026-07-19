import React, { useState } from 'react';
import { Search, Star, MapPin, Heart, Image as ImageIcon, X, Home, Wallet, Gift, Sparkles, TrendingUp } from 'lucide-react';
import { useAppContext } from './context/AppContext';

const ClientView = () => {
  const [activeTab, setActiveTab] = useState('home'); // home, inspo, wallet

  return (
    <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto', backgroundColor: 'var(--surface-color)', minHeight: '100vh', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', position: 'relative' }}>
      
      {activeTab === 'home' && <HomeTab />}
      {activeTab === 'inspo' && <InspoTab />}
      {activeTab === 'wallet' && <WalletTab />}

      {/* Bottom Nav */}
      <nav style={{ position: 'fixed', bottom: 0, width: '100%', maxWidth: '480px', backgroundColor: 'var(--surface-color)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-around', padding: '1rem', zIndex: 10 }}>
        <button onClick={() => setActiveTab('home')} style={{ color: activeTab === 'home' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
          <Home size={24} />
          <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>Explorar</span>
        </button>
        <button onClick={() => setActiveTab('inspo')} style={{ color: activeTab === 'inspo' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
          <Sparkles size={24} />
          <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>Inspirações</span>
        </button>
        <button onClick={() => setActiveTab('wallet')} style={{ color: activeTab === 'wallet' ? 'var(--primary-color)' : 'var(--text-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
          <Wallet size={24} />
          <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>Fidelidade</span>
        </button>
      </nav>
    </div>
  );
};

const HomeTab = () => {
  const [selectedPro, setSelectedPro] = useState(null);

  return (
    <div className="animate-in" style={{ paddingBottom: '100px' }}>
      <header style={{ padding: '2rem 1.5rem', backgroundColor: 'var(--secondary-color)', color: 'white' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>O que vamos fazer hoje? 💅</h1>
        <div style={{ position: 'relative' }}>
          <Search size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Buscar por Blindagem, Gel X, Francesinha..." 
            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '100px', border: 'none', fontSize: '1rem' }}
          />
        </div>
      </header>

      <main style={{ padding: '1.5rem' }}>
        <section style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
            {['Extensão', 'Banho de Gel', 'Spa dos Pés', 'Nail Art', 'Manutenção'].map(cat => (
              <button key={cat} style={{ padding: '0.5rem 1rem', borderRadius: '100px', border: '1px solid var(--border-color)', whiteSpace: 'nowrap', fontWeight: 500 }}>
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary-color), #ff80a6)', borderRadius: '16px', padding: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Simulador de Unhas AI</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Tire uma foto da sua mão e prove cores virtuais</p>
            </div>
            <button style={{ background: 'white', color: 'var(--primary-color)', padding: '0.75rem', borderRadius: '50%' }}>
              <ImageIcon size={24} />
            </button>
          </div>
        </section>

        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Top Manicures (Ranking)</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600 }}>Ver Todas</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <NailTechCard 
              name="Studio Marina Nails" 
              rating="5.0" 
              reviews="240"
              distance="1.2 km"
              tags={['Fibra de Vidro', 'Nail Art 3D']}
              image="https://images.unsplash.com/photo-1519014816548-bf5fe059c98b?auto=format&fit=crop&q=80&w=400&h=200"
              onClick={() => setSelectedPro("Studio Marina Nails")}
            />
            <NailTechCard 
              name="Beauty by Carol" 
              rating="4.8" 
              reviews="185"
              distance="2.5 km"
              tags={['Esmaltação em Gel', 'Spa']}
              image="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=400&h=200"
              onClick={() => setSelectedPro("Beauty by Carol")}
            />
          </div>
        </section>
      </main>

      {selectedPro && <BookingModal pro={selectedPro} onClose={() => setSelectedPro(null)} />}
    </div>
  );
};

const InspoTab = () => (
  <div className="animate-in" style={{ padding: '1.5rem', paddingBottom: '100px' }}>
    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Inspirações & Tendências</h1>
    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Descubra as unhas do momento e encontre quem faz perto de você.</p>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      <div style={{ height: '200px', borderRadius: '12px', background: 'url(https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=300&q=80) center/cover', position: 'relative', padding: '0.75rem', display: 'flex', alignItems: 'flex-end' }}>
        <span className="badge" style={{ backgroundColor: 'white', color: 'var(--secondary-color)' }}><TrendingUp size={12} style={{ marginRight: '4px' }}/> Encapsulada</span>
      </div>
      <div style={{ height: '200px', borderRadius: '12px', background: 'url(https://images.unsplash.com/photo-1595868225338-723fbfa28243?auto=format&fit=crop&w=300&q=80) center/cover', position: 'relative', padding: '0.75rem', display: 'flex', alignItems: 'flex-end' }}>
        <span className="badge" style={{ backgroundColor: 'white', color: 'var(--secondary-color)' }}><TrendingUp size={12} style={{ marginRight: '4px' }}/> Francesinha Reversa</span>
      </div>
      <div style={{ height: '250px', borderRadius: '12px', background: 'url(https://images.unsplash.com/photo-1519014816548-bf5fe059c98b?auto=format&fit=crop&w=300&q=80) center/cover', position: 'relative', padding: '0.75rem', display: 'flex', alignItems: 'flex-end' }}>
        <span className="badge" style={{ backgroundColor: 'white', color: 'var(--secondary-color)' }}>Nail Art 3D</span>
      </div>
      <div style={{ height: '250px', borderRadius: '12px', background: 'url(https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80) center/cover', position: 'relative', padding: '0.75rem', display: 'flex', alignItems: 'flex-end' }}>
        <span className="badge" style={{ backgroundColor: 'white', color: 'var(--secondary-color)' }}>Stiletto</span>
      </div>
    </div>
  </div>
);

const WalletTab = () => (
  <div className="animate-in" style={{ padding: '1.5rem', paddingBottom: '100px' }}>
    <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Minha Carteira</h1>
    
    <div style={{ background: 'linear-gradient(135deg, var(--secondary-color), #444)', borderRadius: '16px', padding: '1.5rem', color: 'white', marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Cartão Fidelidade</h3>
      <p style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '1.5rem' }}>Studio Marina Nails</p>
      
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
        {[1, 2, 3, 4, 5].map((stamp, i) => (
          <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: i < 3 ? 'var(--primary-color)' : 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {i < 3 && <Sparkles size={20} color="white" />}
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>Faltam 2 selos para ganhar 50% OFF!</p>
    </div>

    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: '12px', color: 'var(--primary-color)' }}>
        <Gift size={32} />
      </div>
      <div>
        <h3 style={{ fontSize: '1.1rem' }}>Indique e Ganhe</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: '0.75rem' }}>Convide uma amiga e ambas ganham R$ 20 de desconto.</p>
        <button style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.9rem' }}>Compartilhar Link</button>
      </div>
    </div>
  </div>
);

/* ----- COMPONENTS ----- */

const NailTechCard = ({ name, rating, reviews, distance, tags, image, onClick }) => (
  <div onClick={onClick} style={{ border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}>
    <div style={{ height: '140px', backgroundColor: '#eee', backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
      <button style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', padding: '0.5rem', borderRadius: '50%' }} onClick={(e) => { e.stopPropagation(); }}>
        <Heart size={18} color="var(--text-light)" />
      </button>
    </div>
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1.1rem' }}>{name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
          <Star size={16} fill="currentColor" color="#f59e0b" /> {rating} <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>({reviews})</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
        <MapPin size={14} /> {distance}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {tags.map(tag => (
          <span key={tag} className="badge badge-primary">{tag}</span>
        ))}
      </div>
    </div>
  </div>
);

const BookingModal = ({ pro, onClose }) => {
  const { addAppointment, services } = useAppContext();
  const [service, setService] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (service && time) {
      addAppointment({ client: 'Você (Cliente App)', service: `${service} com ${pro}`, time, status: 'Confirmado pelo App' });
      alert('Agendamento realizado com sucesso! O pagamento pode ser feito no app.');
      onClose();
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000 }}>
      <div className="animate-in" style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--surface-color)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '2rem 1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem' }}>Agendar com</h2>
            <p style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{pro}</p>
          </div>
          <button onClick={onClose}><X size={24} color="var(--text-secondary)" /></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Selecione o Serviço</label>
            <select className="form-input" value={service} onChange={e => setService(e.target.value)} required>
              <option value="">Selecione...</option>
              {services.map(s => <option key={s.id} value={s.name}>{s.name} - R$ {s.price}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Selecione o Horário para Hoje</label>
            <input type="time" className="form-input" value={time} onChange={e => setTime(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>Confirmar & Pagar</button>
        </form>
      </div>
    </div>
  );
};

export default ClientView;
