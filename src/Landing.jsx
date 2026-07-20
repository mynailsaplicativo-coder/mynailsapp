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
    </div>
  );
};

export default Landing;
