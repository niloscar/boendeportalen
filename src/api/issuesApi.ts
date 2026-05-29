import apiConfig from './axiosConfig'
import type { Issue } from '../types/issues'

export async function getIssues(): Promise<Issue[]> {
    const response = await apiConfig.get<Issue[]>('/admin_error_reports', {
        params: {
            select: '*',
            order: 'created_at.desc'
        }
    })

    return response.data
}