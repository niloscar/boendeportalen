import { type ReactNode } from 'react'
import { FeaturesContext, type Feature } from '../contexts/FeaturesContext'

type FeaturesProviderProps = {
    children: ReactNode
}

const EXAMPLE_FEATURE: Feature = {
    id: 1,
    user_levels: [2],
}

export function FeaturesProvider({ children }: FeaturesProviderProps) {

    const isActive = (userLevel: number) => {
        return EXAMPLE_FEATURE.user_levels.includes(userLevel)
    }

    const features: Feature[] = [
        {
            ...EXAMPLE_FEATURE,
            user_levels: EXAMPLE_FEATURE.user_levels.filter(isActive)
        }
    ]

    const value = {
        features,
    }

    return (
        <FeaturesContext.Provider value={value}>
            {children}
        </FeaturesContext.Provider>
    )
}