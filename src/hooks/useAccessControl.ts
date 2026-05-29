import { useAuth } from './useAuth'
import { getUserLevel, hasAdminAccess } from '../utils/accessControl'

export function useAccessControl() {
    const { profile } = useAuth()

    return {
        profile,
        userLevel: getUserLevel(profile),
        isAdmin: hasAdminAccess(profile),
        isTenant: getUserLevel(profile) >= 3
    }
}