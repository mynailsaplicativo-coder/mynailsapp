import React, { useState } from 'react';
import { Calendar as CalendarIcon, Users, Settings, Plus, Sparkles, Scissors, ClipboardList, X, DollarSign, Package, Award, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useAppContext } from './context/AppContext';
import { UserButton } from '@clerk/clerk-react';
import { createPaymentLink } from './services/asaas';

const ProfessionalView = () => {
  const [activeTab, setActiveTab] = useState('agenda');
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Top Header */}
      <div style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles color="var(--primary-color)" size={24} />
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--primary-color)' }}>My Nails Studio</h1>
        </div>
        <UserButton />
      </div>

      {/* Main Content Area */}
      <div className="app-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Olá, Marina 👋</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Resumo do seu estúdio.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsNewBookingOpen(true)} style={{ padding: '0.5rem 1rem' }}>
            <Plus size={18} /> Novo
          </button>
        </div>

        {activeTab === 'agenda' && <AgendaView />}
        {activeTab === 'clientes' && <ClientesView />}
        {activeTab === 'servicos' && <ServicosView />}
        {activeTab === 'financeiro' && <FinanceiroView />}
        {activeTab === 'estoque' && <EstoqueView />}
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
        <button className={`bottom-nav-item ${activeTab === 'estoque' ? 'active' : ''}`} onClick={() => setActiveTab('estoque')}>
          <Package size={22} />
          <span>Estoque</span>
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

const AgendaView = () => {
  const { appointments } = useAppContext();
  return (
    <div className="animate-in">
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
                  <th style={{ padding: '1rem' }}>Pontos (Fidelidade)</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <tr key={c.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{c.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{c.phone}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{c.lastService}</td>
                    <td style={{ padding: '1rem' }}><span className="badge badge-primary">{c.points} selos</span></td>
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
  const { isPremium } = useAppContext();
  const [recommendation, setRecommendation] = useState(null);
  const handleRecommend = (e) => {
    e.preventDefault();
    if (!isPremium) {
      alert("A Anamnese com Inteligência Artificial é exclusiva do Plano Premium!");
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

const ServicosView = () => {
  const { services, addService } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const hands = services.filter(s => s.category === 'Mãos');
  const feet = services.filter(s => s.category === 'Pés');

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Catálogo de Serviços</h2>
        <button className="btn btn-outline" onClick={() => setIsAdding(true)}><Plus size={18} /> Novo Serviço</button>
      </div>
      
      {isAdding && <NewServiceModal onClose={() => setIsAdding(false)} onSave={addService} />}

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
    </div>
  );
};

const FinanceiroView = () => {
  const { transactions, addTransaction, isPremium } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);

  if (!isPremium) return <PremiumLockView featureName="Controle Financeiro Completo" />;

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
  const { inventory, addMaterial, isPremium } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);

  if (!isPremium) return <PremiumLockView featureName="Controle Inteligente de Estoque" />;

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
  const { isPremium, upgradeToPremium } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const checkoutUrl = await createPaymentLink();
      window.open(checkoutUrl, '_blank');
      
      // Simulação do Webhook: Libera o acesso para testes
      alert("A tela de pagamento segura do Asaas foi aberta!\n\nNa vida real, a conta só vira Premium após o webhook do Asaas confirmar o Pix. Para testes, liberamos agora.");
      upgradeToPremium();
    } catch (err) {
      setErrorMsg('Erro de CORS ou Chave Inválida. Verifique o console.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isPremium) return (
    <div className="animate-in card" style={{ padding: '3rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--success), #059669)', color: 'white' }}>
      <Award size={48} color="white" style={{ margin: '0 auto 1rem' }} />
      <h2 style={{ marginBottom: '1rem', color: 'white' }}>Você é Premium! 🌟</h2>
      <p style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '500px', margin: '0 auto' }}>
        Seu portfólio está no topo das buscas, a confirmação automática está ativa e todos os relatórios estão desbloqueados.
      </p>
    </div>
  );

  return (
    <div className="animate-in card" style={{ padding: '3rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--secondary-color), #333)', color: 'white' }}>
      <Award size={48} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
      <h2 style={{ marginBottom: '1rem', color: 'white' }}>Plano Profissional</h2>
      <p style={{ color: '#ccc', maxWidth: '500px', margin: '0 auto 2rem' }}>
        Seu portfólio no topo das buscas do app cliente, confirmação automática de agenda via WhatsApp e relatórios avançados de financeiro e estoque.
      </p>
      {errorMsg && <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '0.5rem', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '8px' }}>{errorMsg}</div>}
      <button className="btn btn-primary" onClick={handleCheckout} disabled={loading}>
        {loading ? 'Gerando Tela de Pagamento...' : 'Ativar Premium (R$ 49,90/mês)'}
      </button>
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
        <div className="input-group"><label>Nome</label><input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required /></div>
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
  const [type, setType] = useState('income');
  const handleSubmit = (e) => { e.preventDefault(); onSave({ description: desc, amount: parseFloat(amount), type, date: new Date().toISOString().split('T')[0] }); onClose(); };
  return (
    <ModalWrapper title="Nova Transação" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="input-group"><label>Descrição</label><input type="text" className="form-input" value={desc} onChange={e => setDesc(e.target.value)} required /></div>
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
  const handleSubmit = (e) => { e.preventDefault(); onSave({ name, quantity, status }); onClose(); };
  return (
    <ModalWrapper title="Novo Material" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="input-group"><label>Nome do Produto</label><input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required /></div>
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

export default ProfessionalView;
