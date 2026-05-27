import type { Feature } from '../types/features'

export function canShowFeature(feature: Feature, userLevel: number): boolean {
    return (
        feature.is_active &&
        feature.user_level <= userLevel &&
        feature.user_level <= 3
    )
}