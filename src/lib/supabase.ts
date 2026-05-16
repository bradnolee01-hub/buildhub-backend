import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('SUPABASE ERROR: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. Please add them in the Settings -> Environment Variables menu.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
