import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  fetchAppointments, insertAppointment, 
  fetchServices, insertService,
  fetchInventory, insertMaterial,
  fetchTransactions, insertTransaction,
  fetchClients, insertClient,
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
  
  const [isPremium, setIsPremium] = useState(false); // Fake profile premium status
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
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const daysLeft = Math.max(0, 15 - diffDays);
      setTrialDaysLeft(daysLeft);
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

        setAppointments(appts || []);
        setServices(svcs || []);
        setInventory(inv || []);
        setTransactions(tx || []);
        setClients(cls || []);
        setPortfolio(port || []);
        setProducts(prod || []);
        setReviews(revs || []);
      } catch (err) {
        console.error("Erro ao carregar dados da nuvem:", err);
      } finally {
        setLoading(false);
      }
    };

    // Só tenta carregar do banco quando o Clerk já resolveu se o user tá logado ou não
    if (isLoaded && user) {
      loadData();
    }
  }, [isLoaded, user]);

  // Actions (Agora salvam na nuvem e depois atualizam o estado local)
  const addAppointment = async (appointment) => {
    const data = await insertAppointment(appointment, user.id);
    if (data && !data.error) setAppointments([...appointments, data]);
    else alert(`Erro ao salvar agendamento: ${data?.error || 'Desconhecido'}`);
  };

  const addService = async (service) => {
    const data = await insertService(service, user.id);
    if (data && !data.error) setServices([...services, data]);
    else alert(`Erro do Supabase: ${data?.error || 'Erro Desconhecido'}\n\nVocê rodou o script CREATE TABLE services no Supabase?`);
  };

  const addMaterial = async (material) => {
    const data = await insertMaterial(material, user.id);
    if (data && !data.error) setInventory([...inventory, data]);
    else alert(`Erro ao salvar material: ${data?.error || 'Desconhecido'}`);
  };

  const addTransaction = async (transaction) => {
    const data = await insertTransaction(transaction, user.id);
    if (data) setTransactions([...transactions, data]);
    else alert('Erro ao salvar transação.');
  };

  const addClient = async (client) => {
    const data = await insertClient(client, user.id);
    if (data && !data.error) setClients([...clients, data]);
    else alert(`Erro ao salvar cliente: ${data?.error || 'Desconhecido'}`);
  };

  const addPortfolio = async (item) => {
    const data = await insertPortfolio(item, user.id);
    if (data) setPortfolio([data, ...portfolio]);
    else alert('Erro ao salvar foto no banco de dados.');
  };

  const addProduct = async (product) => {
    const data = await insertProduct(product, user.id);
    if (data && !data.error) setProducts([...products, data]);
    else alert(`Erro do Supabase: ${data?.error || 'Erro Desconhecido'}`);
  };

  const editProduct = async (productId, updates) => {
    const data = await updateProduct(productId, updates);
    if (data && !data.error) {
      setProducts(products.map(p => p.id === productId ? data : p));
    } else alert(`Erro ao atualizar produto: ${data?.error || 'Erro Desconhecido'}`);
  };

  const removeProduct = async (productId) => {
    const success = await deleteProduct(productId);
    if (success) setProducts(products.filter(p => p.id !== productId));
    else alert('Erro ao deletar produto do Supabase.');
  };

  const addReview = async (review) => {
    const data = await insertReview(review, user.id);
    if (data) setReviews([data, ...reviews]);
    else alert('Erro ao salvar avaliação.');
  };

  const editProfile = async (updates) => {
    const data = await updateProfile(user.id, updates);
    if (data) setProfile(data);
  };

  const upgradeToPremium = () => {
    setIsPremium(true);
    // Aqui atualizaríamos o banco de dados Supabase: updateProfile(user.id, { is_premium: true })
  };

  return (
    <AppContext.Provider value={{ 
      user, profile, setProfile, isPremium, upgradeToPremium, loading, trialDaysLeft,
      walletId, setWalletId,
      appointments, addAppointment, 
      services, addService,
      inventory, addMaterial,
      transactions, addTransaction,
      clients, addClient,
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
