import { useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getSession, getUser, onAuthStateChange, supabase } from '../lib/supabase'
import type { Profile } from '../types/profile'

export function useAuth() {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        let mounted = true

        async function init() {
            try {
                const s = await getSession()
                if (!mounted) return
                setSession(s)
                const u = await getUser()
                if (!mounted) return
                setUser(u)
                if (u?.id) {
                    try {
                        const { data } = await supabase.from('users').select('*').eq('id', u.id).single()
                        if (!mounted) return
                        setProfile(data ?? null)
                    } catch {
                        if (!mounted) return
                        setProfile(null)
                    }
                } else {
                    setProfile(null)
                }
            } finally {
                if (mounted) setLoading(false)
            }
        }

        init()

        const sub = onAuthStateChange(async (_event, session) => {
            setSession(session)
            if (session) {
                const u = await getUser()
                setUser(u)
                if (u?.id) {
                    try {
                        const { data } = await supabase.from('users').select('*').eq('id', u.id).single()
                        setProfile(data ?? null)
                    } catch {
                        setProfile(null)
                    }
                } else {
                    setProfile(null)
                }
            } else {
                setUser(null)
                setProfile(null)
            }
        })

        return () => {
            mounted = false
            sub.data.subscription.unsubscribe()
        }
    }, [])

    return { user, session, loading, profile }
}

export default useAuth

export function useUser() {
    const { user } = useAuth()
    return user
}

export function useSession() {
    const { session } = useAuth()
    return session
}