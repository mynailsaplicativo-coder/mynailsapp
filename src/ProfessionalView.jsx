import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Users, Settings, Plus, Sparkles, Scissors, ClipboardList, X, DollarSign, Package, Award, ArrowUpCircle, ArrowDownCircle, Wallet, Share2, Image, ShoppingBag, ExternalLink } from 'lucide-react';
import { useAppContext } from './context/AppContext';
import { UserButton, useUser } from '@clerk/clerk-react';
import { insertService, updateService, deleteService, insertClient, fetchServices, fetchClients, deleteClient, fetchAllPlans, uploadImage } from './services/database';
import { createPaymentLink, createSubaccount } from './services/asaas';

const ProfessionalView = () => {
  const [activeTab, setActiveTab] = useState('agenda');
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);

  const { profile } = useAppContext();
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === 'yurilojavirtual@gmail.com';

  return (
    <div className="app-container">
      {/* Top Header */}
      <div style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles color="var(--primary-color)" size={24} />
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--primary-color)' }}>My Nails Studio</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isAdmin && <button className="btn btn-outline" onClick={() => window.location.href='/admin'}>Admin</button>}
            <UserButton />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="app-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Olá, {profile?.name || 'Marina'} 👋</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{profile?.city ? `${profile.city} - ${profile.state}` : 'Resumo do seu estúdio.'}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsNewBookingOpen(true)} style={{ padding: '0.5rem 1rem' }}>
            <Plus size={18} /> Novo
          </button>
        </div>

        {activeTab === 'perfil' && <PerfilView />}
        {activeTab === 'portfolio' && <PortfolioView />}
        {activeTab === 'agenda' && <AgendaView />}
        {activeTab === 'clientes' && <ClientesView />}
        {activeTab === 'catalogo' && <CatalogoView />}
        {activeTab === 'financeiro' && <FinanceiroView />}
        {activeTab === 'estoque' && <EstoqueView />}
        {activeTab === 'recebimentos' && <RecebimentosView />}
        {activeTab === 'assinatura' && <AssinaturaView />}

        {isNewBookingOpen && <NewBookingModal onClose={() => setIsNewBookingOpen(false)} />}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button className={`bottom-nav-item ${activeTab === 'agenda' ? 'active' : ''}`} onClick={() => setActiveTab('agenda')}>
          <CalendarIcon size={22} />
          <span>Agenda</span>
        </button>
        <button className={`bottom-nav-item ${activeTab === 'clientes' ? 'active' : ''}`} onClick={() => setActiveTab('clientes')}>
          <Users size={22} />
          <span>Clientes</span>
        </button>
        <button className={`bottom-nav-item ${activeTab === 'financeiro' ? 'active' : ''}`} onClick={() => setActiveTab('financeiro')}>
          <DollarSign size={22} />
          <span>Finanças</span>
        </button>
        <button className={`bottom-nav-item ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => setActiveTab('perfil')}>
          <Settings size={22} />
          <span>Perfil</span>
        </button>
        <button className={`bottom-nav-item ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('portfolio')}>
          <Image size={22} />
          <span>Portfólio</span>
        </button>
        <button className={`bottom-nav-item ${activeTab === 'catalogo' ? 'active' : ''}`} onClick={() => setActiveTab('catalogo')}>
          <ShoppingBag size={22} />
          <span>Catálogo</span>
        </button>
        <button className={`bottom-nav-item ${activeTab === 'estoque' ? 'active' : ''}`} onClick={() => setActiveTab('estoque')}>
          <Package size={22} />
          <span>Estoque</span>
        </button>
        <button className={`bottom-nav-item ${activeTab === 'recebimentos' ? 'active' : ''}`} onClick={() => setActiveTab('recebimentos')}>
          <Wallet size={22} />
          <span>Conta</span>
        </button>
        <button className={`bottom-nav-item ${activeTab === 'assinatura' ? 'active' : ''}`} onClick={() => setActiveTab('assinatura')}>
          <Award size={22} />
          <span>Premium</span>
        </button>
      </nav>
    </div>
  );
};

/* ----- VIEWS ----- */

const PerfilView = () => {
  const { profile, editProfile } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    photo_url: profile?.photo_url || '',
    description: profile?.description || '',
    whatsapp: profile?.whatsapp || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await editProfile(formData);
    setLoading(false);
    alert('Perfil atualizado com sucesso!');
  };

  return (
    <div className="animate-in card">
      <h2 style={{ marginBottom: '1.5rem' }}>Meu Perfil Profissional</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="input-group">
          <label>Nome do Estúdio / Profissional</label>
          <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div className="input-group">
          <label>Foto de Perfil</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {formData.photo_url && <img src={formData.photo_url} alt="Perfil" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />}
            <input type="file" accept="image/*" onChange={async (e) => {
              if (e.target.files && e.target.files[0]) {
                setLoading(true);
                const url = await uploadImage(e.target.files[0]);
                if (url) setFormData({...formData, photo_url: url});
                setLoading(false);
              }
            }} />
          </div>
        </div>
        <div className="input-group">
          <label>Biografia / Descrição</label>
          <textarea className="form-input" rows="3" placeholder="Conte um pouco sobre seu trabalho..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
        </div>
        <div className="input-group">
          <label>WhatsApp (com DDD)</label>
          <input type="text" className="form-input" placeholder="21999999999" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Perfil'}
        </button>
      </form>
    </div>
  );
};

const PortfolioView = () => {
  const { portfolio, addPortfolio } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  
  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Meu Portfólio</h2>
        <button className="btn btn-outline" onClick={() => setIsAdding(true)}><Plus size={18} /> Nova Foto</button>
      </div>

      {isAdding && <NewPortfolioModal onClose={() => setIsAdding(false)} onSave={addPortfolio} />}

      <div className="grid-cards">
        {portfolio.map(item => (
          <div key={item.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <img src={item.media_url} alt="Trabalho" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '1rem' }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>{item.description}</p>
            </div>
          </div>
        ))}
        {portfolio.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>Nenhum trabalho adicionado ainda.</p>}
      </div>
    </div>
  );
};

const RecebimentosView = () => {
  const { walletId, setWalletId } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', cpfCnpj: '', email: '', phone: '', postalCode: '', address: '', addressNumber: '', province: '' });
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const data = await createSubaccount(formData);
      setWalletId(data.walletId);
      setMsg({ type: 'success', text: 'Conta Asaas criada com sucesso! Você já pode receber pagamentos.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (walletId) {
    return (
      <div className="animate-in card" style={{ padding: '3rem', textAlign: 'center', border: '1px solid var(--border-color)' }}>
        <Wallet size={48} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
        <h2>Sua Conta de Recebimentos está Ativa!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>ID da Carteira: <strong>{walletId}</strong></p>
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '8px', color: 'var(--success)' }}>
          ✅ Quando suas clientes pagarem pelo link do app, o dinheiro (descontado a taxa) cairá automaticamente na sua conta Asaas.
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Conta de Recebimentos (Asaas)</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Crie sua conta digital gratuita no Asaas para receber pagamentos das clientes automaticamente com Split.</p>
      </div>
      
      {msg && (
        <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', backgroundColor: msg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: msg.type === 'error' ? 'var(--danger)' : 'var(--success)' }}>
          {msg.text}
        </div>
      )}

      <form className="card" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="input-group" style={{ gridColumn: '1 / -1' }}><label>Nome Completo (ou Razão Social)</label><input type="text" className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
        <div className="input-group"><label>CPF ou CNPJ (só números)</label><input type="text" className="form-input" required value={formData.cpfCnpj} onChange={e => setFormData({...formData, cpfCnpj: e.target.value})} /></div>
        <div className="input-group"><label>Email</label><input type="email" className="form-input" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
        <div className="input-group"><label>Celular (só números com DDD)</label><input type="text" className="form-input" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
        <div className="input-group"><label>CEP</label><input type="text" className="form-input" required value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} /></div>
        <div className="input-group" style={{ gridColumn: '1 / -1' }}><label>Endereço</label><input type="text" className="form-input" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
        <div className="input-group"><label>Número</label><input type="text" className="form-input" required value={formData.addressNumber} onChange={e => setFormData({...formData, addressNumber: e.target.value})} /></div>
        <div className="input-group"><label>Bairro</label><input type="text" className="form-input" required value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})} /></div>
        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Criando Conta Segura...' : 'Criar Conta de Recebimentos'}
          </button>
        </div>
      </form>
    </div>
  );
};

const AgendaView = () => {
  const { appointments, profile } = useAppContext();
  
  const handleShare = () => {
    const link = `https://mynailsapp.com.br/pro/${profile?.user_id}`;
    navigator.clipboard.writeText(link);
    alert(`Link copiado! Envie para suas clientes:\n${link}`);
  };

  return (
    <div className="animate-in">
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--primary-color)', color: 'white' }}>
        <div>
          <h3 style={{ marginBottom: '0.25rem' }}>Seu Link de Agendamento</h3>
          <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>Envie no WhatsApp ou coloque no Instagram para as clientes agendarem sozinhas.</p>
        </div>
        <button className="btn" style={{ backgroundColor: 'white', color: 'var(--primary-color)', display: 'flex', gap: '0.5rem', alignItems: 'center' }} onClick={handleShare}>
          <Share2 size={18} /> Copiar Link
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Agenda de Hoje</h2>
        <span className="badge badge-success">Confirmação Automática Ativada</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {appointments.length === 0 && <p>Nenhum agendamento encontrado.</p>}
        {appointments.map((apt) => (
          <div key={apt.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--primary-color)' }}>{apt.time}</div>
              <div>
                <div style={{ fontWeight: 500, fontSize: '1.1rem' }}>{apt.client}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{apt.service}</div>
              </div>
            </div>
            <span className="badge badge-success">{apt.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ClientesView = () => {
  const { clients, addClient } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [view, setView] = useState('list'); // list or anamnese

  return (
    <div className="animate-in">
      {view === 'list' ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Meus Clientes</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-outline" onClick={() => setView('anamnese')}><ClipboardList size={18} /> Ficha de IA</button>
              <button className="btn btn-primary" onClick={() => setIsAdding(true)}><Plus size={18} /> Novo Cliente</button>
            </div>
          </div>
          
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: 'var(--bg-color)' }}>
                <tr>
                  <th style={{ padding: '1rem' }}>Nome</th>
                  <th style={{ padding: '1rem' }}>Telefone</th>
                  <th style={{ padding: '1rem' }}>Último Serviço</th>
                  <th style={{ padding: '1rem' }}>Data da Volta</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <tr key={c.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{c.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{c.phone}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{c.lastService || '-'}</td>
                    <td style={{ padding: '1rem' }}>
                      {c.return_date ? (
                        <span className="badge badge-primary">{new Date(c.return_date).toLocaleDateString()}</span>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Não agendado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isAdding && <NewClientModal onClose={() => setIsAdding(false)} onSave={addClient} />}
        </>
      ) : (
        <AnamneseForm onBack={() => setView('list')} />
      )}
    </div>
  );
};

const AnamneseForm = ({ onBack }) => {
  const { isPremium, trialDaysLeft } = useAppContext();
  const [recommendation, setRecommendation] = useState(null);
  const handleRecommend = (e) => {
    e.preventDefault();
    if (!isPremium && trialDaysLeft === 0) {
      alert("Seu período de teste acabou! Assine o plano Avançado para usar a Ficha Inteligente com IA.");
      return;
    }
    setRecommendation({ service: "Blindagem / Banho de Gel", reason: "Baseado no histórico de unhas fracas e desejo de manter o comprimento natural." });
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClipboardList size={24} color="var(--primary-color)" /> Ficha Inteligente
          </h2>
          <button className="btn btn-outline" onClick={onBack}>Voltar</button>
        </div>
        <form onSubmit={handleRecommend}>
          <div className="input-group">
            <label>Estado atual das unhas</label>
            <select className="form-input"><option>Fracas e Quebradiças</option><option>Normais</option></select>
          </div>
          <div className="input-group">
            <label>O que a cliente deseja?</label>
            <select className="form-input"><option>Apenas manter esmalte por mais tempo (sem alongar)</option><option>Alongar</option></select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Gerar Recomendação da IA</button>
        </form>
      </div>
      {recommendation && (
        <div className="card" style={{ backgroundColor: 'var(--secondary-color)', color: 'white' }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Recomendação IA</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white', marginBottom: '1rem' }}>{recommendation.service}</div>
          <p style={{ color: '#cccccc' }}>{recommendation.reason}</p>
        </div>
      )}
    </div>
  );
};

const CatalogoView = () => {
  const { services, addService, products, addProduct } = useAppContext();
  const [isAddingService, setIsAddingService] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [tab, setTab] = useState('servicos'); // 'servicos' ou 'produtos'

  const hands = services.filter(s => s.category === 'Mãos');
  const feet = services.filter(s => s.category === 'Pés');

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button className={`btn ${tab === 'servicos' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('servicos')} style={{ flex: 1 }}>Serviços</button>
        <button className={`btn ${tab === 'produtos' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('produtos')} style={{ flex: 1 }}>Produtos (Loja)</button>
      </div>

      {tab === 'servicos' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Serviços</h2>
            <button className="btn btn-outline" onClick={() => setIsAddingService(true)}><Plus size={18} /> Novo Serviço</button>
          </div>
          
          {isAddingService && <NewServiceModal onClose={() => setIsAddingService(false)} onSave={addService} />}

          <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Mãos</h3>
          <div className="grid-cards" style={{ marginBottom: '2rem' }}>
            {hands.map((svc) => (
              <div key={svc.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
                <h3 style={{ fontSize: '1rem' }}>{svc.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span>{svc.duration}</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>R$ {svc.price}</span>
                </div>
              </div>
            ))}
          </div>
          
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Pés</h3>
          <div className="grid-cards">
            {feet.map((svc) => (
              <div key={svc.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
                <h3 style={{ fontSize: '1rem' }}>{svc.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span>{svc.duration}</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>R$ {svc.price}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'produtos' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Lojinha</h2>
            <button className="btn btn-outline" onClick={() => setIsAddingProduct(true)}><Plus size={18} /> Novo Produto</button>
          </div>

          {isAddingProduct && <NewProductModal onClose={() => setIsAddingProduct(false)} onSave={addProduct} />}

          <div className="grid-cards">
            {products.map(prod => (
              <div key={prod.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {prod.photo_url && <img src={prod.photo_url} alt={prod.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />}
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem' }}>{prod.name}</h3>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{prod.description}</p>
                  <div style={{ fontWeight: 600, color: 'var(--primary-color)' }}>R$ {prod.price}</div>
                </div>
              </div>
            ))}
            {products.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>Nenhum produto cadastrado para venda.</p>}
          </div>
        </>
      )}
    </div>
  );
};

const FinanceiroView = () => {
  const { transactions, addTransaction, isPremium, trialDaysLeft } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);

  if (!isPremium && trialDaysLeft === 0) return <PremiumLockView featureName="Controle Financeiro Completo" />;

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Controle Financeiro</h2>
        <button className="btn btn-outline" onClick={() => setIsAdding(true)}><Plus size={18} /> Nova Transação</button>
      </div>

      {isAdding && <NewTransactionModal onClose={() => setIsAdding(false)} onSave={addTransaction} />}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Entradas</p>
          <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem', color: 'var(--success)' }}>R$ {totalIncome.toFixed(2)}</h3>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Saídas</p>
          <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem', color: 'var(--danger)' }}>R$ {totalExpense.toFixed(2)}</h3>
        </div>
        <div className="card" style={{ backgroundColor: 'var(--secondary-color)', color: 'white' }}>
          <p style={{ color: '#ccc', fontSize: '0.9rem' }}>Saldo Atual</p>
          <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem', color: 'white' }}>R$ {balance.toFixed(2)}</h3>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: 'var(--bg-color)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Descrição</th>
              <th style={{ padding: '1rem' }}>Data</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                  {t.type === 'income' ? <ArrowUpCircle size={16} color="var(--success)" /> : <ArrowDownCircle size={16} color="var(--danger)" />}
                  {t.description}
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{t.date}</td>
                <td style={{ padding: '1rem', textAlign: 'right', color: t.type === 'income' ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                  {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EstoqueView = () => {
  const { inventory, addMaterial, isPremium, trialDaysLeft } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);

  if (!isPremium && trialDaysLeft === 0) return <PremiumLockView featureName="Controle Inteligente de Estoque" />;

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Estoque de Materiais</h2>
        <button className="btn btn-outline" onClick={() => setIsAdding(true)}><Plus size={18} /> Novo Material</button>
      </div>

      {isAdding && <NewMaterialModal onClose={() => setIsAdding(false)} onSave={addMaterial} />}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: 'var(--bg-color)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Item / Material</th>
              <th style={{ padding: '1rem' }}>Quantidade Atual</th>
              <th style={{ padding: '1rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{item.name}</td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{item.quantity}</td>
                <td style={{ padding: '1rem' }}>
                  <span className="badge" style={{ backgroundColor: item.status === 'OK' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: item.status === 'OK' ? 'var(--success)' : 'var(--danger)' }}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AssinaturaView = () => {
  const { isPremium, upgradeToPremium, trialDaysLeft, profile } = useAppContext();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      const dbPlans = await fetchAllPlans();
      if (dbPlans && dbPlans.length > 0) {
        setPlans(dbPlans.filter(p => p.active));
      }
      setLoadingPlans(false);
    };
    loadPlans();
  }, []);

  const handleCheckout = async (planName, price) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const email = user?.primaryEmailAddress?.emailAddress || 'manicure@mynails.app.br';
      const name = user?.fullName || profile?.name || 'Manicure Profissional';
      const checkoutUrl = await createPaymentLink(planName, price, name, email);
      window.open(checkoutUrl, '_blank');
      
      alert(`A tela de pagamento do Asaas para o Plano ${planName} foi aberta!\n\nNa vida real, a conta só é liberada após o webhook do Asaas confirmar o Pix. Para testes, vamos liberar agora.`);
      upgradeToPremium();
    } catch (err) {
      setErrorMsg(`Erro: ${err.message || 'Verifique o console.'}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isPremium) return (
    <div className="animate-in card" style={{ padding: '3rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--success), #059669)', color: 'white' }}>
      <Award size={48} color="white" style={{ margin: '0 auto 1rem' }} />
      <h2 style={{ marginBottom: '1rem', color: 'white' }}>Assinatura Ativa! 🌟</h2>
      <p style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '500px', margin: '0 auto' }}>
        Seu negócio está operando com poder máximo. Todos os relatórios e ferramentas estão desbloqueados.
      </p>
    </div>
  );

  return (
    <div className="animate-in">
      {!isPremium && (
        <div style={{ backgroundColor: trialDaysLeft > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: trialDaysLeft > 0 ? 'var(--success)' : 'var(--danger)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', marginBottom: '2rem', border: `1px solid ${trialDaysLeft > 0 ? 'var(--success)' : 'var(--danger)'}` }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
            {trialDaysLeft > 0 ? `Seu Período de Teste Grátis termina em ${trialDaysLeft} dias!` : 'Seu Período de Teste Acabou!'}
          </h3>
          <p style={{ margin: '0.5rem 0 0', opacity: 0.9 }}>
            {trialDaysLeft > 0 ? 'Aproveite para testar todas as funcionalidades. Assine um plano para não perder o acesso.' : 'Escolha um plano abaixo para continuar usando o aplicativo e impulsionar suas vendas.'}
          </p>
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2>Escolha o Plano Ideal</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Foque em fazer unhas incríveis. Nós cuidamos do resto.</p>
        {errorMsg && <div style={{ color: '#ef4444', marginTop: '1rem', padding: '0.5rem', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '8px', display: 'inline-block' }}>{errorMsg}</div>}
      </div>

      {loadingPlans ? (
        <p style={{ textAlign: 'center' }}>Carregando planos...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {plans.map((plan, index) => (
            <div key={plan.id} className="card" style={{ display: 'flex', flexDirection: 'column', border: index === 1 ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', position: 'relative' }}>
              {index === 1 && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--primary-color)', color: 'white', padding: '2px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>MAIS POPULAR</div>
              )}
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{plan.name}</h3>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '1.5rem' }}>R$ {plan.price}<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/{plan.billing_cycle}</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {plan.features.split(',').map((feat, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.5rem' }}><Sparkles size={18} color="var(--success)" /> {feat.trim()}</li>
                ))}
              </ul>
              <button className={`btn ${index === 1 ? 'btn-primary' : 'btn-outline'}`} onClick={() => handleCheckout(plan.name, plan.price)} disabled={loading}>Assinar {plan.name}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente para bloquear telas de usuários grátis
const PremiumLockView = ({ featureName }) => (
  <div className="animate-in card" style={{ padding: '4rem 2rem', textAlign: 'center', border: '2px dashed var(--border-color)' }}>
    <Award size={48} color="var(--primary-color)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
    <h2 style={{ marginBottom: '1rem' }}>Função Bloqueada</h2>
    <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 2rem' }}>
      O <strong>{featureName}</strong> é uma funcionalidade exclusiva do Plano Premium. Assine para desbloquear todo o poder do My Nails!
    </p>
  </div>
);

/* ----- MODALS ----- */
// Helper to create basic modals
const ModalWrapper = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
    <div className="card animate-in" style={{ width: '400px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>{title}</h2>
        <button onClick={onClose}><X size={20} color="var(--text-secondary)" /></button>
      </div>
      {children}
    </div>
  </div>
);

const NewBookingModal = ({ onClose }) => {
  const { addAppointment, services } = useAppContext();
  const [client, setClient] = useState('');
  const [service, setService] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (client && service && time) {
      addAppointment({ client, service, time, status: 'Confirmado' });
      onClose();
    }
  };
  return (
    <ModalWrapper title="Novo Agendamento" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="input-group"><label>Nome</label><input type="text" className="form-input" value={client} onChange={e => setClient(e.target.value)} required /></div>
        <div className="input-group"><label>Serviço</label>
          <select className="form-input" value={service} onChange={e => setService(e.target.value)} required>
            <option value="">Selecione...</option>
            {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        </div>
        <div className="input-group"><label>Horário</label><input type="time" className="form-input" value={time} onChange={e => setTime(e.target.value)} required /></div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Agendar</button>
      </form>
    </ModalWrapper>
  );
};

const NewServiceModal = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Mãos');
  const handleSubmit = (e) => { e.preventDefault(); onSave({ name, price: parseFloat(price) || price, category, duration: '1h' }); onClose(); };
  return (
    <ModalWrapper title="Novo Serviço" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Nome</label>
          <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} list="service-suggestions" required />
          <datalist id="service-suggestions">
            <option value="Manicure Simples" />
            <option value="Pedicure Simples" />
            <option value="Alongamento em Gel" />
            <option value="Blindagem" />
            <option value="Esmaltação em Gel" />
            <option value="Manutenção de Gel" />
            <option value="Spa dos Pés" />
          </datalist>
        </div>
        <div className="input-group"><label>Preço</label><input type="number" className="form-input" value={price} onChange={e => setPrice(e.target.value)} required /></div>
        <div className="input-group"><label>Categoria</label>
          <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}><option>Mãos</option><option>Pés</option></select>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Salvar</button>
      </form>
    </ModalWrapper>
  );
};

const NewTransactionModal = ({ onClose, onSave }) => {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const handleSubmit = (e) => { e.preventDefault(); onSave({ description: desc, amount: parseFloat(amount), type, date: new Date().toISOString().split('T')[0] }); onClose(); };
  return (
    <ModalWrapper title="Nova Transação" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Descrição</label>
          <input type="text" className="form-input" value={desc} onChange={e => setDesc(e.target.value)} list="tx-suggestions" required />
          <datalist id="tx-suggestions">
            <option value="Compra de Esmaltes" />
            <option value="Conta de Luz" />
            <option value="Aluguel do Espaço" />
            <option value="Internet" />
            <option value="Compra de Lixas e Acetona" />
            <option value="Manutenção da Estufa/Motor" />
          </datalist>
        </div>
        <div className="input-group"><label>Valor (R$)</label><input type="number" className="form-input" value={amount} onChange={e => setAmount(e.target.value)} required /></div>
        <div className="input-group"><label>Tipo</label>
          <select className="form-input" value={type} onChange={e => setType(e.target.value)}><option value="income">Entrada (Receita)</option><option value="expense">Saída (Despesa)</option></select>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Salvar</button>
      </form>
    </ModalWrapper>
  );
};

const NewMaterialModal = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [quantity, setQty] = useState('');
  const [status, setStatus] = useState('OK');
  const handleSubmit = (e) => { e.preventDefault(); onSave({ name, current: parseInt(quantity) || 0, min: 0, status }); onClose(); };
  return (
    <ModalWrapper title="Novo Material" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Nome do Produto</label>
          <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} list="mat-suggestions" required />
          <datalist id="mat-suggestions">
            <option value="Algodão (Pacote)" />
            <option value="Acetona (Litro)" />
            <option value="Palitos de Laranjeira" />
            <option value="Lixas (Pacote)" />
            <option value="Base Fortalecedora" />
            <option value="Top Coat" />
            <option value="Gel Construtor (Pote)" />
            <option value="Luvas Descartáveis (Caixa)" />
          </datalist>
        </div>
        <div className="input-group"><label>Quantidade</label><input type="text" className="form-input" value={quantity} onChange={e => setQty(e.target.value)} required /></div>
        <div className="input-group"><label>Status</label>
          <select className="form-input" value={status} onChange={e => setStatus(e.target.value)}><option value="OK">OK (Tem bastante)</option><option value="Baixo">Baixo (Comprar logo)</option></select>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Salvar</button>
      </form>
    </ModalWrapper>
  );
};

const NewClientModal = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const handleSubmit = (e) => { e.preventDefault(); onSave({ name, phone, lastService: '-', points: 0 }); onClose(); };
  return (
    <ModalWrapper title="Novo Cliente" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="input-group"><label>Nome</label><input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required /></div>
        <div className="input-group"><label>Telefone</label><input type="tel" className="form-input" value={phone} onChange={e => setPhone(e.target.value)} required /></div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Salvar Cliente</button>
      </form>
    </ModalWrapper>
  );
};

const NewPortfolioModal = ({ onClose, onSave }) => {
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      const uploadedUrl = await uploadImage(e.target.files[0]);
      if (uploadedUrl) setUrl(uploadedUrl);
      setUploading(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); onSave({ media_url: url, type: 'photo', description: desc }); onClose(); };
  return (
    <ModalWrapper title="Adicionar Trabalho" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Escolher Foto</label>
          <input type="file" accept="image/*" className="form-input" onChange={handleFile} required={!url} />
          {uploading && <small style={{ color: 'var(--primary-color)' }}>Enviando imagem...</small>}
          {url && !uploading && <small style={{ color: 'var(--success)' }}>Imagem carregada com sucesso!</small>}
        </div>
        <div className="input-group"><label>Legenda / Descrição</label><textarea className="form-input" value={desc} onChange={e => setDesc(e.target.value)} required></textarea></div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={uploading || !url}>Salvar</button>
      </form>
    </ModalWrapper>
  );
};

const NewProductModal = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      const uploadedUrl = await uploadImage(e.target.files[0]);
      if (uploadedUrl) setUrl(uploadedUrl);
      setUploading(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); onSave({ name, price: parseFloat(price) || price, description: desc, photo_url: url }); onClose(); };
  return (
    <ModalWrapper title="Novo Produto" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="input-group"><label>Nome</label><input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required /></div>
        <div className="input-group"><label>Preço (R$)</label><input type="number" className="form-input" value={price} onChange={e => setPrice(e.target.value)} required /></div>
        <div className="input-group"><label>Descrição</label><textarea className="form-input" value={desc} onChange={e => setDesc(e.target.value)}></textarea></div>
        <div className="input-group">
          <label>Foto do Produto</label>
          <input type="file" accept="image/*" className="form-input" onChange={handleFile} />
          {uploading && <small style={{ color: 'var(--primary-color)' }}>Enviando imagem...</small>}
          {url && !uploading && <small style={{ color: 'var(--success)' }}>Imagem carregada com sucesso!</small>}
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={uploading}>Salvar Produto</button>
      </form>
    </ModalWrapper>
  );
};

export default ProfessionalView;
