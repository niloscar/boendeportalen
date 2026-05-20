import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from './AdminNav.module.css'

type AdminSubPage = { slug: string, title: string }
type AdminNavProps = { pages: AdminSubPage[] }

export default function AdminNav({ pages }: AdminNavProps) {
    const { user } = useAuth()
    const isAuthenticated = Boolean(user)

    console.log(user)

    const logout = () => {
        // Implement your logout logic here, e.g., clear auth tokens, update context, etc.
        console.log('Logging out...')
        // For example, if you have a signOut function from your auth library:
        // signOut().then(() => {
        //     // Optionally, you can also redirect to the login page after logout
        //     window.location.href = '/admin/login'
        // })
    }

    const classNames = [
        styles.link
    ].join(' ')

    return (
        <nav className="my-4 flex items-center">
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
            {isAuthenticated && user && (
                <ul className="flex space-x-2 ml-auto">
                    <li className="text-gray-500">Inloggad som ({user.email})</li>
                    <li>
                        <Link to="/admin/login" onClick={logout} className={styles.link}>
                            Logga ut
                        </Link>
                    </li>
                </ul>
            )}
        </nav>
    )
}