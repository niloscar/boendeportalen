import { useCallback, useEffect, useMemo, useState } from 'react'
import { FeaturesContext } from './FeaturesContext'
import type { ReactNode } from 'react'
import type { Feature } from '../types/admin'
import { getFeatures, updateFeatureStatuses } from '../api/settingsApi'

export function FeaturesProvider({ children }: { children: ReactNode }) {
    const [features, setFeatures] = useState<Feature[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                setLoading(true)
                setLoadError('')
                const data = await getFeatures();
                setFeatures(data)
            } catch (error: unknown) {
                setLoadError(
                    error instanceof Error
                        ? error.message
                        : 'Ett okänt fel inträffade'
                )
            } finally {
                setLoading(false)
            }
        }
        fetchFeatures()
    }, [])

    const toggleFeature = useCallback((featureName: string, isActive: boolean) => {
        setFeatures((prevFeatures) =>
            prevFeatures.map((feature) =>
                feature.name === featureName
                    ? { ...feature, is_active: isActive }
                    : feature
            )
        )
    }, [])

    const saveFeatures = useCallback(async () => {
        await updateFeatureStatuses(features)
    }, [features])

    const value = useMemo(() => ({
        features,
        loading,
        loadError,
        setFeatures,
        toggleFeature,
        saveFeatures
    }), [features, loading, loadError, toggleFeature, saveFeatures])

    return (
        <FeaturesContext.Provider value={value}>
            {children}
        </FeaturesContext.Provider>
    );
}