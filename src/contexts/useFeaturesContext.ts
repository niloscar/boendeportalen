import { useContext } from 'react'
import { FeaturesContext } from './featuresContext'

export function useFeaturesContext() {
    const context = useContext(FeaturesContext)

    if (!context) {
        throw new Error('useFeatures must be used within FeaturesProvider')
    }

    return context
}