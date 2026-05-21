export interface Profile {
    id?: string
    role?: string
    isAdmin?: boolean
    email?: string | null
    full_name?: string | null
    [key: string]: unknown
}

export type NullableProfile = Profile | null