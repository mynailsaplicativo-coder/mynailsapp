import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  fetchAppointments, insertAppointment, 
  fetchServices, insertService,
  fetchInventory, insertMaterial,
  fetchTransactions, insertTransaction,
  fetchClients, insertClient,
  fetchProfile
} from '../services/database';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [clients, setClients] = useState([]);
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
        const [appts, svcs, inv, tx, cls] = await Promise.all([
          fetchAppointments(),
          fetchServices(),
          fetchInventory(),
          fetchTransactions(),
          fetchClients()
        ]);

        setAppointments(appts || []);
        setServices(svcs || []);
        setInventory(inv || []);
        setTransactions(tx || []);
        setClients(cls || []);
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
    const data = await insertAppointment(appointment);
    if (data) setAppointments([...appointments, data]);
  };

  const addService = async (service) => {
    const data = await insertService(service);
    if (data) setServices([...services, data]);
  };

  const addMaterial = async (material) => {
    const data = await insertMaterial(material);
    if (data) setInventory([...inventory, data]);
  };

  const addTransaction = async (transaction) => {
    const data = await insertTransaction(transaction);
    if (data) setTransactions([...transactions, data]);
  };

  const addClient = async (client) => {
    const data = await insertClient(client);
    if (data) setClients([...clients, data]);
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
      clients, addClient
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
