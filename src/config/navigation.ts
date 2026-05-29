import type { NavigationLink, NavigationPart, NavigationState } from '../types/navigation'

const openLinks: NavigationLink[] = [
    { label: 'Hem', href: '/' },
    { label: 'Lägenheter', href: '/bostader' },
    { label: 'Parkeringar', href: '/parkeringar' },
]

const loggedInLinks: NavigationLink[] = [
    { label: 'Tvättstuga', href: '/tvattstuga', requiresAuth: true },
    { label: 'Gästlägenhet', href: '/gastlagenhet', requiresAuth: true },
    { label: 'Mina sidor', href: '/minasidor', requiresAuth: true, onlyForPart: 'footer' }
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

export function filterNavigationLinks(
    links: NavigationLink[],
    part: NavigationPart,
    isLoggedIn: boolean,
    isAdmin: boolean,
    isFeatureEnabled: (key: string) => boolean
) {
    return links.filter(link => {
        if (link.onlyForPart && link.onlyForPart !== part) return false
        if (link.requiresAuth && !isLoggedIn) return false
        if (link.requiresAdmin && !isAdmin) return false

        if (link.href === '/') return true
        if (link.href === '/admin') return true

        const featureKey = link.href.slice(1)

        return isFeatureEnabled(featureKey)
    })
}

export const navigationLinks = baseLinks