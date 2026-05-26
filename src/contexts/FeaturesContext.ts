import { createContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { Feature } from '../types/admin'

type FeaturesContextValue = {
    features: Feature[]
    loading: boolean
    error: string
    toggleFeature: (featureName: string, isActive: boolean) => void
    setFeatures: Dispatch<SetStateAction<Feature[]>>
    saveFeatures: () => Promise<void>
}

export const FeaturesContext = createContext<FeaturesContextValue | null>(null)