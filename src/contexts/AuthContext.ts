import { createContext, useContext } from 'react'
import type { Profile } from '../types/profile'

type AuthContextValue = {
    profile: Profile | null
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}