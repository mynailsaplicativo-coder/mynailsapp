import { supabase } from '../lib/supabase';

/**
 * Cadastra um novo usuário no Supabase Auth.
 * @param {string} email
 * @param {string} password
 * @param {string} role - 'client' | 'professional'
 * @param {string} name - Nome completo
 */
export const signUpUser = async (email, password, role, name) => {
  if (!supabase) throw new Error("Supabase não configurado.");
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        full_name: name
      }
    }
  });

  if (error) throw error;
  return data;
};

/**
 * Faz login do usuário.
 * @param {string} email
 * @param {string} password
 */
export const signInUser = async (email, password) => {
  if (!supabase) throw new Error("Supabase não configurado.");
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
};

/**
 * Desloga o usuário atual.
 */
export const signOutUser = async () => {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Obtém a sessão ativa.
 */
export const getSession = async () => {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};
