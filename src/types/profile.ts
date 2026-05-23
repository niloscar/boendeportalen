export interface Profile {
    id?: string
    role?: string
    isAdmin?: boolean
    email?: string | null
    full_name?: string | null
    avatar_url?: string
    [key: string]: unknown
}

export type NullableProfile = Profile | null