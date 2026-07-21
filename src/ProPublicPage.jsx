import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProfile, fetchServices, insertAppointment, insertClient, fetchPortfolio, fetchProducts, fetchReviews } from './services/database';
import { createSplitPayment } from './services/asaas';
import { MapPin, Calendar, Clock, ArrowLeft, CheckCircle2, Star, MessageCircle, Image, ShoppingBag, Scissors } from 'lucide-react';
import { useUser } from '@clerk/clerk-react'; // Para ver se o cliente já está logado

const ProPublicPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [pro, setPro] = useState(null);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('servicos'); // servicos, portfolio, loja, avaliacoes

  const [selectedService, setSelectedService] = useState(null);
  const [step, setStep] = useState(1); // 1: Serviços, 2: Agendamento, 3: Confirmação
  
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [clientName, setClientName] = useState(user?.fullName || '');
  const [clientPhone, setClientPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadProData = async () => {
      setLoading(true);
      try {
        const proProfile = await fetchProfile(id);
        if (!proProfile || proProfile.role !== 'pro') {
          setError('Profissional não encontrado.');
          return;
        }
        setPro(proProfile);
        
        const proServices = await fetchServices(id);
        setServices(proServices || []);
        
        const [port, prod, revs] = await Promise.all([
          fetchPortfolio(id),
          fetchProducts(id),
          fetchReviews(id)
        ]);
        setPortfolio(port || []);
        setProducts(prod || []);
        setReviews(revs || []);
      } catch (err) {
        setError('Erro ao carregar os dados.');
      } finally {
        setLoading(false);
      }
    };
    loadProData();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!date || !time || !clientName) return alert('Preencha os campos obrigatórios!');
    
    setIsProcessing(true);
    try {
      // 1. Salva no CRM da Manicure
      await insertClient({
        name: clientName,
        phone: clientPhone,
        frequency: 'Novo Cliente',
        notes: 'Agendou pelo Link Público'
      }, id); // user_id = id da manicure

      // 2. Simula Pagamento Split
      const invoiceUrl = await createSplitPayment({
        clientName: clientName,
        clientEmail: user?.primaryEmailAddress?.emailAddress || 'cliente@mynails.app.br',
        value: selectedService.price,
        description: `Pagamento de ${selectedService.name} com ${pro.name}`,
        splitWalletId: pro.wallet_id // Carteira da manicure
      });
      
      // 3. Salva na Agenda da Manicure
      await insertAppointment({
        client: clientName,
        service: selectedService.name,
        date: date,
        time: time,
        status: 'Aguardando Pagamento'
      }, id); // user_id = id da manicure
      
      setStep(3);
      alert('Redirecionando para a página de pagamento seguro (Asaas).');
      window.open(invoiceUrl, '_blank');
      
    } catch (err) {
      console.error(err);
      alert('Erro ao agendar.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando Perfil...</div>;
  if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div className="app-container" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Header */}
      <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--surface-color)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Agendamento</h1>
      </div>

      {/* Pro Profile Header */}
      <div style={{ padding: '2rem 1.5rem', backgroundColor: 'var(--primary-color)', color: 'white' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <img 
            src={pro.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(pro.name)}&background=random`} 
            alt={pro.name} 
            style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid white', objectFit: 'cover' }}
          />
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{pro.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>
              <MapPin size={16} />
              <span>{pro.city}, {pro.state}</span>
            </div>
            {pro.description && <p style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.4 }}>{pro.description}</p>}
          </div>
        </div>
        {pro.whatsapp && (
          <a href={`https://wa.me/55${pro.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="btn" style={{ backgroundColor: '#25D366', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem', padding: '0.75rem', width: '100%', textDecoration: 'none' }}>
            <MessageCircle size={20} /> Falar no WhatsApp
          </a>
        )}
      </div>

      <div style={{ padding: '1.5rem' }}>
        {step === 1 && (
          <div className="animate-in">
            {/* Nav Tabs */}
            <div style={{ display: 'flex', overflowX: 'auto', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', scrollbarWidth: 'none' }}>
              <button className={`btn ${activeTab === 'servicos' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('servicos')} style={{ whiteSpace: 'nowrap', borderRadius: '20px', padding: '0.5rem 1rem' }}><Scissors size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> Serviços</button>
              <button className={`btn ${activeTab === 'portfolio' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('portfolio')} style={{ whiteSpace: 'nowrap', borderRadius: '20px', padding: '0.5rem 1rem' }}><Image size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> Portfólio</button>
              <button className={`btn ${activeTab === 'loja' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('loja')} style={{ whiteSpace: 'nowrap', borderRadius: '20px', padding: '0.5rem 1rem' }}><ShoppingBag size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> Loja</button>
              <button className={`btn ${activeTab === 'avaliacoes' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('avaliacoes')} style={{ whiteSpace: 'nowrap', borderRadius: '20px', padding: '0.5rem 1rem' }}><Star size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> Avaliações</button>
            </div>

            {activeTab === 'servicos' && (
              <>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Escolha um Serviço</h3>
            {services.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>Esta profissional ainda não cadastrou serviços.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {services.map(service => (
                  <div key={service.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{service.name}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{service.duration}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>R$ {service.price}</p>
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                        onClick={() => { setSelectedService(service); setStep(2); }}
                      >
                        Selecionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="grid-cards">
                {portfolio.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>Nenhuma foto ainda.</p> : portfolio.map(item => (
                  <div key={item.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <img src={item.media_url} alt="Trabalho" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                    <div style={{ padding: '1rem' }}><p style={{ margin: 0, fontSize: '0.9rem' }}>{item.description}</p></div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'loja' && (
              <div className="grid-cards">
                {products.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>Nenhum produto à venda.</p> : products.map(prod => (
                  <div key={prod.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    {prod.photo_url && <img src={prod.photo_url} alt={prod.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />}
                    <div style={{ padding: '1rem' }}>
                      <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem' }}>{prod.name}</h3>
                      <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{prod.description}</p>
                      <div style={{ fontWeight: 600, color: 'var(--primary-color)', marginBottom: '1rem' }}>R$ {prod.price}</div>
                      <a href={`https://wa.me/55${(pro.whatsapp||'').replace(/\D/g,'')}?text=Oi! Gostaria de comprar o produto: ${prod.name}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }}>Comprar pelo WhatsApp</a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'avaliacoes' && (
              <div className="grid-cards">
                {reviews.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>Nenhuma avaliação ainda.</p> : reviews.map(rev => (
                  <div key={rev.id} className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: 600 }}>{rev.client_name}</div>
                      <div style={{ display: 'flex', color: '#FFD700' }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < rev.rating ? '#FFD700' : 'none'} stroke={i < rev.rating ? '#FFD700' : 'var(--text-secondary)'} />)}
                      </div>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="animate-in">
            <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', marginBottom: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ArrowLeft size={16} /> Voltar aos serviços
            </button>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Confirmar Agendamento</h3>
            
            <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: 'rgba(255,107,107,0.05)' }}>
              <h4 style={{ marginBottom: '0.25rem' }}>{selectedService.name}</h4>
              <p style={{ color: 'var(--primary-color)', fontWeight: 600 }}>R$ {selectedService.price} • {selectedService.duration}</p>
            </div>

            <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label><Calendar size={16} style={{ verticalAlign: 'middle' }}/> Data</label>
                  <input type="date" className="form-input" required value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="input-group">
                  <label><Clock size={16} style={{ verticalAlign: 'middle' }}/> Horário</label>
                  <input type="time" className="form-input" required value={time} onChange={e => setTime(e.target.value)} />
                </div>
              </div>

              <div className="input-group">
                <label>Seu Nome Completo</label>
                <input type="text" className="form-input" required value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Como gostaria de ser chamada?" />
              </div>
              <div className="input-group">
                <label>Seu Telefone (WhatsApp)</label>
                <input type="tel" className="form-input" required value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="(11) 99999-9999" />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }} disabled={isProcessing}>
                {isProcessing ? 'Processando...' : `Pagar R$ ${selectedService.price} e Agendar`}
              </button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <CheckCircle2 size={64} color="var(--success-color)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Pedido de Agendamento Enviado!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Você será redirecionada para a página de pagamento seguro. O horário será confirmado automaticamente após o pagamento.
            </p>
            <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => navigate('/')}>
              Voltar para o início
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProPublicPage;
