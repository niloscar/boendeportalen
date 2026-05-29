import { createContext } from 'react'
import type { AuthContextValue } from '../types/authContext'

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)