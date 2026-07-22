import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  fetchAppointments, insertAppointment, 
  fetchServices, insertService,
  fetchInventory, insertMaterial,
  fetchTransactions, insertTransaction,
  fetchClients, insertClient, updateClient,
  fetchProfile, updateProfile,
  fetchPortfolio, insertPortfolio,
  fetchProducts, insertProduct, updateProduct, deleteProduct,
  fetchReviews, insertReview
} from '../services/database';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [clients, setClients] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  const [plan, setPlan] = useState('basic'); // 'basic', 'intermediate', 'advanced'
  const [trialDaysLeft, setTrialDaysLeft] = useState(15);
  const [walletId, setWalletId] = useState(null); // Asaas Wallet ID para Split
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null); // Perfis do Marketplace

  useEffect(() => {
    // Calcula os dias de teste baseados na data de criação da conta no Clerk
    if (user && user.createdAt) {
      const createdDate = new Date(user.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - createdDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTrialDaysLeft(Math.max(0, 15 - diffDays));
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (!user) return;
        
        // 1. Busca o perfil do usuário atual
        const userProfile = await fetchProfile(user.id);
        if (userProfile) {
          setProfile(userProfile);
          if (userProfile.wallet_id) setWalletId(userProfile.wallet_id);
          if (userProfile.plan_type) setPlan(userProfile.plan_type);
        }

        // Tenta buscar dados reais do Supabase (para Profissionais)
        const [appts, svcs, inv, tx, cls, port, prod, revs] = await Promise.all([
          fetchAppointments(user.id),
          fetchServices(user.id),
          fetchInventory(user.id),
          fetchTransactions(user.id),
          fetchClients(user.id),
          fetchPortfolio(user.id),
          fetchProducts(user.id),
          fetchReviews(user.id)
        ]);

        if (appts) setAppointments(appts);
        if (svcs) setServices(svcs);
        if (inv) setInventory(inv);
        if (tx) setTransactions(tx);
        if (cls) setClients(cls);
        if (port) setPortfolio(port);
        if (prod) setProducts(prod);
        if (revs) setReviews(revs);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isLoaded) loadData();
  }, [user, isLoaded]);

  // Funções de CRUD delegadas para o Supabase
  const addAppointment = async (apt) => {
    const data = await insertAppointment(apt, user.id);
    if (data && !data.error) setAppointments([...appointments, data]);
    else alert(`Erro ao agendar: ${data?.error || 'Desconhecido'}`);
  };

  const addService = async (service) => {
    const data = await insertService(service, user.id);
    if (data) setServices([...services, data]);
    else alert('Erro ao salvar serviço.');
  };

  const addMaterial = async (item) => {
    const data = await insertMaterial(item, user.id);
    if (data) setInventory([...inventory, data]);
    else alert('Erro ao salvar material.');
  };

  const addTransaction = async (transaction) => {
    const data = await insertTransaction(transaction, user.id);
    if (data) setTransactions([...transactions, data]);
    else alert('Erro ao salvar transação.');
  };

  const addClient = async (client) => {
    if (!user) return;
    const data = await insertClient(client, user.id);
    if (data && !data.error) setClients([...clients, data]);
    else alert(`Erro ao salvar cliente: ${data?.error || 'Desconhecido'}`);
  };

  const editClient = async (clientId, updates) => {
    if (!user) return;
    const data = await updateClient(clientId, updates);
    if (data && !data.error) {
      setClients(clients.map(c => c.id === clientId ? { ...c, ...updates } : c));
    } else {
      alert(`Erro ao atualizar cliente: ${data?.error || 'Desconhecido'}`);
    }
  };

  const addPortfolio = async (item) => {
    const data = await insertPortfolio(item, user.id);
    if (data) setPortfolio([data, ...portfolio]);
    else alert('Erro ao salvar foto no banco de dados.');
  };

  const addProduct = async (product) => {
    const data = await insertProduct(product, user.id);
    if (data && !data.error) setProducts([...products, data]);
    else alert(`Erro ao salvar produto: ${data?.error || 'Desconhecido'}`);
  };

  const editProduct = async (id, updates) => {
    const data = await updateProduct(id, updates);
    if (data) setProducts(products.map(p => p.id === id ? data : p));
  };

  const removeProduct = async (id) => {
    const success = await deleteProduct(id);
    if (success) setProducts(products.filter(p => p.id !== id));
  };

  const addReview = async (review) => {
    const data = await insertReview(review, user.id);
    if (data) setReviews([data, ...reviews]);
  };

  const editProfile = async (updates) => {
    const data = await updateProfile(user.id, updates);
    if (data) setProfile(data);
  };

  const changePlan = async (newPlan) => {
    setPlan(newPlan);
    await updateProfile(user.id, { plan_type: newPlan });
  };

  return (
    <AppContext.Provider value={{ 
      user, profile, setProfile, plan, changePlan, loading, trialDaysLeft,
      walletId, setWalletId,
      appointments, addAppointment, 
      services, addService,
      inventory, addMaterial,
      transactions, addTransaction,
      clients, addClient, editClient,
      portfolio, addPortfolio,
      products, addProduct, editProduct, removeProduct,
      reviews, addReview,
      editProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
