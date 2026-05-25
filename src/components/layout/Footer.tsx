import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { getNavigationLinks } from '../../config/navigation'

const Footer: React.FC = () => {
    const { user, profile } = useAuth()
    const isAdmin = Boolean(profile?.isAdmin || String(profile?.role ?? '').toLowerCase() === 'admin')
    const navigationLinks = getNavigationLinks({ isLoggedIn: Boolean(user), isAdmin }, 'footer')

    return (
        <footer className="border-t border-neutral-200/70 bg-white">
            <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-neutral-600 sm:px-8 lg:px-12 md:flex-row">
                © {new Date().getFullYear()} BoendePortalen. Alla rättigheter förbehållna.
                <nav aria-label="Sidfotsnavigering">
                    <ul className="flex flex-wrap items-center justify-center gap-4">
                        {navigationLinks.map((link) => (
                            <li key={link.href}>
                                <Link className="transition-colors hover:text-neutral-950" to={link.href}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </footer>
    )
}

export default Footer