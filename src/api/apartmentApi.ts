import apiConfig from './axiosConfig.ts';

export const getAvailableApartments = async () => {
    try {
    const response = await apiConfig.get(`/available_apartments`);
        return response.data;
    } catch(err){
        console.log(`Kunde inte hämta lägenheter, ${err}`); 
        throw err;
    }
};


