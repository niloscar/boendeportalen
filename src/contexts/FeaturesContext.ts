import { createContext } from 'react'

export type Feature = {
    id: number
    user_levels: number[]
}

type FeaturesContextValue = {
    features: Feature[]
}

export const FeaturesContext = createContext<FeaturesContextValue | null>(null)