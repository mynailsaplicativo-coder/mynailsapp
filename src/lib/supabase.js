import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Inicializa o cliente do Supabase apenas se as chaves existirem
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'COLE_SUA_CHAVE_AQUI') 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn('⚠️ Supabase não inicializado. Verifique se a VITE_SUPABASE_ANON_KEY está no arquivo .env.');
}
