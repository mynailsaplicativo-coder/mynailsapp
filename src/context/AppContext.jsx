import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  fetchAppointments, insertAppointment, 
  fetchServices, insertService,
  fetchInventory, insertMaterial,
  fetchTransactions, insertTransaction,
  fetchClients, insertClient
} from '../services/database';
import { getSession } from '../services/auth';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [clients, setClients] = useState([]);
  
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false); // Fake profile premium status
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const session = await getSession();
        if (session) {
          setUser(session.user);
          // Em um app real, buscaríamos o perfil do user para setar isPremium
          // const profile = await fetchProfile(session.user.id);
          // setIsPremium(profile.is_premium);
        }

        // Tenta buscar dados reais do Supabase (se as tabelas existirem)
        // Se as tabelas estiverem vazias, retornará [] (sem dados mockados).
        const [appts, svcs, inv, tx, cls] = await Promise.all([
          fetchAppointments(),
          fetchServices(),
          fetchInventory(),
          fetchTransactions(),
          fetchClients()
        ]);

        setAppointments(appts || []);
        
        // Se a tabela de serviços estiver vazia no banco, podemos injetar alguns básicos
        // mas o pedido foi remover os mocks. Então será array vazio até cadastrarem.
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

    loadData();
  }, []);

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
      user, isPremium, upgradeToPremium, loading,
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
