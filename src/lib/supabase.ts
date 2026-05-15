import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient, Provider, AuthChangeEvent, Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) console.warn('VARNING: Saknar Supabase-variabler. Se .env.local.example för instruktioner.');

export const supabase: SupabaseClient = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');

export const signInWithProvider = async (provider: Provider) => {
    return supabase.auth.signInWithOAuth({ provider });
};

export const signUpWithEmail = (email: string, password: string) => supabase.auth.signUp({ email, password });

export const signInWithEmail = (email: string, password: string) => supabase.auth.signInWithPassword({ email, password });

export const signOut = () => supabase.auth.signOut();

export const onAuthStateChange = (cb: (event: AuthChangeEvent, session: Session | null) => void) => supabase.auth.onAuthStateChange(cb);