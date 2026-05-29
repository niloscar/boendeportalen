import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { onAuthStateChange, supabase } from '../lib/supabase'
import type { Profile } from '../types/profile'

import { AuthContext } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<Profile | null>(null)

    const mountedRef = useRef(false)
    const lastSyncRef = useRef(0)
    const isSyncingRef = useRef(false)

    useEffect(() => {
        mountedRef.current = true

        async function syncAuthState() {
            try {
                const { data: sessionData } = await supabase.auth.getSession()
                const currentSession = sessionData.session ?? null
                const { data: userData, error: userError } = await supabase.auth.getUser()

                if (!mountedRef.current) return

                const currentUser = userData.user ?? null

                if (userError || !currentUser) {
                    setSession(null)
                    setUser(null)
                    setProfile(null)

                    if (currentSession) {
                        // Log out if we expected a session but couldn't get a valid user, to avoid inconsistent state.
                        void supabase.auth.signOut()
                    }

                    return null
                }

                setSession(currentSession)
                setUser(currentUser)

                if (currentUser.id) {
                    try {
                        const { data } = await supabase.from('users').select('*').eq('id', currentUser.id).single()
                        if (!mountedRef.current) return
                        setProfile(data ?? null)
                    } catch {
                        if (!mountedRef.current) return
                        setProfile(null)
                    }
                } else {
                    setProfile(null)
                }
            } finally {
                if (mountedRef.current) setLoading(false)
            }
        }

        // Prevent multiple syncs in quick succession. Example, when user switches back and forth between tabs.
        const syncIfNeeded = () => {
            const now = Date.now()
            if (now - lastSyncRef.current < 1000) return
            if (isSyncingRef.current) return

            lastSyncRef.current = now
            isSyncingRef.current = true

            void syncAuthState().finally(() => {
                isSyncingRef.current = false
            })
        }

        syncAuthState()

        const handleFocus = () => {
            syncIfNeeded()
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                syncIfNeeded()
            }
        }

        const subscription = onAuthStateChange(async (_event, nextSession) => {
            if (!mountedRef.current) return

            lastSyncRef.current = 0

            if (nextSession) {
                setSession(nextSession)
                syncAuthState()
            } else {
                setSession(null)
                setUser(null)
                setProfile(null)
            }
        })

        window.addEventListener('focus', handleFocus)
        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            mountedRef.current = false
            window.removeEventListener('focus', handleFocus)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            subscription.data.subscription.unsubscribe()
        }
    }, [])

    return <AuthContext.Provider value={{ session, user, loading, profile }}>{children}</AuthContext.Provider>
}