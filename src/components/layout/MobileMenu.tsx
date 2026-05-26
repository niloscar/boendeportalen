import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ListIcon, XIcon, ArrowRightIcon } from '@phosphor-icons/react'
import type { MobileMenuProps } from '../../types/navigation'

export default function MobileMenu({ navigationLinks, user, profile }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') setIsOpen(false)
        }

        if (isOpen) window.addEventListener('keydown', handleKeyDown)

        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen])

    return (
        <div className="md:hidden">
            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
                aria-label={isOpen ? 'Stäng meny' : 'Öppna meny'}
                className="relative z-[60] inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white p-2 text-neutral-900 shadow-md transition-colors hover:border-neutral-300 hover:bg-neutral-50 cursor-pointer"
            >
                {isOpen ? <XIcon className="h-6 w-6" /> : <ListIcon className="h-6 w-6" />}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <button
                        type="button"
                        aria-label="Stäng mobilmeny"
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <div className="absolute right-4 top-20 w-[calc(100%-2rem)] max-w-sm rounded-3xl border border-neutral-200 bg-white p-4 shadow-md">
                        <nav id="mobile-navigation" aria-label="Mobilnavigering">
                            <ul className="space-y-1 text-base text-neutral-800">
                                {navigationLinks.map((link) => (
                                    <li key={link.href}>
                                        <NavLink
                                            to={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={({ isActive }) => [
                                                'block rounded-2xl px-4 py-3 transition-colors hover:bg-neutral-100 hover:text-neutral-950',
                                                isActive && 'bg-neutral-100 font-semibold text-neutral-950',
                                            ].filter(Boolean).join(' ')}
                                        >
                                            {link.label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-4 border-t border-neutral-200 pt-4">
                                {user ? (
                                    <NavLink
                                        to="/minasidor"
                                        onClick={() => setIsOpen(false)}
                                        className={({ isActive }) => [
                                            'flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-3 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-300 hover:bg-neutral-100',
                                            isActive && 'border-neutral-300 bg-neutral-100',
                                        ].filter(Boolean).join(' ')}
                                    >
                                        <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-neutral-200 text-xs font-semibold text-neutral-500">
                                            {profile?.avatar_url ? (
                                                <img src={profile.avatar_url} alt="Användaravatar" className="h-full w-full object-cover" />
                                            ) : (
                                                <span>{profile?.full_name?.slice(0, 2).toUpperCase() ?? 'VL'}</span>
                                            )}
                                        </span>
                                        <span className="flex min-w-0 flex-1 flex-col items-start leading-tight">
                                            <span className="truncate font-medium">{profile?.full_name ?? user.email ?? 'Okänt Namn'}</span>
                                            <span className="text-xs text-neutral-500">Mina sidor</span>
                                        </span>
                                    </NavLink>
                                ) : (
                                    <NavLink
                                        to="/inloggning"
                                        onClick={() => setIsOpen(false)}
                                        className={({ isActive }) => [
                                            'inline-flex w-full items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-950',
                                            isActive && 'border-neutral-300 bg-neutral-100 font-semibold',
                                        ].filter(Boolean).join(' ')}
                                    >
                                        Logga in
                                        <ArrowRightIcon className="h-4 w-4" />
                                    </NavLink>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    )
}