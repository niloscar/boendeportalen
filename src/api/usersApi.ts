import apiConfig from "./axiosConfig"

export const getUsers = async () => {
    try {
        const response = await apiConfig.get(`/users`);
        return response.data
    } catch(error){
        console.error(`Kunde inte hämta användare, ${error}`)
        throw error
    }
}

export const getUserById = async (userId: number) => {
    try {
        const response = await apiConfig.get(`/users?id=eq.${userId}`);
        return response.data[0]
    } catch(error){
        console.error(`Kunde inte hämta användare, ${error}`)
        throw error
    }
}

export const updateUser = async (userId: number, data: Partial<{ name: string; email: string }>) => {
    try {
        const response = await apiConfig.patch(
            `/users?id=eq.${userId}`,
            data,
            { headers: { Prefer: 'return=representation' } }
        );
        return response.data[0]
    } catch(error){
        console.error(`Kunde inte uppdatera användare, ${error}`)
        throw error
    }
}

export const deleteUser = async (userId: number) => {
    try {
        await apiConfig.delete(`/users?id=eq.${userId}`);
    } catch(error){
        console.error(`Kunde inte ta bort användare, ${error}`)
        throw error
    }
}