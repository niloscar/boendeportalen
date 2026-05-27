import { useCallback, useEffect, useMemo, useState } from 'react'
import { FeaturesContext } from './featuresContext'
import { useAccessControl } from '../hooks/useAccessControl'
import { getFeatures, updateFeatureStatuses } from '../api/settingsApi'
import { canShowFeature as canShowFeatureForLevel } from '../utils/featureAccess'

import type { ReactNode } from 'react'
import type { Feature } from '../types/features'

export function FeaturesProvider({ children }: { children: ReactNode }) {
    const [features, setFeatures] = useState<Feature[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)
    const { userLevel } = useAccessControl()

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                setLoading(true)
                setLoadError(null)
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

    const toggleFeature = useCallback((featureId: number, featureTypeId: number, isActive: boolean) => {
        setFeatures((prevFeatures) =>
            prevFeatures.map((feature) =>
                feature.id === featureId && feature.feature_type_id === featureTypeId
                    ? { ...feature, is_active: isActive }
                    : feature
            )
        )
    }, [])

    const saveFeatures = useCallback(async () => {
        await updateFeatureStatuses(features)
    }, [features])

    const visibleFeatures = useMemo(() => {
        const featuresById = new Map<number, Feature>()

        features
            .filter(feature => canShowFeatureForLevel(feature, userLevel))
            .sort((a, b) => {
                if (a.user_level !== b.user_level) {
                    return a.user_level - b.user_level
                }

                return a.name.localeCompare(b.name, 'sv', { sensitivity: 'base' })
            })
            .forEach(feature => {
                if (!featuresById.has(feature.id)) {
                    featuresById.set(feature.id, feature)
                }
            })

        return Array.from(featuresById.values())
    }, [features, userLevel])

    const isFeatureEnabled = useCallback((slug: string): boolean => {
        return visibleFeatures.some(feature => feature.slug === slug)
    }, [visibleFeatures])

    const canShowFeature = useCallback((feature: Feature): boolean => {
        return canShowFeatureForLevel(feature, userLevel)
    }, [userLevel])

    const value = useMemo(() => ({
        features,
        visibleFeatures,
        loading,
        loadError,
        setFeatures,
        toggleFeature,
        saveFeatures,
        isFeatureEnabled,
        canShowFeature
    }), [
        features,
        visibleFeatures,
        loading,
        loadError,
        toggleFeature,
        saveFeatures,
        isFeatureEnabled,
        canShowFeature
    ])

    return (
        <FeaturesContext.Provider value={value}>
            {children}
        </FeaturesContext.Provider>
    );
}