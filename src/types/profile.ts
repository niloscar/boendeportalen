export interface Profile {
    id?: string
    role?: string
    isAdmin?: boolean
    [key: string]: unknown
}

export type NullableProfile = Profile | null