import React, { useState, useEffect } from 'react';
import { fetchAllProfiles, fetchAllPlans, insertPlan, updatePlan, deletePlan, deleteProfile } from './services/database';
import { Users, CreditCard, Trash2, Edit, Plus, RefreshCw, AlertCircle } from 'lucide-react';

const AdminView = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profiles, setProfiles] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState({ name: '', price: '', billing_cycle: 'Mensal', features: '', active: true });

  const loadData = async () => {
    setLoading(true);
    const [pfs, pls] = await Promise.all([fetchAllProfiles(), fetchAllPlans()]);
    setProfiles(pfs || []);
    setPlans(pls || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteProfile = async (id, name) => {
    if (window.confirm(`ATENÇÃO! Tem certeza que deseja DELETAR o usuário ${name}?\nEsta ação removerá todos os dados do banco de dados.`)) {
      await deleteProfile(id);
      loadData();
    }
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (editingPlan) {
      await updatePlan(editingPlan.id, planForm);
    } else {
      await insertPlan(planForm);
    }
    setShowPlanModal(false);
    loadData();
  };

  const openEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanForm({ name: plan.name, price: plan.price, billing_cycle: plan.billing_cycle, features: plan.features, active: plan.active });
    setShowPlanModal(true);
  };

  const openNewPlan = () => {
    setEditingPlan(null);
    setPlanForm({ name: '', price: '', billing_cycle: 'Mensal', features: '', active: true });
    setShowPlanModal(true);
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando dados do Admin...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }} className="animate-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary-color)' }}>👑 Painel Master</h1>
        <button className="btn btn-outline" onClick={loadData}><RefreshCw size={18} /> Atualizar</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('dashboard')}>Resumo</button>
        <button className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('users')}><Users size={18} style={{marginRight: '8px', verticalAlign:'middle'}}/> Usuários</button>
        <button className={`btn ${activeTab === 'plans' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('plans')}><CreditCard size={18} style={{marginRight: '8px', verticalAlign:'middle'}}/> Planos</button>
      </div>

      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
            <h3 style={{ color: 'var(--text-secondary)' }}>Total de Usuários Cadastrados</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0' }}>{profiles.length}</p>
          </div>
          <div className="card" style={{ borderLeft: '4px solid var(--success-color)' }}>
            <h3 style={{ color: 'var(--text-secondary)' }}>Planos Ativos</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0' }}>{plans.filter(p => p.active).length}</p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'var(--bg-color)' }}>
              <tr>
                <th style={{ padding: '1rem' }}>ID (Supabase)</th>
                <th style={{ padding: '1rem' }}>Nome</th>
                <th style={{ padding: '1rem' }}>Criado em</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.id.substring(0,8)}...</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{p.name || 'Sem Nome'}</td>
                  <td style={{ padding: '1rem' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button className="btn" style={{ padding: '0.5rem', color: 'white', backgroundColor: 'var(--danger-color)' }} onClick={() => handleDeleteProfile(p.id, p.name)} title="Excluir Usuário">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {profiles.length === 0 && <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center' }}>Nenhum usuário encontrado.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'plans' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="btn btn-primary" onClick={openNewPlan}><Plus size={18} style={{marginRight: '8px', verticalAlign:'middle'}}/> Criar Novo Plano</button>
          </div>
          <div className="grid-cards">
            {plans.map(plan => (
              <div key={plan.id} className="card" style={{ opacity: plan.active ? 1 : 0.6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{plan.name} {plan.active ? '' : '(Inativo)'}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => openEditPlan(plan)}><Edit size={16}/></button>
                  </div>
                </div>
                <p style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>R$ {plan.price} <span style={{fontSize:'1rem', color:'var(--text-secondary)', fontWeight:'normal'}}>/ {plan.billing_cycle}</span></p>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '0' }}>
                  {plan.features.split(',').map((f, i) => <li key={i}>{f.trim()}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL PLANOS */}
      {showPlanModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>{editingPlan ? 'Editar Plano' : 'Novo Plano'}</h2>
            <form onSubmit={handleSavePlan} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div className="input-group">
                <label>Nome do Plano</label>
                <input type="text" className="form-input" required value={planForm.name} onChange={e => setPlanForm({...planForm, name: e.target.value})} placeholder="Ex: Mensal Básico" />
              </div>
              <div className="input-group">
                <label>Preço (R$)</label>
                <input type="number" step="0.01" className="form-input" required value={planForm.price} onChange={e => setPlanForm({...planForm, price: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Ciclo de Cobrança (Para exibição)</label>
                <input type="text" className="form-input" required value={planForm.billing_cycle} onChange={e => setPlanForm({...planForm, billing_cycle: e.target.value})} placeholder="Ex: Mensal, Anual" />
              </div>
              <div className="input-group">
                <label>Vantagens (Separadas por vírgula)</label>
                <textarea className="form-input" required rows={3} value={planForm.features} onChange={e => setPlanForm({...planForm, features: e.target.value})} placeholder="Agenda Ilimitada, Suporte 24h, Relatórios VIP" />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={planForm.active} onChange={e => setPlanForm({...planForm, active: e.target.checked})} />
                Plano Ativo (Visível para venda)
              </label>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Salvar</button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowPlanModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminView;
