export type NavigationPart = 'header' | 'footer'

export type NavigationLink = {
    label: string
    href: string
    requiresAuth?: boolean
    requiresAdmin?: boolean
    onlyForPart?: NavigationPart
}

export type NavigationState = {
    isLoggedIn: boolean
    isAdmin: boolean
}