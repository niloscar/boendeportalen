import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '../types/profile'

export type RouteGuardProps = {
    children: ReactNode
    user: User | null
    loading: boolean
    profile?: Profile | null
}