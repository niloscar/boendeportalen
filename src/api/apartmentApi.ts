import apiConfig from './axiosConfig.ts';

export const getAvailableApartments = async () => {
    try {
    const response = await apiConfig.get(`/apartments`);
        return response.data;
    } catch(err){
        console.log(`Failed to fetch apartments, ${err}`); 
    }
};
