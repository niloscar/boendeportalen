import { NavLink } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useFeatures } from '../../hooks/useFeatures'
import { getNavigationLinks } from '../../config/navigation'
import { ArrowRightIcon } from '@phosphor-icons/react'
import MobileMenu from './MobileMenu'

const Header: React.FC = () => {
    const { user, profile } = useAuth()

    const isLoggedIn = Boolean(user)

    // We check for admin access based on the profile's `isAdmin` flag or if their role is set to 'admin' (case-insensitive) to determine if admin links should be shown.
    const isAdmin = Boolean(
        profile?.isAdmin ||
        String(profile?.role ?? '').toLowerCase() === 'admin'
    )

    const { isFeatureEnabled } = useFeatures()

    // Using `getNavigationLinks` to get the appropriate set of navigation links based on the user's authentication and admin status,
    // and specifying 'header' to filter out any links that are only meant for the footer.
    // This keeps the header navigation dynamic and in sync with the user's permissions.
    const navigationLinks = getNavigationLinks(
        { isLoggedIn, isAdmin },
        'header'
    )

    // Filter links based on feature toggles
    const filteredLinks = navigationLinks.filter(link => {
        if (link.href === '/') return true          // Show Home
        if (link.href === '/admin') return true     // Show Admin if admin

        const featureKey = link.href.replace(/^\//, '')
        return isFeatureEnabled(featureKey)
    })

    return (
        <header className="bg-white border-b border-neutral-200/70">
            <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
                <h1 className="text-xl text-neutral-900 font-extrabold leading-tight">
                    <NavLink to="/">Boende<span className="text-green-500">Portalen</span></NavLink>
                </h1>

                <nav aria-label="Huvudnavigering" className="hidden md:block">
                    <ul className="flex items-center gap-2 text-sm text-neutral-700">
                        {filteredLinks.map(link => (
                            <li key={link.href}>
                                <NavLink
                                    to={link.href}
                                    className={({ isActive }) =>
                                        `transition-colors hover:text-neutral-950 py-3 px-2 rounded-lg hover:bg-neutral-100 ${isActive ? 'font-semibold text-neutral-950 bg-neutral-100' : ''
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-3 md:gap-4">
                    <MobileMenu navigationLinks={filteredLinks} user={user} profile={profile} />

                    {user ? (
                        <NavLink
                            to="/minasidor"
                            className={({ isActive }) =>
                                `hidden md:inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-2 py-2 pr-4 text-sm font-medium text-neutral-800 shadow-md transition-colors hover:border-neutral-300 hover:bg-neutral-50 ${isActive ? 'border-neutral-300 bg-neutral-100' : ''
                                }`
                            }
                        >
                            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-neutral-200 text-xs font-semibold text-neutral-500">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} loading="lazy" alt="Användaravatar" className="h-full w-full object-cover" />
                                ) : (
                                    <span>{profile?.full_name?.slice(0, 2).toUpperCase() ?? 'VL'}</span>
                                )}
                            </span>
                            <div className="flex flex-col items-start leading-tight">
                                <span className="font-medium">{profile?.full_name ?? user.email ?? 'Okänt Namn'}</span>
                                <span className="text-xs text-neutral-500">Mina sidor</span>
                            </div>
                        </NavLink>
                    ) : (
                        <NavLink
                            to="/inloggning"
                            className={({ isActive }) =>
                                `hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-800 hover:text-neutral-950 transition-colors duration-200 ${isActive ? 'font-semibold' : ''
                                }`
                            }
                        >
                            Logga in
                            <ArrowRightIcon className="h-4 w-4" />
                        </NavLink>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
