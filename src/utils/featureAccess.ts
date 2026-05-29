import type { Feature } from '../types/features'

export function canShowFeature(feature: Feature, userLevel: number): boolean {
    if (!feature.is_active) return false
    if (feature.type_slug === 'admin_widgets') return false

    if (userLevel >= 3) {
        return ['user_features', 'tenant_features'].includes(feature.type_slug)
    }

    if (userLevel >= 2) {
        return feature.type_slug === 'user_features'
    }

    return feature.type_slug === 'public_features'
}