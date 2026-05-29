import type { Profile } from '../types/profile'
import apiConfig from './axiosConfig'

export const getUsers = async () => {
    const response = await apiConfig.get('/users?order=full_name.asc')
    return response.data as Profile[]
}

export const getUserById = async (userId: Profile['id']) => {
    if (!userId) throw new Error('Saknar användar-id')

    const response = await apiConfig.get(
        `/users?id=eq.${encodeURIComponent(String(userId))}`
    )

    return response.data[0] as Profile | undefined
}

export const updateUser = async (
    userId: Profile['id'],
    data: Partial<Profile>
) => {
    if (!userId) throw new Error('Saknar användar-id')

    const response = await apiConfig.patch(
        `/users?id=eq.${encodeURIComponent(String(userId))}`,
        data,
        { headers: { Prefer: 'return=representation' } }
    )

    const updatedUser = Array.isArray(response.data)
        ? response.data[0]
        : response.data

    if (!updatedUser) {
        throw new Error('API:t returnerade ingen uppdaterad användare')
    }

    return updatedUser as Profile
}

export const deleteUser = async (userId: Profile['id']) => {
    if (!userId) throw new Error('Saknar användar-id')

    await apiConfig.delete(
        `/users?id=eq.${encodeURIComponent(String(userId))}`
    )
}