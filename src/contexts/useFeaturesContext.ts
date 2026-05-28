import { useContext } from 'react'
import { featuresContext } from './featuresContext'

export function useFeaturesContext() {
    const context = useContext(featuresContext)

    if (!context) {
        throw new Error('useFeatures must be used within FeaturesProvider')
    }

    return context
}