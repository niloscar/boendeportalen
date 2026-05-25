import type { Profile } from '../types/profile'

export function hasAdminAccess(profile?: Profile | null): boolean {
    const role = String(profile?.role ?? '').toLowerCase()
    return role === 'admin' || profile?.isAdmin === true
}