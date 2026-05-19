import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '../types/profile'

type RouteGuardProps = {
    children: ReactNode
    user: User | null
    loading: boolean
    profile?: Profile | null
}

function hasAdminAccess(profile?: Profile | null): boolean {
    const role = String(profile?.role ?? '').toLowerCase()
    return role === 'admin' || profile?.isAdmin === true
}

export function PublicOnlyRoute({ children, user, loading }: RouteGuardProps) {
    if (loading) return null
    if (user) return <Navigate to='/' replace />

    return children
}

export function PrivateRoute({ children, user, loading }: RouteGuardProps) {
    if (loading) return null
    if (!user) return <Navigate to='/auth' replace />

    return children
}

export function AdminRoute({ children, user, loading, profile }: RouteGuardProps) {
    if (loading) return null
    if (!user) return <Navigate to='/auth' replace />
    if (!hasAdminAccess(profile)) return <Navigate to='/' replace />

    return children
}

// IMPORTANT
// You can add more route guards that check for specific permissions or roles as needed. Just follow the same patterns as above.
// If you choose not to create more, then delete these comments.