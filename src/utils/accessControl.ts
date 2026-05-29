import type { Profile } from '../types/profile'

export function hasAdminAccess(profile?: Profile | null): boolean {
    const role = String(profile?.role ?? '').toLowerCase()
    return role === 'admin' || profile?.isAdmin === true
}

export function getUserLevel(profile?: Profile | null): number {
    const role = String(profile?.role ?? '').toLowerCase()

    if (!profile) return 1
    if (role === 'admin') return 4
    if (role === 'tenant') return 3

    return 2
}