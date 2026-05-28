import { createContext } from 'react'
import type { FeaturesContextValue } from '../types/features'

export const FeaturesContext = createContext<FeaturesContextValue | null>(null)