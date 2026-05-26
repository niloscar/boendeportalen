import type { NavigationLink, NavigationPart, NavigationState } from '../types/navigation'

const openLinks: NavigationLink[] = [
    { label: 'Hem', href: '/' },
    { label: 'Sök bostad', href: '/apartment' },
]

const loggedInLinks: NavigationLink[] = [
    { label: 'Mina sidor', href: '/minasidor', requiresAuth: true, onlyForPart: 'footer' },
    { label: 'Boka tvättid', href: '/tvattid', requiresAuth: true, onlyForPart: 'header' },
    { label: 'Boka gästlägenhet', href: '/gastlagenhet', requiresAuth: true, onlyForPart: 'header' }
]

const adminLinks: NavigationLink[] = [
    { label: 'Admin', href: '/admin', requiresAuth: true, requiresAdmin: true },
]

const baseLinks: NavigationLink[] = [
    ...openLinks,
    ...loggedInLinks,
    ...adminLinks,
]

export function getNavigationLinks({ isLoggedIn, isAdmin }: NavigationState, part: NavigationPart): NavigationLink[] {
    return baseLinks.filter((link) => {
        if (link.onlyForPart && link.onlyForPart !== part) return false
        if (link.requiresAuth && !isLoggedIn) return false
        if (link.requiresAdmin && !isAdmin) return false
        return true
    })
}

export const navigationLinks = baseLinks