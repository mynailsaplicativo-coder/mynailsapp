import { supabase } from '../lib/supabase';

// --- PROFILES ---
export const fetchProfile = async (userId) => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
  if (error) { console.warn('Perfil não encontrado:', error.message); return null; }
  return data;
};

export const insertProfile = async (profile) => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('profiles').insert([profile]).select();
  if (error) { console.error('Erro:', error.message); return null; }
  return data[0];
};

export const updateProfileWallet = async (userId, walletId) => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('profiles').update({ wallet_id: walletId }).eq('user_id', userId).select();
  if (error) { console.error('Erro:', error.message); return null; }
  return data[0];
};

export const fetchProsByCity = async (city) => {
  if (!supabase) return [];
  let query = supabase.from('profiles').select('*').eq('role', 'pro');
  if (city) {
    query = query.ilike('city', `%${city}%`);
  }
  const { data, error } = await query;
  if (error) { console.error('Erro:', error.message); return []; }
  return data;
};

// --- AGENDAMENTOS ---
export const fetchAppointments = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('appointments').select('*');
  if (error) { console.error('Erro:', error); return []; }
  return data;
};

export const insertAppointment = async (appointment) => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('appointments').insert([appointment]).select();
  if (error) { console.error('Erro:', error); return null; }
  return data[0];
};

// --- SERVIÇOS (Catálogo) ---
export const fetchServices = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('services').select('*');
  if (error) { console.error('Erro:', error); return []; }
  return data;
};

export const insertService = async (service) => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('services').insert([service]).select();
  if (error) { console.error('Erro:', error); return null; }
  return data[0];
};

// --- CLIENTES ---
export const fetchClients = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('clients').select('*');
  if (error) { console.error('Erro:', error); return []; }
  return data;
};

export const insertClient = async (client) => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('clients').insert([client]).select();
  if (error) { console.error('Erro:', error); return null; }
  return data[0];
};

// --- FINANCEIRO ---
export const fetchTransactions = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('transactions').select('*');
  if (error) { console.error('Erro:', error); return []; }
  return data;
};

export const insertTransaction = async (transaction) => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('transactions').insert([transaction]).select();
  if (error) { console.error('Erro:', error); return null; }
  return data[0];
};

// --- ESTOQUE ---
export const fetchInventory = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('inventory').select('*');
  if (error) { console.error('Erro:', error); return []; }
  return data;
};

export const insertMaterial = async (material) => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('inventory').insert([material]).select();
  if (error) { console.error('Erro:', error); return null; }
  return data[0];
};
