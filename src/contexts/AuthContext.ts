import { createContext } from 'react'

export type User = {
    id: number
    level: number
    fname: string
    lname: string
    email: string
}

export type LoginCredentials = {
    email: string
    password: string
}

export type AuthContextValue = {
    isAuthenticated: boolean
    user: User | null
    login: (credentials: LoginCredentials) => boolean
    logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)