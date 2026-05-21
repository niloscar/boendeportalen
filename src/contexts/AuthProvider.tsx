import { useState, type ReactNode } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import type { Profile } from '../types/profile'
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from '../utils/storage'

type AuthProviderProps = {
    children: ReactNode
}

const EXAMPLE_PROFILES: Profile[] = [
    {
        id: 'random-id-1',
        name: 'Oscar Nilsson',
        email: 'oscar@ondproduktion.se',
        role: 'admin'
    },
    {
        id: 'random-id-2',
        name: 'Janne Långben',
        email: 'janne@ankeborg.se',
        role: 'user'
    }
]

export function AuthProvider({ children }: AuthProviderProps) {
    const cachedProfile = getFromLocalStorage<Profile>('authProfile') // Attempt to load profile from localStorage on initialization

    const [profile, setProfile] = useState<Profile | null>(cachedProfile)

    const isAuthenticated = Boolean(profile)
    const isAdmin = profile?.role === 'admin'

    const signIn = async (email: string, password: string) => {
        // Implementation for signing in
        console.log('Signing in with:', email, password)

        // Simulate successful sign-in by setting the example profile
        setProfile(EXAMPLE_PROFILES[0])
        saveToLocalStorage('authProfile', EXAMPLE_PROFILES[0])
        console.log('Signed in:', EXAMPLE_PROFILES[0])
    }

    const signOut = () => {
        setProfile(null)
        removeFromLocalStorage('authProfile')
        console.log('Signed out')
    }

    const value = {
        profile,
        isAuthenticated,
        isAdmin,
        signIn,
        signOut
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
