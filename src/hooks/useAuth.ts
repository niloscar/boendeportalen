import { useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getSession, getUser, onAuthStateChange } from '../lib/supabase'

export function useAuth() {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

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
            } finally {
                if (mounted) setLoading(false)
            }
        }

        init()

        const sub = onAuthStateChange((_event, session) => {
            setSession(session)
            if (session) {
                getUser().then((u) => setUser(u))
            } else {
                setUser(null)
            }
        })

        return () => {
            mounted = false
            const maybe = sub as unknown as { data?: { subscription?: { unsubscribe?: () => void } } }
            maybe.data?.subscription?.unsubscribe?.()
        }
    }, [])

    return { user, session, loading }
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