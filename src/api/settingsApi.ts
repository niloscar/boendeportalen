import apiConfig from './axiosConfig.ts'
import type { FeatureStatusUpdate } from '../types/features.ts'

export const getFeatures = async () => {
    try {
        const response = await apiConfig.get('/features_with_type')
        return response.data
    } catch (error) {
        console.error(`Kunde inte hämta funktioner, ${error}`)
        throw error
    }
}

export const updateFeatureStatuses = async (features: FeatureStatusUpdate[]) => {
    try {
        const responses = await Promise.all(
            features.map((feature) => (
                apiConfig.patch(
                    `/features_feature_types?feature_id=eq.${feature.id}&feature_type_id=eq.${feature.feature_type_id}`,
                    { is_active: feature.is_active },
                    { headers: { Prefer: 'return=representation' } }
                )
            ))
        )

        return responses.flatMap((response) => response.data)
    } catch (error) {
        console.error(`Kunde inte uppdatera funktioner, ${error}`)
        throw error
    }
}