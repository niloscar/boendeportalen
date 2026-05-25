import { Navigate } from 'react-router-dom'
import { hasAdminAccess } from '../utils/accessControl'
import type { RouteGuardProps } from '../types/routing'

function RouteLoadingFallback() {
    return (
        <div className='min-h-screen grid place-items-center bg-neutral-100 text-sm text-gray-600'>
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

// IMPORTANT
// You can add more route guards that check for specific permissions or roles as needed. Just follow the same patterns as above.
// If you choose not to create more, then delete these comments.