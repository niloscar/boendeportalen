import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient, Provider, AuthChangeEvent, Session, AuthResponse, AuthTokenResponsePassword } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) console.warn('VARNING: Saknar Supabase-variabler. Se .env.local.example för instruktioner.');

export const supabase: SupabaseClient = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');

export const resetSupabase = () => {
    return createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
}

export const getSession = async () => {
    const { data } = await supabase.auth.getSession();
    return data?.session ?? null;
}

export const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    return data?.user ?? null;
}

export const resetPasswordForEmail = (email: string) => supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/auth?type=recovery' });

export const updateUser = (data: { password?: string; email?: string }) => supabase.auth.updateUser(data)

export const handleSessionFromUrl = async () => {
    const parseParams = (src: string) => {
        if (!src) return null
        const raw = src.startsWith('#') ? src.replace('#', '?') : src
        const params = new URLSearchParams(raw.startsWith('?') ? raw.substring(1) : raw)
        const access_token = params.get('access_token')
        const refresh_token = params.get('refresh_token')
        if (access_token) return { access_token, refresh_token }
        return null
    }

    const fromHash = parseParams(window.location.hash || '')
    const fromSearch = parseParams(window.location.search || '')
    const tokens = fromHash ?? fromSearch
    if (tokens) {
        await supabase.auth.setSession({ access_token: tokens.access_token ?? '', refresh_token: tokens.refresh_token ?? '' })
        return true
    }
    return false
}

export const signInWithProvider = async (provider: Provider) => {
    return supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: window.location.origin,
        },
    });
};

export const signUpWithEmail = (email: string, password: string): Promise<AuthResponse> => supabase.auth.signUp({ email, password });

export const signInWithEmail = (email: string, password: string): Promise<AuthTokenResponsePassword> => supabase.auth.signInWithPassword({ email, password });

export const signOut = () => supabase.auth.signOut();

export const onAuthStateChange = (cb: (event: AuthChangeEvent, session: Session | null) => void) => supabase.auth.onAuthStateChange(cb);