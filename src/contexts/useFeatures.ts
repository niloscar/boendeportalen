import { useContext } from 'react'
import { FeaturesContext } from './FeaturesContext'

export const useFeatures = () => {
    const context = useContext(FeaturesContext)
    if (!context) {
        throw new Error('useFeatures must be used within an FeaturesProvider')
    }
    return context
}