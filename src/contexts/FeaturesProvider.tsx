import { useCallback, useEffect, useMemo, useState } from 'react'
import { FeaturesContext } from './featuresContext'
import { useAccessControl } from '../hooks/useAccessControl'
import { getFeatures, updateFeatureStatuses } from '../api/settingsApi'
import { canShowFeature as canShowFeatureForLevel } from '../utils/featureAccess'

import type { ReactNode } from 'react'
import type { Feature, FeatureKey } from '../types/features'

export function FeaturesProvider({ children }: { children: ReactNode }) {
    const [features, setFeatures] = useState<Feature[]>([])
    const [originalFeatures, setOriginalFeatures] = useState<Feature[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)
    const { userLevel } = useAccessControl()

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                setLoading(true)
                setLoadError(null)

                const data = await getFeatures()

                setFeatures(data)
                setOriginalFeatures(data)
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

    const changedFeatures = useMemo(() => {
        const originalFeaturesByKey = new Map(
            originalFeatures.map((feature) => [getFeatureKey(feature), feature])
        )

        return features.filter((feature) => {
            const originalFeature = originalFeaturesByKey.get(getFeatureKey(feature))

            return originalFeature && feature.is_active !== originalFeature.is_active
        })
    }, [features, originalFeatures])

    const saveFeatures = useCallback(async () => {
        if (changedFeatures.length === 0) return

        await updateFeatureStatuses(changedFeatures)

        setOriginalFeatures(features)
    }, [changedFeatures, features])

    const visibleFeatures = useMemo(() => {
        const featuresByKey = new Map<FeatureKey, Feature>()

        features
            .filter(feature => canShowFeatureForLevel(feature, userLevel))
            .sort((a, b) => {
                if (a.user_level !== b.user_level) {
                    return a.user_level - b.user_level
                }

                return a.name.localeCompare(b.name, 'sv', { sensitivity: 'base' })
            })
            .forEach(feature => {
                const featureKey = getFeatureKey(feature)

                if (!featuresByKey.has(featureKey)) {
                    featuresByKey.set(featureKey, feature)
                }
            })

        return Array.from(featuresByKey.values())
    }, [features, userLevel])

    const isFeatureEnabled = useCallback((slug: string): boolean => {
        return features.some(feature =>
            feature.slug === slug &&
            feature.is_active &&
            canShowFeatureForLevel(feature, userLevel)
        )
    }, [features, userLevel])

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
    )
}

function getFeatureKey(feature: Feature): FeatureKey {
    return `${feature.id}:${feature.feature_type_id}`
}