export interface Profile {
    id?: string
    role?: string
    isAdmin?: boolean
    avatar_url?: string
    full_name?: string
    [key: string]: unknown
}

export type NullableProfile = Profile | null