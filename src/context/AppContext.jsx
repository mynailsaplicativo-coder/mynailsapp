import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Global state for Appointments
  const [appointments, setAppointments] = useState([
    { id: 1, time: '14:00', client: 'Juliana Paes', service: 'Banho de Gel + Nail Art', status: 'Confirmado' },
    { id: 2, time: '15:30', client: 'Camila Silva', service: 'Manutenção Fibra de Vidro', status: 'Em andamento' },
    { id: 3, time: '17:00', client: 'Bruna Marquezine', service: 'Esmaltação em Gel X', status: 'Aguardando' }
  ]);

  // Global state for Services Catalog
  const [services, setServices] = useState([
    { id: 1, category: 'Mãos', name: 'Manicure Tradicional', price: 35, duration: '45m' },
    { id: 2, category: 'Mãos', name: 'Esmaltação em Gel', price: 60, duration: '1h' },
    { id: 3, category: 'Mãos', name: 'Blindagem', price: 80, duration: '1h' },
    { id: 4, category: 'Mãos', name: 'Alongamento Fibra de Vidro', price: 150, duration: '2h 30m' },
    { id: 5, category: 'Pés', name: 'Spa dos Pés', price: 80, duration: '1h' },
  ]);

  // Global state for Inventory
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Gel Construtor Nude (Volia)', quantity: '1 pote', status: 'Baixo' },
    { id: 2, name: 'Prep / Higienizador', quantity: '2 frascos', status: 'OK' },
    { id: 3, name: 'Lixa Banana', quantity: '50 unid', status: 'OK' },
  ]);

  // Global state for Finances
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'income', description: 'Manutenção Fibra (Camila)', amount: 100, date: '2023-10-25' },
    { id: 2, type: 'expense', description: 'Compra de Géis (Shopee)', amount: 150, date: '2023-10-24' },
    { id: 3, type: 'income', description: 'Blindagem (Juliana)', amount: 80, date: '2023-10-25' },
  ]);

  // Global state for Clients
  const [clients, setClients] = useState([
    { id: 1, name: 'Juliana Paes', phone: '(11) 99999-9999', lastService: 'Banho de Gel', points: 3 },
    { id: 2, name: 'Camila Silva', phone: '(11) 98888-8888', lastService: 'Manutenção Fibra', points: 1 },
  ]);

  // Actions
  const addAppointment = (appointment) => setAppointments([...appointments, { ...appointment, id: Date.now() }]);
  const addService = (service) => setServices([...services, { ...service, id: Date.now() }]);
  const addMaterial = (material) => setInventory([...inventory, { ...material, id: Date.now() }]);
  const addTransaction = (transaction) => setTransactions([...transactions, { ...transaction, id: Date.now() }]);
  const addClient = (client) => setClients([...clients, { ...client, id: Date.now() }]);

  return (
    <AppContext.Provider value={{ 
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
