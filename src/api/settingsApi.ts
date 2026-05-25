import apiConfig from './axiosConfig.ts'

export const getFeatures = async () => {
    try {
    const response = await apiConfig.get(`/features_with_type`);
        return response.data
    } catch(err){
        console.log(`Kunde inte hämta funktioner, ${err}`)
        throw err
    }
}

type FeatureStatusUpdate = {
    id: number
    is_active: boolean
}

export const updateFeatureStatuses = async (features: FeatureStatusUpdate[]) => {
    try {
        const responses = await Promise.all(
            features.map((feature) => (
                apiConfig.patch(
                    `/features?id=eq.${feature.id}`,
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