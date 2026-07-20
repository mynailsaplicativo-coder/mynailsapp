import { createClient } from '@supabase/supabase-js';

// Chaves injetadas diretamente para evitar erros na Vercel
const supabaseUrl = 'https://cmxcdaxbicklfpjiendk.supabase.co';
const supabaseAnonKey = 'sb_publishable_7t0N8kdr5mlijg6gfbogqQ_Hj9PjEqp';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (!supabase) {
  console.warn('⚠️ Erro crítico: Supabase não conseguiu inicializar.');
}
