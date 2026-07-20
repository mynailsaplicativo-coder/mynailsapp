import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, TrendingUp, Users } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: 'var(--surface-color)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 5%', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
          <Sparkles size={32} />
          <h1 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 700 }}>My Nails</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" onClick={() => navigate('/login')}>Fazer Login</button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '6rem 5%', textAlign: 'center', background: 'linear-gradient(135deg, var(--bg-color), #ffe6f0)' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2 }}>
          O Futuro do seu <span style={{ color: 'var(--primary-color)' }}>Nail Studio</span> chegou.
        </h2>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
          Gestão completa, agenda inteligente, controle financeiro e um super aplicativo para encantar suas clientes. Aumente seu faturamento e organize sua vida em um só lugar.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }} onClick={() => navigate('/cadastro?type=pro')}>
            Sou Profissional (Criar Conta)
          </button>
          <button className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.1rem', backgroundColor: 'white' }} onClick={() => navigate('/cadastro?type=client')}>
            Sou Cliente (Agendar)
          </button>
        </div>
      </section>

      {/* Features for Pros */}
      <section style={{ padding: '5rem 5%' }}>
        <h3 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem' }}>Tudo que uma Nail Designer de Sucesso precisa</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ backgroundColor: 'var(--primary-light)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary-color)' }}>
              <TrendingUp size={32} />
            </div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Gestão Financeira</h4>
            <p style={{ color: 'var(--text-secondary)' }}>Controle de entradas, saídas e descubra qual serviço (Fibra, Banho de Gel) é o mais lucrativo para você.</p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ backgroundColor: 'var(--primary-light)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary-color)' }}>
              <ShieldCheck size={32} />
            </div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Controle de Estoque</h4>
            <p style={{ color: 'var(--text-secondary)' }}>Acompanhe seus potes de gel, lixas e primers. O sistema avisa quando está na hora de repor materiais.</p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ backgroundColor: 'var(--primary-light)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary-color)' }}>
              <Users size={32} />
            </div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>App Cliente & Fidelidade</h4>
            <p style={{ color: 'var(--text-secondary)' }}>Suas clientes terão um app para agendar, ver suas unhas (com simulador de IA) e usar a carteirinha de fidelidade.</p>
          </div>

        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section style={{ padding: '5rem 5%', backgroundColor: 'var(--surface-color)', position: 'relative' }}>
        <h3 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem' }}>O que dizem as maiores Nail Designers</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', position: 'relative' }}>
            <div style={{ fontSize: '3rem', color: 'var(--primary-color)', opacity: 0.2, position: 'absolute', top: 10, right: 20 }}>"</div>
            <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
              "Desde que comecei a usar o My Nails, meu faturamento dobrou. Minhas clientes amam o app e o simulador de IA!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Avatar" style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h4 style={{ margin: 0 }}>Camila Souza</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Nail Designer Há 5 anos</span>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', position: 'relative' }}>
            <div style={{ fontSize: '3rem', color: 'var(--primary-color)', opacity: 0.2, position: 'absolute', top: 10, right: 20 }}>"</div>
            <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
              "A confirmação de agendamentos e o controle de estoque automático me poupam horas de trabalho toda semana. É o melhor investimento que fiz."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Avatar" style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h4 style={{ margin: 0 }}>Bruna Silva</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Especialista em Fibras</span>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: '5rem 5%', background: 'linear-gradient(135deg, #fdfbfb, #ebedee)' }}>
        <h3 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>Invista no Seu Negócio</h3>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto' }}>
          Escolha o plano perfeito para o momento do seu estúdio. Comece de graça e faça o upgrade quando crescer.
        </p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', maxWidth: '1000px', margin: '0 auto' }}>
          {/* Free Plan */}
          <div className="card" style={{ flex: '1 1 300px', padding: '3rem 2rem', textAlign: 'center', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Plano Essencial</h4>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2rem' }}>
              Grátis
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <li>✅ Agenda inteligente (limite de 50/mês)</li>
              <li>✅ Cadastro básico de clientes</li>
              <li>✅ Catálogo de serviços simples</li>
              <li style={{ color: 'var(--text-light)' }}>❌ Controle Financeiro Completo</li>
              <li style={{ color: 'var(--text-light)' }}>❌ Gestão de Estoque</li>
              <li style={{ color: 'var(--text-light)' }}>❌ Anamnese com IA</li>
            </ul>
            <button className="btn btn-outline" onClick={() => navigate('/cadastro?type=pro')} style={{ width: '100%' }}>Começar Grátis</button>
          </div>

          {/* Premium Plan */}
          <div className="glass-panel" style={{ flex: '1 1 300px', padding: '3rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--secondary-color), #333)', color: 'white', position: 'relative', transform: 'scale(1.05)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary-color)', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, boxShadow: 'var(--shadow-glow)' }}>
              MAIS POPULAR
            </div>
            <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Plano Profissional</h4>
            <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem', verticalAlign: 'top' }}>R$</span>49<span style={{ fontSize: '1.5rem' }}>,90</span>
            </div>
            <span style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '2rem', display: 'block' }}>por mês</span>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <li>✨ Agenda ilimitada</li>
              <li>✨ Controle Financeiro e DRE</li>
              <li>✨ Controle de Estoque (com alertas)</li>
              <li>✨ App Exclusivo para suas clientes</li>
              <li>✨ Anamnese com Inteligência Artificial</li>
              <li>✨ Destaque na Busca do App</li>
            </ul>
            <button className="btn btn-primary" onClick={() => navigate('/cadastro?type=pro')} style={{ width: '100%' }}>Assinar Agora</button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ padding: '6rem 5%', textAlign: 'center', backgroundColor: 'var(--secondary-color)', color: 'white' }}>
        <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Pronta para lotar sua agenda?</h3>
        <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 3rem' }}>
          Junte-se a centenas de manicures que já profissionalizaram seus estúdios com o My Nails.
        </p>
        <button className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.25rem' }} onClick={() => navigate('/cadastro?type=pro')}>
          Começar Teste Grátis <ArrowRight style={{ display: 'inline', marginLeft: '0.5rem' }} />
        </button>
      </section>
      {/* Footer */}
      <footer style={{ padding: '2rem 5%', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} color="var(--primary-color)" />
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>My Nails &copy; 2026</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span style={{ cursor: 'pointer' }}>Termos de Uso</span>
          <span style={{ cursor: 'pointer' }}>Privacidade</span>
          <span style={{ cursor: 'pointer' }}>Contato</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
