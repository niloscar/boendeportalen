import apiConfig from './axiosConfig.js';

export const getAvailableApartments = async () => {
    try {
    const response = await apiConfig.get(`/apartments`);
        return response.data;
    } catch(error: any){
        throw new Error(`Failed to get books: ${error.message}`);
    }
};
