import { useFeatures } from '../hooks/useFeatures'
import type { NavigationLink, NavigationPart, NavigationState } from '../types/navigation'

// Links that any user can see, regardless of authentication status.
const openLinks: NavigationLink[] = [
    { label: 'Hem', href: '/' },
    { label: 'Lägenheter', href: '/bostader', slug: 'bostader' },
    { label: 'Parkeringar', href: '/parkeringar', slug: 'parkeringar' },
]

// Links that is only visible to logged in users.
const loggedInLinks: NavigationLink[] = [
    { label: 'Tvättstuga', href: '/tvattstuga', slug: 'tvattstuga', requiresAuth: true },
    { label: 'Gästlägenhet', href: '/gastlagenhet', slug: 'gastlagenhet', requiresAuth: true },
    { label: 'Mina sidor', href: '/minasidor', requiresAuth: true, onlyForPart: 'footer' }
]

// Links that is only visible to users with admin access.
const adminLinks: NavigationLink[] = [
    { label: 'Admin', href: '/admin', requiresAuth: true, requiresAdmin: true },
]

// Adding all links to an array that we can filter from.
const baseLinks: NavigationLink[] = [
    ...openLinks,
    ...loggedInLinks,
    ...adminLinks,
]

// Hook to get the appropriate navigation links, based on the arrays above. Checks for authentication levels etc.
export function useNavigationLinks({ isLoggedIn, isAdmin }: NavigationState, part: NavigationPart): NavigationLink[] {
    const { isFeatureEnabled } = useFeatures()

    return baseLinks.filter((link) => {
        if (link.onlyForPart && link.onlyForPart !== part) return false
        if (link.requiresAuth && !isLoggedIn) return false
        if (link.requiresAdmin && !isAdmin) return false
        if (link.slug && !isFeatureEnabled(link.slug)) return false
        return true
    })
}

// Backwards-compatible export name.
export const getNavigationLinks = useNavigationLinks

export const navigationLinks = baseLinks
