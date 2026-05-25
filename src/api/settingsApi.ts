import apiConfig from './axiosConfig.ts'

export const getFeatures = async () => {
    try {
    const response = await apiConfig.get(`/features`)
        return response.data
    } catch(err){
        console.log(`Kunde inte hämta funktioner, ${err}`)
        throw err
    }
}