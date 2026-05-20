import { useState, type ReactNode } from 'react'
import { AuthContext, type AuthContextValue, type User } from '../contexts/AuthContext'
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from '../utils/storage'

type AuthProviderProps = {
    children: ReactNode
}

const EXAMPLE_USER: User = {
    id: 1,
    level: 2, // Admin level(?)
    fname: 'Admin',
    lname: 'User',
    email: import.meta.env.VITE_EXAMPLE_EMAIL
}

export function AuthProvider({ children }: AuthProviderProps) {
    const storedUser = getFromLocalStorage<User>('auth')

    const [user, setUser] = useState<User | null>(storedUser)
    const [isAuthenticated, setIsAuthenticated] = useState(Boolean(storedUser))

    const login = ({ email, password }: { email: string; password: string }) => {
        const exampleEmail = import.meta.env.VITE_EXAMPLE_EMAIL
        const examplePassword = import.meta.env.VITE_EXAMPLE_PASSWORD

        if (email === exampleEmail && password === examplePassword) {
            setIsAuthenticated(true)
            setUser(EXAMPLE_USER)
            saveToLocalStorage('auth', EXAMPLE_USER)
        } else {
            console.log('Invalid credentials')
        }
    }
    
    const logout = () => {
        setIsAuthenticated(false)
        setUser(null)
        removeFromLocalStorage('auth')
        console.log('Logged out')
    }

    const value = {
        isAuthenticated,
        login,
        logout,
        user
    } as AuthContextValue

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}