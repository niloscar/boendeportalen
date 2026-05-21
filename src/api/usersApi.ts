import apiConfig from './axiosConfig.ts';

export const getUsers = async () => {
    try {
    const response = await apiConfig.get(`/users`);
        return response.data;
    } catch(err){
        console.log(`Failed to fetch users, ${err}`); 
    }
};
