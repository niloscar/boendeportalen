import type { User } from "@supabase/supabase-js"
import type { Profile } from "./profile"

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

export type MobileMenuProps = {
    navigationLinks: NavigationLink[]
    user: User | null
    profile: Profile | null
}