import { useEffect, useState } from 'react'
import { FeaturesContext } from './FeaturesContext'
import type { ReactNode } from 'react'
import type { Feature } from '../types/admin'
import { getFeatures, updateFeatureStatuses } from '../api/settingsApi'

export function FeaturesProvider({ children }: { children: ReactNode }) {
    const [features, setFeatures] = useState<Feature[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                setLoading(true)
                setError('')
                const data = await getFeatures();
                setFeatures(data)
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message)
                }
            } finally {
                setLoading(false)
            }
        }
        fetchFeatures()
    }, [])

    const toggleFeature = (featureName: string, isActive: boolean) => {
        setFeatures((prevFeatures) =>
            prevFeatures.map((feature) =>
                feature.name === featureName
                    ? { ...feature, is_active: isActive }
                    : feature
            )
        )
    }

    const saveFeatures = async () => {
        await updateFeatureStatuses(features)
    }

    const value = { features, loading, error, setFeatures, toggleFeature, saveFeatures }

    return (
        <FeaturesContext.Provider value={value}>
            {children}
        </FeaturesContext.Provider>
    );
}