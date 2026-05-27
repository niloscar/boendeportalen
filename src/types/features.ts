import type { Dispatch, ReactNode, SetStateAction } from 'react'

export type Feature = {
    id: number
    name: string
    slug: string
    description: string | null
    is_active: boolean
    component: string | null
    type_name: string
    type_slug: string
    type_description: string | null
    user_level: number
    feature_type_id: number
}

export type FeaturesContextValue = {
    features: Feature[]
    visibleFeatures: Feature[]
    loading: boolean
    loadError: string | null
    toggleFeature: (featureId: number, featureTypeId: number, isActive: boolean) => void
    setFeatures: Dispatch<SetStateAction<Feature[]>>
    saveFeatures: () => Promise<void>
    isFeatureEnabled: (slug: string) => boolean
    canShowFeature: (feature: Feature) => boolean
}

export type FeaturesByType = Record<string, {
    type_name: string
    type_description: string | null
    features: Feature[]
}>

export type WidgetProps = {
    title: string
    description: string | null
    children: ReactNode
    onExpand: () => void
}