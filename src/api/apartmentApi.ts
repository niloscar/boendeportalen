import apiConfig from './axiosConfig.ts';

//Fetch available apartments
export const getAvailableApartments = async () => {
    try {
        const response = await apiConfig.get(`/available_apartments`);
        return response.data;
    } catch (err) {
        console.log(`Kunde inte hämta lägenheter, ${err}`);
        throw err;
    }
};

// Fetch if already signed up for apartment
export const getApartmentSignupStatus = async (apartment_id: number, end_date: string | null) => {
    try {
        const response = await apiConfig.get(`/apartment_sign_up?select=id,apartment_id,end_date,sign_up_date&apartment_id=eq.${apartment_id}&end_date=eq.${end_date}`);
        return response.data;
    } catch (err) {
        console.log(`Kunde inte hitta tidigare intresseanmälningar, ${err}`);
        throw err;
    }
};

//Sign up for apartment
export async function createApartmentSignUp(apartment_id: number, end_date: string | null) {
    try {
        const response = await apiConfig.post("/apartment_sign_up", {
            apartment_id: apartment_id,
            end_date: end_date
        });
        return response.status;
    } catch (error) {
        console.error("Kunde inte skapa intresseanmälan: ", error);
        throw error;
    }
}

//Delete sign up to apartment
export const deleteApartmentSignUp = async (signUpId: number) => {
    try {
        const response = await apiConfig.delete(`/apartment_sign_up?id=eq.${signUpId}`);
        return response;
    } catch (err) {
        console.log(`Kunde inte ta bort intresseanmälan ${err}`);
        throw err;
    }
};