import React, { useState } from 'react';
import { Calendar as CalendarIcon, Users, Settings, Plus, Sparkles, Scissors, ClipboardList, X, DollarSign, Package, Award, ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import { useAppContext } from './context/AppContext';
import { UserButton } from '@clerk/clerk-react';
import { createPaymentLink, createSubaccount } from './services/asaas';

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
  const { isPremium, upgradeToPremium, trialDaysLeft } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCheckout = async (planName, price) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const checkoutUrl = await createPaymentLink(planName, price);
      window.open(checkoutUrl, '_blank');
      
      alert(`A tela de pagamento do Asaas para o Plano ${planName} foi aberta!\n\nNa vida real, a conta só é liberada após o webhook do Asaas confirmar o Pix. Para testes, vamos liberar agora.`);
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
      <h2 style={{ marginBottom: '1rem', color: 'white' }}>Assinatura Ativa! 🌟</h2>
      <p style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '500px', margin: '0 auto' }}>
        Seu negócio está operando com poder máximo. Todos os relatórios e ferramentas estão desbloqueados.
      </p>
    </div>
  );

  return (
    <div className="animate-in">
      {/* Aviso de Dias de Teste */}
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        
        {/* Básico */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Básico</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '1.5rem' }}>R$ 39,90<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/mês</span></div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={{ display: 'flex', gap: '0.5rem' }}><Sparkles size={18} color="var(--success)" /> Agenda Ilimitada</li>
            <li style={{ display: 'flex', gap: '0.5rem' }}><Sparkles size={18} color="var(--success)" /> Cadastro de Clientes</li>
            <li style={{ display: 'flex', gap: '0.5rem' }}><Sparkles size={18} color="var(--success)" /> Catálogo Local</li>
          </ul>
          <button className="btn btn-outline" onClick={() => handleCheckout('Básico', 39.90)} disabled={loading}>Assinar Básico</button>
        </div>

        {/* Intermediário */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', border: '2px solid var(--primary-color)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--primary-color)', color: 'white', padding: '2px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>MAIS POPULAR</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Intermediário</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '1.5rem' }}>R$ 59,90<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/mês</span></div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={{ display: 'flex', gap: '0.5rem' }}><Sparkles size={18} color="var(--success)" /> Tudo do Básico</li>
            <li style={{ display: 'flex', gap: '0.5rem' }}><Sparkles size={18} color="var(--success)" /> Controle Financeiro</li>
            <li style={{ display: 'flex', gap: '0.5rem' }}><Sparkles size={18} color="var(--success)" /> Gestão de Estoque</li>
          </ul>
          <button className="btn btn-primary" onClick={() => handleCheckout('Intermediário', 59.90)} disabled={loading}>Assinar Intermediário</button>
        </div>

        {/* Avançado */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--secondary-color)', color: 'white' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Avançado</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem' }}>R$ 89,90<span style={{ fontSize: '1rem', color: '#ccc', fontWeight: 400 }}>/mês</span></div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#ccc' }}>
            <li style={{ display: 'flex', gap: '0.5rem' }}><Sparkles size={18} color="var(--primary-light)" /> Tudo do Intermediário</li>
            <li style={{ display: 'flex', gap: '0.5rem' }}><Sparkles size={18} color="var(--primary-light)" /> Relatórios de IA</li>
            <li style={{ display: 'flex', gap: '0.5rem' }}><Sparkles size={18} color="var(--primary-light)" /> Portfólio no app Cliente</li>
          </ul>
          <button className="btn" style={{ backgroundColor: 'white', color: 'var(--secondary-color)', fontWeight: 600, border: 'none', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer' }} onClick={() => handleCheckout('Avançado', 89.90)} disabled={loading}>Assinar Avançado</button>
        </div>

      </div>
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
