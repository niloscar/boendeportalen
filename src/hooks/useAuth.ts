import { useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { onAuthStateChange, supabase } from '../lib/supabase'
import type { Profile } from '../types/profile'

export function useAuth() {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        let mounted = true

        async function syncAuthState() {
            try {
                const { data: sessionData } = await supabase.auth.getSession()
                const currentSession = sessionData.session ?? null
                const { data: userData, error: userError } = await supabase.auth.getUser()

                if (!mounted) return

                const currentUser = userData.user ?? null

                if (userError || !currentUser) {
                    setSession(null)
                    setUser(null)
                    setProfile(null)

                    if (currentSession) {
                        void supabase.auth.signOut()
                    }

                    return
                }

                setSession(currentSession)
                setUser(currentUser)

                if (currentUser.id) {
                    try {
                        const { data } = await supabase.from('users').select('*').eq('id', currentUser.id).single()
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

        void syncAuthState()

        const handleFocus = () => {
            void syncAuthState()
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                void syncAuthState()
            }
        }

        const sub = onAuthStateChange(async (_event, session) => {
            if (!mounted) return

            setSession(session)
            if (session) {
                void syncAuthState()
            } else {
                setUser(null)
                setProfile(null)
            }
        })

        window.addEventListener('focus', handleFocus)
        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            mounted = false
            window.removeEventListener('focus', handleFocus)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
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