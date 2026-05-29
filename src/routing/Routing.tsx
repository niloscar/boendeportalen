import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import useAuth from '../hooks/useAuth'
import { hasAdminAccess } from '../utils/accessControl'
import type { RouteGuardProps } from '../types/routing'

// Simple loading fallback shown while auth or lazy routes initialize.
export function RouteLoadingFallback() {
    return (
        <div className='flex w-full justify-center items-center text-center text-sm text-gray-600'>
            Laddar...
        </div>
    )
}

// Route that should only be visible to unauthenticated users. Redirects to home when a user is already signed in.
export function PublicOnlyRoute({ children, user, loading }: RouteGuardProps) {
    if (loading) return <RouteLoadingFallback />
    if (user) return <Navigate to='/' replace />

    return children
}

// Route that requires authentication. If not authenticated, redirect the user to the login page.
export function PrivateRoute({ children, user, loading }: RouteGuardProps) {
    if (loading) return <RouteLoadingFallback />
    if (!user) return <Navigate to='/inloggning' replace />

    return children
}

// Route that requires the user to have admin privileges. Uses `hasAdminAccess` to determine if the current profile should be allowed to view admin routes.
export function AdminRoute({ children, user, loading, profile }: RouteGuardProps) {
    if (loading) return <RouteLoadingFallback />
    if (!user) return <Navigate to='/inloggning' replace />
    if (!hasAdminAccess(profile)) return <Navigate to='/inloggning' replace />

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