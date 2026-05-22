import { Link, NavLink, useNavigate } from 'react-router-dom'
import styles from './Nav.module.css'
import type { Profile } from '../../types/profile'

type AdminSubPage = { slug: string, title: string }
type AdminNavProps = { pages: AdminSubPage[]; signOut: () => void; profile: Profile | null }

export default function AdminNav({ pages, signOut, profile }: AdminNavProps) {
    const navigate = useNavigate()
    const isAuthenticated = Boolean(profile?.isAdmin || profile?.role === 'admin')

    async function handleSignOut() {
        await signOut()
        navigate('/auth', { replace: true })
    }

    const classNames = [
        styles.link
    ].join(' ')

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
            {isAuthenticated && profile && (
                <ul className="flex space-x-2 ml-auto">
                    <li className="text-gray-500">
                        Inloggad som{' '}
                        {profile.full_name 
                            ? <Link className={styles.link} to="/profile">{profile.full_name}</Link>
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