import type { NavigationLink, NavigationPart, NavigationState } from '../types/navigation'

const openLinks: NavigationLink[] = [
    { label: 'Hem', href: '/' },
]

const loggedInLinks: NavigationLink[] = [
    { label: 'Mina sidor', href: '/minasidor', requiresAuth: true, onlyForPart: 'footer' },
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