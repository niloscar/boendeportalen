import apiConfig from './axiosConfig.ts'
import type { FeatureStatusUpdate } from '../types/features.ts'

export const getFeatures = async () => {
    try {
        const response = await apiConfig.get('/features_with_type')
        return response.data
    } catch (err) {
        console.log(`Kunde inte hämta funktioner, ${err}`)
        throw err
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
    } catch (err) {
        console.log(`Kunde inte uppdatera funktioner, ${err}`)
        throw err
    }
}