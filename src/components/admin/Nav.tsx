import { NavLink, Navigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/useAuthContext'
import { hasAdminAccess } from '../../utils/accessControl'

import type { AuthError } from '@supabase/supabase-js'
import type { AdminSubPage } from '../../types/admin'

import styles from './Nav.module.css'

type AdminNavProps = {
    pages: Pick<AdminSubPage, 'slug' | 'title'>[]
    signOut: () => Promise<{ error: AuthError | null }>
}

export default function AdminNav({ pages, signOut }: AdminNavProps) {
    const { profile } = useAuthContext()

    async function handleSignOut() {
        await signOut()
        return <Navigate to={`/auth`} replace />
    }

    const isAdmin = hasAdminAccess(profile)
    const classNames = [styles.link].filter(Boolean).join(' ')

    return (
        <nav className={`${styles['admin-nav']} m-0 flex items-center`}>
            <ul className="flex space-x-2">
                {pages.map((page) => (
                    <li key={page.slug}>
                        <NavLink
                            to={`/admin/${page.slug}`}
                            className={({ isActive }) => isActive ? `${styles.active} ${classNames}` : classNames}
                        >
                            {page.title}
                        </NavLink>
                    </li>
                ))}
            </ul>
            {isAdmin && profile && (
                <ul className="flex space-x-2 ml-auto">
                    <li className="text-gray-500">
                        Inloggad som{' '}
                        {profile.full_name 
                            ? <span className={styles.link}>{profile.full_name}</span>
                            : 'gäst'
                        }
                    </li>
                    <li>
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className={styles.link}
                        >
                            Logga ut
                        </button>
                    </li>
                </ul>
            )}
        </nav>
    )
}