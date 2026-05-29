import type { Feature } from '../types/features'

export type LandingProps = {
    profileName?: string | null
    loading: boolean
    loadError: string | null
    visibleFeatures: Feature[]
}