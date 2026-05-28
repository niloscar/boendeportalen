import { createContext } from 'react'
import type { FeaturesContextValue } from '../types/features'

export const featuresContext = createContext<FeaturesContextValue | null>(null)