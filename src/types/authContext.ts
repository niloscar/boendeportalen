import type { Session, User } from '@supabase/supabase-js'
import type { Profile } from '../types/profile'

export type AuthContextValue = {
    session: Session | null
    user: User | null
    loading: boolean
    profile: Profile | null
}