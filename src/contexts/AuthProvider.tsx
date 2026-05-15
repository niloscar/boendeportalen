import { useState, type ReactNode } from 'react'
import { AuthContext, type AuthContextValue, type User } from '../contexts/AuthContext'

type AuthProviderProps = {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(null as User | null)

    const login = ({ email, password }: { email: string; password: string }) => {
        const exampleEmail = import.meta.env.VITE_EXAMPLE_EMAIL
        const examplePassword = import.meta.env.VITE_EXAMPLE_PASSWORD

        if (email === exampleEmail && password === examplePassword) {
            setIsAuthenticated(true)
            setUser({ 
                id: 1,
                level: 2, // Admin level(?)
                fname: 'Admin',
                lname: 'User',
                email: exampleEmail
            })

            console.log('Login successful')
            return true
        } else {
            console.log('Invalid credentials')
            return false
        }
    }
    const logout = () => {
        setIsAuthenticated(false)
        setUser(null)
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