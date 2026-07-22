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
  if (error) { console.error('Erro:', error.message); return { error: error.message }; }
  return data[0];
};

export const updateProfileWallet = async (userId, walletId) => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('profiles').update({ wallet_id: walletId }).eq('user_id', userId).select();
  if (error) { console.error('Erro:', error.message); return null; }
  return data[0];
};

export const updateProfile = async (userId, updates) => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('profiles').update(updates).eq('user_id', userId).select();
  if (error) { console.error('Erro ao atualizar perfil:', error.message); return null; }
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
export const fetchAppointments = async (userId) => {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase.from('appointments').select('*').eq('user_id', userId);
  if (error) { console.error('Erro:', error); return []; }
  return data;
};

export const insertAppointment = async (appointment, userId) => {
  if (!supabase || !userId) return null;
  const validData = {
    user_id: userId,
    client: appointment.client,
    service: appointment.service,
    date: appointment.date || new Date().toISOString().split('T')[0], // add default date if missing
    time: appointment.time,
    status: appointment.status,
    return_date: appointment.return_date || null
  };
  const { data, error } = await supabase.from('appointments').insert([validData]).select();
  if (error) { console.error('Erro no agendamento:', error); return { error: error.message }; }
  return data[0];
};

// --- SERVIÇOS (Catálogo) ---
export const fetchServices = async (userId) => {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase.from('services').select('*').eq('user_id', userId);
  if (error) { console.error('Erro:', error); return []; }
  return data;
};

export const deleteReview = async (id) => {
  if (!supabase) return false;
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) { console.error('Erro:', error); return false; }
  return true;
};

// --- ADMIN (Planos) ---
export const fetchAllPlans = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('plans').select('*').order('price', { ascending: true });
  if (error) { console.error('Erro:', error); return []; }
  return data;
};

export const insertPlan = async (plan) => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('plans').insert([plan]).select();
  if (error) { console.error('Erro:', error); return null; }
  return data[0];
};

export const updatePlan = async (id, updates) => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('plans').update(updates).eq('id', id).select();
  if (error) { console.error('Erro:', error); return null; }
  return data[0];
};

export const deletePlan = async (id) => {
  if (!supabase) return false;
  const { error } = await supabase.from('plans').delete().eq('id', id);
  if (error) { console.error('Erro:', error); return false; }
  return true;
};

// --- ADMIN (Usuários) ---
export const fetchAllProfiles = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) { console.error('Erro:', error); return []; }
  return data;
};

export const deleteProfile = async (id) => {
  if (!supabase) return false;
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) { console.error('Erro:', error); return false; }
  return true;
};

export const insertService = async (service, userId) => {
  if (!supabase || !userId) return { error: 'Usuário não autenticado' };
  const { data, error } = await supabase.from('services').insert([{ ...service, user_id: userId }]).select();
  if (error) { console.error('Erro no banco:', error); return { error: error.message || error.details || JSON.stringify(error) }; }
  return data[0];
};

// --- CLIENTES ---
export const fetchClients = async (userId) => {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase.from('clients').select('*').eq('user_id', userId);
  if (error) { console.error('Erro:', error); return []; }
  return data;
};

export const insertClient = async (client, userId) => {
  if (!supabase || !userId) return null;
  const validData = {
    user_id: userId,
    name: client.name,
    phone: client.phone,
    frequency: client.frequency || null,
    notes: client.notes || null,
    is_vip: client.is_vip || false,
    vip_sessions_left: client.vip_sessions_left || 0
  };
  const { data, error } = await supabase.from('clients').insert([validData]).select();
  if (error) { console.error('Erro no cliente:', error); return { error: error.message }; }
  return data[0];
};

export const updateClient = async (clientId, updates) => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('clients').update(updates).eq('id', clientId).select();
  if (error) { console.error('Erro ao atualizar cliente:', error); return { error: error.message }; }
  return data[0];
};

// --- FINANCEIRO ---
export const fetchTransactions = async (userId) => {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase.from('transactions').select('*').eq('user_id', userId);
  if (error) { console.error('Erro:', error); return []; }
  return data;
};

export const insertTransaction = async (transaction, userId) => {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase.from('transactions').insert([{ ...transaction, user_id: userId }]).select();
  if (error) { console.error('Erro:', error); return null; }
  return data[0];
};

// --- ESTOQUE ---
export const fetchInventory = async (userId) => {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase.from('inventory').select('*').eq('user_id', userId);
  if (error) { console.error('Erro:', error); return []; }
  return data;
};

export const insertMaterial = async (material, userId) => {
  if (!supabase || !userId) return { error: 'Usuário não autenticado' };
  const validData = {
    user_id: userId,
    name: material.name,
    current: material.current,
    quantity: material.current, // Some manual schemas might use 'quantity' instead of 'current'
    min: material.min,
    status: material.status
  };
  const { data, error } = await supabase.from('inventory').insert([validData]).select();
  if (error) { console.error('Erro:', error); return { error: error.message }; }
  return data[0];
};

// --- PORTFÓLIO ---
export const fetchPortfolio = async (userId) => {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase.from('portfolio').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) { console.error('Erro:', error); return []; }
  return data;
};

export const insertPortfolio = async (item, userId) => {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase.from('portfolio').insert([{ ...item, user_id: userId }]).select();
  if (error) { console.error('Erro:', error); return null; }
  return data[0];
};

// --- PRODUTOS ---
export const fetchProducts = async (userId) => {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase.from('products').select('*').eq('user_id', userId);
  if (error) { console.error('Erro:', error); return []; }
  return data;
};

export const insertProduct = async (product, userId) => {
  if (!supabase || !userId) return { error: 'Usuário não autenticado' };
  const { data, error } = await supabase.from('products').insert([{ ...product, user_id: userId }]).select();
  if (error) { console.error('Erro:', error); return { error: error.message }; }
  return data[0];
};

export const updateProduct = async (productId, updates) => {
  if (!supabase) return { error: 'Supabase não inicializado' };
  const { data, error } = await supabase.from('products').update(updates).eq('id', productId).select();
  if (error) { console.error('Erro:', error); return { error: error.message }; }
  return data[0];
};

export const deleteProduct = async (productId) => {
  if (!supabase) return false;
  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) { console.error('Erro ao deletar produto:', error); return false; }
  return true;
};

// --- AVALIAÇÕES ---
export const fetchReviews = async (userId) => {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase.from('reviews').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) { console.error('Erro:', error); return []; }
  return data;
};

export const insertReview = async (review, userId) => {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase.from('reviews').insert([{ ...review, user_id: userId }]).select();
  if (error) { console.error('Erro:', error); return null; }
  return data[0];
};

// --- STORAGE (Imagens) ---
export const uploadImage = async (file) => {
  if (!supabase) return null;
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`; // Na raiz do bucket 'images'

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Erro no upload da imagem:', uploadError.message);
      return null;
    }

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Falha inesperada no upload:', error);
    return null;
  }
};
