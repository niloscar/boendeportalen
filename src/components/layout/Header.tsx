import { NavLink } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { getNavigationLinks } from '../../config/navigation'
import { ArrowLongRightIcon } from '@heroicons/react/24/outline'
import MobileMenu from './MobileMenu'

const Header: React.FC = () => {
    const { user, profile } = useAuth()
    const isAdmin = Boolean(profile?.isAdmin || String(profile?.role ?? '').toLowerCase() === 'admin')
    const navigationLinks = getNavigationLinks({ isLoggedIn: Boolean(user), isAdmin }, 'header')

    return (
        <header className="bg-white border-b border-neutral-200/70">
            <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
                <h1 className="text-xl text-neutral-900 font-extrabold leading-tight"><a href="/">Boende<span className="text-green-500">Portalen</span></a></h1>
                <nav aria-label="Huvudnavigering" className="hidden md:block">
                    <ul className="flex items-center gap-4 text-sm text-neutral-700">
                        {navigationLinks.map((link) => (
                            <li key={link.href}>
                                <NavLink to={link.href} className={({ isActive }) => `transition-colors hover:text-neutral-950 ${isActive ? 'font-semibold text-neutral-950' : ''}`}>{link.label}</NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="flex items-center gap-3 md:gap-4">
                    <MobileMenu navigationLinks={navigationLinks} user={user} profile={profile} />
                    {user ? (
                        <NavLink to="/minasidor" className={({ isActive }) => `hidden md:inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-2 py-2 pr-4 text-sm font-medium text-neutral-800 shadow-sm transition-colors hover:border-neutral-300 hover:bg-neutral-50 ${isActive ? 'border-neutral-300 bg-neutral-100' : ''}`}>
                            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-neutral-200 text-xs font-semibold text-neutral-500">
                                {profile?.avatar_url ? (
                                    <img src={profile?.avatar_url} loading="lazy" alt="Användaravatar" className="h-full w-full object-cover" />
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
                        <NavLink to="/auth" className={({ isActive }) => `hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-800 hover:text-neutral-950 transition-colors duration-200 ${isActive ? 'font-semibold' : ''}`}>
                            Logga in
                            <ArrowLongRightIcon className="h-4 w-4" />
                        </NavLink>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header