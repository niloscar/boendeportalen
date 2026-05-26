import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import useAuth from '../hooks/useAuth'
import { hasAdminAccess } from '../utils/accessControl'
import type { RouteGuardProps } from '../types/routing'

export function RouteLoadingFallback() {
    return (
        <div className='min-h-screen grid place-items-center text-sm text-gray-600'>
            Laddar...
        </div>
    )
}

export function PublicOnlyRoute({ children, user, loading }: RouteGuardProps) {
    if (loading) return <RouteLoadingFallback />
    if (user) return <Navigate to='/' replace />

    return children
}

export function PrivateRoute({ children, user, loading }: RouteGuardProps) {
    if (loading) return <RouteLoadingFallback />
    if (!user) return <Navigate to='/auth' replace />

    return children
}

export function AdminRoute({ children, user, loading, profile }: RouteGuardProps) {
    if (loading) return <RouteLoadingFallback />
    if (!user) return <Navigate to='/auth' replace />
    if (!hasAdminAccess(profile)) return <Navigate to='/' replace />

    return children
}

export function PublicOnlyRouteWrapper({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth()

    return <PublicOnlyRoute user={user} loading={loading}>{children}</PublicOnlyRoute>
}

export function PrivateRouteWrapper({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth()

    return <PrivateRoute user={user} loading={loading}>{children}</PrivateRoute>
}

export function AdminRouteWrapper({ children }: { children: ReactNode }) {
    const { user, loading, profile } = useAuth()

    return <AdminRoute user={user} loading={loading} profile={profile}>{children}</AdminRoute>
}