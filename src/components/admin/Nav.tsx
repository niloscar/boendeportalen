import { NavLink, Navigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/useAuthContext'
import { hasAdminAccess } from '../../utils/accessControl'

import type { AuthError } from '@supabase/supabase-js'
import type { AdminSubPage } from '../../types/admin'

type AdminNavProps = {
    pages: Pick<AdminSubPage, 'slug' | 'title'>[]
    signOut: () => Promise<{ error: AuthError | null }>
}

export default function AdminNav({ pages, signOut }: AdminNavProps) {
    const { profile } = useAuthContext()

    async function handleSignOut() {
        await signOut()
        return <Navigate to={`/inloggning`} replace />
    }

    const isAdmin = hasAdminAccess(profile)

    return (
        <nav className={`flex flex-col md:flex-row items-start md:items-center gap-2 m-0`}>
            <ul className="flex flex-col md:flex-row space-x-2">
                {pages.map((page) => (
                    <li key={page.slug}>
                        <NavLink
                            to={`/admin/${page.slug}`}
                            className={({ isActive }) => [
                                'text-decoration-none text-neutral-900 cursor-pointer hover:underline',
                                isActive && 'underline'
                            ].filter(Boolean).join(' ')}
                        >
                            {page.title}
                        </NavLink>
                    </li>
                ))}
            </ul>
            {isAdmin && profile && (
                <ul className="flex flex-col md:flex-row space-x-2 ml-0 md:ml-auto">
                    <li className="text-gray-500">
                        Inloggad som administratör.
                    </li>
                    <li>
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className='text-decoration-none text-neutral-900 cursor-pointer hover:underline'
                        >
                            Logga ut
                        </button>
                    </li>
                </ul>
            )}
        </nav>
    )
}