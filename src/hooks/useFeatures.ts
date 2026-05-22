import { useContext } from 'react'
import { FeaturesContext } from '../contexts/FeaturesContext'

export const useFeatures = () => {
    const context = useContext(FeaturesContext)
    if (!context) {
        throw new Error('useFeatures must be used within a FeaturesProvider')
    }
    return context
}